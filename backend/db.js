const { Pool } = require('pg');
require('dotenv').config();

// Créer un pool de connexions PostgreSQL pour de meilleures performances
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'birthday_brunch',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'birthday_brunch',
  port: process.env.DB_PORT || 5432,
  max: 10, // Nombre maximum de clients dans le pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Tester la connexion au démarrage
pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données PostgreSQL:', err.message);
    process.exit(1);
  }
  console.log('✅ Connecté à la base de données PostgreSQL');
  release();
});

// Gérer les erreurs du pool
pool.on('error', (err) => {
  console.error('Erreur inattendue du pool PostgreSQL:', err);
});

module.exports = pool;
