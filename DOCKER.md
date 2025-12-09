# InfinityStream - Docker Deployment Guide

## 🐳 Quick Start

### Prerequisites
- Docker 24+
- Docker Compose 2.20+

### 1. Setup Environment

```bash
# Copy environment file
cp .env.docker .env

# Edit with your configuration
nano .env
```

### 2. Start All Services

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f
```

### 3. Access Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost |
| API | http://localhost/api |
| API Direct | http://localhost:3001 |
| Database | localhost:5432 |

## 📦 Services Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         NGINX                                │
│                    (Reverse Proxy)                           │
│                     Port 80, 443                             │
└─────────────────────┬───────────────────────┬───────────────┘
                      │                       │
                      ▼                       ▼
┌─────────────────────────────┐   ┌─────────────────────────────┐
│         Frontend            │   │          Backend            │
│      (React + Vite)         │   │    (Node.js + Express)      │
│         Port 80             │   │        Port 3001            │
└─────────────────────────────┘   └──────────────┬──────────────┘
                                                  │
                                                  ▼
                                  ┌─────────────────────────────┐
                                  │        PostgreSQL           │
                                  │         Port 5432           │
                                  └─────────────────────────────┘
```

## 🔧 Docker Commands

### Basic Operations

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Rebuild specific service
docker-compose up -d --build frontend

# View logs
docker-compose logs -f backend

# Restart service
docker-compose restart backend
```

### Database Operations

```bash
# Access PostgreSQL CLI
docker-compose exec database psql -U postgres -d infinitystream

# Backup database
docker-compose exec database pg_dump -U postgres infinitystream > backup.sql

# Restore database
docker-compose exec -T database psql -U postgres infinitystream < backup.sql
```

### Debugging

```bash
# Enter container shell
docker-compose exec backend sh
docker-compose exec frontend sh

# Check container status
docker-compose ps

# View resource usage
docker stats
```

## 🔐 Production Deployment

### 1. SSL/HTTPS Setup

Place SSL certificates in `nginx/ssl/`:
- `cert.pem` - SSL certificate
- `key.pem` - Private key

Then uncomment HTTPS section in `nginx/nginx.conf`.

### 2. Security Checklist

- [ ] Change default database password
- [ ] Set strong JWT_SECRET (min 64 characters)
- [ ] Enable HTTPS
- [ ] Configure firewall (only expose port 80/443)
- [ ] Set up automated backups
- [ ] Configure log rotation

### 3. Scaling

```bash
# Scale backend to 3 instances
docker-compose up -d --scale backend=3
```

Update nginx upstream configuration for load balancing.

## 📊 Monitoring

### Health Checks

```bash
# Check all services health
curl http://localhost/health

# Individual service health
docker-compose exec backend wget -qO- http://localhost:3001/health
```

### Logs Management

```bash
# Rotate logs
docker-compose logs --tail=1000 > logs_$(date +%Y%m%d).txt

# Clear logs
docker-compose down
docker-compose up -d
```

## 🛠 Troubleshooting

### Database Connection Failed
```bash
# Check if database is healthy
docker-compose ps database

# View database logs
docker-compose logs database

# Restart database
docker-compose restart database
```

### Port Already in Use
```bash
# Find process using port
lsof -i :80
lsof -i :3001

# Kill process or change port in docker-compose.yml
```

### Build Failed
```bash
# Clean build
docker-compose down -v
docker system prune -f
docker-compose up -d --build
```

## 📁 File Structure

```
infinitystream/
├── docker-compose.yml      # Main orchestration
├── Dockerfile.frontend     # Frontend build
├── .env.docker            # Environment template
├── DOCKER.md              # This file
├── nginx/
│   ├── nginx.conf         # Main nginx config
│   ├── frontend.conf      # Frontend nginx config
│   └── ssl/               # SSL certificates
└── backend/
    ├── Dockerfile         # Backend build
    └── database/
        └── init.sql       # Database schema
```

## 📝 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DB_USER | Database username | Yes |
| DB_PASSWORD | Database password | Yes |
| DB_NAME | Database name | Yes |
| JWT_SECRET | JWT signing key | Yes |
| JWT_EXPIRES_IN | Token expiration | No |
| FRONTEND_URL | Allowed CORS origin | Yes |
| VITE_API_URL | API URL for frontend | Yes |

---

© 2024 InfinityStream by BelajarNode
