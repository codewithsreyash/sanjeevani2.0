# SANJEEVANI 3.0 — Connected Public Healthcare Platform

**Smart India Hackathon 2026 | Problem Statement #26133**  
Government of Maharashtra | MedTech / HealthTech Domain

---

## Overview

Sanjeevani is an **offline-first, role-based public healthcare coordination platform** for rural Maharashtra. It unifies Patients, ASHA/ANM/CHO health workers, Doctors, and District Administrators under a single, continuous care continuum — from village registration through closed-loop referrals.

### Tech Stack

| Layer | Technology |
|---|---|
| Mobile App | Expo 51 / React Native 0.74 / Expo Router / NativeWind |
| State Management | Zustand |
| Local DB | expo-sqlite (offline-first) |
| Backend API | NestJS 10 / TypeScript |
| Database | PostgreSQL 16 |
| AI Service | FastAPI / XGBoost + SHAP |
| Shared Types | TypeScript monorepo package |
| Containers | Docker Compose |

---

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Docker & Docker Compose
- Expo CLI (`npm install -g expo-cli`)

### 1. Install dependencies

```bash
# Root monorepo
npm install

# Mobile app
cd apps/mobile && npm install
```

### 2. Run the full backend with Docker Compose

```bash
docker compose up --build
```

This starts:
- **PostgreSQL** on port `5432`
- **NestJS API** on port `3002` → `http://localhost:3002/api/v1`
- **FastAPI AI service** on port `8000` → `http://localhost:8000`

### 3. Run the mobile app

```bash
cd apps/mobile
npx expo start
```

- Press `a` for Android emulator
- Scan the QR code with Expo Go on a physical device

> **Physical device tip:** Update `apiUrl` in `apps/mobile/app.json` `extra` field to your machine's LAN IP, e.g. `http://192.168.1.50:3002/api/v1`

### 4. Run backend in dev mode (without Docker)

```bash
# Terminal 1 — PostgreSQL (requires Docker or local Postgres)
docker compose up db

# Terminal 2 — NestJS API
cd apps/api
cp .env.example .env   # edit DATABASE_URL if needed
npm run start:dev

# Terminal 3 — FastAPI AI service
cd apps/ai-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

---

## Demo Login

The app includes a demo mode with pre-built personas — no OTP or backend required.

| Role | Demo User | Access Path |
|---|---|---|
| Patient | Ramesh Patil (Shivapur) | Tap role card on splash |
| Health Worker | ASHA Sunita More | Tap role card on splash |
| Doctor | Dr. Ananya Deshmukh | Tap role card on splash |
| Admin | S. K. Kulkarni (Pune District) | Tap role card on splash |

For OTP login flow, use **123456** as the demo OTP.

---

## Key Features

### Patient
- Care journey carousel & timeline
- Facility finder with wait times and stock status
- Appointment booking & queue token generation
- QR scan for instant facility check-in
- Closed-loop referral live tracking
- Health records & consent manager
- Family profile switching (4 linked members)

### Health Worker (ASHA/ANM/CHO)
- Offline patient registration → SQLite + sync queue
- Vitals capture (SpO2, Temp, BP, HR, Weight)
- Symptom selection with duration
- **Digital Triage**: calls FastAPI AI service (XGBoost + SHAP) with offline fallback
- Community follow-up task recording with offline queue
- Patient directory search by name / ABHA ID

### Doctor
- Priority triage queue (EMERGENCY → ROUTINE sorted)
- AI triage review: **Accept** or **Override with clinical rationale** (auditable)
- Clinical encounter notes & prescription with stock status
- Closed-loop referral creation (modal with reason)
- Referral state machine — advance through 9 states from SENT → COMPLETED

### Admin
- District KPI dashboard (facilities, referrals, high-priority, stock alerts)
- Referral closure rate chart per facility
- District medicine stock monitor with inter-facility recommendations
- Live referral loop monitor

---

## Offline Architecture

```
[Worker records vitals] → [SQLite local_vitals table]
                              ↓
                     [enqueueOfflineMutation()]
                              ↓
                      [sync_queue table — PENDING]
                              ↓  (when online)
                     [processSyncQueue()]
                              ↓
              [POST /api/v1/sync/batch → NestJS]
                              ↓
                    [sync_queue → SYNCED]
```

The `OfflineBanner` component automatically shows when offline or when there are pending mutations. Tapping "Sync Now" flushes the queue.

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/auth/request-otp` | Request OTP (returns 123456 in demo) |
| POST | `/api/v1/auth/verify-otp` | Verify OTP & get JWT |
| GET | `/api/v1/patients` | List/search patients |
| GET | `/api/v1/patients/:id` | Get patient details |
| POST | `/api/v1/patients` | Create patient |
| GET | `/api/v1/patients/:id/vitals` | Get vitals history |
| POST | `/api/v1/patients/:id/vitals` | Record vitals |
| GET | `/api/v1/facilities` | List facilities |
| GET | `/api/v1/facilities/:id/inventory` | Get medicine inventory |
| GET | `/api/v1/facilities/:id/queue` | Get queue status |
| POST | `/api/v1/triage/assess` | Run AI triage (proxies to FastAPI) |
| POST | `/api/v1/triage/review` | Record doctor accept/override |
| POST | `/api/v1/referrals` | Create referral |
| POST | `/api/v1/referrals/:id/transition` | Advance referral state |
| GET | `/api/v1/appointments/patient/:id` | Patient appointments |
| POST | `/api/v1/appointments/queue-token` | Generate queue token |
| GET | `/api/v1/followups` | List follow-up tasks |
| PUT | `/api/v1/followups/:id/complete` | Complete a follow-up |
| POST | `/api/v1/sync/batch` | Batch offline sync mutations |

---

## AI Triage Service

**POST** `http://localhost:8000/triage/predict`

The service evaluates in two layers:

1. **Safety Rules (deterministic, always override ML)**
   - SpO2 < 90% → `EMERGENCY`
   - Systolic ≥ 180 or Diastolic ≥ 120 → `EMERGENCY`
   - Infant fever ≥ 38.5°C → `HIGH`

2. **XGBoost + SHAP simulation** — returns priority, confidence score, and top explanation factors

---

## Project Structure

```
sanjeevani 3.0/
├── apps/
│   ├── mobile/          # Expo React Native app
│   │   ├── app/         # Expo Router screens (4 role groups)
│   │   ├── components/  # Reusable UI components
│   │   ├── store/       # Zustand global state
│   │   ├── database/    # SQLite initialization & tables
│   │   └── sync/        # Offline mutation queue engine
│   ├── api/             # NestJS REST backend
│   │   ├── src/         # Controllers & app module
│   │   └── prisma/      # PostgreSQL schema
│   └── ai-service/      # FastAPI AI triage microservice
│       └── app/         # main.py + safety.py
├── packages/
│   └── shared-types/    # TypeScript types shared across apps
├── docker/
│   └── Dockerfile.api   # Multi-stage API build
├── docker-compose.yml
└── README.md
```

---

## Multilingual Support

The app ships with translations for:
- **English** (`en`) — default
- **मराठी** (`mr`) — Marathi
- **हिंदी** (`hi`) — Hindi

Switch language from the header "EN / MR / HI" button.

---

## License

MIT — Open source, self-hostable, zero hard SaaS dependencies.
