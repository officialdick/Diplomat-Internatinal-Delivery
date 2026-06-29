import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyShipments.css';

const MyShipments: React.FC = () => {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/shipments/my-shipments', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setShipments(response.data.shipments);
      } catch (error) {
        console.error('Failed to fetch shipments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return '#43e97b';
      case 'in_transit':
        return '#667eea';
      case 'pending':
        return '#fa7e1e';
      default:
        return '#999';
    }
  };

  return (
    <div className="my-shipments">
      <h1>My Shipments</h1>

      {loading ? (
        <p>Loading...</p>
      ) : shipments.length === 0 ? (
        <p className="no-shipments">No shipments found. Start by creating a new shipment!</p>
      ) : (
        <div className="shipments-table">
          <table>
            <thead>
              <tr>
                <th>Tracking Number</th>
                <th>Carrier</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created</th>
                <th>Est. Delivery</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.shipmentId}>
                  <td className="tracking-num">{shipment.trackingNumber}</td>
                  <td>{shipment.carrier.toUpperCase()}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(shipment.status) }}
                    >
                      {shipment.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>${shipment.totalPrice.toFixed(2)}</td>
                  <td>{new Date(shipment.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(shipment.estimatedDelivery).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyShipments;
