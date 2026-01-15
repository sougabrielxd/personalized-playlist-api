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
- Node.js (v18 or higher)
- pnpm (or npm/yarn)
- PostgreSQL database
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
