# ☕ Campus Café — College Canteen Management System

A full-stack, premium café-themed college canteen web app built with **React + Vite + Tailwind CSS** (frontend) and **Node.js + Express + Prisma + SQLite** (backend).

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Set up the database

```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
node prisma/seed.js
```

### 3. Run both servers (in two separate terminals)

**Terminal 1 — Backend (port 5000)**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend (port 5173)**
```bash
cd client
npm run dev
```

### 4. Open in browser

- **Student App**: http://localhost:5173
- **API Health**: http://localhost:5000/api/health

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 🎓 Student | `rahul@student.edu` | `student123` |
| ⚡ Admin | `admin@campuscafe.edu` | `admin123` |

---

## 🎟️ Demo Coupons

| Code | Discount |
|------|----------|
| `FIRST50` | 50% off (max ₹50, min order ₹100) |
| `STUDENT20` | 20% off (max ₹40, min order ₹80) |
| `CAMPUS10` | 10% off (max ₹30, min order ₹50) |

---

## 📁 Project Structure

```
project 3/
├── client/              # React + Vite frontend
│   └── src/
│       ├── api/         # Axios API client
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth + Cart context
│       └── pages/
│           ├── Home.jsx
│           ├── Menu.jsx
│           ├── Checkout.jsx
│           ├── OrderTracking.jsx
│           ├── MyOrders.jsx
│           ├── Profile.jsx
│           ├── Login.jsx / Register.jsx
│           ├── About.jsx
│           └── admin/   # Admin dashboard pages
│
└── server/              # Express + Prisma backend
    ├── prisma/
    │   ├── schema.prisma   # SQLite database schema
    │   └── seed.js         # Sample data seeder
    ├── routes/          # API routes
    ├── middleware/      # JWT auth middleware
    └── server.js        # Express entry point
```

---

## 🌟 Features

### Student App
- 🏠 **Home** — Hero, Today's Specials, Popular Items, Categories, Reviews, Hours
- 🍽️ **Menu** — Search, category filters, veg/non-veg, price range, sort, add-to-cart
- 🛒 **Cart** — Slide-in drawer, quantity controls, coupon codes, tax breakdown
- 💳 **Checkout** — Pickup options, UPI/Card/Cash payment, order confirmation with number
- 📍 **Order Tracking** — Live animated timeline, ETA countdown, auto-refresh every 15s
- 📦 **My Orders** — Order history, active order highlight, reorder button
- 👤 **Profile** — Edit name/phone, quick links, logout
- 🔐 **Login / Register** — JWT auth with demo credential buttons

### Admin Dashboard
- 📊 **Dashboard** — KPI cards, Recharts weekly revenue bar chart, top items pie chart
- 📋 **Orders** — Live queue, status filter, quick status update, order detail modal
- 🍕 **Menu Management** — Add/Edit/Delete items, toggle availability & special status
- 📦 **Inventory** — Low-stock alerts, inline stock level editing
- 👥 **Users** — Student list with order count and total spending

---

## 🎨 Design System

| Token | Color |
|-------|-------|
| Primary | `#5B321E` (Dark Espresso Brown) |
| Secondary | `#D97706` (Warm Amber) |
| Accent | `#F59E0B` (Golden Yellow) |
| Background | `#FFF8F0` (Cream) |
| Success | `#16A34A` |
| Error | `#DC2626` |

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register student |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/menu` | Food items with filters |
| GET | `/api/menu/categories` | All categories |
| GET | `/api/menu/specials` | Today's specials |
| GET | `/api/menu/:id` | Food item detail |
| POST | `/api/menu/:id/review` | Add review |
| POST | `/api/orders` | Place order |
| GET | `/api/orders/me` | My orders |
| GET | `/api/orders/track/:num` | Track by order number |
| POST | `/api/coupons/validate` | Validate coupon |
| GET | `/api/admin/dashboard` | Admin stats + charts |
| GET/PATCH | `/api/admin/orders` | Manage orders |
| CRUD | `/api/admin/menu` | Manage menu items |
| GET/PUT | `/api/admin/inventory` | Manage inventory |
| GET | `/api/admin/users` | User management |

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| State | Context API + useReducer |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP | Axios |
| Toasts | react-hot-toast |
| Backend | Node.js + Express |
| Database | SQLite (via Prisma ORM) |
| Auth | JWT + bcryptjs |
