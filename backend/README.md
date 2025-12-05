# Backend - Birthday Brunch

Backend Node.js/Express pour le système de commande de boissons.

## Installation

```bash
npm install
```

## Configuration

1. Copier le fichier `.env.example` en `.env` :
```bash
cp .env.example .env
```

2. Modifier les valeurs dans `.env` :
```env
DB_HOST=localhost
DB_USER=birthday_brunch
DB_PASSWORD=votre_mot_de_passe
DB_NAME=birthday_brunch
DB_PORT=3306
PORT=5000
FRONTEND_URL=http://localhost:3000
```

## Démarrage

### Mode développement (avec auto-reload)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarrera sur `http://localhost:5000`

## Routes API

### Health Check
- **GET** `/api/health`
- Vérifie que le serveur fonctionne

### Créer une commande
- **POST** `/api/orders`
- Body: `{ "drink_name": "Cappuccino", "drink_variant": "vanille" }`

### Créer plusieurs commandes
- **POST** `/api/orders/batch`
- Body: `{ "orders": [{ "drink_name": "Cappuccino", "drink_variant": "vanille" }, ...] }`

### Récupérer toutes les commandes
- **GET** `/api/orders`
- Retourne toutes les commandes par ordre chronologique

### Récupérer les statistiques
- **GET** `/api/orders/stats`
- Retourne les totaux par type de boisson

### Réinitialiser les commandes
- **DELETE** `/api/orders/reset`
- Supprime toutes les commandes

## Test de l'API

```bash
# Test health check
curl http://localhost:5000/api/health

# Créer une commande
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"drink_name":"Cappuccino","drink_variant":"vanille"}'

# Récupérer les stats
curl http://localhost:5000/api/orders/stats
```
