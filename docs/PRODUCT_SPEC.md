# SANJEEVANI — Product Specification & Vision

**Problem Statement ID:** 26133  
**Title:** Accessibility and Quality of Public Healthcare Services, particularly in Rural and Underserved Areas  
**Organization Context:** Government of Maharashtra  
**Domain:** MedTech / BioTech / HealthTech  
**Primary Product:** Android-First Mobile Healthcare Application (Expo / React Native)

---

## 1. Product Vision

Sanjeevani is an offline-first, role-based public healthcare coordination platform designed to bridge rural health disparities across Maharashtra. It unifies Patients, Frontline Health Workers (ASHA/ANM/CHO), Doctors, and Healthcare Administrators under a single continuous care continuum.

### Key Objectives
* **Eliminate Unnecessary Travel & Waiting:** Direct patients to facilities with available doctors, diagnostics, and medicines.
* **Closed-Loop Referrals:** Ensure zero lost referrals between Sub Centres, PHCs, Rural Hospitals, and District Hospitals.
* **Offline Empowerment for Frontline Workers:** Allow ASHA/ANM/CHO workers to register patients, record vitals, conduct triage, and complete follow-ups without active internet.
* **Human-Controlled Decision Support:** Provide explainable AI triage (XGBoost + SHAP) with mandatory clinician verification and override auditing.
* **Continuity of Care:** Maintain unified, cross-facility patient history accessible across stages of care.

---

## 2. Core Care Journey

```
[PATIENT]
   ↓
[REGISTRATION & IDENTIFICATION] (Self or ASHA-assisted)
   ↓
[SYMPTOMS & VITALS RECORDING] (Offline capable)
   ↓
[DIGITAL TRIAGE / RISK ASSESSMENT] (Safety-rules + XGBoost + SHAP)
   ↓
[HEALTHCARE PROFESSIONAL REVIEW] (Accept / Override with reason)
   ↓
[APPOINTMENT / TELECONSULTATION / QUEUE]
   ↓
[DOCTOR CONSULTATION & ENCOUNTER]
   ↓
[LOCAL TREATMENT]  <--->  [CLOSED-LOOP REFERRAL] (Sub-Centre → PHC → RH → DH)
   ↓                                   ↓
[DIAGNOSTICS & PRESCRIPTION WITH LIVE STOCK CHECK]
   ↓
[COMMUNITY FOLLOW-UP TASK] (Assigned to ASHA/ANM)
   ↓
[OUTCOME RECORDED & CONTINUOUS HEALTH HISTORY UPDATED]
```

---

## 3. User Personas & Role Architecture

| Role | Persona | Key Workflows & Permissions |
|---|---|---|
| **PATIENT** | Ramesh Patil (Rural Citizen) | Self-registration, family profiles, view care timeline, facility finder, queue token, appointment booking, referral tracking, consent management, records view. |
| **HEALTH_WORKER** | Sunita More (ASHA / ANM / CHO) | Assigned community dashboard, offline patient registration, vitals & symptoms capture, assisted triage, assisted teleconsultation, offline follow-up outreach, sync status. |
| **DOCTOR** | Dr. Ananya Deshmukh (PHC/RH Doctor) | Priority queue, review AI triage suggestions (accept/override), clinical notes, prescriptions with stock check, diagnostic orders, closed-loop referrals, teleconsultations. |
| **ADMIN** | District Health Administrator | Mobile admin dashboard, facility load, stock alerts, referral loop completion metrics, high-risk follow-up tracking, audit logs. |

---

## 4. Key Non-Functional & Technical Principles

1. **Android-First UI:** Optimized for 360px–430px screens, single-hand touch targets (≥48px), high contrast, Noto Sans Devanagari typography.
2. **Offline-First Storage:** Local SQLite database with a durable mutation sync queue, optimistic UI, auto-reconnect sync.
3. **Open-Source & Self-Hostable:** Zero hard SaaS dependencies (No Firebase, AWS S3, Google Maps, OpenAI). Stack relies on NestJS, PostgreSQL, MapLibre/OSM, XGBoost, Docker.
4. **Human-in-the-Loop AI:** Mandatory professional review of all triage recommendations. Explicit safety rule layer overriding ML predictions for critical red flags.

---

## 5. Prioritization Matrix

### MUST HAVE (MVP Phase)
* Expo / React Native Android shell with Expo Router & NativeWind.
* Role-based Authentication & JWT Session handling with Demo login.
* Multilingual support (English, Marathi, Hindi).
* Patient Care Journey UI & Carousel navigation.
* Health Worker Vitals/Symptoms capture & Offline SQLite Sync Queue.
* XGBoost + SHAP FastAPI Triage Service with Doctor Accept/Override workflow.
* Closed-loop Referral state machine & progress timeline.
* Prescription & Medicine Inventory availability lookup.
* Mobile Admin Dashboard & Operational KPI view.

### SHOULD HAVE
* Synthetic Facility Finder with intelligent sorting (distance, doctor, stock).
* Diagnostic Order & Result lifecycle.
* QR Code scanning for instant facility queue registration.
* Community Follow-up Task Engine for ASHA workers.

### OPTIONAL / LATER PHASE
* Local voice transcription (Whisper / whisper.cpp).
* MapLibre interactive map tiles.
* Dynamic AI translation (IndicTrans2).
