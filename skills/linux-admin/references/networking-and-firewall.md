<!-- Part of the Linux Administration AbsolutelySkilled skill. Load this file when working with network debugging, firewall rules, or iptables/ufw configuration. -->

# Networking Debugging and Firewall Configuration

## Debug networking issues

Follow this workflow top-down:

```bash
# 1. Check interface state and IP assignment
ip addr show
ip link show

# 2. Check routing table
ip route show
# Expected: default route via gateway, local subnet route

# 3. Test gateway reachability
ping -c 4 $(ip route | awk '/default/ {print $3}')

# 4. Test DNS resolution
dig +short google.com @8.8.8.8    # direct to external resolver
resolvectl query google.com        # use system resolver (systemd-resolved)
cat /etc/resolv.conf               # check configured resolvers

# 5. Check listening ports and owning processes
ss -tulpn
# -t: TCP  -u: UDP  -l: listening  -p: process  -n: no name resolution

# 6. Test specific port connectivity
nc -zv 10.0.0.5 5432              # check if port is open
timeout 3 bash -c "</dev/tcp/10.0.0.5/5432" && echo open || echo closed

# 7. Trace the path
traceroute -n 8.8.8.8             # ICMP path tracing
mtr --report 8.8.8.8              # continuous path with stats (better than traceroute)

# 8. Capture traffic for deep inspection
# Capture all traffic on eth0 to/from a host on port 443
sudo tcpdump -i eth0 -n host 10.0.0.5 and port 443 -w /tmp/capture.pcap
# Quick view without saving
sudo tcpdump -i eth0 -n port 53   # watch DNS queries live
```

## Set up firewall rules

Using `ufw` for simple servers, raw `iptables` for complex setups:

```bash
# --- ufw approach (recommended for most servers) ---

# Reset to defaults
sudo ufw --force reset
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (do this BEFORE enabling to avoid lockout)
sudo ufw allow 22/tcp comment 'SSH'

# Web server
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Allow specific source IP for admin access
sudo ufw allow from 192.168.1.0/24 to any port 5432 comment 'Postgres from internal'

# Enable and verify
sudo ufw --force enable
sudo ufw status verbose
```

```bash
# --- iptables approach for precise control ---

# Flush existing rules
iptables -F
iptables -X

# Default policies: drop everything
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# Allow loopback
iptables -A INPUT -i lo -j ACCEPT
iptables -A OUTPUT -o lo -j ACCEPT

# Allow established/related connections
iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow SSH (rate-limit to prevent brute force)
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW \
    -m recent --set --name SSH --rsource
iptables -A INPUT -p tcp --dport 22 -m conntrack --ctstate NEW \
    -m recent --update --seconds 60 --hitcount 4 --name SSH --rsource -j DROP
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
iptables -A INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT

# Save rules
iptables-save > /etc/iptables/rules.v4
```
