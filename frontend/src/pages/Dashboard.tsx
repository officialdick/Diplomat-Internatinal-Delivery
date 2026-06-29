import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalShipments: 0,
    inTransit: 0,
    delivered: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats({
          totalShipments: response.data.totalShipments,
          inTransit: response.data.inTransitShipments,
          delivered: response.data.deliveredShipments,
          pending: response.data.pendingShipments
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="stats-grid">
          <div className="stat-card total">
            <h3>Total Shipments</h3>
            <p className="stat-number">{stats.totalShipments}</p>
          </div>
          <div className="stat-card in-transit">
            <h3>In Transit</h3>
            <p className="stat-number">{stats.inTransit}</p>
          </div>
          <div className="stat-card delivered">
            <h3>Delivered</h3>
            <p className="stat-number">{stats.delivered}</p>
          </div>
          <div className="stat-card pending">
            <h3>Pending</h3>
            <p className="stat-number">{stats.pending}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
