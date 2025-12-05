-- ================================================
-- Script de création de la base de données
-- Birthday Brunch - Système de commande de boissons
-- ================================================

-- 1. Créer l'utilisateur pour l'application
-- IMPORTANT: Remplacez 'VOTRE_MOT_DE_PASSE_SECURISE' par un mot de passe fort
CREATE USER IF NOT EXISTS 'birthday_brunch'@'localhost' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE_SECURISE';
CREATE USER IF NOT EXISTS 'birthday_brunch'@'%' IDENTIFIED BY 'VOTRE_MOT_DE_PASSE_SECURISE';

-- 2. Créer la base de données
CREATE DATABASE IF NOT EXISTS birthday_brunch CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. Accorder tous les privilèges à l'utilisateur sur cette base
GRANT ALL PRIVILEGES ON birthday_brunch.* TO 'birthday_brunch'@'localhost';
GRANT ALL PRIVILEGES ON birthday_brunch.* TO 'birthday_brunch'@'%';
FLUSH PRIVILEGES;

-- 4. Utiliser la base de données
USE birthday_brunch;

-- 5. Créer la table des commandes
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    drink_name VARCHAR(100) NOT NULL,
    drink_variant VARCHAR(50),
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_drink (drink_name),
    INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Insérer quelques données de test (optionnel - peut être supprimé en production)
-- INSERT INTO orders (drink_name, drink_variant, quantity) VALUES
-- ('Cappuccino', 'vanille', 1),
-- ('Expresso', 'double', 1),
-- ('Latte Macchiato', 'caramel', 1);
