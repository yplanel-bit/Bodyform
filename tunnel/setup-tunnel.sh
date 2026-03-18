#!/bin/bash
# ============================================================
# setup-tunnel.sh — Création d'un tunnel Cloudflare dédié
#                   à Bodyform, sans conflit avec d'autres applis
#
# Usage : bash setup-tunnel.sh <utilisateur> <ton-domaine.com> [<chemin_cle_ssh>]
# Exemple : bash setup-tunnel.sh pi mondomaine.com ~/.ssh/id_rsa
#
# Prérequis : cloudflared déjà installé et authentifié sur le Pi
#   (voir la section "Installation cloudflared" dans BODYFORM.md)
# ============================================================

set -e

PI_USER="${1:-raspyan}"
DOMAIN="${2:-}"
SSH_KEY="${3:-}"
PI_HOST="192.168.1.144"
TUNNEL_NAME="bodyform-tunnel"
SUBDOMAIN="bodyform"
APP_PORT="2905"
CONFIG_DIR="/home/${PI_USER}/.cloudflared"
CONFIG_FILE="${CONFIG_DIR}/bodyform-config.yml"

SSH_OPTS="-o StrictHostKeyChecking=accept-new"
[ -n "$SSH_KEY" ] && SSH_OPTS="$SSH_OPTS -i $SSH_KEY"

if [ -z "$DOMAIN" ]; then
  echo "ERREUR : tu dois fournir ton domaine."
  echo "Usage : bash setup-tunnel.sh pi mondomaine.com"
  exit 1
fi

HOSTNAME="${SUBDOMAIN}.${DOMAIN}"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  BODYFORM — Configuration tunnel Cloudflare"
echo "  Tunnel    : ${TUNNEL_NAME}"
echo "  URL cible : https://${HOSTNAME}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ssh $SSH_OPTS ${PI_USER}@${PI_HOST} bash <<REMOTE
set -e

echo "[1/4] Vérification de cloudflared..."
cloudflared --version

echo ""
echo "[2/4] Création du tunnel '${TUNNEL_NAME}'..."
# Si le tunnel existe déjà, on l'utilise
EXISTING=\$(cloudflared tunnel list 2>/dev/null | grep '${TUNNEL_NAME}' | awk '{print \$1}')
if [ -n "\$EXISTING" ]; then
  TUNNEL_ID="\$EXISTING"
  echo "  Tunnel existant trouvé : \$TUNNEL_ID"
else
  cloudflared tunnel create ${TUNNEL_NAME}
  TUNNEL_ID=\$(cloudflared tunnel list | grep '${TUNNEL_NAME}' | awk '{print \$1}')
  echo "  Nouveau tunnel créé : \$TUNNEL_ID"
fi

echo ""
echo "[3/4] Écriture de la config dans ${CONFIG_FILE}..."
mkdir -p ${CONFIG_DIR}
cat > ${CONFIG_FILE} << EOF
tunnel: \${TUNNEL_ID}
credentials-file: ${CONFIG_DIR}/\${TUNNEL_ID}.json

# Sécurité : seul localhost est exposé — aucun port ouvert sur la box
# Le trafic passe entièrement par le réseau chiffré Cloudflare (HTTPS)

ingress:
  - hostname: ${HOSTNAME}
    service: http://localhost:${APP_PORT}
    originRequest:
      connectTimeout: 10s
      noTLSVerify: false
  - service: http_status:404
EOF

echo "  Config écrite."

echo ""
echo "[4/4] Création de l'enregistrement DNS..."
cloudflared tunnel route dns ${TUNNEL_NAME} ${HOSTNAME} || \
  echo "  (DNS déjà configuré ou à créer manuellement dans le tableau de bord Cloudflare)"

echo ""
echo "  ✓ Tunnel configuré !"
REMOTE

# ── Démarrage du tunnel via PM2 ───────────────────────────
echo ""
echo "[+] Démarrage du tunnel via PM2..."
ssh $SSH_OPTS ${PI_USER}@${PI_HOST} "
  pm2 delete bodyform-tunnel 2>/dev/null || true
  pm2 start 'cloudflared tunnel --config ${CONFIG_FILE} run' --name 'bodyform-tunnel'
  pm2 save
"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✓  Tunnel actif !"
echo "  Accès externe : https://${HOSTNAME}"
echo ""
echo "  Commandes utiles sur le Pi :"
echo "    pm2 status            — état de l'app + tunnel"
echo "    pm2 logs bodyform     — logs de l'app"
echo "    pm2 logs bodyform-tunnel — logs du tunnel"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
