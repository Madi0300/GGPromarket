# GGPromarket 🛁🚽

> **Single-page e-commerce demo for bathroom & sanitary ware**
> Frontend powered by React Router + Vite and backed by a lightweight Node.js API.

## ✨ Features

- **Responsive UI** — desktop / tablet / mobile / any sizes
- **Product catalogue** with data served from a backend API
- **Hydrated state**: no hardcoded Redux data, everything loads via `/api/*`
- **Client-side routing (React Router v7)** with loader-based data fetching
- **Lazy-loaded media** (IntersectionObserver) with resilient default fallbacks
- **Shared media storage**: marketing assets are hosted from the Node.js server

## 🛠️ Tech stack (2025-09-10)

| Layer                  | Tech & version                             |
| ---------------------- | ------------------------------------------ |
| **Frontend**           | React **19.1.1**, TypeScript 5.9           |
| **Routing / Bundling** | React Router CLI **7.8.x**, Vite **7.1**   |
| **Styling**            | Tailwind CSS **4.1**, CSS/SCSS Modules     |
| **State management**   | Redux Toolkit (store scaffolding only)     |
| **Backend**            | Node.js 20, Express 4.21, Helmet, CORS     |
| **Assets**             | Static media served from `/server/public`  |
| **Testing**            | Vitest + React Testing Library _(planned)_ |

## 📸 Screenshots

| Home                             |
| -------------------------------- |
| ![Home](./docs/screens/home.png) |

## 🚀 Quick start

```bash
# 1. Clone repo
git clone https://github.com/Madi0300/GGPromarket.git
cd GGPromarket

# 2. Install dependencies for both apps
cd client && npm install
cd ../server && npm install

# 3. Start backend API (http://localhost:4000)
npm run dev

# 4. In another terminal start the React app (http://localhost:5173)
cd ../client
npm run dev

# 5. Production builds
# Backend
cd ../server && npm run start   # uses compiled JS in src/

# Frontend
cd ../client
npm run build
```

> **Node ≥ 18.18 required** for both frontend and backend toolchains.

## 📂 Project structure (trimmed)

```text
client/
  app/
    api/               # shared TypeScript contracts
    routes/            # React Router route tree
    utils/api.ts       # helper to call backend within loaders
  vite.config.ts       # dev proxy to the Node backend

server/
  data/                # static JSON-like content used by the API
  public/media/        # marketing imagery served at /media/*
  src/                 # Express application
```

## 🧭 API overview

The Node.js backend exposes read-only JSON endpoints under `http://localhost:4000/api`:

| Endpoint             | Description                                      |
| -------------------- | ------------------------------------------------ |
| `/api/config`        | Header + navigation configuration                 |
| `/api/home`          | Aggregated payload for the homepage (hero, goods) |
| `/api/products`      | Full product catalogue with categories            |
| `/api/brands`        | Brand directory with logo URLs                    |
| `/api/articles`      | Content cards for the blog slider                 |
| `/api/footer`        | Footer links, schedule and social accounts        |

Static images moved from `client/public` now live under `server/public/media` and
are exposed via `GET /media/...`. To keep the repository PR-friendly, these
assets are stored as editable SVG placeholders instead of binary PNGs.

## 🤝 Contributing

Personal portfolio project, but PRs and suggestions are welcome.

## 📄 License

MIT

—

Made with ❤️ by **Madi Aitbai** — aspiring Frontend / React developer.
