# SANJEEVANI — Role-Based Access Control (RBAC) Specification

## 1. System Roles

The system supports four distinct top-level roles:

1. **`PATIENT`**: Citizens and their linked family dependents.
2. **`HEALTH_WORKER`**: Frontline Healthcare Personnel (ASHA, ANM, CHO).
3. **`DOCTOR`**: Medical Officers, Specialists, and Teleconsultation Clinicians.
4. **`ADMIN`**: District and Block Healthcare Administrators.

---

## 2. Comprehensive Permission Matrix

| Resource / Action | PATIENT | HEALTH_WORKER | DOCTOR | ADMIN |
|---|---|---|---|---|
| **View Own Demographics & Records** | ✅ | ✅ (Assigned) | ✅ (In-care) | ❌ |
| **Manage Family Profiles** | ✅ | ❌ | ❌ | ❌ |
| **Register New Patient** | ❌ | ✅ | ✅ | ❌ |
| **Record Vitals & Symptoms** | ❌ | ✅ | ✅ | ❌ |
| **Request AI Digital Triage** | ❌ | ✅ | ✅ | ❌ |
| **Review AI Triage (Accept/Override)**| ❌ | ❌ | ✅ | ❌ |
| **Create Clinical Encounter Notes** | ❌ | ❌ | ✅ | ❌ |
| **Order Diagnostics** | ❌ | ❌ | ✅ | ❌ |
| **Create Prescription** | ❌ | ❌ | ✅ | ❌ |
| **Create Closed-Loop Referral** | ❌ | ✅ (Escalation)| ✅ | ❌ |
| **Accept & Update Referral Status**| ❌ | ❌ | ✅ | ❌ |
| **Complete Follow-up Outreach** | ❌ | ✅ | ❌ | ❌ |
| **View Facility Queue & Booking** | ✅ | ✅ | ✅ | ✅ |
| **View Medicine Inventory Stock** | ✅ (Read-only) | ✅ | ✅ | ✅ |
| **View Facility / District Operational KPIs** | ❌ | ❌ | ❌ | ✅ |
| **View Audit Logs** | ❌ | ❌ | ❌ | ✅ |

---

## 3. Resource-Level Authorization Rules

### Patient Data Access Rule
- A **`PATIENT`** token can ONLY access records where `patientId == session.userId` or where `patientId` is linked in `PatientFamilyLink`.
- A **`HEALTH_WORKER`** can access records of patients registered within their assigned `facilityId` or explicit catchment area (`village`).
- A **`DOCTOR`** can access records of patients with an active queue token, active referral, or open encounter at their assigned `facilityId`.
- An **`ADMIN`** accesses anonymized/aggregate metrics by default. Detailed audit access requires explicit system log permissions.

---

## 4. JWT Token Payload Structure

```json
{
  "sub": "usr_987654321",
  "phone": "9876543210",
  "role": "HEALTH_WORKER",
  "workerType": "ASHA",
  "facilityId": "fac_shivapur_phc",
  "district": "PUNE",
  "iat": 1725400000,
  "exp": 1725486400
}
```

---

## 5. Development Role Switching & Quick Auth Mechanism

For rapid hackathon demonstration, the system provides a development quick-switcher on the splash/login screen:
- **Patient Demo Login:** Mobile `9876543210`, OTP `123456`
- **Health Worker (ASHA) Demo Login:** Mobile `9876543211`, OTP `123456`
- **Doctor Demo Login:** Mobile `9876543212`, OTP `123456`
- **Admin Demo Login:** Mobile `9876543213`, OTP `123456`
