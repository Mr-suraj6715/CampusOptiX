# ⚙️ CampusOptiX Installation & Setup Guide

This guide provides step-by-step instructions to configure, initialize, and run **CampusOptiX** locally.

---

## 1. System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Node.js**: `v18.0.0` or higher ([Download Node.js](https://nodejs.org/))
- **PostgreSQL**: `v14.0` or higher ([Download PostgreSQL](https://www.postgresql.org/)) (Optional for offline demo mode)
- **Git**: [Download Git](https://git-scm.com/)

---

## 2. Step-by-Step Installation

### Step 1: Clone Repository
```bash
git clone https://github.com/Mr-suraj6715/Amazon-clone.git CampusOptiX
cd CampusOptiX
```

### Step 2: Configure Environment Variables
Navigate to the `server/` directory and configure `.env`:
```bash
cd server
cp .env.example .env
```

Review `server/.env`:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/campusoptix_db?schema=public"
JWT_SECRET="campusoptix_super_secret_jwt_key_2026_dev_prod"
JWT_EXPIRES_IN="7d"
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
AI_API_KEY="" # Optional
```

### Step 3: Install Dependencies
```bash
# Install backend packages
npm install

# Install frontend packages
cd ..
npm install
```

### Step 4: Database Migration & Realistic Seeding
```bash
cd server

# Generate Prisma ORM Client
npm run prisma:generate

# Run DB Migrations (if PostgreSQL is running)
# npm run prisma:migrate

# Seed Demo Dataset (12 rooms, 6 labs, 4 buildings, 15 faculty, 20 courses, 8 demo scenarios)
npm run prisma:seed
```

### Step 5: Run Automated Tests
```bash
# In the server/ directory
npm test
```
*Expected output: `17 Passed, 0 Failed (100% Pass Rate)`.*

---

## 3. Running Development Servers

### Terminal 1: Backend Server (Port 5000)
```bash
cd server
npm run dev
```
*Backend runs at `http://localhost:5000` with Swagger UI at `http://localhost:5000/api/docs`.*

### Terminal 2: Frontend Web App (Port 5173)
```bash
cd ..
npm run dev
```
*Frontend runs at `http://localhost:5173`.*

---

## 4. Default Seeded Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@campusoptix.edu` | `Admin@123` | Full Campus Access & Overrides |
| **HOD (CSE)** | `priya.mehta@campusoptix.edu` | `Faculty@123` | Department Management & Approvals |
| **Faculty Member** | `rajesh.kumar@campusoptix.edu` | `Faculty@123` | Instructor Preferences & Schedule |
| **Student** | `student@campusoptix.edu` | `Student@123` | Timetable Viewer & Alerts |
