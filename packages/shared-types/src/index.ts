export enum Role {
  PATIENT = 'PATIENT',
  HEALTH_WORKER = 'HEALTH_WORKER',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

export enum WorkerType {
  ASHA = 'ASHA',
  ANM = 'ANM',
  CHO = 'CHO',
}

export enum PriorityLevel {
  ROUTINE = 'ROUTINE',
  PRIORITY = 'PRIORITY',
  HIGH = 'HIGH',
  EMERGENCY = 'EMERGENCY',
}

export enum ReferralStatus {
  CREATED = 'CREATED',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  APPOINTMENT_SCHEDULED = 'APPOINTMENT_SCHEDULED',
  PATIENT_ARRIVED = 'PATIENT_ARRIVED',
  CONSULTATION_STARTED = 'CONSULTATION_STARTED',
  CONSULTATION_COMPLETED = 'CONSULTATION_COMPLETED',
  OUTCOME_RECORDED = 'OUTCOME_RECORDED',
  CARE_PLAN_RETURNED = 'CARE_PLAN_RETURNED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum DiagnosticStatus {
  ORDERED = 'ORDERED',
  SCHEDULED = 'SCHEDULED',
  SAMPLE_COLLECTED = 'SAMPLE_COLLECTED',
  PROCESSING = 'PROCESSING',
  REPORT_READY = 'REPORT_READY',
  REVIEWED = 'REVIEWED',
}

export enum FollowUpStatus {
  PENDING = 'PENDING',
  DUE_TODAY = 'DUE_TODAY',
  OVERDUE = 'OVERDUE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum InventoryStatus {
  AVAILABLE = 'AVAILABLE',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface UserSession {
  id: string;
  phoneNumber: string;
  role: Role;
  workerType?: WorkerType;
  facilityId?: string;
  facilityName?: string;
  district?: string;
  accessToken: string;
  refreshToken: string;
}

export interface VitalsPayload {
  patientId: string;
  temperature?: number;
  heartRate?: number;
  bloodPressure?: string;
  spO2?: number;
  weight?: number;
  recordedBy: string;
}

export interface SymptomsPayload {
  patientId: string;
  symptoms: string[];
  durationDays: number;
  description?: string;
  recordedBy: string;
}

export interface TriagePredictionRequest {
  patientAge: number;
  symptoms: string[];
  durationDays: number;
  temperature?: number;
  heartRate?: number;
  systolicBP?: number;
  diastolicBP?: number;
  spO2?: number;
  weight?: number;
}

export interface TriagePredictionResponse {
  suggestedPriority: PriorityLevel;
  confidence: number;
  explanationFactors: string[];
  modelVersion: string;
  safetyRuleTriggered: boolean;
}

export interface TriageReviewPayload {
  assessmentId: string;
  reviewerDoctorId: string;
  finalPriority: PriorityLevel;
  isOverridden: boolean;
  overrideReason?: string;
}

export interface ReferralCreatePayload {
  patientId: string;
  destinationFacilityId: string;
  reason: string;
  priority: PriorityLevel;
  encounterId?: string;
}

export interface ReferralTransitionPayload {
  referralId: string;
  toState: ReferralStatus;
  notes?: string;
  triggeredBy: string;
}

export interface SyncMutation {
  clientUuid: string;
  entityType: 'PATIENT' | 'VITAL' | 'SYMPTOM' | 'FOLLOWUP' | 'REFERRAL';
  operation: 'CREATE' | 'UPDATE';
  payload: Record<string, any>;
  createdAt: string;
}

export interface BatchSyncPayload {
  mutations: SyncMutation[];
}

export interface BatchSyncResponse {
  syncedUuids: string[];
  failedUuids: string[];
}
