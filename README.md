# GGPromarket 🛁🚽

> **Single-page e-commerce demo for bathroom & sanitary ware**  
> Built as a portfolio project to showcase modern React + TypeScript skills.

## ✨ Features

- **Responsive UI** — desktop / tablet / mobile / any sizes
- **Product catalogue** with category filtering (baths, toilets, sinks, …)
- **Cart & mini-cart** powered by Redux Toolkit
- **Client-side routing & SSR-ready build** (React Router v7 CLI)
- **Lazy-loaded images** (IntersectionObserver)
- **Default images** applies a default image if there is an error loading the required image

## 🛠️ Tech stack (2025-09-10)

| Layer                | Tech & version                             |
| -------------------- | ------------------------------------------ |
| **Framework**        | React **19.1.1** + TypeScript 5.9          |
| **Router / Build**   | React Router CLI **7.8.x** (Vite 7)        |
| **State management** | Redux Toolkit **2.9** + RTK Query          |
| **Styling**          | Tailwind CSS **4.1** + CSS/SCSS Modules    |
| **Tooling**          | Vite **7.1** · ESLint · Prettier           |
| **Testing**          | Vitest + React Testing Library _(planned)_ |

## 📸 Screenshots

| Home                             |
| -------------------------------- |
| ![Home](./docs/screens/home.png) |

## 🚀 Quick start

```bash
# 1. Clone repo & install deps
git clone https://github.com/Madi0300/GGPromarket.git
cd GGPromarket
npm install          # or pnpm / yarn

# 2. Start dev server (HMR)
npm run dev              # http://localhost:5173

# 3. Production build
npm run build            # creates build/ & server/ bundles
npm run preview          # SSR-preview on port 3000
```

> **Node ≥ 18.18 required.**

## 📂 Project structure (trimmed)

```text
client/
  app/
    header/
    home/
    goods/
    collections/
  store/
    appSlice.ts
    index.ts
  routes.ts
```

## 🗺️ Roadmap

- [x] Finish **ProductCatalog** (filters, empty-state, skeletons)
- [ ] Build **PopularBrands** carousel
- [ ] Build **Articles / Blog preview**
- [ ] Add **SEOTextBlock** (rich text + internal links)
- [ ] Layout **Footer** with adaptive grid
- [ ] Set up minimal **backend** (Node + Express or Fastify)
- [ ] Expose `/api/products` & `/api/brands` endpoints (static JSON)
- [ ] Wire frontend to API via RTK Query
- [ ] Deploy full stack (Vercel / Render / Railway)

## 🤝 Contributing

Personal portfolio project, but PRs and suggestions are welcome.

## 📄 License

MIT

—

Made with ❤️ by **Madi Aitbai** — aspiring Frontend / React developer.
