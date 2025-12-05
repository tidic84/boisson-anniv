# 🚀 Démarrage Rapide

Guide minimal pour démarrer rapidement l'application.

## ⚡ En 5 minutes

### 1. Base de données

```bash
# Éditer le mot de passe dans database/setup.sql
nano database/setup.sql

# Créer la base
mysql -u root -p < database/setup.sql
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
nano .env  # Configurer le mot de passe DB
npm run dev
```

### 3. Frontend (nouveau terminal)

```bash
cd frontend
npm install
npm start
```

### 4. Accès

- **Commande** : http://localhost:3000
- **Admin** : http://localhost:3000/admin

## 🎯 Test Rapide

```bash
# Tester le backend
curl http://localhost:5000/api/health

# Créer une commande test
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{"drink_name":"Cappuccino","drink_variant":"vanille"}'

# Voir les stats
curl http://localhost:5000/api/orders/stats
```

## 📝 Checklist

- [ ] MySQL installé et démarré
- [ ] Node.js 16+ installé
- [ ] Base de données créée
- [ ] `.env` configuré dans backend
- [ ] Backend démarré (port 5000)
- [ ] Frontend démarré (port 3000)
- [ ] Test d'une commande réussie

## ❓ Problèmes courants

**Backend n'accède pas à MySQL ?**
```bash
# Vérifier MySQL
systemctl status mysql

# Tester la connexion
mysql -u birthday_brunch -p
```

**Port déjà utilisé ?**
```bash
# Changer le port dans backend/.env
PORT=5001

# Ou tuer le processus
lsof -ti:5000 | xargs kill -9
```

**Dépendances manquantes ?**
```bash
# Réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📱 Générer le QR Code

1. Aller sur : https://www.qr-code-generator.com/
2. Entrer l'URL : `https://votre-site.tidic.fr`
3. Télécharger et imprimer

---

Pour plus de détails, voir le [README.md](README.md) complet.
