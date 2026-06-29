import React, { useState } from 'react';
import axios from 'axios';
import './TrackingPage.css';

const TrackingPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setShipment(null);

    try {
      const response = await axios.get(`/api/tracking/${trackingNumber}`);
      setShipment(response.data);
    } catch (err: any) {
      setError('Tracking number not found. Please check and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tracking-container">
      <h1>Track Your Shipment</h1>
      
      <div className="tracking-search">
        <form onSubmit={handleTrack}>
          <input
            type="text"
            placeholder="Enter tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Tracking...' : 'Track'}
          </button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {shipment && (
        <div className="shipment-details">
          <div className="detail-section">
            <h2>Shipment Status</h2>
            <div className="status-badge" style={{ 
              backgroundColor: 
                shipment.status === 'delivered' ? '#43e97b' :
                shipment.status === 'in_transit' ? '#667eea' :
                shipment.status === 'pending' ? '#fa7e1e' : '#ccc'
            }}>
              {shipment.status.toUpperCase().replace('_', ' ')}
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <label>Tracking Number:</label>
              <p>{shipment.trackingNumber}</p>
            </div>
            <div className="detail-item">
              <label>Carrier:</label>
              <p>{shipment.carrier.toUpperCase()}</p>
            </div>
            <div className="detail-item">
              <label>Shipped:</label>
              <p>{new Date(shipment.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="detail-item">
              <label>Estimated Delivery:</label>
              <p>{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="detail-section">
            <h3>From</h3>
            <p>
              <strong>{shipment.sender.name}</strong><br />
              {shipment.sender.address}<br />
              {shipment.sender.city}, {shipment.sender.state} {shipment.sender.zip}<br />
              {shipment.sender.country}
            </p>
          </div>

          <div className="detail-section">
            <h3>To</h3>
            <p>
              <strong>{shipment.recipient.name}</strong><br />
              {shipment.recipient.address}<br />
              {shipment.recipient.city}, {shipment.recipient.state} {shipment.recipient.zip}<br />
              {shipment.recipient.country}
            </p>
          </div>

          <div className="detail-section">
            <h2>Tracking Timeline</h2>
            <div className="timeline">
              {shipment.events && shipment.events.length > 0 ? (
                shipment.events.map((event: any, index: number) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <p className="timestamp">
                        {new Date(event.timestamp).toLocaleString()}
                      </p>
                      <p className="status">{event.status}</p>
                      <p className="location">{event.location}</p>
                      <p className="description">{event.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tracking events yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackingPage;
