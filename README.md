# 🎉 Birthday Brunch 23 - Système de Commande de Boissons

Application web complète pour gérer les commandes de boissons lors d'un anniversaire, avec un thème léopard élégant.

![Theme](https://img.shields.io/badge/Theme-Leopard-D4A574)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1)

## 📋 Fonctionnalités

- ✅ **Commande anonyme** : Les invités commandent sans avoir à s'identifier
- ☕ **7 types de boissons** avec variantes (Expresso, Cappuccino, Latte Macchiato, etc.)
- 📊 **Dashboard admin** : Vue en temps réel des commandes
- 🔄 **Auto-refresh** : Mise à jour automatique toutes les 10 secondes
- 🎨 **Design thématique** : Thème léopard avec cœurs décoratifs
- 📱 **Responsive** : Adapté aux mobiles et tablettes
- 🚀 **Temps réel** : Les commandes apparaissent instantanément

## 🏗️ Architecture

```
boisson-anniv/
├── frontend/          # Application React
│   ├── src/
│   │   ├── components/
│   │   │   ├── OrderForm.jsx       # Formulaire de commande
│   │   │   └── AdminDashboard.jsx  # Dashboard admin
│   │   ├── styles/
│   │   │   └── App.css             # Styles thématiques
│   │   ├── App.js                  # Router principal
│   │   └── index.js
│   └── package.json
├── backend/           # API Node.js/Express
│   ├── server.js      # Serveur et routes API
│   ├── db.js          # Connexion MySQL
│   ├── .env.example   # Variables d'environnement
│   └── package.json
└── database/          # Scripts SQL
    ├── setup.sql      # Création DB et tables
    └── README.md
```

## 🚀 Installation

### Prérequis

- Node.js 16+ et npm
- MySQL 5.7+ ou MariaDB
- Un serveur web (pour la production)

### 1. Cloner le projet

```bash
git clone <votre-repo>
cd boisson-anniv
```

### 2. Configuration de la base de données

#### A. Créer la base de données

```bash
cd database
mysql -u root -p < setup.sql
```

⚠️ **Important** : Avant d'exécuter, éditez `setup.sql` et remplacez `VOTRE_MOT_DE_PASSE_SECURISE` par un mot de passe fort.

#### B. Vérifier la création

```bash
mysql -u birthday_brunch -p birthday_brunch
```

Puis :
```sql
SHOW TABLES;
DESCRIBE orders;
```

### 3. Configuration du Backend

```bash
cd ../backend
npm install
```

Créer le fichier `.env` :
```bash
cp .env.example .env
```

Éditer `.env` avec vos paramètres :
```env
DB_HOST=localhost
DB_USER=birthday_brunch
DB_PASSWORD=votre_mot_de_passe_ici
DB_NAME=birthday_brunch
DB_PORT=3306
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 4. Configuration du Frontend

```bash
cd ../frontend
npm install
```

## 🎮 Utilisation (Développement)

### Démarrer le backend

```bash
cd backend
npm run dev
```

Le backend sera accessible sur `http://localhost:5000`

### Démarrer le frontend

Dans un autre terminal :
```bash
cd frontend
npm start
```

Le frontend sera accessible sur `http://localhost:3000`

### Tester l'application

1. **Page de commande** : `http://localhost:3000/`
   - Sélectionnez les boissons
   - Cliquez sur "Commander"
   - Confirmation instantanée

2. **Dashboard admin** : `http://localhost:3000/admin`
   - Vue des totaux par boisson
   - Actualisation automatique
   - Bouton de réinitialisation

## 📦 Déploiement en Production

### 1. Build du Frontend

```bash
cd frontend
npm run build
```

Le dossier `build/` contient les fichiers statiques à déployer.

### 2. Configuration Nginx (Exemple)

```nginx
server {
    listen 80;
    server_name votre-domaine.tidic.fr;

    # Frontend
    location / {
        root /var/www/birthday-brunch/build;
        try_files $uri $uri/ /index.html;
    }

    # API Backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Démarrer le Backend en Production

```bash
cd backend

# Avec PM2 (recommandé)
npm install -g pm2
pm2 start server.js --name birthday-brunch
pm2 save
pm2 startup

# Ou avec nohup
nohup npm start &
```

### 4. Configuration de la Base de Données

Sur votre serveur tidic.fr, assurez-vous que :
- MySQL est installé et démarré
- Le pare-feu autorise les connexions (si nécessaire)
- L'utilisateur `birthday_brunch` a les bonnes permissions

## 🔧 Configuration Avancée

### Variables d'Environnement Backend

| Variable | Description | Défaut |
|----------|-------------|--------|
| `DB_HOST` | Hôte MySQL | `localhost` |
| `DB_USER` | Utilisateur MySQL | `birthday_brunch` |
| `DB_PASSWORD` | Mot de passe MySQL | - |
| `DB_NAME` | Nom de la base | `birthday_brunch` |
| `DB_PORT` | Port MySQL | `3306` |
| `PORT` | Port du backend | `5000` |
| `FRONTEND_URL` | URL du frontend (CORS) | `http://localhost:3000` |

### Proxy Frontend (package.json)

Pour le développement, le frontend utilise un proxy vers le backend :
```json
"proxy": "http://localhost:5000"
```

En production, configurez votre serveur web (Nginx/Apache) pour router `/api/*` vers le backend.

## 📱 Générer un QR Code

Pour permettre aux invités de scanner et accéder à la page :

1. Utilisez un générateur de QR code en ligne (ex: qr-code-generator.com)
2. Entrez l'URL de votre site : `https://votre-domaine.tidic.fr`
3. Téléchargez et imprimez le QR code
4. Placez-le sur les tables

## 🍹 Liste des Boissons

- **Expresso** (simple / double)
- **Cappuccino** (nature / vanille / caramel)
- **Latte Macchiato** (nature / vanille / caramel)
- **Latte Macchiato spéculos**
- **Frappuccino Cookie Cream**
- **Thé**
- **Chocolat chaud**

## 🎨 Personnalisation du Design

Le thème est défini dans `frontend/src/styles/App.css` :

```css
:root {
  --color-bg: #F5E6D3;           /* Fond beige */
  --color-primary: #2D2D2D;      /* Texte noir */
  --color-accent: #C9A87C;       /* Accent doré */
  --color-leopard: #D4A574;      /* Léopard clair */
  --color-leopard-dark: #8B6F47; /* Léopard foncé */
  --font-script: 'Allura', cursive;
  --font-body: 'Poppins', sans-serif;
}
```

## 🔒 Sécurité

### Recommandations :

1. **Mot de passe MySQL fort**
2. **HTTPS en production** (Let's Encrypt)
3. **Variables d'environnement** : Ne jamais commit le fichier `.env`
4. **Rate limiting** : Ajouter express-rate-limit pour éviter les abus
5. **CORS** : Configurer correctement les origines autorisées

### Ajouter une authentification admin (optionnel)

Pour protéger `/admin`, vous pouvez ajouter :
- Authentification basique HTTP
- JWT tokens
- Middleware de vérification

## 📊 Commandes SQL Utiles

```sql
-- Voir toutes les commandes
SELECT * FROM orders ORDER BY created_at DESC;

-- Totaux par boisson
SELECT drink_name, drink_variant, COUNT(*) as total
FROM orders
GROUP BY drink_name, drink_variant;

-- Total général
SELECT COUNT(*) as total FROM orders;

-- Réinitialiser
TRUNCATE TABLE orders;

-- Supprimer les commandes de plus de 24h
DELETE FROM orders WHERE created_at < NOW() - INTERVAL 24 HOUR;
```

## 🐛 Dépannage

### Le backend ne se connecte pas à MySQL

1. Vérifier que MySQL est démarré : `systemctl status mysql`
2. Vérifier les credentials dans `.env`
3. Tester la connexion : `mysql -u birthday_brunch -p`

### Erreur CORS

1. Vérifier `FRONTEND_URL` dans `.env` du backend
2. En production, s'assurer que le proxy Nginx est bien configuré

### Le frontend ne charge pas les données

1. Vérifier que le backend est démarré
2. Ouvrir la console du navigateur (F12) pour voir les erreurs
3. Vérifier que `/api/orders/stats` retourne des données

## 📝 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/orders` | Créer une commande |
| POST | `/api/orders/batch` | Créer plusieurs commandes |
| GET | `/api/orders` | Liste toutes les commandes |
| GET | `/api/orders/stats` | Statistiques par boisson |
| DELETE | `/api/orders/reset` | Réinitialiser toutes les commandes |

## 🤝 Contribution

Ce projet est créé pour un événement privé. Pour toute modification :

1. Testez en local
2. Vérifiez que tout fonctionne
3. Committez avec des messages clairs

## 📄 Licence

Projet privé - Tous droits réservés

## 💡 Idées d'Amélioration

- [ ] Ajouter des notifications push pour les nouvelles commandes
- [ ] Système de file d'attente (commandes en cours / terminées)
- [ ] Export des statistiques en CSV
- [ ] Mode nuit
- [ ] Multilingue (FR/EN)
- [ ] Impression automatique des commandes

---

**Bon anniversaire ! 🎉🥳**
