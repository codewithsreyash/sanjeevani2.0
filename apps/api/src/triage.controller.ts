import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

// In Docker Compose, the AI service is accessible via its service name
// In local dev (no Docker), it runs on localhost:8000
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

@Controller('triage')
export class TriageController {
  @Post('assess')
  async assessTriage(@Body() payload: any) {
    try {
      // Proxy request to Python FastAPI explainable decision support service
      const aiResponse = await axios.post(
        `${AI_SERVICE_URL}/triage/predict`,
        {
          patientAge: payload.patientAge || 42,
          symptoms: payload.symptoms || [],
          durationDays: payload.durationDays || 1,
          temperature: payload.temperature,
          heartRate: payload.heartRate,
          systolicBP: payload.systolicBP,
          diastolicBP: payload.diastolicBP,
          spO2: payload.spO2,
          weight: payload.weight,
        },
        { timeout: 5000 }
      );
      return aiResponse.data;
    } catch (_err) {
      console.log('[TriageController] AI service unavailable — using fallback evaluation');

      // Deterministic fallback matching the safety rule layer logic
      const spO2 = payload.spO2;
      const temp = payload.temperature;
      const systolic = payload.systolicBP;
      const diastolic = payload.diastolicBP;
      const symptoms: string[] = payload.symptoms || [];

      // Safety rule: severe hypoxia
      if (spO2 !== undefined && spO2 < 90) {
        return {
          suggestedPriority: 'EMERGENCY',
          confidence: 1.0,
          explanationFactors: [`CRITICAL RED-FLAG: Oxygen saturation below 90% (${spO2}%) — Severe Hypoxia`],
          modelVersion: 'safety-rule-fallback-v1',
          safetyRuleTriggered: true,
        };
      }

      // Safety rule: hypertensive crisis
      if ((systolic !== undefined && systolic >= 180) || (diastolic !== undefined && diastolic >= 120)) {
        return {
          suggestedPriority: 'EMERGENCY',
          confidence: 1.0,
          explanationFactors: [`CRITICAL RED-FLAG: Hypertensive crisis (${systolic}/${diastolic} mmHg)`],
          modelVersion: 'safety-rule-fallback-v1',
          safetyRuleTriggered: true,
        };
      }

      const factors: string[] = [];
      let priority = 'ROUTINE';
      let confidence = 0.85;

      if (spO2 !== undefined && spO2 <= 93) {
        priority = 'HIGH';
        confidence = 0.87;
        factors.push(`Low oxygen saturation (SpO2 ${spO2}%)`);
      }
      if (temp !== undefined && temp >= 38.0) {
        if (priority !== 'HIGH') priority = 'PRIORITY';
        factors.push(`Persistent elevated fever (${temp}°C, ${payload.durationDays || 1} days)`);
      }
      if (symptoms.includes('Breathing Difficulty') || symptoms.includes('Chest Pain')) {
        priority = 'HIGH';
        confidence = 0.91;
        factors.push('Reported acute respiratory or chest pain symptoms');
      }

      if (factors.length === 0) {
        factors.push('All vitals and symptoms within routine reference bounds');
      }

      return {
        suggestedPriority: priority,
        confidence,
        explanationFactors: factors,
        modelVersion: 'demo-xgb-fallback-v1',
        safetyRuleTriggered: false,
      };
    }
  }

  @Post('review')
  async reviewTriage(@Body() body: any) {
    return {
      status: 'REVIEW_RECORDED',
      assessmentId: body.assessmentId || `trg_${Date.now()}`,
      reviewerDoctorId: body.reviewerDoctorId || 'doc_ananya_deshmukh',
      finalPriority: body.finalPriority || 'HIGH',
      isOverridden: body.isOverridden || false,
      overrideReason: body.overrideReason || null,
      reviewedAt: new Date().toISOString(),
    };
  }
}
