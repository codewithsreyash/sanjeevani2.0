# SANJEEVANI — Database Schema & Data Model

## 1. Relational Entities (Prisma Schema Reference)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  PATIENT
  HEALTH_WORKER
  DOCTOR
  ADMIN
}

enum WorkerType {
  ASHA
  ANM
  CHO
}

enum PriorityLevel {
  ROUTINE
  PRIORITY
  HIGH
  EMERGENCY
}

enum ReferralStatus {
  CREATED
  SENT
  ACCEPTED
  APPOINTMENT_SCHEDULED
  PATIENT_ARRIVED
  CONSULTATION_STARTED
  CONSULTATION_COMPLETED
  OUTCOME_RECORDED
  CARE_PLAN_RETURNED
  COMPLETED
  CANCELLED
}

enum DiagnosticStatus {
  ORDERED
  SCHEDULED
  SAMPLE_COLLECTED
  PROCESSING
  REPORT_READY
  REVIEWED
}

enum FollowUpStatus {
  PENDING
  DUE_TODAY
  OVERDUE
  COMPLETED
  CANCELLED
}

enum InventoryStatus {
  AVAILABLE
  LOW_STOCK
  OUT_OF_STOCK
}

model User {
  id            String          @id @default(uuid())
  phoneNumber   String          @unique
  passwordHash  String?
  role          Role            @default(PATIENT)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt

  patientProfile Patient?
  workerProfile  HealthcareWorker?
  doctorProfile  Doctor?
  auditLogs      AuditLog[]
}

model Patient {
  id             String          @id @default(uuid())
  userId         String          @unique
  user           User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName       String
  dateOfBirth    DateTime
  gender         String
  village        String
  district       String
  mockAbhaId     String?         @unique
  emergencyContact String?
  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  familyHeadLinks  PatientFamilyLink[] @relation("FamilyHead")
  familyMemberLinks PatientFamilyLink[] @relation("FamilyMember")

  vitals         Vital[]
  symptoms       SymptomRecord[]
  triageRecords  TriageAssessment[]
  encounters     Encounter[]
  referrals      Referral[]
  diagnostics    DiagnosticOrder[]
  prescriptions  Prescription[]
  followUps      FollowUp[]
  appointments   Appointment[]
  queueTokens    QueueToken[]
  consents       Consent[]
}

model PatientFamilyLink {
  id             String   @id @default(uuid())
  familyHeadId   String
  familyHead     Patient  @relation("FamilyHead", fields: [familyHeadId], references: [id])
  familyMemberId String
  familyMember   Patient  @relation("FamilyMember", fields: [familyMemberId], references: [id])
  relationship   String   // Child, Spouse, Parent, Dependent
  createdAt      DateTime @default(now())
}

model HealthcareWorker {
  id            String     @id @default(uuid())
  userId        String     @unique
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName      String
  workerType    WorkerType
  employeeId    String     @unique
  facilityId    String
  facility      Facility   @relation(fields: [facilityId], references: [id])
  villageSector String
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  assignedFollowUps FollowUp[]
  triageAssessed    TriageAssessment[]
}

model Doctor {
  id            String     @id @default(uuid())
  userId        String     @unique
  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  fullName      String
  registrationNo String    @unique
  specialization String
  facilityId    String
  facility      Facility   @relation(fields: [facilityId], references: [id])
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt

  triageReviews TriageReview[]
  encounters    Encounter[]
  referralsSent Referral[]     @relation("ReferringDoctor")
  prescriptions Prescription[]
}

model Facility {
  id                  String   @id @default(uuid())
  name                String
  type                String   // Sub Centre, PHC, Rural Hospital, District Hospital
  district            String
  taluka              String
  latitude            Float
  longitude           Float
  services            String[]
  hasDoctor           Boolean  @default(true)
  approxWaitTimeMins  Int      @default(15)
  isOpen              Boolean  @default(true)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  workers             HealthcareWorker[]
  doctors             Doctor[]
  inventory           MedicineInventory[]
  referralsOut        Referral[] @relation("SourceFacility")
  referralsIn         Referral[] @relation("DestinationFacility")
  appointments        Appointment[]
  queueTokens         QueueToken[]
}

model Vital {
  id             String   @id @default(uuid())
  patientId      String
  patient        Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  temperature    Float?   // Celsius
  heartRate      Int?     // bpm
  bloodPressure  String?  // e.g. "120/80"
  spO2           Int?     // percentage
  weight         Float?   // kg
  recordedBy     String   // Worker or Doctor ID
  recordedAt     DateTime @default(now())
}

model SymptomRecord {
  id             String   @id @default(uuid())
  patientId      String
  patient        Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  symptoms       String[] // Category tags
  durationDays   Int
  description    String?
  recordedBy     String
  recordedAt     DateTime @default(now())
}

model TriageAssessment {
  id                 String        @id @default(uuid())
  patientId          String
  patient            Patient       @relation(fields: [patientId], references: [id], onDelete: Cascade)
  assessedById       String
  assessedBy         HealthcareWorker @relation(fields: [assessedById], references: [id])
  suggestedPriority  PriorityLevel
  confidence         Float
  explanationFactors String[]
  modelVersion       String
  safetyRuleTriggered Boolean      @default(false)
  createdAt          DateTime      @default(now())

  triageReview       TriageReview?
}

model TriageReview {
  id                 String           @id @default(uuid())
  assessmentId       String           @unique
  assessment         TriageAssessment @relation(fields: [assessmentId], references: [id])
  reviewerDoctorId   String
  reviewerDoctor     Doctor           @relation(fields: [reviewerDoctorId], references: [id])
  finalPriority      PriorityLevel
  isOverridden       Boolean          @default(false)
  overrideReason     String?
  reviewedAt         DateTime         @default(now())
}

model Encounter {
  id             String   @id @default(uuid())
  patientId      String
  patient        Patient  @relation(fields: [patientId], references: [id])
  doctorId       String
  doctor         Doctor   @relation(fields: [doctorId], references: [id])
  chiefComplaint String
  clinicalNotes  String
  diagnosis      String?
  status         String   // IN_PROGRESS, COMPLETED
  startedAt      DateTime @default(now())
  completedAt    DateTime?

  prescriptions  Prescription[]
  diagnostics    DiagnosticOrder[]
  referrals      Referral[]
}

model Referral {
  id                    String         @id @default(uuid())
  referralCode          String         @unique
  patientId             String
  patient               Patient        @relation(fields: [patientId], references: [id])
  sourceFacilityId      String
  sourceFacility        Facility       @relation("SourceFacility", fields: [sourceFacilityId], references: [id])
  destinationFacilityId String
  destinationFacility   Facility       @relation("DestinationFacility", fields: [destinationFacilityId], references: [id])
  referringDoctorId     String
  referringDoctor       Doctor         @relation("ReferringDoctor", fields: [referringDoctorId], references: [id])
  encounterId           String?
  encounter             Encounter?     @relation(fields: [encounterId], references: [id])
  reason                String
  priority              PriorityLevel
  currentState          ReferralStatus @default(CREATED)
  outcomeNotes          String?
  returnCarePlan        String?
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt

  events                ReferralEvent[]
}

model ReferralEvent {
  id           String         @id @default(uuid())
  referralId   String
  referral     Referral       @relation(fields: [referralId], references: [id], onDelete: Cascade)
  fromState    ReferralStatus
  toState      ReferralStatus
  triggeredBy  String         // User or Doctor ID
  notes        String?
  createdAt    DateTime       @default(now())
}

model DiagnosticOrder {
  id             String           @id @default(uuid())
  patientId      String
  patient        Patient          @relation(fields: [patientId], references: [id])
  encounterId    String?
  encounter      Encounter?       @relation(fields: [encounterId], references: [id])
  testName       String
  status         DiagnosticStatus @default(ORDERED)
  resultSummary  String?
  orderedAt      DateTime         @default(now())
  completedAt    DateTime?
}

model Medicine {
  id          String   @id @default(uuid())
  name        String
  dosageForm  String   // Tablet, Syrup, Injection
  strength    String   // 500mg, 10mg/ml
  category    String
  createdAt   DateTime @default(now())

  inventory   MedicineInventory[]
  items       PrescriptionItem[]
}

model MedicineInventory {
  id           String          @id @default(uuid())
  facilityId   String
  facility     Facility        @relation(fields: [facilityId], references: [id])
  medicineId   String
  medicine     Medicine        @relation(fields: [medicineId], references: [id])
  stockQuantity Int
  status       InventoryStatus @default(AVAILABLE)
  updatedAt    DateTime        @updatedAt
}

model Prescription {
  id          String   @id @default(uuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id])
  doctorId    String
  doctor      Doctor   @relation(fields: [doctorId], references: [id])
  encounterId String?
  encounter   Encounter? @relation(fields: [encounterId], references: [id])
  createdAt   DateTime @default(now())

  items       PrescriptionItem[]
}

model PrescriptionItem {
  id             String       @id @default(uuid())
  prescriptionId String
  prescription   Prescription @relation(fields: [prescriptionId], references: [id], onDelete: Cascade)
  medicineId     String
  medicine       Medicine     @relation(fields: [medicineId], references: [id])
  dosage         String       // e.g. "1-0-1"
  durationDays   Int
  instructions   String?
}

model FollowUp {
  id             String         @id @default(uuid())
  patientId      String
  patient        Patient        @relation(fields: [patientId], references: [id])
  assignedWorkerId String
  assignedWorker HealthcareWorker @relation(fields: [assignedWorkerId], references: [id])
  type           String         // Maternal, Child, Hypertension, Diabetes, Post-Consultation
  priority       PriorityLevel
  dueDate        DateTime
  status         FollowUpStatus @default(PENDING)
  notes          String?
  outcome        String?
  createdAt      DateTime       @default(now())
  completedAt    DateTime?
}

model Appointment {
  id          String   @id @default(uuid())
  patientId   String
  patient     Patient  @relation(fields: [patientId], references: [id])
  facilityId  String
  facility    Facility @relation(fields: [facilityId], references: [id])
  date        DateTime
  timeSlot    String
  type        String   // IN_PERSON, TELECONSULT
  status      String   // BOOKED, COMPLETED, CANCELLED
  createdAt   DateTime @default(now())
}

model QueueToken {
  id            String   @id @default(uuid())
  tokenNumber   String   // e.g. "A-017"
  patientId     String
  patient       Patient  @relation(fields: [patientId], references: [id])
  facilityId    String
  facility      Facility @relation(fields: [facilityId], references: [id])
  patientsAhead Int
  status        String   // WAITING, CALLED, COMPLETED
  createdAt     DateTime @default(now())
}

model Consent {
  id             String   @id @default(uuid())
  patientId      String
  patient        Patient  @relation(fields: [patientId], references: [id])
  purpose        String
  grantedToRole  String
  isGranted      Boolean  @default(true)
  grantedAt      DateTime @default(now())
}

model AuditLog {
  id         String   @id @default(uuid())
  userId     String?
  user       User?    @relation(fields: [userId], references: [id])
  action     String   // PATIENT_VIEW, TRIAGE_REVIEW, REFERRAL_CREATE
  entityType String
  entityId   String
  metadata   String?  // JSON stringified payload
  timestamp  DateTime @default(now())
}

model SyncEvent {
  id          String   @id @default(uuid())
  clientUuid  String   @unique
  entityType  String
  operation   String   // CREATE, UPDATE
  syncedAt    DateTime @default(now())
}
```
