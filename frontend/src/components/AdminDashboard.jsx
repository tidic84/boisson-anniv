import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

const AdminDashboard = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/orders/stats`);
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors de la récupération des stats:', error);
      setMessage({
        type: 'error',
        text: 'Erreur lors de la récupération des données'
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Auto-refresh toutes les 10 secondes
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchStats();
      }, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleReset = async () => {
    if (!window.confirm('⚠️ Êtes-vous sûr de vouloir réinitialiser toutes les commandes ?')) {
      return;
    }

    try {
      await axios.delete(`${config.apiBaseUrl}/orders/reset`);
      setStats([]);
      setMessage({
        type: 'success',
        text: '✅ Toutes les commandes ont été supprimées'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      setMessage({
        type: 'error',
        text: '❌ Erreur lors de la réinitialisation'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const totalDrinks = stats.reduce((sum, stat) => sum + stat.total, 0);

  if (loading) {
    return (
      <div className="app-container">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="header">
        <div className="leopard-heart top-right"></div>
        <h1 className="title">Birthday</h1>
        <h2 className="subtitle">Brunch</h2>
        <div className="event-number">23</div>
        <div className="leopard-heart bottom-left"></div>
      </div>

      <div className="card">
        <div className="admin-header">
          <h2 className="admin-title">📊 Tableau de bord</h2>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            Auto-refresh
          </label>
        </div>

        {message.text && (
          <div className={`message message-${message.type}`}>
            {message.text}
          </div>
        )}

        {stats.length === 0 ? (
          <div className="empty-state">
            <p>Aucune commande pour le moment</p>
            <p style={{ fontSize: '3rem', margin: '20px 0' }}>☕️</p>
          </div>
        ) : (
          <>
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-name">
                    {stat.drink_name}
                    {stat.drink_variant && (
                      <span className="variant">({stat.drink_variant})</span>
                    )}
                  </div>
                  <div className="stat-count">{stat.total}</div>
                </div>
              ))}
            </div>

            <div className="total-section">
              <div className="total-label">Total des boissons</div>
              <div className="total-count">{totalDrinks}</div>
            </div>
          </>
        )}

        <div className="admin-actions">
          <button onClick={fetchStats} className="btn btn-secondary">
            🔄 Actualiser
          </button>
          {stats.length > 0 && (
            <button onClick={handleReset} className="btn btn-danger">
              🗑️ Réinitialiser
            </button>
          )}
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <a href="/" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
            ← Retour à la page de commande
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
