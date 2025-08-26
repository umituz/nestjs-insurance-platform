# Insurance Orchestration Platform API

A TypeScript/NestJS backend demonstrating modern insurance tech architecture with MongoDB, PostgreSQL, Redis, and JWT authentication.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role management
- **Insurance Quotes**: Create, calculate, and manage insurance quotes  
- **Database Integration**: MongoDB for core data, PostgreSQL for integrations
- **Event-Driven Architecture**: Redis for caching and queue management
- **API Integration**: Mock external insurance provider integrations
- **Testing**: Unit tests with Jest
- **Docker Support**: Full containerized development environment

## 🛠 Tech Stack

- **Framework**: NestJS with TypeScript
- **Databases**: MongoDB, PostgreSQL
- **Cache/Queue**: Redis
- **Authentication**: JWT, Passport
- **Testing**: Jest
- **Containers**: Docker & Docker Compose

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/profile` - Get user profile (protected)

### Insurance Quotes
- `POST /api/quotes` - Create new quote (protected)
- `GET /api/quotes` - Get user's quotes (protected)  
- `GET /api/quotes/:id` - Get specific quote (protected)
- `POST /api/quotes/:id/accept` - Accept quote (protected)

## 🏃‍♂️ Quick Start

### Using Docker (Recommended)

```bash
# Clone and navigate
git clone <repo>
cd mobile

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app
```

### Manual Setup

```bash
# Install dependencies
npm install

# Start databases (MongoDB, PostgreSQL, Redis)
# Configure .env file (copy from .env.example)

# Start development server
npm run start:dev
```

## 🧪 Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## 📱 Example Usage

```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'

# Create quote (use token from registration)
curl -X POST http://localhost:3000/api/quotes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "insuranceType": "auto",
    "customerData": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "1234567890",
      "dateOfBirth": "1990-01-01",
      "address": {
        "street": "123 Main St",
        "city": "Anytown", 
        "state": "CA",
        "zipCode": "12345",
        "country": "USA"
      }
    }
  }'
```

## 🏗 Architecture

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and external integrations
- **Guards**: JWT authentication middleware
- **Schemas**: MongoDB document definitions
- **Entities**: PostgreSQL table definitions  
- **DTOs**: Data validation and transformation
- **Queue System**: Async processing with Redis

Built for the Finsuretex Backend Developer role - demonstrating TypeScript, NestJS, database design, API integration, and event-driven architecture skills.