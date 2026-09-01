# 🎓 CampusOptiX — Smart Campus Resource & Classroom Optimizer

> **Enterprise-grade Classroom Scheduling, Spatial Utilization & Timetable Optimization Engine**

[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4.21+-lightgrey.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma_ORM-blue.svg)](https://www.prisma.io/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0_Swagger-orange.svg)](http://localhost:5000/api/docs)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/Tests-17%2F17_Passed-brightgreen.svg)]()

---

## 🌟 Overview

**CampusOptiX** is an automated spatial intelligence and conflict resolution platform designed for educational institutions. It deterministically resolves classroom overcrowding, detects scheduling collisions, balances space utilization, minimizes student travel displacement, and provides 1-click transactional timetable optimization.

---

## 🎯 Key Features

- ⚡ **100% Deterministic Conflict Engine**: Zero reliance on non-deterministic LLMs for hard constraints.
- 📐 **Transparent Multi-Objective Soft Scoring**: 100-point transparent rating across 7 criteria.
- 🚶 **Student Walking Distance Optimization**: Haversine GPS spherical distance between campus buildings.
- 🔬 **Sandboxed What-If Simulator**: In-memory scenario modeling that guarantees production timetables are never mutated.
- 🚨 **Emergency Reallocation Engine**: Impact solver for sudden facility outages with non-destructive recommendations.
- 📈 **Attendance-Based Demand Prediction**: Empirical moving-average turnout projections.
- 🤖 **Optional Natural Language Query AI Layer**: Query campus availability in plain English with deterministic backend verification.
- 🔒 **Enterprise Security & Role-Based Access (RBAC)**: JWT authentication, bcrypt hashing, and scoped role permissions (`ADMIN`, `HOD`, `FACULTY`, `LAB_INCHARGE`, `STUDENT`).
- 📖 **Interactive Swagger Documentation**: Live OpenAPI 3.0 UI at `http://localhost:5000/api/docs`.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **PostgreSQL**: `v14.0` or higher (optional for mock/offline testing)
- **npm** or **yarn**

### 2. Installation & Database Setup
```bash
# Clone the repository
git clone https://github.com/Mr-suraj6715/Amazon-clone.git CampusOptiX
cd CampusOptiX

# Install Frontend dependencies
npm install

# Install Backend dependencies
cd server
npm install

# Copy environment template
cp .env.example .env

# Generate Prisma Client & Run Seed
npm run prisma:generate
npm run prisma:seed

# Run Automated Test Suite
npm test
```

### 3. Start Development Servers
```bash
# Terminal 1: Start Backend (Port 5000)
cd server
npm run dev

# Terminal 2: Start Frontend (Port 5173)
cd ..
npm run dev
```

---

## 🌐 Live System URLs

| Interface | URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | `http://localhost:5173` | React + Tailwind Dashboard & Optimizer |
| **Interactive Swagger Docs** | `http://localhost:5000/api/docs` | OpenAPI 3.0 Swagger UI |
| **OpenAPI Spec (JSON)** | `http://localhost:5000/api/docs/openapi.json` | Machine-readable API schema |
| **Backend REST API** | `http://localhost:5000/api` | REST endpoints root |
| **Health Check** | `http://localhost:5000/health` | Service health status |

---

## 📚 Technical Documentation Index

- [🏛️ ARCHITECTURE.md](./ARCHITECTURE.md) — System Design, Optimization Engine & ERD
- [⚙️ SETUP.md](./SETUP.md) — Step-by-Step Installation & Deployment Guide
- [📡 API.md](./API.md) — Comprehensive REST API Reference & Endpoints
