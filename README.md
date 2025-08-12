Laptop E‑commerce Web App

Full‑stack e‑commerce web application specialized for selling laptops. Built with React (Vite + TailwindCSS + shadcn/ui) on the frontend and NestJS + TypeORM + PostgreSQL on the backend. Supports JWT authentication, product/catalog management, cart, orders with rank‑based discounts, SePay QR payments (and COD), product reviews, an admin dashboard, and transactional email.

Table of Contents

- Features
- Architecture
- Tech Stack
- Project Structure
- Quick Start (Docker)
- Local Development
- Environment Variables
- API Overview
- Payments (SePay)
- Security Notes
- Testing
- Demo Accounts
- Roadmap

Features

- Authentication & Authorization: Register/Login, JWT access + refresh tokens, role‑based guards (User/Admin).
- Products & Categories: CRUD (admin), listing, product details, search/filter (by category), pagination.
- Cart: Persistent cart for logged‑in users, add/update/remove items.
- Orders: Create from cart, view history/details, cancel order; rank‑based discounts (Bronze/Silver/Gold/Diamond → 0%/5%/10%/20%).
- Payments: SePay QR code generation, webhook handling, COD support; switch payment method for an order.
- Reviews: 1–5 stars with comments; only for purchased products; average rating per product.
- Admin: Dashboard with summary and detailed stats; user/product/order management endpoints.
- Mail: Welcome email on successful registration (EJS templating).

Architecture

- Frontend: React SPA (Vite), TailwindCSS 4, shadcn/ui, Zustand for state, React Router, TanStack Query.
- Backend: NestJS modular architecture, TypeORM with PostgreSQL, DTO validation, global guards/interceptors, Swagger docs.
- RESTful API over HTTP. CORS enabled. Monolith deployment with clear domain‑based modules for easy scaling later.

Tech Stack

- Backend: NestJS 11, TypeScript, TypeORM, PostgreSQL, JWT, Bcrypt, @nestjs-modules/mailer (EJS).
- Frontend: React 19, TypeScript, Vite 6, TailwindCSS 4, shadcn/ui, Zustand 5, TanStack Query 5.
- Infra: Docker & Docker Compose.

Project Structure (high‑level)

```
Web-Ecom/
  backend/        # NestJS API (auth, products, cart, orders, payments, reviews, admin, mail, common, config)
  frontend/       # React SPA (components, hooks, pages, services, stores, types)
  docker-compose.yml
```

Quick Start (Docker)
Prerequisites: Docker and Docker Compose installed.

```bash
# From project root
docker compose up -d
```

Services (defaults):

- Frontend: http://localhost (mapped 80:80)
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api/docs
- PostgreSQL: localhost:5432 (user: ecom_user, db: ecom_db)

Notes

- The compose file sets default JWT and SMTP placeholders. Change them for production deployments.
- Uploaded files (if any) are persisted via volume: ./backend/uploads → /app/uploads.

Local Development

Option A — Run everything with Docker (recommended for quick start)

- Same as Quick Start. Then iterate on code; containers hot‑reload per Dockerfile/runtime setup.

Option B — Run DB with Docker, FE/BE locally

```bash
# Start only Postgres from compose
docker compose up -d postgres
```

Backend (NestJS)

```bash
cd backend
pnpm install   # or npm/yarn

# Create .env.development (see sample below)

pnpm dev       # start in watch mode (http://localhost:3000)

# Seed sample data (products, users, etc.)
pnpm seed
```

Frontend (React)

```bash
cd frontend
pnpm install   # or npm/yarn

# Create .env with VITE_API_URL=http://localhost:3000

pnpm dev       # start Vite dev server (usually http://localhost:5173)
```

Environment Variables

Backend (.env.[environment]) — used via ConfigModule

```env
# App
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=ecom_db

# JWT
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRATION_TIME=1h
JWT_REFRESH_EXPIRATION_TIME=7d

# Mail (example with Gmail SMTP)
MAIL_HOST=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# SePay (optional for payments in dev)
SEPAY_API_KEY=
SEPAY_BANK_ACCOUNT=
SEPAY_BANK_CODE=VCB
SEPAY_ACCOUNT_NAME=
SEPAY_WEBHOOK_SECRET=
SEPAY_API_BASE_URL=https://my.sepay.vn/userapi
SEPAY_QR_EXPIRE_MINUTES=15
```

Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
```

API Overview (summary)

- Auth
  - POST /api/auth/register — register
  - POST /api/auth/login — login (returns access + refresh tokens)
  - POST /api/auth/refresh-token — refresh access token
- Products & Categories
  - GET /api/products — list
  - GET /api/products/:id — detail
  - GET /api/categories — list categories
- Cart (auth required)
  - GET /api/cart — get current user cart
  - POST /api/cart/items — add item
  - PUT /api/cart/items/:productId — update quantity
  - DELETE /api/cart/items/:productId — remove item
- Orders (auth required)
  - POST /api/orders — create order (returns order + optional QR code)
  - GET /api/orders — list user orders
  - GET /api/orders/:orderId — order detail
  - DELETE /api/orders/:orderId/cancel — cancel order
- Payments
  - POST /api/payment/create — generate SePay QR (auth required)
  - POST /api/payment/webhook/sepay — SePay webhook (no auth)
  - GET /api/payment/methods — available methods
  - POST /api/payment/switch/:orderId — switch payment method (auth required)
- Admin (auth: ADMIN)
  - GET /api/admin/orders — list orders
  - GET /api/admin/orders/:orderId — order detail
  - PATCH /api/admin/orders/:orderId/status — update status
  - GET /api/admin/dashboard/summary — summary metrics
  - GET /api/admin/dashboard/detailed-stats — detailed stats

API docs UI (Swagger) not included yet in this repo; see API summary above. You can add Swagger later if needed.

Payments (SePay)

- QR generation builds an image URL (`https://qr.sepay.vn/img?...`) with order correlation code (DH{orderId}).
- Webhook signature verification is enabled if `SEPAY_WEBHOOK_SECRET` is set; otherwise it is bypassed (for local/dev ease).
- SePay public API has a 2 calls/second rate limit; the provider applies basic rate‑limiting before calls.

Security Notes

- Change all secrets (`JWT_SECRET`, SMTP credentials, SePay keys) before any public deployment.
- Use HTTPS and secure cookie/storage practices in production.
- Validate webhook sources and rotate secrets regularly.

Testing

- Currently no automated tests are included. Test scripts are scaffolded but suites/specs are not yet implemented.

Demo Accounts (seeded / for demo)

- Admin: admin@gmail.com / admin123
- Customer: customer@gmail.com / 123456789

Roadmap / Future Work

- ML‑based product recommendations, RAG chatbot.
- Advanced search and spec comparison.
- Additional payment gateways: VNPay, MoMo, ZaloPay.
- Mobile UX improvements and performance optimizations.
