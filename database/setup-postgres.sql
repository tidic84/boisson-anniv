-- ================================================
-- Script de création de la base de données PostgreSQL
-- Birthday Brunch - Système de commande de boissons
-- ================================================

-- 1. Créer l'utilisateur pour l'application
-- IMPORTANT: Remplacez 'VOTRE_MOT_DE_PASSE_SECURISE' par un mot de passe fort
-- À exécuter en tant que superuser (postgres)
CREATE USER birthday_brunch WITH PASSWORD 'VOTRE_MOT_DE_PASSE_SECURISE';

-- 2. Créer la base de données
CREATE DATABASE birthday_brunch
    WITH
    OWNER = birthday_brunch
    ENCODING = 'UTF8'
    LC_COLLATE = 'fr_FR.UTF-8'
    LC_CTYPE = 'fr_FR.UTF-8'
    TEMPLATE = template0;

-- 3. Se connecter à la base de données
-- Utilisez: \c birthday_brunch

-- 4. Créer la table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    drink_name VARCHAR(100) NOT NULL,
    drink_variant VARCHAR(50),
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Créer les index pour optimiser les requêtes
CREATE INDEX idx_drink ON orders(drink_name);
CREATE INDEX idx_created ON orders(created_at);

-- 6. Accorder tous les privilèges à l'utilisateur
GRANT ALL PRIVILEGES ON TABLE orders TO birthday_brunch;
GRANT USAGE, SELECT ON SEQUENCE orders_id_seq TO birthday_brunch;

-- 7. Insérer quelques données de test (optionnel - peut être supprimé en production)
-- INSERT INTO orders (drink_name, drink_variant, quantity) VALUES
-- ('Cappuccino', 'vanille', 1),
-- ('Expresso', 'double', 1),
-- ('Latte Macchiato', 'caramel', 1);
