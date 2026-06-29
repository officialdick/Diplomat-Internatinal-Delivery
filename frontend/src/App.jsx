import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import Tracking from './pages/Tracking';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="navbar">
          <h1>🚚 DIPLOMAT INTERNATIONAL DELIVERY LTD</h1>
          <div className="nav-links">
            <Link to="/">Dashboard</Link>
            <Link to="/shipments">Shipments</Link>
            <Link to="/tracking">Track</Link>
          </div>
        </nav>
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/tracking" element={<Tracking />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
