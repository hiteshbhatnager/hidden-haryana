# Hidden Haryana – Local Tourism Discovery Platform 🌾🏰

**Hidden Haryana** is a production-quality local tourism discovery platform dedicated to addressing two critical problems in regional tourism:
1. **Low visibility of lesser-known local destinations**: Spectacular 5,000-year-old Harappan citadels, 16th-century Mughal water palaces, sacred Shivalik pine lakes, and Ramsar wetland bird sanctuaries receive virtually no exposure compared to mainstream highway halts.
2. **Scattered and unreliable tourism information**: Information is dispersed across obsolete blogs and broken links. Hidden Haryana centralizes verified GPS waypoints, opening hours, entry fees, traveler tips, and amenities into a single modern platform.

---

## 🏗️ Architecture & Technology Stack

The project is structured into two decoupled, modular applications:

```
project/
├── client/                 # React.js Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI & section components
│   │   │   ├── common/     # Navbar, Footer, Button, Badge, Loader, DestinationCard
│   │   │   └── home/       # Hero, CategoryBrowse, FeaturedDestinations, HiddenGems, RecentlyAdded
│   │   ├── constants/      # Districts of Haryana (22 districts), Categories
│   │   ├── context/        # AuthContext (State, JWT persistence, admin roles)
│   │   ├── pages/          # Home, Explore, DestinationDetails, About, Login, Register, AdminDashboard, 404
│   │   ├── routes/         # AppRoutes, ProtectedRoute (RBAC)
│   │   ├── services/       # Axios API client, authService, destinationService
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js  # Nature-inspired palette (Forest Green, Warm Cream, Terracotta, Charcoal)
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
│
└── server/                 # Node.js & Express.js Backend
    ├── src/
    │   ├── config/         # MongoDB Mongoose connection & Cloudinary config
    │   ├── controllers/    # authController, destinationController, uploadController
    │   ├── data/           # seedData (9 authentic Haryana destinations with verified coords & history)
    │   ├── middlewares/    # authMiddleware (JWT & RBAC), errorMiddleware, uploadMiddleware (Multer), validateMiddleware
    │   ├── models/         # User (bcrypt + roles), Destination (rich schema + indexing + slug generator)
    │   ├── routes/         # authRoutes, destinationRoutes, uploadRoutes, health
    │   ├── scripts/        # seed.js (Database initialization CLI)
    │   ├── utils/          # ApiResponse, ApiError, asyncHandler, generateToken
    │   ├── app.js          # Express app configuration, CORS, cookies, parsers
    │   └── server.js       # Server bootstrap with port listener
    ├── test-api.js         # Automated end-to-end API test suite
    ├── .env.example
    └── package.json
```

---

## 🎨 Nature-Inspired Color Palette & UI Design

Designed to feel like a high-end travel discovery product:
- **Forest Green** (`#14532d` / `#166534`): Represents Haryana's Shivalik ridges, Sal reserves, and agricultural expanses.
- **Warm Cream** (`#FAF8F5` / `#F5F0E1`): Soft, natural background evoking historical sandstone and parchment.
- **Terracotta & Muted Amber** (`#C85A32` / `#D97706`): Highlights Harappan pottery and brick heritage.
- **Dark Charcoal** (`#1C1F1E`): High-contrast, legible typography with Playfair Display and Plus Jakarta Sans.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= v18
- **npm** >= v9
- **MongoDB** (Local instance or MongoDB Atlas connection string; resilient fallback active out of the box)

### 1. Backend Setup (`/server`)

```bash
cd server

# Configure environment variables
cp .env.example .env

# Install dependencies (already completed)
npm install

# Run database seed (Optional: populates admin user and 9 Haryana destinations)
npm run seed

# Start server in development mode
npm run dev
# Server runs on http://localhost:5000
```

### 2. Frontend Setup (`/client`)

```bash
cd client

# Configure environment variables
cp .env.example .env

# Install dependencies (already completed)
npm install

# Start Vite development server
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🔐 Pre-Configured Test Credentials

For quick evaluation, an administrative user is pre-configured:

| Role | Email | Password |
|---|---|---|
| **Tourism Administrator** | `admin@hiddenharyana.org` | `AdminPassword123!` |

*(The Login page includes a one-click **"Fill Demo Admin Credentials"** button for instant testing.)*

---

## 📡 REST API Documentation

### **Authentication**
- `POST /api/auth/register` – Register a new traveler or administrator.
- `POST /api/auth/login` – Authenticate with email/password and receive HTTP-only cookie + JWT.
- `POST /api/auth/logout` – Clear authentication cookie.
- `GET /api/auth/me` – Retrieve current authenticated user profile.

### **Destinations**
- `GET /api/destinations` – Retrieve paginated destinations with search & filters:
  - Query params: `keyword`, `category`, `district`, `isFeatured`, `isHiddenGem`, `sort`, `page`, `limit`
- `GET /api/destinations/featured` – Featured destinations for homepage spotlight.
- `GET /api/destinations/hidden-gems` – Curated quiet, off-the-beaten-path locations.
- `GET /api/destinations/recent` – Freshly catalogued destinations.
- `GET /api/destinations/meta` – Distinct categories and all 22 districts with item counts.
- `GET /api/destinations/:idOrSlug` – Retrieve full destination detail (e.g. `/api/destinations/tikkar-taal-morni-hills`) including related recommendations.
- `POST /api/destinations` – *(Protected, Admin)* Create a new destination.
- `PUT /api/destinations/:id` – *(Protected, Admin)* Modify destination details.
- `DELETE /api/destinations/:id` – *(Protected, Admin)* Remove destination.

### **Image Uploads**
- `POST /api/upload` – *(Protected)* Upload destination photography (Multer + Cloudinary with local storage fallback).

---

## 🧪 Verification & Automated Testing

Run the included automated integration suite to verify all API routes:

```bash
node server/test-api.js
```

Verify the frontend production bundle:

```bash
npm --prefix client run build
```
*(Production build succeeds with 0 errors and creates optimized gzip assets).*

