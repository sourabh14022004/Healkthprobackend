# QR Code Management API

A robust backend API for managing QR codes with features like user authentication, QR code generation, tracking, and analytics.

## Features

- 🔐 User Authentication: Secure login, registration, and profile management.
- 🖼️ Static & Dynamic QR Codes: Generate and manage both types.
- 📊 Analytics: Track scan events and analyze QR code usage patterns.
- 🔒 Secure APIs: Authentication is required for QR code operations.

## Tech Stack

- Backend Framework: Node.js & Express.js
- Database: MySQL
- ORM: Prisma
- Authentication: JWT
- Environment Configuration: .env file for configuration management

## API Endpoints

### Authentication

```
POST /auth/register          - Register a new user
POST /auth/login             - Login user
GET  /auth/me                - Get logged-in user profile
```

### QR Code Management

```bash
POST   /qr/static            - Generate a static QR code
POST   /qr/dynamic           - Generate a dynamic QR code
PUT    /qr/:id/update        - Update a dynamic QR code
POST   /qr/:id/track         - Track a QR code scan event
GET    /qr/:id/events        - Get events for a QR code
GET    /qr/:id/analytics     - Get analytics for a QR code
GET    /qr/my-codes          - Get user's QR codes
```

### Authentication

The API uses JWT for authentication. Include the token in the Authorization header for protected routes:

```makefile
Authorization: Bearer <your-token>
```

## Setup

### Prerequisites

- Node.js (v16 or later)
- MySQL database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo.git
cd your-repo
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
mysql -u root -p
CREATE DATABASE qr_platform;
```

4. Configure environment variables: Create a .env file with the following:
```makefile
DATABASE_URL="mysql://root:password@localhost:3306/qr_platform"
JWT_SECRET="your-secret-key"
API_URL="http://localhost:3000"
```

5. Generate and push the database schema:
```bash
npx prisma generate
npx prisma db push
```

6. Run the development server:
```bash
npm run dev
```

## Folder Structure

```bash
/controllers       # Business logic for routes
/middleware        # Authentication and request handling
/routes            # Route definitions for API endpoints
/prisma            # ORM schema and migrations
.env.example       # Sample environment configuration
testing.md         # Comprehensive testing guide
```

## Error Handling

### The API follows standard HTTP status codes for responses:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Troubleshooting

### Database Connection Issues

- Ensure MySQL is running.
- Verify the DATABASE_URL in .env.

### Authentication Errors

- Confirm the Authorization header is included in requests.
- Verify the JWT_SECRET matches during token generation.

### QR Code Generation Issues

- Ensure valid URL and metadata are provided in the request body.

### Token Verification Errors

- Check token format and expiration.

## Contributing

- Fork the repository.
- Create a new branch (feature-branch-name).
- Commit your changes.
- Open a pull request.

