---
title: "Hardening a single-node VPS in 2026"
description: "The minimal-effort checklist I run on every fresh box before anything else gets installed."
pubDate: 2026-05-20
tags: ["security", "linux", "vps"]
draft: false
---

Every time I spin up a VPS I run roughly the same set of steps. Here it is, written down,
so I stop forgetting one of them.

## 1. SSH first, before anything else

```bash
# on your laptop
ssh-keygen -t ed25519 -C "marc@laptop"
ssh-copy-id root@new-vps

# on the box
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh
```

Test in a **second terminal** before you log out of the first one. Ask me how I know.

## 2. Unattended security updates

```bash
apt update && apt install -y unattended-upgrades
dpkg-reconfigure -plow unattended-upgrades
```

## 3. UFW: deny by default

```bash
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80,443/tcp
ufw enable
```

## 4. Fail2ban for SSH

```bash
apt install -y fail2ban
systemctl enable --now fail2ban
```

Default jails cover SSH. That's enough for a single-node box.

## 5. A non-root user for everything else

```bash
adduser marc
usermod -aG sudo,docker marc
```

From this point on, `root` only exists for emergencies.

## 6. Docker, configured for production

`/etc/docker/daemon.json`:

```json
{
  "log-driver": "journald",
  "no-new-privileges": true,
  "userns-remap": "default",
  "live-restore": true
}
```

That's it. Six steps, ~five minutes, and the box is dramatically less interesting to attackers.
