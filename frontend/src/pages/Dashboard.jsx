import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalShipments: 245,
    inTransit: 32,
    delivered: 198,
    pending: 15
  });

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="grid">
        <div className="stat-box">
          <h3>Total Shipments</h3>
          <div className="number">{stats.totalShipments}</div>
        </div>
        <div className="stat-box" style={{background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'}}>
          <h3>In Transit</h3>
          <div className="number">{stats.inTransit}</div>
        </div>
        <div className="stat-box" style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}>
          <h3>Delivered</h3>
          <div className="number">{stats.delivered}</div>
        </div>
        <div className="stat-box" style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}>
          <h3>Pending</h3>
          <div className="number">{stats.pending}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
