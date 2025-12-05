# Configuration de la base de données PostgreSQL

## Installation

### 1. Se connecter à PostgreSQL en tant que superuser

```bash
sudo -u postgres psql
```

### 2. Exécuter le script de configuration

Option A - Depuis la ligne de commande :
```bash
sudo -u postgres psql -f setup-postgres.sql
```

Option B - Depuis PostgreSQL :
```sql
\i /chemin/vers/setup-postgres.sql
```

### 3. Modifier le mot de passe

⚠️ **IMPORTANT** : Avant d'exécuter le script, éditez `setup-postgres.sql` et remplacez `VOTRE_MOT_DE_PASSE_SECURISE` par un mot de passe fort.

Ou créez l'utilisateur manuellement :
```sql
CREATE USER birthday_brunch WITH PASSWORD 'votre_mot_de_passe_fort';
CREATE DATABASE birthday_brunch OWNER birthday_brunch;
```

### 4. Se connecter à la base et créer la table

```bash
sudo -u postgres psql birthday_brunch
```

Puis exécutez les commandes de création de table du script.

### 5. Vérifier la création

```bash
psql -U birthday_brunch -d birthday_brunch -h localhost
```

Mot de passe : celui que vous avez défini

Dans PostgreSQL :
```sql
\dt              -- Lister les tables
\d orders        -- Décrire la table orders
```

## Structure de la table `orders`

| Colonne | Type | Description |
|---------|------|-------------|
| id | SERIAL | Identifiant unique (auto-incrémenté) |
| drink_name | VARCHAR(100) | Nom de la boisson |
| drink_variant | VARCHAR(50) | Variante (nature, vanille, caramel, etc.) |
| quantity | INTEGER | Quantité (toujours 1 pour ce projet) |
| created_at | TIMESTAMP | Date et heure de la commande |

## Commandes utiles PostgreSQL

### Voir toutes les commandes
```sql
SELECT * FROM orders ORDER BY created_at DESC;
```

### Voir les totaux par boisson
```sql
SELECT
    drink_name,
    drink_variant,
    COUNT(*) as total
FROM orders
GROUP BY drink_name, drink_variant
ORDER BY drink_name, drink_variant;
```

### Réinitialiser les commandes
```sql
TRUNCATE TABLE orders RESTART IDENTITY;
```

### Voir le nombre total de commandes
```sql
SELECT COUNT(*) FROM orders;
```

### Supprimer les commandes de plus de 24h
```sql
DELETE FROM orders WHERE created_at < NOW() - INTERVAL '24 hours';
```

### Supprimer complètement la base (si nécessaire)
```sql
-- Se connecter en tant que postgres
DROP DATABASE IF EXISTS birthday_brunch;
DROP USER IF EXISTS birthday_brunch;
```

## Configuration PostgreSQL pour l'accès réseau

Si vous avez besoin d'accéder à PostgreSQL depuis un autre serveur :

### 1. Éditer pg_hba.conf

```bash
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

Ajouter :
```
# Autoriser birthday_brunch depuis localhost
host    birthday_brunch    birthday_brunch    127.0.0.1/32    md5
host    birthday_brunch    birthday_brunch    ::1/128         md5
```

### 2. Éditer postgresql.conf (si nécessaire)

```bash
sudo nano /etc/postgresql/*/main/postgresql.conf
```

Pour écouter sur toutes les interfaces :
```
listen_addresses = '*'
```

### 3. Redémarrer PostgreSQL

```bash
sudo systemctl restart postgresql
```

## Backup et Restore

### Créer un backup
```bash
pg_dump -U birthday_brunch -h localhost birthday_brunch > backup.sql
```

### Restaurer un backup
```bash
psql -U birthday_brunch -h localhost birthday_brunch < backup.sql
```

### Backup automatique (cron)

Créer un script `/usr/local/bin/backup-birthday-brunch.sh` :
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/birthday-brunch"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U birthday_brunch -h localhost birthday_brunch > "$BACKUP_DIR/backup_$DATE.sql"
# Garder seulement les 7 derniers backups
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

Rendre exécutable et ajouter au cron :
```bash
sudo chmod +x /usr/local/bin/backup-birthday-brunch.sh
sudo crontab -e
```

Ajouter (backup quotidien à 2h du matin) :
```
0 2 * * * /usr/local/bin/backup-birthday-brunch.sh
```

## Monitoring

### Voir les connexions actives
```sql
SELECT * FROM pg_stat_activity WHERE datname = 'birthday_brunch';
```

### Voir la taille de la base
```sql
SELECT pg_size_pretty(pg_database_size('birthday_brunch'));
```

### Voir la taille de la table
```sql
SELECT pg_size_pretty(pg_total_relation_size('orders'));
```

## Optimisation

### Analyser les requêtes
```sql
EXPLAIN ANALYZE SELECT drink_name, COUNT(*) FROM orders GROUP BY drink_name;
```

### Vacuum (nettoyage)
```sql
VACUUM ANALYZE orders;
```

### Reindex
```sql
REINDEX TABLE orders;
```

## Sécurité

1. **Mot de passe fort** pour l'utilisateur birthday_brunch
2. **pg_hba.conf** : Limiter les accès aux IPs nécessaires
3. **SSL** : Activer SSL pour les connexions distantes
4. **Firewall** : Limiter l'accès au port 5432

```bash
sudo ufw allow from <votre_ip> to any port 5432
```

## Dépannage

### L'utilisateur ne peut pas se connecter

Vérifier pg_hba.conf et redémarrer PostgreSQL.

### Permission denied

```sql
-- Se connecter en tant que postgres
GRANT ALL PRIVILEGES ON DATABASE birthday_brunch TO birthday_brunch;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO birthday_brunch;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO birthday_brunch;
```

### Peer authentication failed

Utilisez `-h localhost` pour forcer l'authentification par mot de passe :
```bash
psql -U birthday_brunch -d birthday_brunch -h localhost
```
