import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ShipmentForm from './pages/ShipmentForm';
import TrackingPage from './pages/TrackingPage';
import MyShipments from './pages/MyShipments';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  const handleAuthSuccess = () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    setIsAuthenticated(true);
    setUser(JSON.parse(savedUser || '{}'));
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated ? (
        <div className="app">
          <nav className="navbar">
            <div className="nav-container">
              <Link to="/" className="nav-logo">
                🚀 DIPLOMAT DELIVERY
              </Link>
              <ul className="nav-menu">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/create-shipment" className="nav-link">
                    Create Shipment
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/my-shipments" className="nav-link">
                    My Shipments
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/track" className="nav-link">
                    Track
                  </Link>
                </li>
                <li className="nav-item user-info">
                  <span>Welcome, {user?.name || user?.email}</span>
                </li>
                <li className="nav-item">
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/create-shipment" element={<ShipmentForm />} />
              <Route path="/my-shipments" element={<MyShipments />} />
              <Route path="/track" element={<TrackingPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>&copy; 2024 DIPLOMAT INTERNATIONAL DELIVERY LTD. All rights reserved.</p>
          </footer>
        </div>
      ) : (
        <Auth onAuthSuccess={handleAuthSuccess} />
      )}
    </Router>
  );
};

export default App;
