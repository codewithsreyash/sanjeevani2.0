# SANJEEVANI — Open Source & Vendor-Neutral Technology Stack

Sanjeevani is strictly designed to eliminate mandatory reliance on proprietary SaaS vendors. Every component can be built, tested, and self-hosted locally or on standard Linux/Docker infrastructure.

## Component & License Audit

| Layer | Library / Tool | License | Purpose | Self-Hosting Method |
|---|---|---|---|---|
| Mobile UI | React Native / Expo | MIT | Cross-platform Android app | Open-source Expo CLI & native Gradle toolchain |
| Routing | Expo Router | MIT | File-based navigation | Embedded in mobile bundle |
| Styling | NativeWind / Tailwind CSS | MIT | Utility-first mobile styling | Compiled build time |
| Icons | Lucide React Native | ISC | Accessible UI iconography | Bundled SVG components |
| State | Zustand | MIT | Global client store | React hooks |
| Query / Cache | TanStack Query | MIT | Server state management | Client side |
| Offline DB | expo-sqlite | MIT | On-device persistent SQLite DB | Native SQLite binding |
| Key Storage | expo-secure-store | MIT | Encrypted token storage | Native Android Keychain/Keystore |
| Camera / QR | expo-camera | MIT | Scanning facility QR tokens | Native Camera API |
| Location | expo-location | MIT | Geospatial facility finder | Native Location API |
| Maps | MapLibre React Native / OpenStreetMap | BSD / ODbL | Offline-friendly mapping | Public OSM tiles / self-hosted tile server |
| Backend | NestJS | MIT | Modular REST API server | Node.js process / Docker |
| ORM | Prisma | Apache-2.0 | Type-safe PostgreSQL queries | Node.js process |
| Database | PostgreSQL 16 | PostgreSQL | Relational data persistence | Official Docker image |
| AI Service | FastAPI / XGBoost / SHAP | Apache-2.0 / BSD | Explainable triage service | Official Python Docker image |

---

## Zero Mandatory SaaS Dependencies

- **No Firebase:** Uses local SQLite + NestJS JWT authentication.
- **No AWS S3:** Local filesystem storage with generic `StorageAdapter` interface.
- **No Google Maps:** Uses OpenStreetMap / MapLibre.
- **No OpenAI / Commercial LLM APIs:** Uses deterministic rule engines + self-contained XGBoost models.
- **No EAS Hosted Build:** Supported via local `npx expo run:android` or Gradle CLI builds.
