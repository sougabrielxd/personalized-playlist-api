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
