# Jelly — Egyptian Socks E-Commerce

**Live:** https://jelly-eg.com  
**Stack:** Next.js 16 + React 19 + Tailwind CSS v4 + Prisma 7 + PostgreSQL + Auth.js v5

---

## Overview

Jelly is a bilingual (English / Arabic) e-commerce storefront for premium Egyptian socks. It features a playful, colorful design system, full cart & checkout, customer accounts, and a comprehensive admin dashboard.

## Tech Stack

- **Framework:** Next.js 16.2.6 (App Router, Turbopack)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS v4 with custom design tokens
- **UI Components:** Shadcn UI
- **Database:** PostgreSQL (Neon) via Prisma 7 + `@prisma/adapter-pg`
- **Auth:** Auth.js v5 (next-auth@5.0.0-beta.31) with JWT strategy
- **Icons:** lucide-react
- **Password Hashing:** bcryptjs

## Features

### Customer-Facing
- Bilingual homepage (`/en`, `/ar` with RTL)
- Product catalog with categories, search, filters
- Product detail with image gallery, variant picker
- Guest & signed-in cart with localStorage / Prisma persistence
- Cash on Delivery checkout with coupon support
- Customer account (dashboard, orders, profile)
- Wishlist
- WhatsApp floating button

### Admin Dashboard
- Dashboard with stats (orders, revenue, customers, products)
- Products CRUD with bilingual fields, images, variants
- Categories CRUD with soft-delete guard
- Orders management with status updates
- Stock/variants management with inline editing
- Coupons management
- Homepage banners management with reordering
- Custom order requests
- Users/customers management

## Environment Variables

See `Environment Variables.md` for the full list.

Key variables:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — NextAuth JWT secret
- `NEXT_PUBLIC_WHATSAPP_NUMBER` — WhatsApp CTA number (with +)

## Development

```bash
# Install dependencies
npm install

# Set up database
npm run db:generate
npm run db:migrate
npm run db:seed

# Run dev server
npm run dev

# Run linter
npm run lint

# Production build
npm run build
npm run start
```

## Deployment

See `Deployment Notes.md` for VPS deployment instructions.

## Project Structure

```
src/
  app/              # Next.js App Router pages
  components/       # React components
  lib/              # Prisma client, helpers, metadata
  auth.ts           # Auth.js configuration
  auth.config.ts    # Edge-safe auth config
  proxy.ts          # Next.js 16 middleware (locale + auth)
prisma/
  schema.prisma     # Database schema
  seed.ts           # Seed data
```

## License

Private — Jelly Egypt
