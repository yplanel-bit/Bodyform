#!/bin/bash
# ============================================================
# deploy.sh — Déploiement Bodyform sur Raspberry Pi
# Usage : bash deploy.sh <utilisateur> [<chemin_cle_ssh>]
# Exemple : bash deploy.sh pi ~/.ssh/id_rsa
# ============================================================

set -e

PI_USER="${1:-raspyan}"
PI_HOST="192.168.1.144"
APP_PORT="2905"
REMOTE_DIR="/home/${PI_USER}/apps/Bodyform"
SSH_KEY="${2:-}"

SSH_OPTS="-o StrictHostKeyChecking=accept-new"
[ -n "$SSH_KEY" ] && SSH_OPTS="$SSH_OPTS -i $SSH_KEY"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  BODYFORM — Déploiement sur Raspberry Pi"
echo "  Destination : ${PI_USER}@${PI_HOST}:${REMOTE_DIR}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── 1. Copie des fichiers ──────────────────────────────────
echo "[1/5] Copie des fichiers vers le Pi..."
ssh $SSH_OPTS ${PI_USER}@${PI_HOST} "mkdir -p ${REMOTE_DIR}"
rsync -avz --exclude 'node_modules' --exclude '.git' \
  $SSH_OPTS \
  -e "ssh $SSH_OPTS" \
  ./app/ ${PI_USER}@${PI_HOST}:${REMOTE_DIR}/app/

# ── 2. Installation + build sur le Pi ─────────────────────
echo ""
echo "[2/5] Installation des dépendances et build sur le Pi..."
ssh $SSH_OPTS ${PI_USER}@${PI_HOST} "
  cd ${REMOTE_DIR}/app
  npm install --production=false
  npm run build
"

# ── 3. Installation de PM2 ────────────────────────────────
echo ""
echo "[3/5] Installation / mise à jour de PM2..."
ssh $SSH_OPTS ${PI_USER}@${PI_HOST} "
  which pm2 || sudo npm install -g pm2
"

# ── 4. (Re)démarrage avec PM2 ─────────────────────────────
echo ""
echo "[4/5] (Re)démarrage de l'application via PM2..."
ssh $SSH_OPTS ${PI_USER}@${PI_HOST} "
  cd ${REMOTE_DIR}/app
  pm2 delete bodyform 2>/dev/null || true
  pm2 start npm --name 'bodyform' -- start
  pm2 startup | tail -1 | bash || true
  pm2 save
"

# ── 5. Vérification ───────────────────────────────────────
echo ""
echo "[5/5] Vérification..."
sleep 3
ssh $SSH_OPTS ${PI_USER}@${PI_HOST} "pm2 status bodyform"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓  Application en ligne !"
echo "  Réseau local : http://${PI_HOST}:${APP_PORT}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
