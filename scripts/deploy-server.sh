#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# deploy-server.sh — Deploy NetTrek game server to EC2
# ─────────────────────────────────────────────────────────────
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SERVER_IP="54.224.95.1"
KEY="$HOME/.ssh/space-channel-key.pem"
SSH="ssh -i $KEY -o StrictHostKeyChecking=no ubuntu@$SERVER_IP"
SCP="scp -i $KEY -o StrictHostKeyChecking=no"

echo ""
echo "  ┌─────────────────────────────────────────────┐"
echo "  │  NetTrek Game Server Deploy                 │"
echo "  └─────────────────────────────────────────────┘"
echo ""

# Upload server files
echo "  Uploading server files..."
$SSH "mkdir -p ~/nettrek/server"
$SCP $PROJECT_ROOT/server/*.js "ubuntu@$SERVER_IP:~/nettrek/server/"
$SCP "$PROJECT_ROOT/package.json" "ubuntu@$SERVER_IP:~/nettrek/"
echo "  ✓ Files uploaded"

# Install deps + setup service
echo "  Setting up server..."
$SSH << 'REMOTE'
  # Install Node if needed
  if ! command -v node &>/dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
    sudo apt-get install -y nodejs
  fi

  cd ~/nettrek
  npm install --production 2>/dev/null

  # Create systemd service
  sudo tee /etc/systemd/system/nettrek.service > /dev/null << 'EOF'
[Unit]
Description=NetTrek Game Server
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/nettrek
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=5
Environment=PORT=4300

[Install]
WantedBy=multi-user.target
EOF

  sudo systemctl daemon-reload
  sudo systemctl enable nettrek
  sudo systemctl restart nettrek
  sleep 2
  sudo systemctl status nettrek --no-pager | head -5
REMOTE

echo ""
echo "  ✓ NetTrek server deployed"
echo "  WebSocket: ws://$SERVER_IP:4300"
echo ""
