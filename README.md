# 🍔 Mr Bun Fast Food Platform

Official web application and edge API for **Mr Bun**, featuring artisan fast food ordering, live kitchen tracking, outlet details, franchise expressions of interest, and bulk party catering.

---

## 📌 Company & Statutory Information

- **Company Name**: Mr Bun
- **Helpline / WhatsApp**: `9476088111`
- **Email ID**: `contact@mrbun.in`
- **FSSAI License No.**: `22926112000173`
- **Cloudflare Worker Target**: `mrbun.ceansystech.workers.dev`
- **Cloudflare D1 Database**: `mrbun` (`0b367436-034c-462f-8811-c1ac76ea2023`)

---

## 🌐 Routes Overview

| Route | Page Component | Description |
| :--- | :--- | :--- |
| `/` | `HomePage.tsx` | Hero banner, quick craving selector, bestsellers, party catering teaser & reviews |
| `/menu` | `MenuPage.tsx` | Full interactive menu with categories (`burgers`, `pizzas`, `sandwiches`, `mocktails`, `sides`, `combos`), search & Veg/Non-Veg filters |
| `/parties` | `PartyPage.tsx` | Bulk & party catering planner with instant cost calculator & interactive booking dialog box |
| `/outlets` | `OutletsPage.tsx` | Outlets in city (Flagship Diner, Cyber Tech Hub, Midnight Kitchen) with amenities & hours |
| `/about` | `AboutPage.tsx` | Story of Mr Bun mascot, quality oath, 100% dairy cheese & FSSAI standards |
| `/contact` | `ContactPage.tsx` | Direct contact desk, 1-click hotline `9476088111`, query form & FAQs |
| `/franchise` | `FranchisePage.tsx` | Franchise models, investment ROI, and interactive expression of interest dialog |
| `/admin` | `AdminPage.tsx` | Dedicated Admin Portal (order status dispatcher, party inquiries & D1 SQLite inspector) |
| `/orders` | `OrdersPage.tsx` | Customer order history, live 5-stage kitchen tracker & digital tax invoice |
| `*` | `NotFoundPage.tsx` | 404 handler with fast food mascot illustration and navigation |

---

## 🚀 Cloudflare Deployment to `mrbun.ceansystech.workers.dev`

### 1. Initialize Tables in Your Cloudflare D1 Database
Execute your `schema.sql` against your existing remote D1 database (`mrbun`):
```bash
npm run d1:init
```
*(Or run `npx wrangler d1 execute mrbun --remote --file=./schema.sql`)*

### 2. Build & Deploy Worker
Deploy the complete Vite frontend assets and edge API to `mrbun.ceansystech.workers.dev`:
```bash
npm run deploy
```
*(Or run `npx wrangler deploy`)*

Once deployed, your live application will be live at:
👉 **`https://mrbun.ceansystech.workers.dev`**

---

## 🛠️ Local Development

To run locally with instant hot reload:
```bash
npm run dev
```
Open **`http://localhost:5173`**.

---

## 🔑 Admin Credentials
- Navigate to: **`http://localhost:5173/admin`** (or **`https://mrbun.ceansystech.workers.dev/admin`**)
- **Username**: `admin@mrbun.in`
- **Passcode**: `admin123` *(or click the 1-click Demo Fill button)*
