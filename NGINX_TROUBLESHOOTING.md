# 🔧 Dépannage Nginx - Erreur 403 sur les fichiers statiques

## Problème : 403 Forbidden sur `/anniv-emma/static/js/...`

### Solution 1 : Vérifier les permissions des fichiers

```bash
# Donner les bonnes permissions
sudo chown -R www-data:www-data /var/www/birthday-brunch/frontend/build
sudo chmod -R 755 /var/www/birthday-brunch/frontend/build

# Vérifier
ls -la /var/www/birthday-brunch/frontend/build/
ls -la /var/www/birthday-brunch/frontend/build/static/
```

### Solution 2 : Vérifier la configuration Nginx

Utilisez la configuration simplifiée dans `nginx-subpath.conf` :

```nginx
# 1. API AVANT le frontend (important!)
location /anniv-emma/api/ {
    rewrite ^/anniv-emma/api/(.*)$ /api/$1 break;
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}

# 2. Frontend
location /anniv-emma {
    alias /var/www/birthday-brunch/frontend/build;
    index index.html;
    try_files $uri $uri/ /anniv-emma/index.html;
}
```

### Solution 3 : Tester la configuration Nginx

```bash
# Tester la syntaxe
sudo nginx -t

# Si OK, recharger
sudo systemctl reload nginx

# Voir les logs en temps réel
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Solution 4 : Vérifier que les fichiers existent

```bash
# Vérifier que le build existe
ls -la /var/www/birthday-brunch/frontend/build/
ls -la /var/www/birthday-brunch/frontend/build/static/js/

# Vérifier qu'index.html existe
cat /var/www/birthday-brunch/frontend/build/index.html | head -20
```

### Solution 5 : Alternative avec ROOT au lieu d'ALIAS

Si `alias` pose problème, utilisez `root` :

```nginx
# Créer un symlink
sudo ln -s /var/www/birthday-brunch/frontend/build /var/www/html/anniv-emma

# Configuration Nginx
location /anniv-emma {
    root /var/www/html;
    index index.html;
    try_files $uri $uri/ /anniv-emma/index.html;
}
```

### Solution 6 : Configuration complète alternative

Si les solutions précédentes ne marchent pas, utilisez cette config :

```nginx
server {
    listen 80;
    server_name tidic.fr;

    # ... vos autres configurations ...

    # API
    location ~ ^/anniv-emma/api/(.*)$ {
        proxy_pass http://localhost:5000/api/$1$is_args$args;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Frontend - index.html pour les routes React
    location ~ ^/anniv-emma/?$ {
        alias /var/www/birthday-brunch/frontend/build/index.html;
    }

    # Frontend - fichiers statiques
    location ~ ^/anniv-emma/(.*)$ {
        alias /var/www/birthday-brunch/frontend/build/$1;
        try_files $uri /anniv-emma/index.html;
    }
}
```

### Commandes de diagnostic

```bash
# 1. Vérifier que Nginx peut accéder aux fichiers
sudo -u www-data cat /var/www/birthday-brunch/frontend/build/index.html

# 2. Vérifier le propriétaire des fichiers
ls -la /var/www/birthday-brunch/frontend/build/

# 3. Vérifier SELinux (si activé)
sestatus
sudo setenforce 0  # Temporairement désactiver pour tester

# 4. Tester directement avec curl
curl -I https://tidic.fr/anniv-emma/
curl -I https://tidic.fr/anniv-emma/static/js/main.xxxxx.js

# 5. Voir les logs Nginx
sudo tail -50 /var/log/nginx/error.log
```

### Points importants avec `alias`

⚠️ **ATTENTION** : `alias` est sensible aux slashes !

```nginx
# ❌ INCORRECT - Double slash possible
location /anniv-emma/ {
    alias /var/www/build/;
}

# ✅ CORRECT - Pas de slash final sur location
location /anniv-emma {
    alias /var/www/build;
}

# OU

# ✅ CORRECT - Slash final sur les deux
location /anniv-emma/ {
    alias /var/www/build/;
}
```

### Tester en local

Pour vérifier que le build est correct :

```bash
cd /var/www/birthday-brunch/frontend/build
python3 -m http.server 8080
```

Puis testez : `http://votre-serveur:8080`

Si ça fonctionne avec le serveur Python, le problème est bien dans la config Nginx.

## Checklist complète

- [ ] Les fichiers sont dans `/var/www/birthday-brunch/frontend/build/`
- [ ] Les permissions sont `755` pour les dossiers et `644` pour les fichiers
- [ ] Le propriétaire est `www-data:www-data`
- [ ] La config Nginx utilise `alias` correctement (sans conflits de slashes)
- [ ] L'API est AVANT le frontend dans la config
- [ ] `nginx -t` passe sans erreur
- [ ] Nginx a été rechargé après modification
- [ ] Les logs ne montrent pas d'erreur de permissions

## Si rien ne fonctionne

Partagez les informations suivantes :

```bash
# Config actuelle
sudo nginx -T | grep -A 30 "anniv-emma"

# Permissions
ls -la /var/www/birthday-brunch/frontend/build/

# Logs
sudo tail -50 /var/log/nginx/error.log | grep anniv-emma

# Test de lecture
sudo -u www-data cat /var/www/birthday-brunch/frontend/build/index.html | head -5
```
