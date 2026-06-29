import React, { useState } from 'react';
import axios from 'axios';

function Shipments() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    recipientName: '',
    recipientEmail: '',
    carrier: 'fedex',
    weight: '',
    description: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/shipments/create', formData);
      setMessage(`✅ Shipment created! Tracking: ${response.data.trackingNumber}`);
      setFormData({
        senderName: '',
        senderEmail: '',
        recipientName: '',
        recipientEmail: '',
        carrier: 'fedex',
        weight: '',
        description: ''
      });
    } catch (error) {
      setMessage('❌ Failed to create shipment');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1>Create Shipment</h1>
      {message && <div className="card" style={{color: message.includes('✅') ? 'green' : 'red'}}>{message}</div>}
      <div className="card">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="senderName"
            placeholder="Sender Name"
            value={formData.senderName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="senderEmail"
            placeholder="Sender Email"
            value={formData.senderEmail}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="recipientName"
            placeholder="Recipient Name"
            value={formData.recipientName}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="recipientEmail"
            placeholder="Recipient Email"
            value={formData.recipientEmail}
            onChange={handleChange}
            required
          />
          <select
            name="carrier"
            value={formData.carrier}
            onChange={handleChange}
          >
            <option value="fedex">FedEx</option>
            <option value="ups">UPS</option>
            <option value="dhl">DHL</option>
          </select>
          <input
            type="number"
            name="weight"
            placeholder="Weight (kg)"
            value={formData.weight}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Package Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Shipment'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Shipments;
