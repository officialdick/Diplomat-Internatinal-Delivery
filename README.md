# DIPLOMAT INTERNATIONAL DELIVERY LTD
## Full-Stack Shipping & Delivery Platform

A comprehensive international delivery platform with real-time tracking, multiple carrier integration, and admin management.

### 🌟 Features

#### Authentication & Authorization
- User registration and login
- JWT-based authentication
- Role-based access control (Customer, Driver, Admin)
- Secure password hashing with bcryptjs

#### Shipment Management
- Create and manage shipments
- Multi-carrier support (FedEx, UPS, DHL)
- Real-time tracking
- Package weight and dimension handling
- Insurance options
- Signature requirement option

#### Tracking System
- Public tracking by tracking number
- Real-time status updates via WebSocket
- Detailed timeline of events
- Location tracking
- Estimated delivery dates

#### Admin Dashboard
- Dashboard statistics
- Shipment management
- User management
- Revenue reports
- Status updates

#### Pricing
- Dynamic rate calculation
- Multiple carrier quotes
- Tax calculation
- Insurance fees

### 📁 Project Structure

```
diplomat-international-delivery/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   └── Shipment.ts
│   │   ├── middleware/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── shipments.ts
│   │   │   ├── tracking.ts
│   │   │   ├── admin.ts
│   │   │   ├── rates.ts
│   │   │   └── index.ts
│   │   ├── services/
│   │   │   ├── FedExService.ts
│   │   │   ├── UPSService.ts
│   │   │   └── DHLService.ts
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Auth.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── ShipmentForm.tsx
│   │   │   ├── TrackingPage.tsx
│   │   │   ├── MyShipments.tsx
│   │   │   └── [styles].css
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.tsx
│   │   └── index.css
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
│
└── README.md
```

### 🚀 Getting Started

#### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

#### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/diplomat_db
JWT_SECRET=your_secret_key
FEDEX_API_KEY=your_fedex_key
UPS_API_KEY=your_ups_key
DHL_API_KEY=your_dhl_key
```

5. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

#### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

Application opens at `http://localhost:3000`

### 📚 API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

#### Shipments
- `POST /api/shipments/create` - Create shipment
- `GET /api/shipments/my-shipments` - Get user's shipments
- `GET /api/shipments/:trackingNumber` - Get shipment details
- `PUT /api/shipments/:trackingNumber/status` - Update status
- `DELETE /api/shipments/:trackingNumber` - Cancel shipment

#### Tracking
- `GET /api/tracking/:trackingNumber` - Track shipment
- `GET /api/tracking/:trackingNumber/history` - Get tracking history
- `POST /api/tracking/:trackingNumber/subscribe` - WebSocket subscription

#### Rates
- `POST /api/rates/calculate` - Calculate shipping rates

#### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/shipments` - All shipments (admin only)
- `GET /api/admin/users` - All users (admin only)
- `PUT /api/admin/shipments/:trackingNumber` - Update shipment (admin only)
- `GET /api/admin/reports/revenue` - Revenue report (admin only)

### 🔐 Authentication

All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### 🎯 User Roles

- **Customer**: Create shipments, track deliveries, view own shipments
- **Driver**: Manage assigned deliveries, update status
- **Admin**: Full access to all features and reports

### 🛠️ Technology Stack

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- Socket.IO (Real-time updates)
- bcryptjs (Password hashing)

**Frontend:**
- React 18
- TypeScript
- React Router DOM
- Axios
- Socket.IO Client
- CSS3

### 📦 Deployment

#### Backend (Heroku/Railway/Render)
```bash
npm run build
npm start
```

#### Frontend (Vercel/Netlify)
```bash
npm run build
```

### 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

### 📄 License

MIT License - See LICENSE file for details

### 📞 Support

For support, email: support@diplomatdelivery.com

---

**© 2024 DIPLOMAT INTERNATIONAL DELIVERY LTD**
