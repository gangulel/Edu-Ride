# Edu-Ride

A full-stack school bus transportation platform connecting parents, drivers, and administrators. Parents can search and book verified school bus services, track their child's bus in real time, and communicate directly with drivers. Drivers manage routes, students, bookings, and earnings. Admins oversee the entire platform through a dedicated web dashboard.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Running the Backend](#running-the-backend)
  - [Running the Mobile App](#running-the-mobile-app)
  - [Running the Admin Dashboard](#running-the-admin-dashboard)
- [API Reference](#api-reference)
- [Database Models](#database-models)
- [Authentication](#authentication)
- [Real-time Features](#real-time-features)
- [Internationalization](#internationalization)
- [Deployment](#deployment)

---

## Overview

Edu-Ride is a monorepo containing three applications:

| App | Description | Tech |
|-----|-------------|------|
| `mobile/` | React Native app for parents and drivers | Expo 54, React Native 0.81 |
| `backend/` | REST API + real-time server | Express 5, MongoDB, Socket.io |
| `admin/` | Web dashboard for administrators | React 18, TypeScript, Vite |

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Mobile App     │     │  Admin Dashboard │     │  External       │
│  (Expo/RN)      │     │  (React + Vite)  │     │  Services       │
│  Parents &      │     │  Administrators  │     │  Firebase Auth  │
│  Drivers        │     │                  │     │  MongoDB Atlas  │
└────────┬────────┘     └────────┬─────────┘     └────────┬────────┘
         │                       │                          │
         └───────────────────────┼──────────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   Express.js Backend    │
                    │   REST API + Socket.io  │
                    │   JWT Authentication    │
                    │   Role-based Access     │
                    └─────────────────────────┘
```

---

## Tech Stack

### Mobile (React Native + Expo)

| Category | Technology |
|----------|-----------|
| Framework | React Native 0.81.5 + Expo 54.0.31 |
| Routing | Expo Router 6 (file-based) |
| Navigation | React Navigation + Bottom Tabs |
| Authentication | Firebase Auth + expo-auth-session (Google OAuth) |
| Animations | React Native Reanimated |
| Internationalization | i18next + react-i18next |
| Icons | iconsax-react-native |
| Gradients | expo-linear-gradient |

### Backend (Node.js)

| Category | Technology |
|----------|-----------|
| Server | Express.js 5.1.0 |
| Database | MongoDB + Mongoose 8.24 |
| Authentication | Firebase Admin SDK 13 + Custom JWT |
| Real-time | Socket.io 4.8 |
| Validation | Zod |
| Security | Helmet, CORS, Bcrypt, Rate Limiting |
| Dev Tools | Nodemon |

### Admin Dashboard (React + TypeScript)

| Category | Technology |
|----------|-----------|
| Framework | React 18.3 + TypeScript |
| Build Tool | Vite 6.3 |
| UI Components | Shadcn/ui (Radix UI) |
| Charts | Recharts 2.15 |
| Forms | React Hook Form 7.55 |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Theming | next-themes (dark/light mode) |

---

## Project Structure

```
edu-ride/
├── mobile/                    # React Native mobile app
│   ├── app/                   # Screens (Expo Router file-based routing)
│   │   ├── _layout.jsx        # Root layout
│   │   ├── index.jsx          # Landing / onboarding
│   │   ├── login/             # Authentication screens
│   │   ├── parent/            # Parent user screens
│   │   │   ├── index.jsx      # Parent dashboard
│   │   │   ├── search.jsx     # Search drivers & routes
│   │   │   ├── booking.jsx    # Book a service
│   │   │   ├── my-bookings.jsx
│   │   │   ├── payments.jsx
│   │   │   ├── chat.jsx
│   │   │   ├── notifications.jsx
│   │   │   └── profile/
│   │   ├── driver/            # Driver user screens
│   │   │   ├── index.jsx      # Driver dashboard
│   │   │   ├── active-trip.jsx
│   │   │   ├── booking-requests.jsx
│   │   │   ├── route-management.jsx
│   │   │   ├── students.jsx
│   │   │   ├── earnings.jsx
│   │   │   ├── chat.jsx
│   │   │   └── Profile/
│   │   └── settings/
│   ├── components/            # Atomic design component library
│   │   ├── atoms/             # Button, Input, Text, Avatar, Badge, etc.
│   │   ├── molecules/         # SearchBar, ServiceCard, ReviewCard, etc.
│   │   ├── organisms/         # Complex composed sections
│   │   ├── driver/            # Driver-specific components
│   │   └── templates/         # Page-level templates
│   ├── contexts/              # React contexts (auth, theme, language)
│   ├── hooks/                 # Custom React hooks
│   ├── services/              # API integration layer
│   ├── theme/                 # Colors, typography, spacing
│   ├── utils/                 # Utility helpers
│   ├── constants/             # App-wide constants
│   ├── config/                # API and OAuth configuration
│   ├── assets/                # Images, fonts, icons
│   ├── app.json               # Expo config (bundle ID: com.eduride.mobile)
│   └── .env.example           # Environment variable template
│
├── backend/                   # Express.js API server
│   └── src/
│       ├── index.js           # Server entry point
│       ├── config/
│       │   └── firebase.js    # Firebase Admin SDK setup
│       ├── models/            # 16 Mongoose schemas
│       ├── routes/            # 16 API route files
│       ├── controllers/       # Business logic
│       ├── middleware/        # Auth, validation, rate limiting
│       ├── services/          # Notification service
│       ├── socket/            # Socket.io real-time handlers
│       ├── lib/               # DB connection, JWT utils, audit log
│       ├── validators/        # Zod request schemas
│       └── scripts/           # DB seeding and checks
│
├── admin/                     # React admin dashboard
│   └── src/
│       ├── App.tsx            # Root with routing and auth
│       ├── components/        # Feature panels (12 major views)
│       │   ├── DashboardOverview.tsx
│       │   ├── UserManagement.tsx
│       │   ├── RouteManagement.tsx
│       │   ├── PaymentManagement.tsx
│       │   ├── RatingsReviews.tsx
│       │   ├── AuditLogs.tsx
│       │   ├── ContentManagement.tsx
│       │   └── ui/            # 50+ Shadcn/ui primitives
│       └── lib/
│           ├── api.ts         # Backend API client
│           └── theme.tsx      # Theme provider
│
├── package.json               # Root workspace config
├── vercel.json                # Vercel deployment config
└── tsconfig.json
```

---

## Features

### Parent Features

- **Search & Discovery** — Find verified school bus drivers by location, route, and price
- **Booking** — Request and manage bus service subscriptions
- **Live Tracking** — Track the bus position in real time
- **Payments** — Add payment methods and view transaction history
- **Messaging** — In-app chat with drivers
- **Notifications** — Pickup/dropoff alerts and booking updates
- **Reviews** — Rate and review drivers after service
- **Child Management** — Add multiple children with their school details

### Driver Features

- **Route Management** — Create routes with stops, timings, and capacity
- **Student Roster** — View and manage enrolled students
- **Booking Requests** — Accept or decline parent booking requests
- **Active Trip** — Start/end trips and broadcast real-time location
- **Earnings** — View daily, weekly, and monthly earnings summaries
- **Messaging** — Chat with parents
- **Profile** — Manage vehicle, documents, and personal info

### Admin Features

- **Dashboard Overview** — Platform-wide KPIs (users, drivers, routes, revenue)
- **User Management** — Search, verify, and suspend parent/driver accounts
- **Route Monitoring** — View and manage all active routes
- **Payment Management** — Track transactions and handle disputes
- **Ratings & Reviews** — Moderate and remove inappropriate reviews
- **Communication Monitor** — Oversight of parent–driver messaging
- **Complaints & Support** — Track and resolve support tickets
- **Reports & Analytics** — Revenue trends, user growth, performance metrics
- **Content Management** — Edit FAQs, policies, and app content
- **Audit Logs** — Complete history of all admin actions
- **System Settings** — Feature toggles and platform configuration

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Expo CLI** (`npm install -g expo-cli`)
- **MongoDB Atlas** account (or local MongoDB instance)
- **Firebase** project with Authentication enabled
- An Android or iOS device/emulator, or Expo Go app

---

### Environment Variables

#### Backend — `backend/.env`

```env
PORT=3000
MONGO_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/eduride
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
ADMIN_PANEL_EMAIL=admin@eduride.com
ADMIN_PANEL_PASSWORD=Admin@123
JWT_SECRET=your-jwt-secret-key
```

#### Mobile — `mobile/.env`

Create `mobile/.env` from `mobile/.env.example`:

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000/api
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-web-client-id
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your-google-ios-client-id
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your-google-android-client-id
```

See `mobile/GOOGLE_LOGIN_SETUP.md` for full Google OAuth setup instructions.

---

### Running the Backend

```bash
cd backend
npm install
npm run dev       # Starts with nodemon on PORT 3000
```

Optional — seed the database with dummy data:

```bash
npm run seed:dummy
```

Optional — verify MongoDB connectivity:

```bash
npm run check:mongo
```

---

### Running the Mobile App

```bash
cd mobile
npm install
npx expo start
```

Then press:
- `a` — open Android emulator
- `i` — open iOS simulator
- `w` — open in browser (limited features)
- Scan the QR code with **Expo Go** on a physical device

---

### Running the Admin Dashboard

```bash
cd admin
npm install
npm run dev       # Starts Vite dev server (usually http://localhost:5173)
```

**Default admin credentials:**

```
Email:    admin@eduride.com
Password: Admin@123
```

> These credentials are configured via `ADMIN_PANEL_EMAIL` and `ADMIN_PANEL_PASSWORD` in `backend/.env`.

To build for production:

```bash
npm run build     # Output goes to admin/build/
```

---

## API Reference

All API routes are prefixed with `/api`.

| Resource | Base Path | Description |
|----------|-----------|-------------|
| Auth | `/api/auth` | Login, register, logout, token refresh |
| Users | `/api/users` | Profile management for all user types |
| Children | `/api/children` | Add/update/remove child records |
| Vehicles | `/api/vehicles` | Driver vehicle information |
| Routes | `/api/routes` | Bus route CRUD with stops and timing |
| Bookings | `/api/bookings` | Booking requests and acceptance |
| Trips | `/api/trips` | Trip logging and status updates |
| Payments | `/api/payments` | Payment processing and history |
| Payment Methods | `/api/payment-methods` | Stored payment method management |
| Subscriptions | `/api/subscriptions` | Active subscription management |
| Reviews | `/api/reviews` | Driver ratings and reviews |
| Chat | `/api/chat` | Messaging threads and messages |
| Notifications | `/api/notifications` | Push and in-app notifications |
| Earnings | `/api/earnings` | Driver earnings tracking |
| Content | `/api/content` | FAQs, policies, static content |
| Admin | `/api/admin` | Admin-only operations and reporting |

---

## Database Models

The backend uses 16 MongoDB/Mongoose models:

| Model | Purpose |
|-------|---------|
| `User` | Parents, drivers, and admins (role field) |
| `Child` | Student records linked to parent accounts |
| `Vehicle` | Bus/vehicle details linked to a driver |
| `Route` | Driver routes with ordered stops and times |
| `Booking` | Parent's booking of a driver's service |
| `Subscription` | Active subscription between parent and driver |
| `Trip` | Individual trip logs (start, end, stops visited) |
| `Payment` | Payment transactions |
| `PaymentMethod` | Saved payment methods per user |
| `Review` | Star ratings and text reviews for drivers |
| `Message` | Individual chat messages |
| `Conversation` | Chat threads between two users |
| `Notification` | In-app and push notification records |
| `Earning` | Driver earnings entries |
| `AuditLog` | Admin action history for compliance |
| `AdminContent` | Admin-managed content (FAQs, policies) |

---

## Authentication

Edu-Ride uses a layered authentication approach:

1. **Firebase Authentication** — handles email/password and Google OAuth flows on the mobile client
2. **Custom JWT tokens** — issued by the backend after Firebase token verification; used for all subsequent API calls
3. **Role-based access control** — middleware enforces `parent`, `driver`, or `admin` role restrictions per route
4. **Admin session tokens** — separate token type for admin dashboard authentication

Token types are managed in:
- `backend/src/lib/userToken.js` — standard user tokens
- `backend/src/lib/mobileSessionToken.js` — mobile session management
- `backend/src/lib/adminSessionToken.js` — admin dashboard sessions

---

## Real-time Features

Socket.io (`backend/src/socket/index.js`) powers real-time functionality:

- **Live bus tracking** — drivers broadcast GPS coordinates; parents subscribe to their booked driver's location
- **In-app chat** — bi-directional messaging between parents and drivers with instant delivery
- **Trip status updates** — trip start/end/stop events delivered to subscribed parents in real time
- **Booking notifications** — instant alerts when a booking is accepted or declined

---

## Internationalization

The mobile app supports multiple languages via **i18next** and **react-i18next**. Language selection is available from a dedicated screen and persists via context. Translation files are located in `mobile/assets/` (or `mobile/locales/`). The `LanguageContext` in `mobile/contexts/` manages the active language across the app.

---

## Deployment

| Component | Platform | Notes |
|-----------|----------|-------|
| Backend | Vercel (Node runtime) | Configured in `vercel.json` at repo root |
| Admin Dashboard | Vercel / Static host | Build output in `admin/build/` |
| Mobile App | Expo Application Services (EAS) | Publish to App Store & Google Play |
| Database | MongoDB Atlas | Managed cloud cluster |
| Authentication | Firebase | Managed by Google Cloud |

For backend deployment on Vercel, the `vercel.json` config routes all traffic through the Express server.

For mobile builds:

```bash
cd mobile
npx eas build --platform android
npx eas build --platform ios
```

---

## Contributing

1. Create a feature branch from `main`
2. Make changes and write tests where applicable
3. Open a pull request against `main`

Current active branch: `driver` — ongoing driver feature development.
