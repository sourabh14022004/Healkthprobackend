# QR Code Management Platform - Testing Guide

## Setup Instructions

1. **Database Setup**
```bash
# Install MySQL if not already installed
# Create a new database
mysql -u root -p
CREATE DATABASE qr_platform;
```

2. **Project Setup**
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push
```

3. **Environment Setup**
Make sure your `.env` file has the correct configuration:
```env
DATABASE_URL="mysql://root:password@localhost:3306/qr_platform"
JWT_SECRET="your-secret-key-here"
API_URL="http://localhost:3000"
```

4. **Start the Server**
```bash
npm run dev
```

## API Testing Guide

### 1. Authentication Endpoints

#### Register User
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```
Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```
Expected Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Get Profile
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Expected Response:
```json
{
  "id": 1,
  "email": "test@example.com",
  "name": "Test User"
}
```

### 2. QR Code Endpoints

#### Generate Static QR Code
```bash
curl -X POST http://localhost:3000/qr/static \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com",
    "metadata": {
      "campaign": "summer_sale",
      "description": "Summer Sale 2023"
    }
  }'
```
Expected Response:
```json
{
  "qrCode": {
    "id": 1,
    "url": "https://example.com",
    "metadata": {
      "campaign": "summer_sale",
      "description": "Summer Sale 2023"
    },
    "isDynamic": false
  },
  "qrImage": "data:image/png;base64,..."
}
```

#### Generate Dynamic QR Code
```bash
curl -X POST http://localhost:3000/qr/dynamic \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/promo",
    "metadata": {
      "campaign": "winter_promo",
      "description": "Winter Promotion 2023"
    }
  }'
```
Expected Response:
```json
{
  "qrCode": {
    "id": 2,
    "url": "https://example.com/promo",
    "metadata": {
      "campaign": "winter_promo",
      "description": "Winter Promotion 2023"
    },
    "isDynamic": true
  },
  "qrImage": "data:image/png;base64,..."
}
```

#### Update Dynamic QR Code
```bash
curl -X PUT http://localhost:3000/qr/2/update \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/new-promo"
  }'
```
Expected Response:
```json
{
  "message": "QR code updated successfully"
}
```

#### Track QR Code Event
```bash
curl -X POST http://localhost:3000/qr/2/track \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "New York, USA",
    "deviceType": "iPhone",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }'
```
Expected Response:
```json
{
  "message": "Event tracked successfully"
}
```

#### Get QR Code Events
```bash
curl -X GET http://localhost:3000/qr/2/events \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Expected Response:
```json
[
  {
    "id": 1,
    "qrCodeId": 2,
    "timestamp": "2023-12-20T10:30:00Z",
    "location": "New York, USA",
    "deviceType": "iPhone",
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0..."
  }
]
```

#### Get QR Code Analytics
```bash
curl -X GET "http://localhost:3000/qr/2/analytics?startDate=2023-12-01&endDate=2023-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Expected Response:
```json
{
  "totalScans": 150,
  "uniqueUsers": 75,
  "deviceTypes": {
    "iPhone": 80,
    "Android": 60,
    "unknown": 10
  }
}
```

#### Get User's QR Codes
```bash
curl -X GET http://localhost:3000/qr/my-codes \
  -H "Authorization: Bearer YOUR_TOKEN"
```
Expected Response:
```json
[
  {
    "id": 1,
    "url": "https://example.com",
    "metadata": {
      "campaign": "summer_sale"
    },
    "isDynamic": false,
    "_count": {
      "events": 50
    }
  },
  {
    "id": 2,
    "url": "https://example.com/new-promo",
    "metadata": {
      "campaign": "winter_promo"
    },
    "isDynamic": true,
    "_count": {
      "events": 150
    }
  }
]
```

## Common Error Responses

1. **Authentication Error**
```json
{
  "error": "Authentication required"
}
```

2. **Invalid Input**
```json
{
  "error": "Invalid input"
}
```

3. **Unauthorized Access**
```json
{
  "error": "Unauthorized"
}
```

4. **Resource Not Found**
```json
{
  "error": "QR code not found"
}
```

## Testing Tips

1. Always save the token received from login/register for subsequent requests
2. Test error cases by:
   - Providing invalid input
   - Using expired/invalid tokens
   - Accessing resources that don't belong to the user
3. Test QR code scanning by:
   - Using a QR code scanner app
   - Verifying that dynamic QR codes redirect correctly
4. Test analytics by:
   - Creating multiple scan events
   - Using different device types and locations
   - Verifying the aggregated data is correct

## Troubleshooting

1. If database connection fails:
   - Verify MySQL is running
   - Check DATABASE_URL in .env
   - Ensure database exists

2. If token verification fails:
   - Check JWT_SECRET in .env
   - Verify token format in Authorization header

3. If QR code generation fails:
   - Verify URL format
   - Check if metadata is valid JSON