import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';

const OrderForm = () => {
  const [selectedDrinks, setSelectedDrinks] = useState({});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Liste des boissons avec leurs variantes
  const drinks = [
    {
      name: 'Expresso',
      variants: ['simple', 'double']
    },
    {
      name: 'Cappuccino',
      variants: ['nature', 'vanille', 'caramel']
    },
    {
      name: 'Latte Macchiato',
      variants: ['nature', 'vanille', 'caramel', 'speculos']
    },
    {
      name: 'Frappuccino Cookie Cream',
      variants: null,
      bold: true
    },
    {
      name: 'Thé',
      variants: null,
      bold: true
    },
    {
      name: 'Chocolat chaud',
      variants: null,
      bold: true
    }
  ];

  const handleCheckboxChange = (drinkName, variant = null) => {
    const key = variant ? `${drinkName}-${variant}` : drinkName;

    setSelectedDrinks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Récupérer les boissons sélectionnées
    const orders = Object.entries(selectedDrinks)
      .filter(([_, isSelected]) => isSelected)
      .map(([key, _]) => {
        const parts = key.split('-');
        if (parts.length > 1) {
          const variant = parts.pop();
          const drinkName = parts.join('-');
          return { drink_name: drinkName, drink_variant: variant };
        }
        return { drink_name: key, drink_variant: null };
      });

    if (orders.length === 0) {
      setMessage({
        type: 'error',
        text: 'Veuillez sélectionner au moins une boisson'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${config.apiBaseUrl}/orders/batch`, { orders });

      setMessage({
        type: 'success',
        text: `✨ Merci ! ${orders.length} boisson(s) commandée(s) avec succès !`
      });

      // Réinitialiser le formulaire
      setSelectedDrinks({});

      // Effacer le message après 5 secondes
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (error) {
      console.error('Erreur lors de la commande:', error);
      setMessage({
        type: 'error',
        text: '❌ Erreur lors de l\'envoi de la commande. Veuillez réessayer.'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <form onSubmit={handleSubmit}>
          <div className="drinks-list">
            {drinks.map((drink, index) => (
              <div key={index} className="drink-category">
                {drink.variants ? (
                  <>
                    <div className="drink-label with-variants">{drink.name}</div>
                    <div className="drink-variants">
                      {drink.variants.map((variant, vIndex) => (
                        <div key={vIndex} className="drink-item">
                          <input
                            type="checkbox"
                            id={`${drink.name}-${variant}`}
                            className="drink-checkbox"
                            checked={selectedDrinks[`${drink.name}-${variant}`] || false}
                            onChange={() => handleCheckboxChange(drink.name, variant)}
                          />
                          <label
                            htmlFor={`${drink.name}-${variant}`}
                            className="drink-label"
                          >
                            {variant.charAt(0).toUpperCase() + variant.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="drink-item">
                    <input
                      type="checkbox"
                      id={drink.name}
                      className="drink-checkbox"
                      checked={selectedDrinks[drink.name] || false}
                      onChange={() => handleCheckboxChange(drink.name)}
                    />
                    <label htmlFor={drink.name} className={`drink-label${drink.bold ? ' bold' : ''}`}>
                      {drink.name}
                    </label>
                  </div>
                )}
              </div>
            ))}
          </div>

          {message.text && (
            <div className={`message message-${message.type}`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
            style={{ marginTop: '30px' }}
          >
            {isSubmitting ? 'Envoi en cours...' : 'Commander'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
