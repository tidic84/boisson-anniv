const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(express.json());

// ============================================
// ROUTES API
// ============================================

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend Birthday Brunch fonctionne!' });
});

// POST - Créer une nouvelle commande
app.post('/api/orders', async (req, res) => {
  try {
    const { drink_name, drink_variant } = req.body;

    if (!drink_name) {
      return res.status(400).json({ error: 'Le nom de la boisson est requis' });
    }

    const [result] = await db.query(
      'INSERT INTO orders (drink_name, drink_variant, quantity) VALUES (?, ?, 1)',
      [drink_name, drink_variant || null]
    );

    res.status(201).json({
      message: 'Commande créée avec succès',
      orderId: result.insertId
    });
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création de la commande' });
  }
});

// POST - Créer plusieurs commandes en une seule requête (pour le formulaire)
app.post('/api/orders/batch', async (req, res) => {
  try {
    const { orders } = req.body;

    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({ error: 'Le tableau de commandes est requis' });
    }

    // Insérer toutes les commandes
    const insertPromises = orders.map(order => {
      return db.query(
        'INSERT INTO orders (drink_name, drink_variant, quantity) VALUES (?, ?, 1)',
        [order.drink_name, order.drink_variant || null]
      );
    });

    await Promise.all(insertPromises);

    res.status(201).json({
      message: `${orders.length} commande(s) créée(s) avec succès`,
      count: orders.length
    });
  } catch (error) {
    console.error('Erreur lors de la création des commandes:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la création des commandes' });
  }
});

// GET - Récupérer toutes les commandes (pour l'admin)
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des commandes:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des commandes' });
  }
});

// GET - Récupérer les statistiques (totaux par boisson)
app.get('/api/orders/stats', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        drink_name,
        drink_variant,
        COUNT(*) as total
      FROM orders
      GROUP BY drink_name, drink_variant
      ORDER BY drink_name, drink_variant
    `);
    res.json(rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la récupération des statistiques' });
  }
});

// DELETE - Réinitialiser toutes les commandes (pour l'admin)
app.delete('/api/orders/reset', async (req, res) => {
  try {
    await db.query('TRUNCATE TABLE orders');
    res.json({ message: 'Toutes les commandes ont été supprimées' });
  } catch (error) {
    console.error('Erreur lors de la réinitialisation:', error);
    res.status(500).json({ error: 'Erreur serveur lors de la réinitialisation' });
  }
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
  console.log(`📍 API disponible sur http://localhost:${PORT}/api`);
});
