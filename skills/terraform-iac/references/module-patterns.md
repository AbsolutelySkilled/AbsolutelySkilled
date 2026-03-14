<!-- Part of the terraform-iac AbsolutelySkilled skill. Load this file when
     designing or structuring Terraform modules. -->

# Terraform Module Design Patterns

Opinionated reference for building maintainable, shareable Terraform modules.
These patterns apply whether you are building a team-internal module library or
publishing to the public Terraform Registry.

---

## Module taxonomy

Before choosing a pattern, classify the module:

| Type | Purpose | Example |
|---|---|---|
| **Resource module** | Wraps a single resource type with sane defaults | `modules/s3-bucket` |
| **Composition module** | Assembles multiple resource modules into a capability | `modules/app-cluster` (ECS + ALB + SG) |
| **Root module** | Entry point for `terraform apply`; calls composition modules | `environments/prod/main.tf` |
| **Wrapper module** | Thin shim over an upstream module to enforce org standards | `modules/vpc` wrapping `terraform-aws-modules/vpc` |

Root modules own state. Resource and composition modules own no state themselves
- they are called by root modules.

---

## 1. Resource module pattern

The simplest and most reusable module type. One resource, hardened defaults,
minimal surface area.

**Rules:**
- Every input must have a `description`.
- Provide sensible defaults for non-environment-specific values.
- Expose all attributes that callers might need as outputs.
- Use `lifecycle` blocks to protect against accidental deletion on critical resources.

```hcl
# modules/s3-bucket/main.tf
resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name
}

resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.this.id
  versioning_configuration {
    status = var.versioning_enabled ? "Enabled" : "Disabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "this" {
  bucket                  = aws_s3_bucket.this.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
```

```hcl
# modules/s3-bucket/variables.tf
variable "bucket_name" {
  description = "Globally unique name for the S3 bucket"
  type        = string
}

variable "versioning_enabled" {
  description = "Enable S3 versioning. Recommended for state and artifact buckets."
  type        = bool
  default     = true
}
```

```hcl
# modules/s3-bucket/outputs.tf
output "bucket_id" {
  description = "Name of the bucket (same as ID for S3)"
  value       = aws_s3_bucket.this.id
}

output "bucket_arn" {
  description = "ARN of the bucket"
  value       = aws_s3_bucket.this.arn
}
```

---

## 2. Composition module pattern

Assembles multiple resource modules or resources into a single deployable
capability. This is the right level for "a working ECS service" or "a complete
RDS setup with parameter groups and subnet groups."

**Rules:**
- Accept high-level intent variables, not low-level resource IDs where possible.
- Use `depends_on` only when implicit dependencies are impossible.
- Do not accept a `tags` variable and merge it - let callers use `provider default_tags`.

```hcl
# modules/ecs-service/main.tf
module "alb" {
  source = "../alb"

  name       = "${var.service_name}-alb"
  vpc_id     = var.vpc_id
  subnet_ids = var.public_subnet_ids
}

module "security_group" {
  source = "../security-group"

  name   = "${var.service_name}-ecs-sg"
  vpc_id = var.vpc_id

  ingress_rules = [
    {
      from_port   = var.container_port
      to_port     = var.container_port
      protocol    = "tcp"
      cidr_blocks = [var.vpc_cidr]
    }
  ]
}

resource "aws_ecs_service" "this" {
  name            = var.service_name
  cluster         = var.cluster_arn
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count

  load_balancer {
    target_group_arn = module.alb.target_group_arn
    container_name   = var.service_name
    container_port   = var.container_port
  }

  network_configuration {
    subnets         = var.private_subnet_ids
    security_groups = [module.security_group.security_group_id]
  }
}
```

---

## 3. Wrapper module pattern

A thin wrapper over a well-known upstream module (Terraform Registry or
community module) that enforces organizational standards - naming conventions,
required tags, forbidden settings, and approved defaults.

**When to use:** Your org uses `terraform-aws-modules/vpc/aws` but every team
keeps forgetting to enable flow logs and VPN gateway. Write a wrapper once.

```hcl
# modules/vpc/main.tf
# Wraps the community VPC module with org-required settings locked in

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = var.name
  cidr = var.cidr_block
  azs  = var.availability_zones

  private_subnets = var.private_subnet_cidrs
  public_subnets  = var.public_subnet_cidrs

  # Org standards: always enabled
  enable_nat_gateway     = true
  single_nat_gateway     = var.environment != "prod"
  enable_vpn_gateway     = false
  enable_flow_log        = true
  flow_log_destination_type = "s3"
  flow_log_destination_arn  = var.flow_log_bucket_arn

  # Prevent callers from disabling DNS (required for ECS service discovery)
  enable_dns_hostnames = true
  enable_dns_support   = true
}
```

```hcl
# modules/vpc/variables.tf - only expose what callers should control
variable "name" { type = string }
variable "cidr_block" { type = string; default = "10.0.0.0/16" }
variable "availability_zones" { type = list(string) }
variable "private_subnet_cidrs" { type = list(string) }
variable "public_subnet_cidrs" { type = list(string) }
variable "flow_log_bucket_arn" { type = string }
variable "environment" { type = string }
```

**Rule: do not expose every upstream variable.** Exposing everything defeats
the purpose - callers could disable the org-required settings. Only expose
variables where variation between callers is legitimate.

---

## 4. Factory pattern

Generate multiple similar resources from a map of configurations. Prefer this
over `count` when resources have distinct identities - with `count`, removing
an element from the middle of a list shifts all indices and causes unwanted
replacements.

```hcl
# Preferred: for_each with a map - each resource has a stable key
variable "environments" {
  type = map(object({
    instance_type = string
    min_size      = number
    max_size      = number
  }))
  default = {
    dev = {
      instance_type = "t3.micro"
      min_size      = 1
      max_size      = 2
    }
    staging = {
      instance_type = "t3.small"
      min_size      = 1
      max_size      = 3
    }
  }
}

resource "aws_launch_template" "env" {
  for_each      = var.environments
  name_prefix   = "app-${each.key}-"
  instance_type = each.value.instance_type
}

resource "aws_autoscaling_group" "env" {
  for_each         = var.environments
  name             = "app-${each.key}"
  min_size         = each.value.min_size
  max_size         = each.value.max_size

  launch_template {
    id      = aws_launch_template.env[each.key].id
    version = "$Latest"
  }
}
```

**Rule: use `count` only for resources where identity is purely ordinal
(e.g., three identical worker nodes where any can be replaced by any other).
Use `for_each` for anything with a meaningful name.**

---

## 5. Module versioning

### Local modules (monorepo)

Use relative paths. No versioning - all modules are always at HEAD.

```hcl
module "vpc" {
  source = "../../modules/vpc"
}
```

**Monorepo directory layout:**

```
infrastructure/
  modules/
    vpc/
    s3-bucket/
    ecs-service/
    rds/
  environments/
    dev/
      main.tf
      terraform.tfvars
    staging/
      main.tf
      terraform.tfvars
    prod/
      main.tf
      terraform.tfvars
```

### Git-sourced modules

Pin to a tag, not `main`. Tags are immutable; `main` drifts.

```hcl
module "vpc" {
  source = "git::https://github.com/my-org/terraform-modules.git//modules/vpc?ref=v1.4.2"
}
```

### Terraform Registry modules

Pin to a minor version constraint. The `~>` operator allows patch updates but
not minor version bumps.

```hcl
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"
}
```

**Never use an unpinned Registry module in production.** Major and minor version
bumps can include breaking changes.

---

## 6. Module interface contract rules

A module's `variables.tf` and `outputs.tf` are its public API. Treat them with
the same discipline as a REST API.

| Rule | Rationale |
|---|---|
| Add `description` to every variable and output | Callers should not need to read `main.tf` to understand an input |
| Use `validation` blocks for constrained inputs | Catch errors at plan time, not after apply |
| Do not change a variable's `type` in a patch release | Breaking change - bump minor version |
| Do not remove an output | Downstream configs may depend on it |
| Use `sensitive = true` for secret outputs | Prevents values appearing in plan output and logs |
| Avoid outputting raw IDs when the ARN is more useful | ARNs are globally unique and more composable for IAM policies |

```hcl
variable "environment" {
  description = "Deployment environment. Controls instance sizing and HA settings."
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Valid values: dev, staging, prod"
  }
}

output "db_password" {
  description = "RDS master password. Store in secrets manager immediately."
  value       = random_password.db.result
  sensitive   = true
}
```

---

## Quick reference - when to use which pattern

| Scenario | Pattern |
|---|---|
| Wrap a single AWS resource with secure defaults | Resource module |
| Bundle several resources into one deployable unit | Composition module |
| Enforce org standards over a community module | Wrapper module |
| Create N similar resources from a config map | Factory (for_each) |
| Same 3 worker nodes, interchangeable identity | count |
| Shared modules within one repo | Local path source |
| Shared modules across repos, need versioning | Git ref or Terraform Registry |
