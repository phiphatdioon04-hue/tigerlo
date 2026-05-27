#!/usr/bin/env bash
# Tigerlo VPS one-shot deploy script
# Usage (on Ubuntu/Debian VPS as root):
#   curl -fsSL https://raw.githubusercontent.com/phiphatdioon04-hue/tigerlo/main/deploy/setup.sh | bash
#
# What it does:
#   1. Install Node.js 20, Nginx, Certbot, git, build-essential
#   2. Clone (or pull) repo to /opt/tigerlo
#   3. npm install + seed backend, build frontend
#   4. Create systemd service for backend on :3001
#   5. Configure Nginx reverse proxy for play-dame.com → :3001
#   6. Obtain Let's Encrypt SSL certificate
#
# Re-runnable: skips steps that are already done.

set -euo pipefail

DOMAIN_MAIN="play-dame.com"
DOMAIN_WWW="www.play-dame.com"
EMAIL_LE="admin@play-dame.com"
REPO_URL="https://github.com/phiphatdioon04-hue/tigerlo.git"
APP_DIR="/opt/tigerlo"
SERVICE_NAME="tigerlo"
APP_PORT=3001

log() { echo -e "\n\033[1;36m▶ $*\033[0m"; }
ok()  { echo -e "  \033[1;32m✓\033[0m $*"; }

# Must run as root
if [[ $EUID -ne 0 ]]; then
  echo "This script must be run as root (use: sudo bash setup.sh)" >&2
  exit 1
fi

log "Updating apt cache"
apt-get update -qq
ok "Done"

log "Installing base packages"
apt-get install -y -qq curl ca-certificates gnupg git build-essential nginx ufw
ok "Done"

if ! command -v node >/dev/null 2>&1 || [[ "$(node -v | sed 's/v//' | cut -d. -f1)" -lt 18 ]]; then
  log "Installing Node.js 20 (NodeSource)"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null
  apt-get install -y -qq nodejs
fi
ok "Node $(node -v) / npm $(npm -v)"

if ! command -v certbot >/dev/null 2>&1; then
  log "Installing certbot"
  apt-get install -y -qq certbot python3-certbot-nginx
fi
ok "certbot $(certbot --version 2>&1 | awk '{print $2}')"

# Clone or update repo
if [[ -d "$APP_DIR/.git" ]]; then
  log "Updating existing repo at $APP_DIR"
  git -C "$APP_DIR" fetch --quiet origin
  git -C "$APP_DIR" reset --hard origin/main --quiet
else
  log "Cloning repo to $APP_DIR"
  rm -rf "$APP_DIR"
  git clone --quiet "$REPO_URL" "$APP_DIR"
fi
ok "Repo at $(git -C "$APP_DIR" rev-parse --short HEAD)"

log "Installing backend deps + seeding DB"
cd "$APP_DIR/backend"
npm install --omit=dev --silent
# Seed only if DB doesn't exist
if [[ ! -f "$APP_DIR/backend/data.db" ]]; then
  npm run seed
  ok "Database seeded"
else
  ok "Database already exists, skipping seed"
fi

log "Building frontend"
cd "$APP_DIR/frontend"
npm install --silent
npm run build
ok "Frontend built to dist/"

# Generate persistent JWT secret if not exists
SECRET_FILE="$APP_DIR/backend/.jwt_secret"
if [[ ! -f "$SECRET_FILE" ]]; then
  openssl rand -hex 32 > "$SECRET_FILE"
  chmod 600 "$SECRET_FILE"
  ok "Generated JWT secret"
fi
JWT_SECRET="$(cat "$SECRET_FILE")"

log "Creating systemd service: $SERVICE_NAME"
cat > "/etc/systemd/system/${SERVICE_NAME}.service" <<EOF
[Unit]
Description=Tigerlo App Backend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$APP_DIR/backend
Environment="NODE_ENV=production"
Environment="PORT=$APP_PORT"
Environment="JWT_SECRET=$JWT_SECRET"
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable "$SERVICE_NAME" --quiet
systemctl restart "$SERVICE_NAME"
sleep 2
if systemctl is-active --quiet "$SERVICE_NAME"; then
  ok "Service running on :$APP_PORT"
else
  echo "Service failed to start. Logs:"
  journalctl -u "$SERVICE_NAME" -n 20 --no-pager
  exit 1
fi

log "Configuring Nginx"
cat > "/etc/nginx/sites-available/${SERVICE_NAME}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN_MAIN} ${DOMAIN_WWW};

    client_max_body_size 10M;

    location / {
        proxy_pass http://127.0.0.1:${APP_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        proxy_read_timeout 60s;
    }
}
EOF

ln -sf "/etc/nginx/sites-available/${SERVICE_NAME}" "/etc/nginx/sites-enabled/${SERVICE_NAME}"
rm -f /etc/nginx/sites-enabled/default
nginx -t -q
systemctl reload nginx
ok "Nginx configured"

# Firewall
if command -v ufw >/dev/null 2>&1; then
  log "Configuring firewall (UFW)"
  ufw --force allow OpenSSH >/dev/null
  ufw --force allow 'Nginx Full' >/dev/null
  ufw --force enable >/dev/null
  ok "Firewall enabled (SSH + HTTP/HTTPS)"
fi

# SSL via certbot
log "Requesting Let's Encrypt SSL cert"
if certbot certificates 2>/dev/null | grep -q "$DOMAIN_MAIN"; then
  ok "Cert already exists, skipping"
else
  certbot --nginx \
    -d "$DOMAIN_MAIN" \
    -d "$DOMAIN_WWW" \
    --non-interactive \
    --agree-tos \
    -m "$EMAIL_LE" \
    --redirect \
    || echo "  ⚠ Certbot failed — make sure DNS A records point to this server and ports 80/443 are open."
fi

# Auto-renew is handled by certbot's systemd timer (installed by default)

log "Deployment complete!"
echo ""
echo "  App:           https://${DOMAIN_MAIN}"
echo "  Admin login:   https://${DOMAIN_MAIN}/admin/login"
echo "  Default creds: admin / admin123  ← change ASAP"
echo ""
echo "  Service status:  systemctl status ${SERVICE_NAME}"
echo "  Service logs:    journalctl -u ${SERVICE_NAME} -f"
echo "  Update app:      curl -fsSL https://raw.githubusercontent.com/phiphatdioon04-hue/tigerlo/main/deploy/setup.sh | bash"
echo ""
