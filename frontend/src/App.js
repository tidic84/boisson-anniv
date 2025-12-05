import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrderForm from './components/OrderForm';
import AdminDashboard from './components/AdminDashboard';
import './styles/App.css';

function App() {
  return (
    <Router basename="/anniv-emma">
      <div className="app-container">
        <Routes>
          <Route path="/" element={<OrderForm />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
