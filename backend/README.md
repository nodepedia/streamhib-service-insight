# InfinityStream Backend API

Backend API untuk platform cloud streaming InfinityStream by BelajarNode.

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm atau yarn

### Installation

```bash
# Clone dan masuk ke folder backend
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env dengan konfigurasi database Anda
nano .env

# Jalankan database migration
psql -U postgres -d infinitystream -f database/init.sql

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user baru |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/refresh` | Refresh JWT token |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users (Admin) |
| GET | `/api/users/:id` | Get user by ID |
| PATCH | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Delete user |

### Streams
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/streams` | Get user's streams |
| GET | `/api/streams/:id` | Get stream by ID |
| POST | `/api/streams` | Create new stream |
| PATCH | `/api/streams/:id` | Update stream |
| DELETE | `/api/streams/:id` | Delete stream |
| POST | `/api/streams/:id/start` | Start streaming |
| POST | `/api/streams/:id/stop` | Stop streaming |
| GET | `/api/streams/:id/stats` | Get stream statistics |

## 🔐 Authentication

Semua endpoint (kecuali register/login) memerlukan JWT token:

```bash
Authorization: Bearer <your-jwt-token>
```

## 📦 Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Auth**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting

## 🐳 Docker

```bash
# Build image
docker build -t infinitystream-api .

# Run container
docker run -p 3001:3001 --env-file .env infinitystream-api
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Database & app config
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── schemas/         # Zod validation schemas
│   ├── types/           # TypeScript types
│   └── index.ts         # Entry point
├── database/
│   └── init.sql         # Database schema
├── Dockerfile
├── package.json
└── tsconfig.json
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| NODE_ENV | Environment | development |
| DATABASE_URL | PostgreSQL connection string | - |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRES_IN | JWT expiration | 7d |
| FRONTEND_URL | CORS allowed origin | http://localhost:5173 |

## 📝 License

MIT © BelajarNode
