from typing import Optional, Dict, Any, List

def check_emergency_safety_rules(
    age: int,
    spO2: Optional[int],
    temp: Optional[float],
    systolic: Optional[int],
    diastolic: Optional[int],
    symptoms: List[str]
) -> Optional[Dict[str, Any]]:
    """
    Evaluates deterministic red-flag clinical conditions before passing inputs to XGBoost ML model.
    Hardcoded safety rules supersede machine learning predictions for critical cases.
    """
    factors = []

    # Rule 1: Severe Hypoxia
    if spO2 is not None and spO2 < 90:
        factors.append(f"CRITICAL RED-FLAG: Oxygen saturation below 90% ({spO2}%) — Severe Hypoxia")
        return {
            "suggestedPriority": "EMERGENCY",
            "confidence": 1.0,
            "explanationFactors": factors,
            "safetyRuleTriggered": True,
            "modelVersion": "safety-rule-layer-v1"
        }

    # Rule 2: Hypertensive Crisis
    if (systolic is not None and systolic >= 180) or (diastolic is not None and diastolic >= 120):
        factors.append(f"CRITICAL RED-FLAG: Hypertensive crisis threshold exceeded ({systolic}/{diastolic} mmHg)")
        return {
            "suggestedPriority": "EMERGENCY",
            "confidence": 1.0,
            "explanationFactors": factors,
            "safetyRuleTriggered": True,
            "modelVersion": "safety-rule-layer-v1"
        }

    # Rule 3: High Fever in Infant (< 1 year)
    if age < 1 and temp is not None and temp >= 38.5:
        factors.append(f"CRITICAL RED-FLAG: Infant fever ({temp}°C) requiring immediate pediatric evaluation")
        return {
            "suggestedPriority": "HIGH",
            "confidence": 1.0,
            "explanationFactors": factors,
            "safetyRuleTriggered": True,
            "modelVersion": "safety-rule-layer-v1"
        }

    return None
