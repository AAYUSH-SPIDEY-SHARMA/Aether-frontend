# 🚀 AETHER - Technical Symposium Platform

<div align="center">

**The Official Website for AETHER - Data Science & AI/ML Club, IIIT Lucknow**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vite.dev)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)](https://nestjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)](https://postgresql.org)

</div>

---

## 📖 Overview

AETHER is a full-stack web platform for managing technical symposiums, club activities, and event registrations for the Data Science & AI/ML Club at IIIT Lucknow.

### ✨ Key Features

- **🎪 Symposium 2026** - Event showcase, registration, and ticketing
- **💳 Payment Integration** - Razorpay-powered payment processing
- **📧 Email Notifications** - Automated confirmation and reminder emails
- **🖼️ Asset Management** - Cloudinary-based image uploads with cropping
- **👥 Team Showcase** - Club coordinators, faculty, and symposium team
- **🦋 Wings Management** - WnC (Web & Coding) and Climate Tech wings
- **🔐 Admin Dashboard** - Complete content management system

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18.3 | UI Framework |
| Vite 6.0 | Build Tool |
| React Router 7 | Routing |
| Framer Motion | Animations |
| Lucide Icons | Icon Library |
| CSS (Vanilla) | Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express.js | HTTP Server |
| Prisma 6.0 | ORM |
| PostgreSQL | Database |
| JWT | Authentication |
| Razorpay | Payments |
| Cloudinary | Image Storage |
| React Email + Resend | Transactional Emails |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 16+ (or Docker)
- npm or yarn

### 1. Clone & Install

```bash
# Clone repository
git clone https://github.com/your-org/aether.git
cd aether

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp backend/.env.example backend/.env

# Edit with your values
# See .env.example for all required variables
```

### 3. Database Setup

```bash
cd backend

# Run Prisma migrations
npx prisma migrate dev

# Seed initial data
npx prisma db seed
```

### 4. Start Development

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd ..
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Admin: http://localhost:5173/admin

---

## 📁 Project Structure

```
aether/
├── src/                    # Frontend React app
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── utils/             # Utilities
├── backend/               # Backend API
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   ├── middlewares/   # Auth, error handling
│   │   └── emails/        # Email templates
│   └── prisma/            # Database schema
├── public/                # Static assets
└── dist/                  # Production build
```

---

## 🔑 Environment Variables

### Backend (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:pass@host:5432/aether_db

# JWT Auth
JWT_ACCESS_SECRET=<min_32_chars>
JWT_REFRESH_SECRET=<min_32_chars>

# Razorpay
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=xxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxxx
CLOUDINARY_API_KEY=xxxxx
CLOUDINARY_API_SECRET=xxxxx

# Email
RESEND_API_KEY=re_xxxxx

# CORS
FRONTEND_URL=https://aether.iiitl.ac.in
```

---

## 📡 API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events |
| GET | `/api/events/:id` | Event details |
| GET | `/api/wings` | List wings |
| GET | `/api/team` | Team members |
| GET | `/api/sponsors` | Sponsors |
| POST | `/api/registrations` | Create registration |

### Admin (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| CRUD | `/api/admin/events` | Manage events |
| CRUD | `/api/admin/wings` | Manage wings |
| CRUD | `/api/admin/team` | Manage team |
| GET | `/api/admin/registrations` | View registrations |

---

## 🔐 Authentication

- **JWT-based** authentication
- Access token: 15 min expiry
- Refresh token: 7 day expiry
- Role-based access: `USER` | `ADMIN`

---

## 💳 Payment Flow

1. User creates registration
2. Frontend calls `/api/payments/create-order`
3. Backend creates Razorpay order
4. User completes payment in Razorpay modal
5. Razorpay webhook confirms payment
6. Backend updates status & sends email

---

## 🚀 Deployment

### Production Build

```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
```

### Pre-Deployment Checklist
- ✅ Set `NODE_ENV=production`
- ✅ Configure production database
- ✅ Set Razorpay live keys
- ✅ Configure SSL/HTTPS
- ✅ Run `npx prisma migrate deploy`

See [AETHER_PRODUCTION_READINESS_REPORT.md](./AETHER_PRODUCTION_READINESS_REPORT.md) for full audit.

---

## 📜 Audit Reports

| Report | Description |
|--------|-------------|
| [Security Audit](./AUDIT_SECURITY_REPORT.md) | Secrets & vulnerability scan |
| [API Audit](./AUDIT_API_CONNECTION_REPORT.md) | Endpoint verification |
| [Database Audit](./AUDIT_DATABASE_REPORT.md) | Schema validation |
| [Build Audit](./AUDIT_BUILD_REPORT.md) | Production build check |
| [Access Audit](./AUDIT_ACCESS_REPORT.md) | Auth & permissions |
| [Payment Audit](./AUDIT_PAYMENT_EMAIL_REPORT.md) | Payment security |
| [UI Audit](./AUDIT_UI_REPORT.md) | Responsiveness check |

---

## 👥 Team

**AETHER - Data Science & AI/ML Club**  
IIIT Lucknow

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

---

<div align="center">

**Built with ❤️ for AETHER Symposium 2026**

</div>
