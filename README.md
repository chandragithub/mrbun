# 🍔 Mr Bun - Fresh, Cheesy & Crave-Worthy Fast Food Platform

Welcome to the official repository for **Mr Bun**, a fast food web application designed for online food ordering, instant live order tracking, outlet discovery, and bulk/party catering bookings.

---

## 📌 Company & Statutory Information

- **Company Name**: Mr Bun
- **Helpline / WhatsApp**: `9476088111`
- **Email ID**: `contact@mrbun.in`
- **FSSAI License No.**: `22926112000173`
- **Official Mascot / Logo**: Featured in `/public/logo.png`

---

## 🧭 Routes & Lazy Loading Architecture

Every route is decoupled into its own chunk with `React.lazy()` and `<Suspense fallback={<PageLoader />}>`:

| Route | Page Component | Lazy Chunk | Description |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage.tsx` | `HomePage-*.js` | Hero showcase, cravings grid, bestsellers, party teaser & customer reviews |
| `/menu` | `MenuPage.tsx` | `MenuPage-*.js` | Complete fast food menu with live search & veg/non-veg filter |
| `/menu?category=burgers` | `MenuPage.tsx` | `MenuPage-*.js` | Deep-linked category for smashed brioche burgers |
| `/menu?category=pizzas` | `MenuPage.tsx` | `MenuPage-*.js` | Deep-linked category for cheesy sourdough pizzas |
| `/menu?category=sandwiches`| `MenuPage.tsx` | `MenuPage-*.js` | Deep-linked category for club sandwiches & wraps |
| `/menu?category=mocktails` | `MenuPage.tsx` | `MenuPage-*.js` | Deep-linked category for chilled mocktails & shakes |
| `/parties` | `PartyPage.tsx` | `PartyPage-*.js` | Bulk order & party catering planner with instant cost calculator & volume discount |
| `/outlets` | `OutletsPage.tsx` | `OutletsPage-*.js` | **Outlet Details**: Flagship diner, cyber tech hub & midnight kitchen with amenities & directions |
| `/about` | `AboutPage.tsx` | `AboutPage-*.js` | **About Us**: Story of Mr Bun mascot, quality oath, 100% dairy cheese & FSSAI hygiene standards |
| `/contact` | `ContactPage.tsx` | `ContactPage-*.js` | **Contact Us**: Interactive query form, 1-click hotline `9476088111`, official email & FAQs |
| `/admin` | `AdminPage.tsx` | `AdminPage-*.js` | **Dedicated Admin Page Route**: Live orders, status management, party bookings & Cloudflare D1 SQLite schema view |
| `/orders` | `OrdersPage.tsx` | `OrdersPage-*.js` | Customer order history & real-time delivery tracker |
| `*` | `NotFoundPage.tsx` | `NotFoundPage-*.js` | 404 handler with quick navigation back to the menu |

---

## 🚀 Tech Stack

- **Frontend**: React 18, React Router v7, TypeScript, Tailwind CSS, Lucide Icons
- **Build Tool**: Vite 6 (Code-split with `React.lazy`)
- **Backend / Edge Functions**: Cloudflare Pages Functions / Cloudflare Workers
- **Database**: SQLite (Cloudflare D1 serverless database with unified fallback storage)
- **Deployment & CLI**: Cloudflare Wrangler CLI

---

## 🛠️ Local Development & Cloudflare Deployment

### 1. Run Locally with Vite
```bash
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### 2. Build for Production
```bash
npm run build
```

### 3. Dedicated Admin Page Credentials
- Navigate to: `http://localhost:5173/admin`
- **Username**: `admin@mrbun.in`
- **Passcode**: `admin123` *(or click the 1-click Demo Fill button)*

### 4. Cloudflare Wrangler & D1 Database Setup
```bash
# 1. Create your Cloudflare D1 SQLite database:
npx wrangler d1 create mrbun-db

# 2. Initialize the tables:
npx wrangler d1 execute mrbun-db --file=./schema.sql

# 3. Deploy to Cloudflare Pages:
npx wrangler pages deploy dist
```
