# Setup Guide - DIPLOMAT INTERNATIONAL DELIVERY LTD

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Docker & Docker Compose

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/officialdick/Diplomat-Internatinal-Delivery.git
cd Diplomat-Internatinal-Delivery
```

### 2. Create .env File

```bash
cp .env.example .env
```

### 3. Start Services

```bash
docker-compose up --build
```

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- API Health: http://localhost:5000/api/health

## Development (Without Docker)

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## API Credentials

### FedEx
- https://developer.fedex.com

### UPS
- https://www.ups.com/upsdeveloperkit

### DHL
- https://developer.dhl.com

## Troubleshooting

### Port in Use

```bash
# Linux/Mac
sudo lsof -ti:5000 | xargs kill -9

# Or use different ports in docker-compose.yml
```

### Docker Issues

```bash
docker-compose down
docker-compose up --build --force-recreate
```
