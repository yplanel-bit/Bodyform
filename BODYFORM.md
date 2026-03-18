# Bodyform — Cahier des charges & Guide de déploiement

## Vision du projet

**Bodyform** est une application web mobile-first, au design premium et harmonieux, intégrant du glassmorphism. Elle est conçue pour être hébergée sur un Raspberry Pi 4 personnel et accessible depuis l'extérieur via un tunnel Cloudflare.

---

## Contraintes de design

- **Responsive** mais pensée avant tout pour une utilisation sur **téléphone mobile**
- Style **harmonieux et arrondi**, premium — pas industriel
- Intégration du **glassmorphism** (effets de verre dépoli, transparences, flous)
- Couleurs douces, typographie moderne et lisible sur petit écran
- Animations fluides et subtiles

---

## Contraintes techniques

- Application déployée sur un **Raspberry Pi 4** nommé `raspyan`
- Adresse locale : `192.168.1.144`
- Accès via **clé SSH**
- Accès hors réseau local via un **tunnel Cloudflare** (configuration pas à pas, sans conflit avec les applications déjà hébergées)

---

## Guide de déploiement — étape par étape (en langage simple)

> Ce guide est rédigé pour quelqu'un qui n'est pas développeur. Chaque étape est expliquée clairement et dans le détail.

---

### Étape 1 — Préparer ton ordinateur

Avant de commencer, tu as besoin d'un outil pour te connecter à ton Raspberry Pi à distance. C'est comme ouvrir une "fenêtre de commande" sur ton Pi depuis ton ordinateur.

#### Sur macOS ou Linux
Le terminal est déjà installé. Tu n'as rien à faire.

#### Sur Windows
Installe **Windows Terminal** ou utilise **PuTTY** (un logiciel gratuit).

---

### Étape 2 — Se connecter au Raspberry Pi via SSH

SSH (Secure Shell) est un système qui permet de contrôler ton Raspberry Pi à distance, comme si tu tapais directement dessus.

```bash
ssh utilisateur@192.168.1.144
```

Remplace `utilisateur` par le nom d'utilisateur de ton Pi (souvent `pi` par défaut).

Si tu utilises une **clé SSH** (plus sécurisé que le mot de passe) :

```bash
ssh -i ~/.ssh/ta_cle_privee utilisateur@192.168.1.144
```

> **Explication :** `-i` veut dire "identité". Tu indiques au système quelle clé utiliser pour prouver que c'est bien toi.

---

### Étape 3 — Mettre à jour le Raspberry Pi

Une fois connecté, on s'assure que tout est à jour :

```bash
sudo apt update && sudo apt upgrade -y
```

> **Explication :** `apt` est le gestionnaire de logiciels du Pi. `update` récupère la liste des mises à jour disponibles. `upgrade` les installe. `sudo` signifie "fais ça en tant qu'administrateur".

---

### Étape 4 — Installer Node.js (le moteur de l'application)

Node.js est l'environnement qui permet de faire tourner l'application. C'est comme installer le moteur avant de démarrer la voiture.

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Vérifie que c'est bien installé :

```bash
node -v
npm -v
```

Tu dois voir un numéro de version s'afficher (ex : `v20.x.x`).

---

### Étape 5 — Déposer les fichiers de l'application sur le Pi

Depuis ton ordinateur, tu vas envoyer les fichiers de l'application vers ton Raspberry Pi. On utilise la commande `scp` (Secure Copy).

```bash
scp -r ./Bodyform utilisateur@192.168.1.144:/home/utilisateur/
```

> **Explication :** On copie tout le dossier `Bodyform` de ton ordinateur vers le dossier personnel de l'utilisateur sur le Pi.

Ou, si tu utilises Git :

```bash
# Sur le Pi
git clone https://github.com/ton-compte/bodyform.git
```

---

### Étape 6 — Lancer l'application

Une fois les fichiers sur le Pi, on se connecte en SSH et on installe les dépendances :

```bash
cd /home/utilisateur/Bodyform
npm install
npm run build
npm start
```

> **Explication :**
> - `npm install` télécharge tous les outils dont l'application a besoin
> - `npm run build` prépare l'application pour la production (comme emballer un colis)
> - `npm start` démarre l'application

L'application tourne maintenant sur le port `2905`.

---

### Étape 7 — Faire tourner l'application en permanence avec PM2

Sans outil supplémentaire, l'application s'arrêterait si tu fermes le terminal. **PM2** est un gestionnaire qui la maintient active en permanence.

```bash
sudo npm install -g pm2
pm2 start npm --name "bodyform" -- start
pm2 startup
pm2 save
```

> **Explication :**
> - `pm2 start` lance l'application en arrière-plan
> - `pm2 startup` fait en sorte que l'application redémarre automatiquement si le Pi redémarre
> - `pm2 save` mémorise cette configuration

---

### Étape 8 — Configurer le tunnel Cloudflare (accès depuis l'extérieur)

Pour accéder à l'application depuis l'extérieur de ton réseau (depuis ta 4G, par exemple), on utilise **Cloudflare Tunnel**. C'est une solution gratuite qui crée un "passage secret" sécurisé entre Internet et ton Pi, sans ouvrir de port sur ta box.

#### 8.1 — Créer un compte Cloudflare
Rends-toi sur [cloudflare.com](https://cloudflare.com) et crée un compte gratuit.

#### 8.2 — Installer cloudflared sur le Pi

```bash
# Télécharger cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-arm64.deb

# Installer
sudo dpkg -i cloudflared-linux-arm64.deb
```

> **Note :** Si ton Pi est un modèle 32 bits, remplace `arm64` par `armhf`.

#### 8.3 — Se connecter à ton compte Cloudflare

```bash
cloudflared tunnel login
```

Un lien s'affiche dans le terminal. Copie-le et colle-le dans ton navigateur. Connecte-toi à Cloudflare et autorise l'accès.

#### 8.4 — Créer un nouveau tunnel (sans conflit)

Pour éviter tout conflit avec d'autres applications déjà hébergées, on crée un tunnel avec un nom unique :

```bash
cloudflared tunnel create bodyform-tunnel
```

> Un fichier de configuration est créé automatiquement. Note l'**identifiant du tunnel** (une longue suite de lettres et chiffres) qui s'affiche.

#### 8.5 — Configurer le tunnel

Crée un fichier de configuration dédié à cette application :

```bash
nano ~/.cloudflared/bodyform-config.yml
```

Colle le contenu suivant (adapte les valeurs) :

```yaml
tunnel: <identifiant-du-tunnel>
credentials-file: /home/utilisateur/.cloudflared/<identifiant-du-tunnel>.json

ingress:
  - hostname: bodyform.ton-domaine.com
    service: http://localhost:2905
  - service: http_status:404
```

> **Explication :**
> - `hostname` : l'adresse à laquelle ton application sera accessible (tu dois posséder ce domaine et l'avoir ajouté dans Cloudflare)
> - `service` : l'adresse locale de l'application (le port sur lequel elle tourne sur le Pi)
> - La dernière ligne gère les requêtes qui ne correspondent à rien

#### 8.6 — Configurer le DNS dans Cloudflare

```bash
cloudflared tunnel route dns bodyform-tunnel bodyform.ton-domaine.com
```

> Cela crée automatiquement l'enregistrement DNS dans ton tableau de bord Cloudflare.

#### 8.7 — Lancer le tunnel en permanence avec PM2

```bash
pm2 start "cloudflared tunnel --config /home/utilisateur/.cloudflared/bodyform-config.yml run" --name "bodyform-tunnel"
pm2 save
```

> **Explication :** On utilise PM2 (déjà installé) pour gérer le tunnel comme l'application. Ainsi les deux démarrent automatiquement en cas de redémarrage du Pi.

---

### Étape 9 — Vérifier que tout fonctionne

1. Depuis ton réseau local : ouvre `http://192.168.1.144:2905` dans ton navigateur
2. Depuis l'extérieur (4G ou autre réseau) : ouvre `https://bodyform.ton-domaine.com`

---

### Récapitulatif des commandes utiles

| Action | Commande |
|---|---|
| Se connecter au Pi | `ssh utilisateur@192.168.1.144` |
| Voir l'état de l'application | `pm2 status` |
| Voir les logs de l'app | `pm2 logs bodyform` |
| Redémarrer l'application | `pm2 restart bodyform` |
| Voir l'état du tunnel | `pm2 logs bodyform-tunnel` |
| Mettre à jour l'application | `git pull && npm install && npm run build && pm2 restart bodyform` |

---

## Notes importantes

- **Ne jamais utiliser le même port** qu'une autre application déjà hébergée sur le Pi. Vérifie les ports occupés avec : `sudo ss -tlnp`
- **Ne jamais créer deux tunnels Cloudflare** pour le même hostname. Utilise toujours un nom de tunnel unique.
- Si tu as déjà un tunnel Cloudflare actif, liste-les avant d'en créer un nouveau : `cloudflared tunnel list`

---

*Document généré pour le projet Bodyform — version initiale*
