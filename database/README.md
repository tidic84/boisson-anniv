# Configuration de la base de données

## Installation

### 1. Se connecter à MySQL en tant que root
```bash
mysql -u root -p
```

### 2. Exécuter le script de configuration
```bash
mysql -u root -p < setup.sql
```

OU depuis MySQL :
```sql
source /chemin/vers/setup.sql;
```

### 3. Modifier le mot de passe
⚠️ **IMPORTANT** : Avant d'exécuter le script, éditez `setup.sql` et remplacez `VOTRE_MOT_DE_PASSE_SECURISE` par un mot de passe fort.

### 4. Vérifier la création
```bash
mysql -u birthday_brunch -p birthday_brunch
```

Puis vérifiez la table :
```sql
SHOW TABLES;
DESCRIBE orders;
```

## Structure de la table `orders`

| Colonne | Type | Description |
|---------|------|-------------|
| id | INT | Identifiant unique (auto-incrémenté) |
| drink_name | VARCHAR(100) | Nom de la boisson |
| drink_variant | VARCHAR(50) | Variante (nature, vanille, caramel, etc.) |
| quantity | INT | Quantité (toujours 1 pour ce projet) |
| created_at | TIMESTAMP | Date et heure de la commande |

## Commandes utiles

### Voir toutes les commandes
```sql
SELECT * FROM orders;
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
TRUNCATE TABLE orders;
```

### Supprimer complètement la base (si nécessaire)
```sql
DROP DATABASE birthday_brunch;
DROP USER 'birthday_brunch'@'localhost';
DROP USER 'birthday_brunch'@'%';
```
