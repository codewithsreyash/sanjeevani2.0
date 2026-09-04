# SANJEEVANI — Offline-First Architecture & Synchronization Engine

## 1. Local Database Architecture (`expo-sqlite`)

Sanjeevani uses `expo-sqlite` on the Android client to maintain a mirror of critical healthcare data for frontline health workers (ASHA/ANM/CHO).

### Local Tables Scheme
1. **`local_patients`**: Offline registered/cached patients.
2. **`local_vitals`**: Offline recorded temperature, heart rate, SpO2, BP.
3. **`local_symptoms`**: Offline recorded symptoms.
4. **`local_followups`**: Assigned outreach tasks.
5. **`sync_queue`**: Store for pending backend mutations.

---

## 2. Sync Queue Table Schema

```sql
CREATE TABLE IF NOT EXISTS sync_queue (
  id TEXT PRIMARY KEY NOT NULL,
  client_uuid TEXT NOT NULL UNIQUE,
  entity_type TEXT NOT NULL, -- PATIENT, VITAL, SYMPTOM, FOLLOWUP, REFERRAL
  operation TEXT NOT NULL,   -- CREATE, UPDATE
  payload TEXT NOT NULL,     -- JSON stringified payload
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  sync_status TEXT DEFAULT 'PENDING', -- PENDING, SYNCING, SYNCED, FAILED
  retry_count INTEGER DEFAULT 0,
  error_message TEXT
);
```

---

## 3. Synchronization Workflow & Conflict Resolution Strategy

```
[WORKER TAKES ACTION OFFLINE]
         ↓
1. Write to local_vitals / local_symptoms in SQLite
2. Write record into sync_queue (status: PENDING)
3. UI updates immediately (Optimistic Update)
         ↓
[NETWORK MONITORED BY @react-native-community/netinfo]
         ↓
[NETWORK RESTORED]
         ↓
4. Sync Engine triggers POST /sync/batch
5. Backend verifies client_uuid for idempotency:
   - If client_uuid exists in SyncEvent: Return SYNCED (Skip duplicate)
   - If new: Apply Prisma transaction, update PostgreSQL, record SyncEvent
6. On 200 OK Response:
   - Client updates local sync_queue status to SYNCED
   - Client purges synced records from local queue
   - UI displays "All records synchronized" badge
```

---

## 4. Conflict Policy (Last-Write-Wins with Server Verification)

- **Client-Generated UUIDs:** All local entities use standard v4 UUIDs before syncing.
- **Server Timestamp Precedence:** In case of concurrent modifications, server timestamp (`updatedAt`) determines the ground truth.
- **Auditing:** Any overridden field during conflict generates an `AuditLog` entry on the NestJS backend.
