# SANJEEVANI — REST API Specification

All endpoints are hosted at `/api/v1` and accept/return JSON content unless specified.

## 1. Authentication (`/auth`)

* `POST /auth/request-otp`
  - **Body:** `{ "phoneNumber": "9876543210" }`
  - **Response:** `{ "status": "OTP_SENT", "developmentOtp": "123456" }`

* `POST /auth/verify-otp`
  - **Body:** `{ "phoneNumber": "9876543210", "otp": "123456", "role": "PATIENT" | "HEALTH_WORKER" | "DOCTOR" | "ADMIN" }`
  - **Response:** `{ "accessToken": "jwt...", "refreshToken": "jwt...", "user": { "id": "...", "role": "..." } }`

* `POST /auth/refresh`
  - **Body:** `{ "refreshToken": "jwt..." }`
  - **Response:** `{ "accessToken": "jwt..." }`

---

## 2. Patients (`/patients`)

* `GET /patients` (Query: `search`, `village`, `page`, `limit`)
* `GET /patients/:id`
* `POST /patients` (Register patient)
* `POST /patients/:id/vitals`
* `POST /patients/:id/symptoms`
* `POST /patients/:id/family-links`

---

## 3. Digital Triage & AI (`/triage`)

* `POST /triage/assess`
  - **Body:** Vitals + Symptoms payload
  - **Behavior:** Proxies call to Python FastAPI `/triage/predict` service and stores `TriageAssessment`.
  - **Response:** `{ "id": "trg_123", "suggestedPriority": "HIGH", "confidence": 0.87, "explanationFactors": ["Low oxygen saturation", "Persistent fever"], "safetyRuleTriggered": false }`

* `POST /triage/:id/review` (Doctor only)
  - **Body:** `{ "finalPriority": "HIGH", "isOverridden": true, "overrideReason": "Clinical judgment based on chest pain history" }`
  - **Response:** Updated `TriageReview` record.

---

## 4. Facilities & Appointments (`/facilities`, `/appointments`)

* `GET /facilities` (Query: `district`, `type`, `lat`, `lng`, `serviceNeeded`)
* `GET /facilities/:id`
* `POST /appointments`
* `GET /appointments/:id`
* `GET /queues/token?facilityId=...`

---

## 5. Closed-Loop Referrals (`/referrals`)

* `POST /referrals` (Create referral)
  - **Body:** `{ "patientId": "...", "destinationFacilityId": "...", "reason": "...", "priority": "HIGH" }`
* `GET /referrals/:id` (Fetch referral timeline and events)
* `POST /referrals/:id/transition`
  - **Body:** `{ "nextState": "ACCEPTED" | "PATIENT_ARRIVED" | "CONSULTATION_COMPLETED" | "CARE_PLAN_RETURNED", "notes": "..." }`

---

## 6. Diagnostics, Prescriptions & Medicines (`/diagnostics`, `/prescriptions`, `/medicines`)

* `POST /diagnostics`
* `GET /diagnostics/patient/:patientId`
* `POST /prescriptions`
* `GET /medicines/availability?facilityId=...`

---

## 7. Follow-Ups & Offline Sync (`/followups`, `/sync`)

* `GET /followups/worker/:workerId`
* `PATCH /followups/:id`
* `POST /sync/batch` (Durable local mutation sync)
  - **Body:** `{ "mutations": [ { "clientUuid": "...", "entityType": "VITAL", "operation": "CREATE", "payload": { ... } } ] }`
  - **Response:** `{ "synced": ["clientUuid_1"], "failed": [] }`
