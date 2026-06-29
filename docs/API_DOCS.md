# API Documentation - DIPLOMAT INTERNATIONAL DELIVERY LTD

## Base URL

```
http://localhost:5000/api
```

## Endpoints

### Health Check

```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00Z",
  "service": "DIPLOMAT INTERNATIONAL DELIVERY LTD - API"
}
```

### Shipments

#### Create Shipment

```http
POST /api/shipments/create
Content-Type: application/json
```

Request Body:
```json
{
  "senderName": "John Doe",
  "senderEmail": "john@example.com",
  "recipientName": "Jane Smith",
  "recipientEmail": "jane@example.com",
  "carrier": "fedex",
  "weight": 2.5,
  "description": "Electronics package"
}
```

#### Get All Shipments

```http
GET /api/shipments
```

### Tracking

#### Track Shipment

```http
GET /api/tracking/{trackingNumber}
```

Response:
```json
{
  "trackingNumber": "794629157891",
  "carrier": "fedex",
  "status": "in_transit",
  "lastUpdate": "2024-01-01T10:30:00Z"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error
