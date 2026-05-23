---
title: "Let’s Encrypt Cert Re-newel via DNS-01-Challenge"
description: "This guide explains how to switch from HTTP-01 to DNS-01 ACME challenges, so you can automate certificate issuance for any service (web servers, mail servers, and more) without exposing port 80."
pubDate: 2025-05-16
tags: []
draft: false
---

## Configure Dynamic DNS Updates in Your DNS GUI

1. **Create a DNS key**  
   - Go to **Security** or **DNS Keys** in your DNS GUI.  
   - Add a key:  
     - **Name**: `acme-update`  
     - **Algorithm**: HMAC-SHA512 (or HMAC-SHA256)  
     - **Key Length**: 256 or 512 bits  
   - Generate and copy the Base64 secret.

2. **Authorize the key for your zone**  
   - Open settings for zone `example.com`.  
   - Enable **Allow Dynamic Updates** (sometimes "DDNS").  
   - Add the `acme-update` key to the authorized keys list.  
   - Save and reload your DNS server via the GUI.

---

## Install and Configure acme.sh

On the server hosting your service:

```bash
# 1. Install acme.sh
curl https://get.acme.sh | sh
. ~/.bashrc

# 2. Create the TSIG keyfile for nsupdate
cat > ~/nsupdate.key <<EOF
key "acme-update" {
  algorithm hmac-sha512;
  secret "PASTE_YOUR_GUI_SECRET_HERE";
};
EOF
```

Then export the variables so acme.sh can push DNS changes:

```bash
export NSUPDATE_SERVER="dns1.example.com"
export NSUPDATE_ZONE="example.com"
export NSUPDATE_KEY="$HOME/nsupdate.key"
```

## Issue and Deploy Your Certificate

Adjust `mail.example.com`, file paths, and reload command for your service:

```bash
acme.sh --issue --dns dns_nsupdate \
  -d mail.example.com \
  --key-file       /path/to/your.service.key \
  --fullchain-file /path/to/your.service.crt \
  --reloadcmd      "systemctl restart your-service"
```

`--dns dns_nsupdate` uses your TSIG key to create the `_acme-challenge` TXT record.

`--reloadcmd` restarts your service so it immediately loads the new certificate.

## Automate Renewals & Close Port 80

### Automatic Renewal

acme.sh installs a daily cron job that:

- Checks if your cert is 60+ days old (in its 90-day lifecycle)
- Updates the DNS TXT record via your TSIG key
- Fetches the renewed certificate
- Runs your reload command

### Closing Port 80

After verifying (e.g. `dig TXT _acme-challenge.mail.example.com` and inspecting cert expiry) that DNS-01 issuance works, block TCP/80 on your server. All Let's Encrypt validations will occur over DNS only.

## How It Works

### DNS-01 Challenge
You prove domain control by publishing a TXT record `_acme-challenge.<your-domain>` containing Let's Encrypt's challenge token.

### TSIG-Secured Updates
TSIG keys (RFC2136) authenticate dynamic DNS UPDATE requests, ensuring only authorized clients can modify your zone.

### acme.sh Integration
The `dns_nsupdate` hook uses nsupdate with your TSIG key to programmatically add and remove TXT records during issuance and renewal.

### Seamless Automation
Certificates auto-renew without manual DNS edits or HTTP exposure, and your service reloads the new cert via the `--reloadcmd`.

### Reduced Attack Surface
With no HTTP-01 listener needed, you can fully firewall off port 80, improving overall security.

This method applies to any service that uses SSL/TLS certificates and supports reloading from file, not just Kerio Connect.

## References

acme.sh DNS NSUPDATE documentation:
https://github.com/acmesh-official/acme.sh/wiki/dnsapi#3-dns-api-addons---dynamic-update-rfc2136
