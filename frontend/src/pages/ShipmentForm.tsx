import React, { useState } from 'react';
import axios from 'axios';
import './ShipmentForm.css';

const ShipmentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    senderPhone: '',
    senderAddress: '',
    senderCity: '',
    senderState: '',
    senderZip: '',
    senderCountry: 'USA',
    recipientName: '',
    recipientEmail: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientCity: '',
    recipientState: '',
    recipientZip: '',
    recipientCountry: 'USA',
    weight: '',
    length: '',
    width: '',
    height: '',
    description: '',
    contents: '',
    value: '',
    carrier: 'fedex',
    insurance: false,
    signatureRequired: false
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/shipments/create', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setTrackingNumber(response.data.shipment.trackingNumber);
      setMessage(`✅ Shipment created successfully!`);
      
      setTimeout(() => {
        setFormData({
          senderName: '',
          senderEmail: '',
          senderPhone: '',
          senderAddress: '',
          senderCity: '',
          senderState: '',
          senderZip: '',
          senderCountry: 'USA',
          recipientName: '',
          recipientEmail: '',
          recipientPhone: '',
          recipientAddress: '',
          recipientCity: '',
          recipientState: '',
          recipientZip: '',
          recipientCountry: 'USA',
          weight: '',
          length: '',
          width: '',
          height: '',
          description: '',
          contents: '',
          value: '',
          carrier: 'fedex',
          insurance: false,
          signatureRequired: false
        });
      }, 2000);
    } catch (error: any) {
      setMessage(`❌ ${error.response?.data?.error || 'Failed to create shipment'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shipment-form-container">
      <h1>Create New Shipment</h1>
      
      {message && (
        <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
          {trackingNumber && (
            <p className="tracking">Tracking Number: <strong>{trackingNumber}</strong></p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="shipment-form">
        <div className="form-section">
          <h2>Sender Information</h2>
          <div className="form-grid">
            <input
              type="text"
              name="senderName"
              placeholder="Full Name"
              value={formData.senderName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="senderEmail"
              placeholder="Email Address"
              value={formData.senderEmail}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="senderPhone"
              placeholder="Phone Number"
              value={formData.senderPhone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="senderAddress"
              placeholder="Street Address"
              value={formData.senderAddress}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="senderCity"
              placeholder="City"
              value={formData.senderCity}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="senderState"
              placeholder="State/Province"
              value={formData.senderState}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="senderZip"
              placeholder="ZIP/Postal Code"
              value={formData.senderZip}
              onChange={handleChange}
              required
            />
            <select
              name="senderCountry"
              value={formData.senderCountry}
              onChange={handleChange}
            >
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>Recipient Information</h2>
          <div className="form-grid">
            <input
              type="text"
              name="recipientName"
              placeholder="Full Name"
              value={formData.recipientName}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="recipientEmail"
              placeholder="Email Address"
              value={formData.recipientEmail}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="recipientPhone"
              placeholder="Phone Number"
              value={formData.recipientPhone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="recipientAddress"
              placeholder="Street Address"
              value={formData.recipientAddress}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="recipientCity"
              placeholder="City"
              value={formData.recipientCity}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="recipientState"
              placeholder="State/Province"
              value={formData.recipientState}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="recipientZip"
              placeholder="ZIP/Postal Code"
              value={formData.recipientZip}
              onChange={handleChange}
              required
            />
            <select
              name="recipientCountry"
              value={formData.recipientCountry}
              onChange={handleChange}
            >
              <option value="USA">USA</option>
              <option value="Canada">Canada</option>
              <option value="UK">UK</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h2>Package Information</h2>
          <div className="form-grid">
            <input
              type="number"
              name="weight"
              placeholder="Weight (kg)"
              value={formData.weight}
              onChange={handleChange}
              step="0.1"
              required
            />
            <input
              type="number"
              name="length"
              placeholder="Length (cm)"
              value={formData.length}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="width"
              placeholder="Width (cm)"
              value={formData.width}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="height"
              placeholder="Height (cm)"
              value={formData.height}
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
            <textarea
              name="contents"
              placeholder="List of Contents"
              value={formData.contents}
              onChange={handleChange}
            />
            <input
              type="number"
              name="value"
              placeholder="Package Value (USD)"
              value={formData.value}
              onChange={handleChange}
              step="0.01"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Shipping Options</h2>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Carrier:</label>
              <select
                name="carrier"
                value={formData.carrier}
                onChange={handleChange}
              >
                <option value="fedex">FedEx</option>
                <option value="ups">UPS</option>
                <option value="dhl">DHL</option>
              </select>
            </div>
          </div>
          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="insurance"
                checked={formData.insurance}
                onChange={handleChange}
              />
              Add Insurance (+$50)
            </label>
            <label>
              <input
                type="checkbox"
                name="signatureRequired"
                checked={formData.signatureRequired}
                onChange={handleChange}
              />
              Signature Required
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Creating Shipment...' : 'Create Shipment'}
        </button>
      </form>
    </div>
  );
};

export default ShipmentForm;
