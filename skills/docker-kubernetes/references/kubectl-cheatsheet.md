<!-- Part of the docker-kubernetes AbsolutelySkilled skill. Load this file when
     running kubectl commands or debugging Kubernetes clusters. -->

# kubectl Cheatsheet

Quick reference for essential kubectl commands organized by resource type.
All commands accept `-n <namespace>` to target a specific namespace and
`-A` / `--all-namespaces` to search across all namespaces.

---

## Context and cluster

```bash
kubectl config get-contexts                    # list all contexts
kubectl config use-context <context-name>      # switch active context
kubectl config current-context                 # show active context
kubectl cluster-info                           # cluster endpoint and DNS
kubectl get nodes                              # list nodes and status
kubectl get nodes -o wide                      # include IP, OS, kernel version
kubectl top node                               # CPU/memory usage per node
```

---

## Pods

```bash
# List
kubectl get pods -n <ns>                       # all pods in namespace
kubectl get pods -n <ns> -o wide               # include node and IP
kubectl get pods -A --field-selector=status.phase=Pending

# Inspect
kubectl describe pod <pod> -n <ns>             # full spec + events (read Events section first)
kubectl get pod <pod> -n <ns> -o yaml          # full YAML manifest

# Logs
kubectl logs <pod> -n <ns>                     # current container logs
kubectl logs <pod> -n <ns> --previous          # logs from last crashed container
kubectl logs <pod> -n <ns> -c <container>      # specific container in multi-container pod
kubectl logs <pod> -n <ns> -f                  # follow/stream logs
kubectl logs <pod> -n <ns> --tail=100          # last 100 lines

# Execute
kubectl exec -it <pod> -n <ns> -- /bin/sh      # interactive shell
kubectl exec <pod> -n <ns> -- env              # dump environment variables

# Debug
kubectl debug -it <pod> -n <ns> --image=busybox --target=<container>   # ephemeral debug container
kubectl debug node/<node-name> -it --image=ubuntu                       # debug at node level

# Delete / restart
kubectl delete pod <pod> -n <ns>               # pod restarts via Deployment controller
kubectl rollout restart deployment/<name> -n <ns>   # graceful rolling restart
```

---

## Deployments

```bash
kubectl get deployments -n <ns>
kubectl describe deployment <name> -n <ns>

# Rollout
kubectl rollout status deployment/<name> -n <ns>      # watch rollout progress
kubectl rollout history deployment/<name> -n <ns>     # revision history
kubectl rollout undo deployment/<name> -n <ns>        # roll back to previous revision
kubectl rollout undo deployment/<name> -n <ns> --to-revision=3

# Scale
kubectl scale deployment/<name> --replicas=5 -n <ns>

# Image update (prefer updating YAML in git; this is a quick override)
kubectl set image deployment/<name> <container>=<image>:<tag> -n <ns>
```

---

## Services and Endpoints

```bash
kubectl get services -n <ns>
kubectl get endpoints <service-name> -n <ns>          # verify pods are registered
kubectl describe service <name> -n <ns>

# Port-forward to test a service locally
kubectl port-forward svc/<service-name> 8080:80 -n <ns>
kubectl port-forward pod/<pod-name> 8080:3000 -n <ns>
```

---

## Ingress

```bash
kubectl get ingress -n <ns>
kubectl describe ingress <name> -n <ns>               # shows rules and TLS status
kubectl get ingress -n <ns> -o yaml                   # full manifest with annotations
```

---

## ConfigMaps and Secrets

```bash
kubectl get configmaps -n <ns>
kubectl describe configmap <name> -n <ns>
kubectl get configmap <name> -n <ns> -o yaml

kubectl get secrets -n <ns>
kubectl describe secret <name> -n <ns>                # shows keys but not values
kubectl get secret <name> -n <ns> -o jsonpath='{.data.<key>}' | base64 -d   # decode a value

# Create from literal (prefer declarative YAML in production)
kubectl create configmap <name> --from-literal=KEY=VALUE -n <ns>
kubectl create secret generic <name> --from-literal=KEY=VALUE -n <ns>
```

---

## Resource usage and events

```bash
kubectl top pods -n <ns>                              # CPU/memory per pod
kubectl top pods -n <ns> --sort-by=memory
kubectl get events -n <ns> --sort-by='.lastTimestamp'   # recent events, newest last
kubectl get events -n <ns> --field-selector=reason=OOMKilling
```

---

## Namespaces and RBAC

```bash
kubectl get namespaces
kubectl create namespace <name>

kubectl get rolebindings -n <ns>
kubectl get clusterrolebindings
kubectl auth can-i create deployments -n <ns>         # check your permissions
kubectl auth can-i create deployments -n <ns> --as=<service-account>
```

---

## Apply, diff, and dry-run

```bash
kubectl apply -f <file.yaml>                          # apply declarative manifest
kubectl apply -f <directory>/                         # apply all YAML in a directory
kubectl apply -k <kustomize-dir>/                     # apply Kustomize overlay

kubectl diff -f <file.yaml>                           # show diff vs live cluster state
kubectl apply -f <file.yaml> --dry-run=server         # server-side dry run (validates fully)
kubectl apply -f <file.yaml> --dry-run=client         # client-side dry run (basic validation)

kubectl delete -f <file.yaml>                         # delete resources defined in file
```

---

## Helm

```bash
helm list -n <ns>                                     # installed releases
helm status <release> -n <ns>                         # release status and notes
helm history <release> -n <ns>                        # revision history

helm upgrade --install <release> <chart> -f values.yaml -n <ns>
helm upgrade --install <release> <chart> -f values.yaml -n <ns> --dry-run

helm rollback <release> <revision> -n <ns>
helm uninstall <release> -n <ns>

helm template <release> <chart> -f values.yaml        # render templates locally
helm lint <chart-dir>/                                 # lint chart for errors
```

---

## Common diagnostic workflow for a broken pod

```bash
# 1. What state is it in?
kubectl get pod <pod> -n <ns>

# 2. Why? Read the Events section at the bottom
kubectl describe pod <pod> -n <ns>

# 3. What did the process print before dying?
kubectl logs <pod> -n <ns> --previous

# 4. Is it a resource issue?
kubectl top pod <pod> -n <ns>

# 5. Can I reproduce it interactively?
kubectl run debug-shell --rm -it --image=alpine -n <ns> -- /bin/sh
```
