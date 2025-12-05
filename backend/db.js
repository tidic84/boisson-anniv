const mysql = require('mysql2');
require('dotenv').config();

// Créer un pool de connexions pour de meilleures performances
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'birthday_brunch',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'birthday_brunch',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Utiliser les promises au lieu des callbacks
const promisePool = pool.promise();

// Tester la connexion au démarrage
pool.getConnection((err, connection) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données:', err.message);
    process.exit(1);
  }
  console.log('✅ Connecté à la base de données MySQL');
  connection.release();
});

module.exports = promisePool;
