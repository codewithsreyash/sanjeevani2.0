# SANJEEVANI — Healthcare Interoperability & Mock ABDM Strategy

## 1. Interoperability Architecture & Adapter Pattern

To maintain vendor-neutral, open-source principles while ensuring future alignment with India's Ayushman Bharat Digital Mission (ABDM), Sanjeevani implements an **Adapter Pattern** for all health identity, record exchange, and registry functions.

```
+-------------------------------------------------------------+
|                      SANJEEVANI CORE                        |
+-------------------------------------------------------------+
                               |
               +---------------+---------------+
               | Interfaces / Abstract Adapters|
               +---------------+---------------+
                               |
        +----------------------+----------------------+
        |                                             |
[ MockABHAAdapter ]                          [ MockConsentAdapter ]
(Synthetic ABHA ID validation)               (Mock Consent Artefact)
```

---

## 2. Mock Adapter Interfaces & FHIR Mapping Design

### ABHA Adapter (`ABHAAdapter`)
- **`generateMockABHA(patientId: string): string`**: Formats synthetic ABHA `XX-XXXX-XXXX-XXXX`.
- **`verifyABHA(abhaNumber: string): Promise<MockABHAProfile>`**: Simulates OTP verification and returns synthetic demographic bundle.

### Consent Adapter (`ConsentAdapter`)
- **`requestConsent(patientId, doctorId, scope)`**: Creates synthetic consent request.
- **`checkConsentStatus(consentId)`**: Returns active consent status.

### Health Record DTO & FHIR Alignment Strategy
While Sanjeevani relies on simplified internal JSON DTOs for mobile performance, DTO schemas map cleanly to standard FHIR R4 resources:

| Sanjeevani Entity | FHIR R4 Equivalent | Mapping Key |
|---|---|---|
| `Patient` | `Patient` | `id`, `name`, `gender`, `birthDate` |
| `Vital` | `Observation` | `code` (LOINC), `valueQuantity` |
| `TriageAssessment` | `RiskAssessment` | `prediction.outcome`, `rationale` |
| `Referral` | `ServiceRequest` / `Task` | `status`, `intent`, `requester`, `performer` |
| `Prescription` | `MedicationRequest` | `medicationCodeableConcept`, `dosageInstruction` |
