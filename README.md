# GGPromarket

> Single-page e-commerce showcase for a bathroom and sanitaryware marketplace.

GGPromarket is a portfolio project that demonstrates a modern React Router 7 single-page application backed by a Node/Express API that serves data from local fixtures. The UI recreates a retail landing page with product carousels, lazy image loading, a modal product detail flow, and header and footer content served from the API.

![Home screen](./docs/screens/home.png)

## Highlights
- Nested layout built with the React Router CLI (`HeaderBoard` layout -> `Home` route -> modal overlay on `/product/:productId`)
- Redux Toolkit and RTK Query data layer that talks to an Express REST API
- IntersectionObserver-based lazy loading for hero, collections, goods, brands, and articles blocks
- LocalStorage powered "likes" list with a dropdown preview anchored to the header action button
- Defensive asset handling with default fallbacks for broken images and API errors
- Responsive design using SCSS modules together with Tailwind CSS utilities

## Tech Stack
| Area      | Details |
| --------- | ------- |
| Frontend  | React 19 / React Router 7 (`ssr: false`) / TypeScript 5.8 / Vite 6 / Redux Toolkit 2.8 / RTK Query / SCSS modules / Tailwind CSS 4 plugin |
| Backend   | Node 18+ / Express 4 / CORS / Static asset hosting from `/public/images` / URL helpers for absolute paths / In-memory data fixtures |
| Tooling   | React Router CLI (`react-router build`, `react-router dev`, `react-router typegen`) / `vite-tsconfig-paths` aliases (`@/*`, `#/*`) / Sass / `gh-pages` deploy script |

## Repository Layout
- `client/` - React Router SPA (source under `app/`, build output in `build/`)
- `server/` - Express API, data fixtures, and supporting utilities
- `docs/` - Screenshots and supporting assets
- `.github/` - Optional GitHub Pages workflow template

## Frontend Overview (`client/`)
- **Layout**: `HeaderBoard` wraps the application with `<Header />`, routed content, and `<Footer />`.
- **Home route**: composed of `Hero`, `Icons`, `Collections`, `Goods`, `Brands`, `Articles`, and `SEO` blocks; each subscribes to RTK Query endpoints with sensible defaults for offline mode.
- **Hero slider**: preloads when visible, swaps to default imagery on `onError`, and keeps sidebar modules in sync.
- **Goods section**: two carousels ("hits" and "discounts") with category filters, scroll buttons, lazy imagery, and a modal for detailed view (`product/:productId` route). Likes are persisted to `localStorage` and mirrored inside header notifications.
- **Header actions**: burger-driven dropdown menus, adaptive city selection, and a likes dropdown that reuses RTK Query to fetch product names for saved IDs.
- **Modal route**: fetches product details on demand, displays pricing badges, and posts purchase intent to `/api/purchase` (endpoint pending on the server).
- **Styling**: SCSS modules for component-specific styles plus Tailwind utility classes (`tailwindcss()` plugin in `vite.config.ts`).
- **Routing**: `client/app/routes.ts` declares filesystem routes for the CLI; `react-router.config.ts` sets `ssr: false` and configures the GitHub Pages basename.

## Backend Overview (`server/`)
- **Express API**: `server.js` wires CORS, JSON parsing, static `/public` hosting, and mounts REST routes under `/api`.
- **Routes** (`routes/api.js`):
  - `GET /api/articles`, `/brands`, `/goods`, `/collections`, `/footer`, `/header`, `/hero`, `/icons`, `/seo`
  - `GET /api/goods/:id` returns full product details (description included)
  - `GET /api/server-url` echoes the resolved base URL for client fetches
  - Responses flow through `utils/urlUtils.js` to convert `/images/...` paths into absolute URLs
- **Data fixtures**: `server/data/*.js` exports structured objects and arrays (articles, brands, goods, and more) that can be served directly or adapted to another data source.
- **Static assets**: served from `server/public/images`, mirroring the collection names expected by the client.

> Note: The `/api/purchase` endpoint referenced by the modal is not yet implemented, so submissions currently no-op.

## Getting Started
### 1. Prerequisites
- Node.js **18.18+** (matching the original development environment)
- npm (bundled with Node)

### 2. Install and run the API
```bash
cd server
npm install
npm start
```

By default the API listens on `http://localhost:3001` and serves data from the local fixtures in `server/data`.

### 3. Install and run the client
```bash
cd client
npm install
npm run dev      # http://localhost:5173
```

`npm run build` compiles the React Router bundles and copies `index.html` to `404.html` for GitHub Pages hosting. Use `npm run deploy` to publish the built client to the `gh-pages` branch.

## Environment Variables
- `client/.env.local` - `VITE_API_BASE_URL=http://localhost:3001/api`
- `client/.env.production` - `VITE_API_BASE_URL=https://ggpromarket-server.onrender.com/api`

Set the appropriate value before running `npm run dev` or `npm run build`. The Vite config also adjusts the `base` path to `/GGPromarket/` in production for GitHub Pages.

## API Reference
| Method | Route | Description |
| ------ | ----- | ----------- |
| `GET` | `/api/articles` | Latest editorial articles carousel |
| `GET` | `/api/brands` | Brand slider items (name, logo, link) |
| `GET` | `/api/collections` | Featured tile collections (single document) |
| `GET` | `/api/footer` | Footer navigation, contacts, socials |
| `GET` | `/api/header` | Header contacts, catalog links, city info |
| `GET` | `/api/hero` | Hero slider items plus sidebar promos |
| `GET` | `/api/icons` | Service guarantee icons |
| `GET` | `/api/seo` | SEO content block (title, image, text) |
| `GET` | `/api/goods` | Product list for sliders (description omitted) |
| `GET` | `/api/goods/:id` | Full product detail used by modal and liked dropdown |
| `GET` | `/api/server-url` | Detects the public base URL (Render or GitHub Pages) |

All list endpoints automatically rewrite image URLs to absolute paths based on the incoming request host, enabling CDN or reverse-proxy deployments.

## Deployment Notes
- **Frontend**: `package.json` `homepage` points to `https://Madi0300.github.io/GGPromarket`; run `npm run predeploy && npm run deploy` from `client/`.
- **Backend**: `.env.production` references `https://ggpromarket-server.onrender.com/api`, implying the API is deployed on Render. Update `config.js` if the public host or port changes.
- **Automation**: The repository ships with a sample `.github/workflows/jekyll-gh-pages.yml`; replace it with a React deployment workflow if GitHub Actions are desired.

## Testing and Quality
- No automated tests are defined yet (`npm test` is a placeholder). Consider adding Vitest and React Testing Library coverage for interactive components and a supertest suite for the Express routes.
- Linting is handled implicitly by TypeScript's strict mode; add ESLint or Prettier if consistent formatting is required.

## Roadmap Ideas
- Implement `/api/purchase` to honour modal submissions and add server-side validation
- Replace placeholder Russian copy or fix encoding issues in seed data
- Add authentication to the `/login` route and wire the header account button
- Surface real cart data instead of static counters in the header
- Automate deployments with a dedicated GitHub Actions workflow for both client and server
