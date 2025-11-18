# StatusMarket

StatusMarket is a modern WhatsApp-first marketplace where verified sellers can publish rich listings, manage their storefront, and let buyers reach out instantly via WhatsApp. The platform ships with a fully typed Express + Prisma API, PostgreSQL persistence, Cloudinary media storage, JWT authentication, React Query powered dashboard, and an admin control panel.

## Tech Stack

- **Frontend:** React + Vite, TypeScript, React Router, React Query, Axios, TailwindCSS, Framer Motion, React Hook Form, Zod, React Hot Toast
- **Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL, Cloudinary, JWT, Zod
- **Tooling:** ESLint, Vite, ts-node-dev, Nodemon-style reloads
- **Deployment targets:** Frontend on Vercel, Backend on Render, Database on Neon/Railway, Media on Cloudinary

## Features

- Seller authentication (register/login) with role-aware JWT sessions
- Seller dashboard to create, edit, delete, and preview listings
- 1–5 Cloudinary-hosted images per listing (base64 uploads)
- Public marketplace with search + filters (category, price range, location)
- Seller public profiles with their active listings
- WhatsApp CTAs with pre-filled outreach messages
- Admin interface to review/delete users and listings
- Responsive, mobile-first UI powered by Tailwind and Framer Motion

## Project Structure

```
SanNike/
├── backend/        # Express API, Prisma schema, middleware, routes
└── frontend/       # React app, routes, components, pages, services
```

## Prerequisites

- Node.js 18+
- npm 9+
- PostgreSQL database (local, Neon, or Railway)
- Cloudinary account (for `CLOUDINARY_*` keys)

## Environment Variables

Copy the provided samples and fill in your secrets:

```bash
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env
```

**Backend required values**

- `DATABASE_URL` – PostgreSQL connection string
- `JWT_SECRET` – long random string
- `JWT_EXPIRES_IN` – e.g. `7d`
- `CLIENT_URL` – e.g. `http://localhost:5173`
- `ADMIN_EMAIL` – email that should be granted admin role on registration
- `CLOUDINARY_*` – Cloud name, API key, API secret, optional folder

**Frontend required value**

- `VITE_API_URL` – e.g. `http://localhost:5000`

## Install Dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

## Database Setup

From `backend/`:

```bash
npx prisma migrate dev --name init
npx prisma generate
```

Use `npm run prisma:migrate` and `npm run prisma:deploy` for future changes.

## Local Development

Backend (port 5000):

```bash
cd backend
npm run dev
```

Frontend (port 5173):

```bash
cd frontend
npm run dev
```

The frontend expects the API at `VITE_API_URL`. Update the `.env` if you run the API on a different host/port.

## Production Builds

```bash
# backend
cd backend
npm run build

# frontend
cd frontend
npm run build
```

Serve the frontend `/dist` folder via Vercel (or any static host) and deploy the backend to Render/Heroku/Fly/etc. Ensure the runtime environments include the same environment variables listed above.

## API Overview

| Method | Endpoint                 | Description                               | Auth              |
|--------|--------------------------|-------------------------------------------|-------------------|
| POST   | `/api/auth/register`     | Register seller/admin                     | Public            |
| POST   | `/api/auth/login`        | Login seller/admin                        | Public            |
| GET    | `/api/auth/me`           | Fetch current authenticated user          | Bearer token      |
| GET    | `/api/listings`          | List listings with query filters          | Public            |
| GET    | `/api/listings/:id`      | Listing detail                            | Public            |
| POST   | `/api/listings`          | Create listing                            | Seller/Admin      |
| PUT    | `/api/listings/:id`      | Update own (or admin) listing             | Seller/Admin      |
| DELETE | `/api/listings/:id`      | Soft delete listing                       | Seller/Admin      |
| GET    | `/api/listings/mine`     | Listings owned by the authenticated user  | Seller/Admin      |
| GET    | `/api/users/:id`         | Public seller profile w/ listings         | Public            |
| GET    | `/api/users/me`          | Profile settings                          | Seller/Admin      |
| PUT    | `/api/users/me`          | Update profile settings                   | Seller/Admin      |
| GET    | `/api/admin/users`       | All users (admin only)                    | Admin             |
| DELETE | `/api/admin/users/:id`   | Remove user (admin only)                  | Admin             |
| GET    | `/api/admin/listings`    | All listings (admin only)                 | Admin             |
| DELETE | `/api/admin/listings/:id`| Remove listing (admin only)               | Admin             |

## Testing & Linting

- **Backend:** `npm run lint` (TypeScript check)
- **Frontend:** `npm run build` (TS + production build) or `npm run lint` if you enable ESLint rules

## 🧪 Guide de Test Complet

Pour un guide détaillé sur comment tester toutes les fonctionnalités de l'application, consultez **[GUIDE_TEST.md](./GUIDE_TEST.md)**.

**Démarrage rapide :**
- Windows : Double-cliquez sur `start-dev.bat` ou exécutez `.\start-dev.ps1` dans PowerShell
- Linux/Mac : Lancez manuellement le backend puis le frontend dans deux terminaux séparés

## Deployment Notes

- Ensure the backend `CLIENT_URL` matches the deployed frontend origin for CORS.
- Cloudinary uploads rely on base64 payloads; increase body size limits (`express.json({ limit: "10mb" })`) if needed.
- When seeding an admin, register using the `ADMIN_EMAIL` so the role is elevated automatically.

---

Enjoy building on top of StatusMarket! Contributions and enhancements are welcome.

