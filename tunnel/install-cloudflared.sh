#!/bin/bash
# ============================================================
# install-cloudflared.sh — Installation de cloudflared sur Pi
# À exécuter DIRECTEMENT sur le Raspberry Pi (pas depuis ton ordi)
# ============================================================

set -e

echo "Détection de l'architecture..."
ARCH=$(uname -m)

case "$ARCH" in
  aarch64) DEB="cloudflared-linux-arm64.deb" ;;
  armv7l)  DEB="cloudflared-linux-armhf.deb" ;;
  x86_64)  DEB="cloudflared-linux-amd64.deb" ;;
  *)
    echo "Architecture non reconnue : $ARCH"
    exit 1
    ;;
esac

echo "Architecture : $ARCH → fichier : $DEB"
echo ""

echo "Téléchargement de cloudflared..."
wget -q --show-progress \
  "https://github.com/cloudflare/cloudflared/releases/latest/download/${DEB}" \
  -O /tmp/cloudflared.deb

echo "Installation..."
sudo dpkg -i /tmp/cloudflared.deb
rm /tmp/cloudflared.deb

echo ""
echo "Version installée :"
cloudflared --version

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo " cloudflared installé !"
echo ""
echo " Prochaine étape — authentification Cloudflare :"
echo "   cloudflared tunnel login"
echo " (un lien s'affiche, ouvre-le dans ton navigateur)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
