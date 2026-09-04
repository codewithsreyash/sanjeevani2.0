# SANJEEVANI — System Architecture Specification

## 1. System Topology

```
+-------------------------------------------------------------------------+
|                         SANJEEVANI MOBILE APP                           |
|      (React Native / Expo / Expo Router / NativeWind / Zustand)         |
|                                                                         |
|  +-----------------------+                    +----------------------+  |
|  | Local SQLite DB       |                    | Sync Engine          |  |
|  | (expo-sqlite)         | <----------------> | (Mutation Queue)     |  |
|  +-----------------------+                    +----------------------+  |
+-------------------------------------------------------------------------+
                                    |
                                    | HTTPS / REST API (JWT Tokens)
                                    v
+-------------------------------------------------------------------------+
|                           NESTJS BACKEND API                            |
|             (Node.js / Express / Prisma ORM / NestJS RBAC)              |
|                                                                         |
|  +---------------+  +------------------+  +--------------------------+  |
|  | Auth & RBAC   |  | Care Continuum   |  | Referral State Machine   |  |
|  +---------------+  +------------------+  +--------------------------+  |
|  | Sync Handler  |  | Inventory Engine |  | Audit Logger             |  |
|  +---------------+  +------------------+  +--------------------------+  |
+-------------------------------------------------------------------------+
            |                                         |
            | Database Queries                        | HTTP Post /triage/predict
            v                                         v
+-----------------------+                 +-------------------------------+
|  POSTGRESQL DATABASE  |                 |    FASTAPI AI TRIAGE SERVICE  |
|  (Relational Storage) |                 | (Python / XGBoost / SHAP)     |
+-----------------------+                 +-------------------------------+
```

---

## 2. Component Layering

### Mobile Application (`apps/mobile`)
- **App Directory (`app/`):** File-based routing powered by Expo Router.
- **Features (`features/`):** Domain modules containing UI screens, components, custom hooks, and state management (e.g. `features/triage`, `features/referrals`, `features/offline`).
- **Database & Sync (`database/`, `sync/`):** Local SQLite initialization, tables, mutation queue processing, connectivity listener, conflict resolution.
- **Global Store (`store/`):** Zustand stores for auth session, active role, current patient context, network status, offline queue counter.
- **Design System (`components/ui/`):** Reusable NativeWind primitives (Button, Card, Badge, Modal, Input, Header, ScreenContainer, OfflineBanner).

### Backend REST Service (`apps/api`)
- **Modules Structure:** Modular NestJS architecture (`auth`, `users`, `patients`, `workers`, `doctors`, `facilities`, `appointments`, `triage`, `referrals`, `diagnostics`, `prescriptions`, `medicines`, `followups`, `sync`, `audit`).
- **Data Access:** Prisma ORM connected to PostgreSQL.
- **Security & Authorization:** Passport JWT strategy, NestJS `RolesGuard` and `@Roles()` decorators, resource ownership checks.

### Decision Support Microservice (`apps/ai-service`)
- **Tech Stack:** Python 3.11, FastAPI, Uvicorn, XGBoost, SHAP.
- **Safety Rule Layer:** Hardcoded clinical red flags (e.g., SpO2 < 90% forces IMMEDIATE EMERGENCY status before model prediction).
- **Explainability Engine:** TreeSHAP feature attribution returning top 3 contributing factors to the priority score.

---

## 3. Technology Selection Rationale (Vendor-Neutral & Open-Source)

| Component | Selected Technology | Open-Source License | Hostability / Infrastructure |
|---|---|---|---|
| Mobile Framework | Expo / React Native | MIT | Self-hosted local Android build / APK via Gradle |
| Mobile DB | `expo-sqlite` | MIT | Embedded on device |
| Mobile Map | MapLibre React Native / OSM | BSD / ODbL | Self-hosted tile server or public OSM tiles |
| Backend Framework | NestJS (TypeScript) | MIT | Generic Linux server / Docker container |
| ORM | Prisma ORM | Apache-2.0 | Runs within Node process |
| Database | PostgreSQL 16 | PostgreSQL License | Local Docker / Bare-metal Linux |
| AI Service | FastAPI + XGBoost + SHAP | Apache-2.0 / BSD | Self-hosted Python container |

---

## 4. Environment Setup & Deployment Topology

### Containerization Strategy (`docker-compose.yml`)
1. **`db` service:** PostgreSQL 16 image with healthcheck.
2. **`api` service:** NestJS Node container listening on port 3000.
3. **`ai-service` service:** Python FastAPI container listening on port 8000.
4. **Local Mobile Dev:** Expo Dev Server with local Android emulator or physical device via ADB USB/WiFi.
