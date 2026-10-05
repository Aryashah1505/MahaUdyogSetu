#!/bin/bash
# MahaUdyogSetu - Resilient Multi-Server Tunnel Launcher
# Automatically reconnects if network drops or IP changes

CLOUDFLARED="/tmp/cloudflared"

if [ ! -f "$CLOUDFLARED" ]; then
  echo "Downloading cloudflared..."
  curl -L -s --fail -o /tmp/cloudflared.tgz https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-darwin-arm64.tgz
  tar -xzf /tmp/cloudflared.tgz -C /tmp
  chmod +x /tmp/cloudflared
fi

echo "Starting MahaUdyogSetu permanent tunnel to http://127.0.0.1:3000..."
while true; do
  "$CLOUDFLARED" tunnel --url http://127.0.0.1:3000 --retries 50 2>&1 | tee /tmp/cloudflared.log &
  PID=$!
  sleep 4
  NEW_URL=$(grep -oE "https://[a-zA-Z0-9.-]+\.trycloudflare\.com" /tmp/cloudflared.log | head -n 1)
  if [ -n "$NEW_URL" ]; then
    echo "$NEW_URL" > /tmp/current_tunnel_url
    echo "=================================================="
    echo "LIVE CLOUDFLARE URL: $NEW_URL"
    echo "=================================================="
    (
      while kill -0 $PID 2>/dev/null; do
        curl -s -o /dev/null "$NEW_URL/api/health" 2>/dev/null || true
        sleep 25
      done
    ) &
  fi
  wait $PID
  echo "Tunnel connection dropped. Reconnecting in 2s..."
  sleep 2
done
