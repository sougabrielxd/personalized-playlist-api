# 🎧 Personalized Playlist API

Public REST API for generating personalized music playlists based on user preferences such as mood, genre, energy level and duration.  
Integrated with the Spotify Web API.

---

## 🚀 Features

- Generate playlists based on:
  - Mood
  - Music genre
  - Energy level
  - Desired duration
- Spotify Web API integration
- Public endpoint for playlist generation
- JSON responses
- API documentation with Swagger
- Basic rate limiting
- Simple logging

---

## 🧩 Tech Stack

- **Node.js**
- **TypeScript**
- **NestJS**
- **PostgreSQL**
- **Prisma ORM**
- **Spotify Web API**
- **Swagger / OpenAPI**
- **Docker**

---

## 📌 API Endpoint (MVP)

### Generate Playlist
```http
POST /api/playlists/generate
```

---

## 🛠️ Project Setup

### Prerequisites
- Node.js (v18 or higher) **OR** Docker (v20+)
- pnpm (or npm/yarn)
- PostgreSQL database **OR** Docker Compose
- Spotify Developer Account (for API credentials)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sougabrielxd/personalized-playlist-api.git
cd personalized-playlist-api
```

2. Install dependencies:
```bash
pnpm install
```

3. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Setup database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the application:
```bash
# Development
pnpm start:dev

# Production
pnpm build
pnpm start:prod
```

---

## 🐳 Docker Setup

### Prerequisites
- Docker (v20 or higher)
- Docker Compose (v2 or higher)

### Quick Start with Docker Compose

1. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your credentials
```

2. Start all services (app + PostgreSQL):
```bash
# Production
docker-compose up -d

# Development (with hot reload)
docker-compose -f docker-compose.dev.yml up
```

3. Run database migrations:
```bash
docker-compose exec app pnpm prisma migrate deploy
```

4. Access the application:
- **API**: `http://localhost:3000`
- **Swagger**: `http://localhost:3000/docs`
- **Health Check**: `http://localhost:3000/health`

### Docker Commands

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop containers
docker-compose down

# Stop and remove volumes (⚠️ deletes database data)
docker-compose down -v

# Rebuild containers
docker-compose build --no-cache

# Execute commands in container
docker-compose exec app pnpm prisma studio
docker-compose exec app pnpm prisma migrate dev
```

### Development Mode

For development with hot reload and debugging:

```bash
docker-compose -f docker-compose.dev.yml up
```

This will:
- Mount your local code as a volume
- Enable hot reload
- Expose debug port (9229)
- Use development dependencies

### Building Docker Image Manually

```bash
# Build production image
docker build -t personalized-playlist-api:latest .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e SPOTIFY_CLIENT_ID="..." \
  -e SPOTIFY_CLIENT_SECRET="..." \
  -e API_KEY="..." \
  personalized-playlist-api:latest
```

---

## 📚 API Documentation

Once the application is running, access the Swagger documentation at:
- **Swagger UI**: `http://localhost:3000/docs`

---

## 🧪 Testing

```bash
# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

---

## 📝 License

This project is licensed under the MIT License.
