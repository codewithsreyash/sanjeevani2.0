# SANJEEVANI — AI Safety & Clinical Decision Support Protocol

## 1. Principles of Human-Controlled Healthcare AI

1. **Decision Support, Not Autonomous Diagnosis:** The AI model ONLY outputs priority suggestions and risk scoring to assist workflow triage.
2. **Explicit Safety-Rule Layer:** Machine learning (XGBoost) is SECONDARY to deterministic red-flag safety rules.
3. **Mandatory Clinician Review:** No triage recommendation can alter care pathways without explicit Doctor/CHO review.
4. **Transparent Explainability:** Every priority output includes top SHAP feature attributions in human-readable terms.
5. **Full Audit Logging:** All overrides require a rationale and are stored immutably in system logs.

---

## 2. Red-Flag Deterministic Safety Layer

Before calling the XGBoost model, input vitals and symptoms pass through deterministic evaluation:

```python
def check_emergency_safety_rules(vitals, symptoms):
    # Rule 1: Severe Hypoxia
    if vitals.spO2 is not None and vitals.spO2 < 90:
        return {
            "suggestedPriority": "EMERGENCY",
            "confidence": 1.0,
            "explanationFactors": ["CRITICAL: Oxygen Saturation below 90% (Severe Hypoxia)"],
            "safetyRuleTriggered": True
        }
    # Rule 2: Hypertensive Crisis
    if vitals.systolic >= 180 or vitals.diastolic >= 120:
        return {
            "suggestedPriority": "EMERGENCY",
            "confidence": 1.0,
            "explanationFactors": ["CRITICAL: Hypertensive Crisis threshold exceeded"],
            "safetyRuleTriggered": True
        }
    # Rule 3: High Fever in Neonate/Infant
    if vitals.ageYears < 1 and vitals.temperature >= 38.5:
        return {
            "suggestedPriority": "HIGH",
            "confidence": 1.0,
            "explanationFactors": ["CRITICAL: Infant fever requiring immediate pediatric evaluation"],
            "safetyRuleTriggered": True
        }
    return None
```

---

## 3. XGBoost Priority Model & SHAP Attribution

If no emergency rule triggers, the normalized features (age, symptoms vector, vitals delta) are passed into the XGBoost classifier.

```
[Normalized Inputs] ---> [XGBoost Model] ---> [Predicted Class: ROUTINE / PRIORITY / HIGH]
                                |
                                v
                        [SHAP TreeExplainer] ---> [Top Factors: "SpO2 93%", "Fever 4 days"]
```

---

## 4. Clinician Accept / Override Workflow UI UI

The Doctor app presents the triage result with full transparency:

```
+-------------------------------------------------------------+
| DIGITAL TRIAGE — DECISION SUPPORT                           |
| Suggested Priority: HIGH (87% confidence)                   |
| Factors:                                                    |
|  • Low oxygen saturation (92%)                              |
|  • Persistent fever (5 days)                                |
|                                                             |
| Status: Healthcare Professional Review Required             |
|                                                             |
|  [ ACCEPT PRIORITY (HIGH) ]   [ OVERRIDE PRIORITY ]         |
+-------------------------------------------------------------+
```

If **OVERRIDE PRIORITY** is pressed:
- A dropdown/text input prompts for **Reason for Override** (e.g., "Patient reports history of asthma, setting priority to EMERGENCY").
- The override, doctor ID, reason, and original AI recommendation are permanently saved in `TriageReview`.
