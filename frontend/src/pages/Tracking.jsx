import React, { useState } from 'react';
import axios from 'axios';

function Tracking() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`/api/tracking/${trackingNumber}`);
      setTrackingInfo(response.data);
    } catch (err) {
      setError('Tracking number not found');
      setTrackingInfo(null);
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Track Shipment</h1>
      <div className="card">
        <form onSubmit={handleTrack}>
          <div style={{display: 'flex', gap: '10px'}}>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              required
              style={{flex: 1}}
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
        </form>
      </div>

      {error && <div className="card" style={{color: 'red'}}>{error}</div>}

      {trackingInfo && (
        <div className="card">
          <h2>Tracking Details</h2>
          <table>
            <tbody>
              <tr>
                <td><strong>Tracking Number:</strong></td>
                <td>{trackingInfo.trackingNumber}</td>
              </tr>
              <tr>
                <td><strong>Carrier:</strong></td>
                <td>{trackingInfo.carrier}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td><span className={`status ${trackingInfo.status}`}>{trackingInfo.status}</span></td>
              </tr>
              <tr>
                <td><strong>Last Update:</strong></td>
                <td>{new Date(trackingInfo.lastUpdate).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Tracking;
