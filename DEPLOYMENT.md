# 🚀 Guide de Déploiement sur tidic.fr

## Prérequis Serveur

- Ubuntu/Debian Linux
- Node.js 16+
- MySQL 5.7+
- Nginx
- Accès SSH au serveur

## 📦 Étape 1 : Préparation du Serveur

### Installer les dépendances

```bash
# Mise à jour
sudo apt update && sudo apt upgrade -y

# Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# MySQL
sudo apt install -y mysql-server

# Nginx
sudo apt install -y nginx

# PM2 (Process Manager)
sudo npm install -g pm2
```

### Configurer MySQL

```bash
sudo mysql_secure_installation
```

## 📂 Étape 2 : Déployer le Code

```bash
# Cloner le projet
cd /var/www
sudo git clone <votre-repo> birthday-brunch
sudo chown -R $USER:$USER birthday-brunch
cd birthday-brunch
```

## 🗄️ Étape 3 : Configuration de la Base de Données

```bash
# Éditer le mot de passe dans setup.sql
nano database/setup.sql

# Créer la base de données
sudo mysql -u root -p < database/setup.sql

# Vérifier
mysql -u birthday_brunch -p
```

Dans MySQL :
```sql
USE birthday_brunch;
SHOW TABLES;
DESCRIBE orders;
EXIT;
```

## ⚙️ Étape 4 : Configuration du Backend

```bash
cd backend
npm install --production

# Créer le fichier .env
cp .env.example .env
nano .env
```

Configurer `.env` pour la production :
```env
DB_HOST=localhost
DB_USER=birthday_brunch
DB_PASSWORD=votre_mot_de_passe_prod
DB_NAME=birthday_brunch
DB_PORT=3306
PORT=5000
FRONTEND_URL=https://votre-domaine.tidic.fr
```

### Démarrer avec PM2

```bash
pm2 start server.js --name birthday-brunch-api
pm2 save
pm2 startup
```

Vérifier :
```bash
pm2 status
pm2 logs birthday-brunch-api
```

## 🎨 Étape 5 : Build du Frontend

```bash
cd ../frontend
npm install
npm run build
```

Le dossier `build/` contient les fichiers à servir.

## 🌐 Étape 6 : Configuration Nginx

```bash
sudo nano /etc/nginx/sites-available/birthday-brunch
```

Contenu :
```nginx
server {
    listen 80;
    server_name votre-domaine.tidic.fr;

    # Logs
    access_log /var/log/nginx/birthday-brunch-access.log;
    error_log /var/log/nginx/birthday-brunch-error.log;

    # Frontend (fichiers statiques)
    location / {
        root /var/www/birthday-brunch/frontend/build;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Backend (proxy vers Node.js)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### Activer le site

```bash
sudo ln -s /etc/nginx/sites-available/birthday-brunch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 🔒 Étape 7 : HTTPS avec Let's Encrypt (Recommandé)

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d votre-domaine.tidic.fr

# Auto-renouvellement
sudo certbot renew --dry-run
```

Certbot modifiera automatiquement la config Nginx pour ajouter HTTPS.

## ✅ Étape 8 : Vérification

```bash
# Status du backend
pm2 status

# Logs en temps réel
pm2 logs birthday-brunch-api

# Status Nginx
sudo systemctl status nginx

# Tester l'API
curl http://localhost:5000/api/health
curl https://votre-domaine.tidic.fr/api/health
```

## 📱 Étape 9 : Générer le QR Code

1. Aller sur https://www.qr-code-generator.com/
2. URL : `https://votre-domaine.tidic.fr`
3. Télécharger en haute qualité
4. Imprimer et placer sur les tables

## 🔄 Mise à Jour du Code

```bash
cd /var/www/birthday-brunch

# Pull les changements
git pull origin main

# Backend
cd backend
npm install --production
pm2 restart birthday-brunch-api

# Frontend
cd ../frontend
npm install
npm run build

# Recharger Nginx (si config changée)
sudo systemctl reload nginx
```

## 🛠️ Commandes Utiles

### PM2
```bash
pm2 status                          # État de tous les process
pm2 logs birthday-brunch-api        # Voir les logs
pm2 restart birthday-brunch-api     # Redémarrer
pm2 stop birthday-brunch-api        # Arrêter
pm2 delete birthday-brunch-api      # Supprimer
```

### Nginx
```bash
sudo systemctl status nginx         # Status
sudo systemctl restart nginx        # Redémarrer
sudo systemctl reload nginx         # Recharger config
sudo nginx -t                       # Tester config
tail -f /var/log/nginx/birthday-brunch-access.log  # Logs
```

### MySQL
```bash
sudo systemctl status mysql         # Status
mysql -u birthday_brunch -p         # Se connecter

# Backup
mysqldump -u birthday_brunch -p birthday_brunch > backup.sql

# Restore
mysql -u birthday_brunch -p birthday_brunch < backup.sql
```

## 🔥 Pare-feu (UFW)

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

## 📊 Monitoring

### Logs Backend
```bash
pm2 logs birthday-brunch-api --lines 100
```

### Logs Nginx
```bash
tail -f /var/log/nginx/birthday-brunch-access.log
tail -f /var/log/nginx/birthday-brunch-error.log
```

### Base de Données
```bash
mysql -u birthday_brunch -p

USE birthday_brunch;
SELECT COUNT(*) FROM orders;
SELECT drink_name, COUNT(*) FROM orders GROUP BY drink_name;
```

## 🚨 Dépannage

### Backend ne démarre pas
```bash
pm2 logs birthday-brunch-api
# Vérifier .env et connexion MySQL
```

### Erreur 502 Bad Gateway
```bash
# Le backend n'est pas accessible
pm2 status
pm2 restart birthday-brunch-api
```

### Base de données inaccessible
```bash
sudo systemctl status mysql
sudo systemctl restart mysql
mysql -u birthday_brunch -p  # Tester connexion
```

## 🎯 Checklist de Déploiement

- [ ] Serveur Ubuntu/Debian configuré
- [ ] Node.js, MySQL, Nginx installés
- [ ] Base de données créée et testée
- [ ] Code cloné dans `/var/www/birthday-brunch`
- [ ] Backend configuré (`.env` en production)
- [ ] Backend démarré avec PM2
- [ ] Frontend buildé
- [ ] Nginx configuré et testé
- [ ] HTTPS activé (Let's Encrypt)
- [ ] Pare-feu configuré
- [ ] QR Code généré et imprimé
- [ ] Test complet de bout en bout

## 📈 Performance

### Optimisations recommandées

1. **Nginx Caching**
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

2. **PM2 Cluster Mode** (multi-core)
```bash
pm2 start server.js -i max --name birthday-brunch-api
```

3. **MySQL Optimization**
```sql
-- Index pour améliorer les performances
CREATE INDEX idx_drink_created ON orders(drink_name, created_at);
```

## 🔐 Sécurité Supplémentaire

### Rate Limiting (Backend)

Installer :
```bash
npm install express-rate-limit
```

Ajouter dans `server.js` :
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite par IP
});

app.use('/api/', limiter);
```

### Protéger /admin avec HTTP Basic Auth (Nginx)

```bash
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
```

Dans la config Nginx :
```nginx
location /admin {
    auth_basic "Admin Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
    root /var/www/birthday-brunch/frontend/build;
    try_files $uri $uri/ /index.html;
}
```

---

**Bon déploiement ! 🚀**
