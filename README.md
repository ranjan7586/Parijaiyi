# 🏍️ Parijaiyi — The Migratory Souls

A cinematic, dark-mode MERN website + WordPress-style admin CMS for the **Parijaiyi** motorcycle riding group. Built with React + Vite, Tailwind CSS, Framer Motion, Express, MongoDB and Cloudinary.

> **Parijaiyi** (পরিযায়ী) is Bengali for *migratory* — the birds that answer a pull they can't explain. So do we.

---

## ✨ Features

**Public site** (`/`)
- Cinematic hero — auto-slider + parallax + typewriter of places visited
- About / "The Flock" emotional section with animated stats
- Rider profiles — 3D flip cards (image → quote + bio on hover)
- Photo gallery — masonry grid, category tabs, full-screen lightbox with **Download High-Res**
- Video Vault — Cloudinary/YouTube reels with click-to-play posters
- Interactive dark **Leaflet** map of "Places We've Conquered"
- Upcoming rides timeline
- "Join the Flock" + Contact forms (saved to DB)
- Footer with hover-glow socials

**Admin CMS** (`/admin`)
- JWT-gated login (bcrypt-hashed passwords)
- Sidebar dashboard (Ghost/WordPress vibe)
- CRUD for riders (with Cloudinary image upload), media (multi-upload + tagging), rides (+ map coordinates)
- Submissions inbox (read/unread, delete)

---

## 🧱 Tech Stack

| Layer | Tech |
|------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, React Router, yet-another-react-lightbox, React-Leaflet |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Storage | Cloudinary (images & video) |
| Auth | JWT + bcryptjs |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database — local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free [Cloudinary](https://cloudinary.com) account (only needed for uploading new media via the admin)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env        # already done if you cloned this scaffold
# → edit .env: set MONGODB_URI, JWT_SECRET, and Cloudinary keys
npm run seed                # creates the admin user + demo content
npm run dev                 # API on http://localhost:8080
```

`npm run seed` prints the admin login it created (defaults: `admin@parijaiyi.com` / `ChangeMe123!` — change these in `.env`).

### 2. Frontend

```bash
cd client
npm install
npm run dev                 # site on http://localhost:5173
```

The Vite dev server proxies `/api` → `http://localhost:8080`, so both run together seamlessly.

Visit:
- **http://localhost:5173** — the public site
- **http://localhost:5173/admin** — the admin dashboard

---

## 🔑 Environment Variables

### `server/.env`
| Var | Description |
|-----|-------------|
| `PORT` | API port (default 8080) |
| `CLIENT_URL` | Frontend origin for CORS |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin credentials |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From your Cloudinary console |

### `client/.env`
| Var | Description |
|-----|-------------|
| `VITE_API_URL` | API base (`/api` uses the dev proxy) |

> The site falls back to bundled demo data (riders, photos, rides) if the API is unreachable — so the frontend looks complete even before the backend is wired up. Uploads, however, require Cloudinary credentials.

---

## 🎨 Design System — "Midnight Migration"

| Token | Value | Use |
|-------|-------|-----|
| `onyx` | `#0f1115` | Background |
| `amber-glow` | `#F5A623` | Primary accent |
| `slate-card` | `#1C1F26` | Cards / elevation |
| `cloud` | `#F8F9FA` | Headings |
| `mist` | `#A0AEC0` | Body text |

Headings: **Oswald** · Body: **Inter**. All defined in `client/tailwind.config.js`.

---

## 📡 API Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/login` | — | Admin login → JWT |
| GET | `/api/auth/me` | ✓ | Current admin |
| GET | `/api/riders` | — | List riders |
| POST/PUT/DELETE | `/api/riders/:id?` | ✓ | Manage riders (image upload) |
| GET | `/api/media?type=image&category=Nature` | — | List media |
| POST | `/api/media` | ✓ | Upload (multipart, up to 20 files) |
| PUT/DELETE | `/api/media/:id` | ✓ | Edit / delete media |
| GET | `/api/rides?status=upcoming` | — | List rides |
| POST/PUT/DELETE | `/api/rides/:id?` | ✓ | Manage rides |
| POST | `/api/messages` | — | Submit contact / application |
| GET | `/api/messages` | ✓ | Inbox |
| PATCH | `/api/messages/:id/read` | ✓ | Toggle read |
| DELETE | `/api/messages/:id` | ✓ | Delete message |

---

## 📁 Project Structure

```
parijaiyi/
├── server/                 # Express API
│   └── src/
│       ├── config/         # db.js, cloudinary.js
│       ├── models/         # Rider, Media, RideEvent, Message, Admin
│       ├── middleware/     # auth (JWT), upload (multer)
│       ├── routes/         # auth, riders, media, rides, messages
│       ├── seed.js         # admin + demo content
│       └── index.js        # app entry
└── client/                 # React + Vite
    └── src/
        ├── components/     # Hero, Gallery, RiderCard, RouteMap, …
        ├── pages/          # Home + admin/*
        ├── context/        # AuthContext (JWT)
        ├── lib/            # api (axios), animations (framer variants)
        └── data/           # mockData fallback
```

---

## 🛳️ Production build

```bash
cd client && npm run build      # outputs client/dist
cd ../server && npm start       # serve the API
```

Deploy `client/dist` to any static host (Vercel/Netlify) and the server to Render/Railway/Fly. Point `VITE_API_URL` at the deployed API and set `CLIENT_URL` on the server to the deployed frontend.

---

Built for the riders who'd rather be lost on a mountain pass than found anywhere else. 🏔️
