# 🚀 Déploiement sur tidic.fr/anniv-emma

Guide spécifique pour déployer l'application sur un sous-chemin.

## ✅ Modifications déjà effectuées

Les fichiers suivants ont été configurés pour fonctionner sur `tidic.fr/anniv-emma` :

1. **frontend/src/App.js** : `basename="/anniv-emma"` dans React Router
2. **frontend/package.json** : `"homepage": "/anniv-emma"`
3. **nginx-subpath.conf** : Configuration Nginx pour le sous-chemin

## 📋 Étapes de déploiement

### 1. Build du Frontend

```bash
cd frontend
npm install
npm run build
```

Le build sera automatiquement configuré pour le chemin `/anniv-emma`.

### 2. Configurer Nginx

Ajoutez le contenu de `nginx-subpath.conf` dans votre configuration Nginx existante pour `tidic.fr` :

```bash
sudo nano /etc/nginx/sites-available/tidic.fr
```

Ajoutez les blocs `location` du fichier `nginx-subpath.conf` dans votre bloc `server {}` existant.

### 3. Déployer les fichiers

```bash
# Créer le répertoire
sudo mkdir -p /var/www/birthday-brunch/frontend/build

# Copier les fichiers buildés
sudo cp -r frontend/build/* /var/www/birthday-brunch/frontend/build/

# Permissions
sudo chown -R www-data:www-data /var/www/birthday-brunch
```

### 4. Configurer le Backend

Le backend reste sur le port 5000 (pas de changement nécessaire).

```bash
cd backend
npm install
cp .env.example .env
nano .env
```

Dans `.env`, en production :
```env
FRONTEND_URL=https://tidic.fr
```

Démarrer avec PM2 :
```bash
pm2 start server.js --name birthday-brunch-api
```

### 5. Recharger Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 🌐 Accès

Une fois déployé :

- **Page de commande** : `https://tidic.fr/anniv-emma`
- **Dashboard admin** : `https://tidic.fr/anniv-emma/admin`
- **API** : `https://tidic.fr/anniv-emma/api/*`

## 📱 QR Code

Générez le QR code avec l'URL complète :
```
https://tidic.fr/anniv-emma
```

## 🔧 Configuration Nginx Complète (Exemple)

Voici un exemple de configuration complète pour tidic.fr :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name tidic.fr www.tidic.fr;

    # Redirection HTTPS (si configuré)
    # return 301 https://$server_name$request_uri;

    # Vos autres configurations existantes pour tidic.fr
    # ...

    # === Birthday Brunch Application ===

    # Frontend React
    location /anniv-emma {
        alias /var/www/birthday-brunch/frontend/build;
        index index.html;
        try_files $uri $uri/ /anniv-emma/index.html;

        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml;

        location ~* /anniv-emma/static/ {
            alias /var/www/birthday-brunch/frontend/build/static/;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Backend
    location /anniv-emma/api {
        rewrite ^/anniv-emma/api/(.*)$ /api/$1 break;
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
}
```

## 🧪 Tester en Local avec Sous-chemin

Pour tester localement avec le sous-chemin :

```bash
# Backend
cd backend
npm run dev  # Sur http://localhost:5000

# Frontend
cd frontend
npm start    # Sur http://localhost:3000/anniv-emma
```

Accédez à : `http://localhost:3000/anniv-emma`

## ⚠️ Points Importants

1. **Tous les liens internes** dans l'application utilisent des chemins relatifs grâce à React Router
2. **Les assets** (CSS, JS, images) sont automatiquement préfixés par `/anniv-emma` grâce au `homepage`
3. **L'API** est accessible via `/anniv-emma/api` grâce à la réécriture Nginx
4. **Le CORS** doit autoriser `tidic.fr` (pas besoin de spécifier le sous-chemin)

## 🔄 Mise à Jour

Pour mettre à jour l'application :

```bash
# 1. Pull les changements
cd /var/www/birthday-brunch
git pull

# 2. Rebuild le frontend
cd frontend
npm install
npm run build
sudo cp -r build/* /var/www/birthday-brunch/frontend/build/

# 3. Redémarrer le backend si nécessaire
cd ../backend
npm install
pm2 restart birthday-brunch-api

# 4. Recharger Nginx si config changée
sudo systemctl reload nginx
```

## 📊 Vérification

```bash
# Vérifier que Nginx sert bien les fichiers
curl -I https://tidic.fr/anniv-emma

# Vérifier l'API
curl https://tidic.fr/anniv-emma/api/health

# Vérifier les logs
pm2 logs birthday-brunch-api
tail -f /var/log/nginx/access.log
```

## 🐛 Dépannage

### Erreur 404 sur les routes React

Vérifiez que `try_files` redirige bien vers `/anniv-emma/index.html` dans Nginx.

### Assets (CSS/JS) en 404

Vérifiez que `"homepage": "/anniv-emma"` est bien dans `frontend/package.json`.

### API ne répond pas

Vérifiez que la réécriture `rewrite ^/anniv-emma/api/(.*)$ /api/$1 break;` est présente.

### CORS Error

Dans `backend/.env`, vérifiez que `FRONTEND_URL=https://tidic.fr` (sans le sous-chemin).

---

✨ **Votre application sera accessible sur `tidic.fr/anniv-emma` !**
