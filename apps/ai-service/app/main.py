from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from app.safety import check_emergency_safety_rules

app = FastAPI(
    title="SANJEEVANI Explainable Decision Support AI Service",
    description="XGBoost + SHAP Explainable Digital Triage for Public Healthcare",
    version="1.0.0"
)

class TriageRequest(BaseModel):
    patientAge: int = 42
    symptoms: List[str] = ["Persistent Fever", "Breathing Difficulty"]
    durationDays: int = 5
    temperature: Optional[float] = 38.5
    heartRate: Optional[int] = 98
    systolicBP: Optional[int] = 130
    diastolicBP: Optional[int] = 85
    spO2: Optional[int] = 92
    weight: Optional[float] = 65.0

class TriageResponse(BaseModel):
    suggestedPriority: str
    confidence: float
    explanationFactors: List[str]
    modelVersion: str
    safetyRuleTriggered: bool

@app.get("/")
def read_root():
    return {"service": "SANJEEVANI AI Triage Service", "status": "HEALTHY"}

@app.post("/triage/predict", response_model=TriageResponse)
def predict_triage(req: TriageRequest):
    # Step 1: Check Deterministic Safety Rules
    safety_result = check_emergency_safety_rules(
        age=req.patientAge,
        spO2=req.spO2,
        temp=req.temperature,
        systolic=req.systolicBP,
        diastolic=req.diastolicBP,
        symptoms=req.symptoms
    )

    if safety_result is not None:
        return safety_result

    # Step 2: Explainable Machine Learning Decision Support (XGBoost + SHAP Simulation)
    factors = []
    priority = "ROUTINE"
    confidence = 0.85

    if req.spO2 is not None and req.spO2 <= 93:
        priority = "HIGH"
        confidence = 0.87
        factors.append(f"Low oxygen saturation (SpO2 {req.spO2}%)")

    if req.temperature is not None and req.temperature >= 38.0:
        if priority != "HIGH":
            priority = "PRIORITY"
        factors.append(f"Persistent elevated fever ({req.temperature}°C, {req.durationDays} days)")

    if "Breathing Difficulty" in req.symptoms or "Chest Pain" in req.symptoms:
        priority = "HIGH"
        confidence = 0.91
        factors.append("Reported acute respiratory or chest pain symptoms")

    if not factors:
        factors.append("All vitals and recorded symptoms within routine reference bounds")

    return {
        "suggestedPriority": priority,
        "confidence": confidence,
        "explanationFactors": factors,
        "modelVersion": "demo-xgb-shap-v1",
        "safetyRuleTriggered": False
    }
