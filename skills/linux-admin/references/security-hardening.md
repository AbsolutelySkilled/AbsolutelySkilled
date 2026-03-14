<!-- Part of the linux-admin AbsolutelySkilled skill. Load this file when
     hardening a Linux server or auditing security configuration. -->

# Linux Security Hardening Reference

Opinionated, production-grade security hardening checklist for Linux servers.
Apply these in order: SSH first (so you don't lock yourself out), then firewall,
then user management, then kernel hardening, then audit logging. When in doubt,
be more restrictive.

---

## 1. SSH Hardening

### sshd_config settings

```
# /etc/ssh/sshd_config

# Authentication
PermitRootLogin no
PasswordAuthentication no
ChallengeResponseAuthentication no
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Session limits
LoginGraceTime 30
MaxAuthTries 4
MaxSessions 10
MaxStartups 10:30:60

# Forwarding (disable unless needed)
X11Forwarding no
AllowTcpForwarding no
AllowAgentForwarding no
PermitTunnel no

# Idle timeout (disconnect after ~15 min idle)
ClientAliveInterval 300
ClientAliveCountMax 3

# Access control
AllowGroups sshusers admins

# Modern algorithms only
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com
MACs hmac-sha2-256-etm@openssh.com,hmac-sha2-512-etm@openssh.com
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org

# Logging
LogLevel VERBOSE
SyslogFacility AUTH
```

### SSH key management

```bash
# Generate a strong key pair (ed25519 preferred over RSA)
ssh-keygen -t ed25519 -C "user@hostname-$(date +%Y-%m)" -f ~/.ssh/id_ed25519

# If RSA is required by legacy systems, use 4096-bit
ssh-keygen -t rsa -b 4096 -C "user@hostname" -f ~/.ssh/id_rsa

# Deploy a public key to a remote server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@remote-host

# Correct permissions on key files (critical - SSH refuses to use wrong permissions)
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
chmod 600 ~/.ssh/authorized_keys

# Audit authorized_keys on a server
sudo find /home -name authorized_keys -exec cat {} \; -print
```

### SSH checklist

- [ ] `PermitRootLogin no`
- [ ] `PasswordAuthentication no`
- [ ] `X11Forwarding no`
- [ ] `AllowGroups` set to restrict access to a specific group
- [ ] `MaxAuthTries 4` or lower
- [ ] `LoginGraceTime 30` or lower
- [ ] Modern cipher suite configured (no arcfour, 3DES, MD5 MACs)
- [ ] `sshd -t` validates config before restart
- [ ] New session verified before closing old one after config change
- [ ] `AllowTcpForwarding no` unless port forwarding is explicitly needed
- [ ] SSH port-knock or non-standard port + firewall if high brute-force exposure

---

## 2. Firewall

### ufw (Ubuntu/Debian - recommended for most servers)

```bash
# Initial lockdown
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw default deny routed

# SSH - always add BEFORE enabling
sudo ufw allow from 203.0.113.0/24 to any port 22 comment 'SSH from office'
# If SSH must be public, rate-limit it
sudo ufw limit 22/tcp comment 'SSH rate-limited'

# Web
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Internal services - restrict by source IP only
sudo ufw allow from 10.0.0.0/8 to any port 5432 comment 'PostgreSQL internal only'
sudo ufw allow from 10.0.0.0/8 to any port 6379 comment 'Redis internal only'

# Enable with verbose output for review
sudo ufw --force enable
sudo ufw status verbose

# Logging
sudo ufw logging medium
```

### iptables (advanced - for complex rule sets)

```bash
#!/usr/bin/env bash
# /usr/local/sbin/firewall-setup.sh
set -euo pipefail

IPT="iptables"

# Flush
$IPT -F; $IPT -X; $IPT -Z
$IPT -t nat -F; $IPT -t nat -X
$IPT -t mangle -F; $IPT -t mangle -X

# Default policies
$IPT -P INPUT DROP
$IPT -P FORWARD DROP
$IPT -P OUTPUT ACCEPT

# Loopback
$IPT -A INPUT -i lo -j ACCEPT

# Established/related connections
$IPT -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Drop invalid packets
$IPT -A INPUT -m conntrack --ctstate INVALID -j DROP

# SSH with brute-force rate limiting
$IPT -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW \
    -m recent --set --name SSH_LIMIT --rsource
$IPT -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW \
    -m recent --update --seconds 60 --hitcount 4 --name SSH_LIMIT --rsource -j LOG \
    --log-prefix "SSH brute-force: " --log-level 4
$IPT -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW \
    -m recent --update --seconds 60 --hitcount 4 --name SSH_LIMIT --rsource -j DROP
$IPT -A INPUT -p tcp --dport 22 -j ACCEPT

# Web
$IPT -A INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT

# ICMP (ping) - allow but rate-limit
$IPT -A INPUT -p icmp --icmp-type echo-request -m limit --limit 5/sec -j ACCEPT
$IPT -A INPUT -p icmp -j DROP

# Log and drop everything else
$IPT -A INPUT -j LOG --log-prefix "iptables-drop: " --log-level 4
$IPT -A INPUT -j DROP

# Persist
iptables-save > /etc/iptables/rules.v4
```

### Firewall checklist

- [ ] Default INPUT policy is DROP
- [ ] SSH is explicitly allowed before enabling firewall
- [ ] Internal services (databases, cache) are restricted to internal IPs
- [ ] ICMP rate-limited (not blocked - needed for MTU path discovery)
- [ ] Firewall rules persist across reboots (`iptables-persistent` or ufw enabled)
- [ ] Outbound traffic filtered if server has fixed external communication patterns
- [ ] Rules audited with `ufw status verbose` or `iptables -L -n -v --line-numbers`

---

## 3. User Management

### Principle of least privilege

```bash
# Create a dedicated service account with no shell and no home directory login
sudo useradd \
    --system \
    --no-create-home \
    --shell /usr/sbin/nologin \
    --comment "MyApp service account" \
    myapp

# Lock the account password (key-only or service-only access)
sudo passwd -l myapp

# Create an app directory owned by the service user
sudo mkdir -p /opt/myapp
sudo chown myapp:myapp /opt/myapp
sudo chmod 750 /opt/myapp
```

### sudo hardening

```bash
# Edit sudoers with visudo - never directly edit /etc/sudoers
sudo visudo

# Grant specific command access, not full sudo
# In /etc/sudoers or /etc/sudoers.d/admins:
# %admins ALL=(ALL) /usr/bin/systemctl restart myapp, /usr/bin/journalctl

# Require password for sudo (disable NOPASSWD in production)
# %admins ALL=(ALL) ALL

# Limit sudo session timeout
# Defaults timestamp_timeout=5

# Log all sudo usage (usually enabled by default)
# Defaults logfile=/var/log/sudo.log
```

### Account auditing

```bash
# List all users with login shells (potential interactive login accounts)
grep -v '/nologin\|/false' /etc/passwd | awk -F: '{print $1, $7}'

# List users with UID 0 (should only be root)
awk -F: '$3 == 0 {print $1}' /etc/passwd

# Find accounts with empty passwords (security risk)
sudo awk -F: '($2 == "" || $2 == "!") {print $1}' /etc/shadow

# Check sudo group members
getent group sudo wheel admins 2>/dev/null

# Audit recent logins
last -n 20
lastb -n 20    # failed logins

# Check SSH authorized_keys across all home directories
sudo find /root /home -name authorized_keys -ls 2>/dev/null
```

### User management checklist

- [ ] Root account has no SSH access (`PermitRootLogin no`)
- [ ] Service accounts use `/usr/sbin/nologin` shell and locked passwords
- [ ] No user accounts with UID 0 except root
- [ ] `sudo` is required for privileged operations (no shared root password)
- [ ] Sudoers entries are command-specific, not blanket `ALL`
- [ ] Inactive user accounts are disabled (`usermod -L`)
- [ ] Default password policy enforced (`pam_pwquality` or `pwquality.conf`)
- [ ] `/etc/shadow` has mode 640 or 000
- [ ] `/etc/passwd` has mode 644

---

## 4. Kernel Hardening (sysctl)

```bash
# /etc/sysctl.d/99-hardening.conf

# Network: prevent common attacks
# Disable IP forwarding (unless this is a router)
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

# SYN flood protection
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_syn_retries = 3
net.ipv4.tcp_synack_retries = 2

# Ignore ICMP redirects (prevent MITM route injection)
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0

# Ignore source-routed packets
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0

# Log martian packets (invalid source/destination IPs)
net.ipv4.conf.all.log_martians = 1

# Prevent IP spoofing (reverse path filtering)
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Disable ICMP broadcast responses
net.ipv4.icmp_echo_ignore_broadcasts = 1

# Ignore bogus ICMP errors
net.ipv4.icmp_ignore_bogus_error_responses = 1

# Filesystem: prevent some privilege escalation attacks
# Restrict /proc/pid visibility to own processes
kernel.hidepid = 2

# Restrict ptrace to parent process only (limits debugger-based exploits)
kernel.yama.ptrace_scope = 1

# Disable core dumps from setuid programs
fs.suid_dumpable = 0

# Restrict dmesg to root (prevents info leaks)
kernel.dmesg_restrict = 1

# Randomize memory layout (ASLR)
kernel.randomize_va_space = 2

# Restrict /proc/kallsyms and kernel pointers (prevents info leaks)
kernel.kptr_restrict = 2

# Disable magic SysRq key in production
kernel.sysrq = 0
```

```bash
# Apply sysctl settings immediately without reboot
sudo sysctl --system

# Verify a specific setting
sysctl net.ipv4.tcp_syncookies
```

### Kernel hardening checklist

- [ ] SYN cookies enabled (`net.ipv4.tcp_syncookies = 1`)
- [ ] IP forwarding disabled (unless server is a router)
- [ ] ICMP redirects disabled
- [ ] Reverse path filtering enabled (`rp_filter = 1`)
- [ ] ASLR enabled (`randomize_va_space = 2`)
- [ ] `ptrace_scope = 1` (Yama LSM)
- [ ] `dmesg_restrict = 1`
- [ ] `kptr_restrict = 2`
- [ ] Settings persisted in `/etc/sysctl.d/`

---

## 5. Audit Logging

### auditd setup

```bash
# Install
sudo apt-get install auditd audispd-plugins   # Debian/Ubuntu
sudo yum install audit                         # RHEL/CentOS

# Start and enable
sudo systemctl enable --now auditd
```

```bash
# /etc/audit/rules.d/99-hardening.rules

# Delete all existing rules and set default policy
-D
-b 8192
-f 1

# Monitor authentication files
-w /etc/passwd -p wa -k identity
-w /etc/group -p wa -k identity
-w /etc/shadow -p wa -k identity
-w /etc/sudoers -p wa -k sudoers
-w /etc/sudoers.d/ -p wa -k sudoers

# Monitor SSH configuration
-w /etc/ssh/sshd_config -p wa -k sshd_config

# Monitor login/logout events
-w /var/log/wtmp -p wa -k logins
-w /var/log/btmp -p wa -k logins
-w /var/log/lastlog -p wa -k logins

# Monitor privilege escalation (sudo, su)
-w /usr/bin/sudo -p x -k privilege_escalation
-w /bin/su -p x -k privilege_escalation

# Monitor cron
-w /etc/cron.d/ -p wa -k cron
-w /etc/crontab -p wa -k cron
-w /var/spool/cron/ -p wa -k cron

# Monitor network configuration changes
-w /sbin/iptables -p x -k firewall
-w /etc/hosts -p wa -k network_config

# Monitor kernel module loading (potential rootkit indicator)
-w /sbin/insmod -p x -k modules
-w /sbin/rmmod -p x -k modules
-w /sbin/modprobe -p x -k modules
-a always,exit -F arch=b64 -S init_module -S delete_module -k modules

# Audit all commands run by root
-a always,exit -F arch=b64 -F uid=0 -S execve -k root_commands

# Make audit rules immutable (requires reboot to change - use on locked-down servers)
# -e 2
```

```bash
# Reload audit rules
sudo augenrules --load

# Search audit log
sudo ausearch -k identity -ts today
sudo ausearch -k privilege_escalation -ts recent
sudo ausearch -k sshd_config

# Generate a human-readable report
sudo aureport --auth --summary
sudo aureport --login --summary
sudo aureport --failed --summary
```

### System log monitoring

```bash
# Key log files to monitor
/var/log/auth.log        # (Debian/Ubuntu) authentication events
/var/log/secure          # (RHEL/CentOS) authentication events
/var/log/audit/audit.log # auditd events
/var/log/syslog          # general system messages
/var/log/kern.log        # kernel messages (including iptables drops if LOG target set)

# Watch auth log live for suspicious activity
sudo tail -f /var/log/auth.log | grep -E 'Failed|Invalid|Accepted|sudo'

# Summarize failed SSH login attempts
sudo grep "Failed password" /var/log/auth.log | \
    awk '{print $11}' | sort | uniq -c | sort -rn | head -20
```

### fail2ban (automated brute-force blocking)

```bash
# Install
sudo apt-get install fail2ban

# /etc/fail2ban/jail.local
[DEFAULT]
bantime  = 3600
findtime = 600
maxretry = 4
backend  = systemd

[sshd]
enabled = true
port    = ssh
logpath = %(sshd_log)s
maxretry = 3
bantime  = 7200
```

```bash
sudo systemctl enable --now fail2ban
sudo fail2ban-client status sshd     # check bans
sudo fail2ban-client set sshd unbanip 1.2.3.4   # unban an IP
```

### Audit logging checklist

- [ ] `auditd` installed and running
- [ ] Audit rules cover: passwd/shadow/sudoers changes, login events, privilege escalation
- [ ] SSH authentication events logged at VERBOSE level
- [ ] Log files are protected from modification by non-root users
- [ ] Logs are shipped to a remote/central log server (so local tampering doesn't erase evidence)
- [ ] `fail2ban` or equivalent configured for SSH brute-force blocking
- [ ] Log rotation configured to prevent disk exhaustion
- [ ] Alerts defined for: spike in auth failures, sudo usage, new user creation

---

## 6. System Update and Patch Management

```bash
# Debian/Ubuntu: enable automatic security updates
sudo apt-get install unattended-upgrades apt-listchanges

# /etc/apt/apt.conf.d/50unattended-upgrades
# Unattended-Upgrade::Allowed-Origins {
#   "${distro_id}:${distro_codename}-security";
# };
# Unattended-Upgrade::Automatic-Reboot "true";
# Unattended-Upgrade::Automatic-Reboot-Time "03:00";

sudo dpkg-reconfigure --priority=low unattended-upgrades

# RHEL/CentOS: dnf-automatic for security updates
sudo dnf install dnf-automatic
sudo sed -i 's/upgrade_type = default/upgrade_type = security/' /etc/dnf/automatic.conf
sudo systemctl enable --now dnf-automatic.timer
```

### Package management checklist

- [ ] OS and packages are on a supported version with active security updates
- [ ] Automatic security updates enabled (or a manual patching cadence enforced)
- [ ] Kernel and libc updates applied regularly (require reboot to take effect)
- [ ] Unnecessary packages are removed (`apt autoremove`, `dnf autoremove`)
- [ ] No development tools (compilers, build-essential) installed on production servers
- [ ] Container base images rebuilt when base OS packages are patched

---

## Quick Reference: What to do first on a new server

```bash
# 1. Update all packages
sudo apt-get update && sudo apt-get upgrade -y

# 2. Create admin user and add to sudo group
sudo useradd -m -s /bin/bash -G sudo adminuser
sudo passwd adminuser

# 3. Deploy SSH public key for admin user
sudo mkdir -p /home/adminuser/.ssh
sudo cp ~/.ssh/authorized_keys /home/adminuser/.ssh/
sudo chown -R adminuser:adminuser /home/adminuser/.ssh
sudo chmod 700 /home/adminuser/.ssh
sudo chmod 600 /home/adminuser/.ssh/authorized_keys

# 4. Test login as new admin user in a NEW session before next step
# ssh adminuser@server

# 5. Harden sshd_config (PermitRootLogin no, PasswordAuthentication no)
# 6. Validate: sudo sshd -t
# 7. Restart: sudo systemctl restart sshd
# 8. Configure firewall (ufw or iptables)
# 9. Apply sysctl hardening
# 10. Install and configure auditd + fail2ban
# 11. Set up automatic security updates
# 12. Run a security scanner (Lynis, OpenSCAP) for a baseline audit
```

```bash
# Lynis security audit (quick baseline)
sudo apt-get install lynis
sudo lynis audit system
# Review output: hardening index, warnings, and suggestions
```
