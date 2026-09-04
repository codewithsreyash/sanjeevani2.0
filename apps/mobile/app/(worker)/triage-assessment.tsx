import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ShieldAlert, AlertTriangle, Stethoscope, ArrowRight, Info, HelpCircle, CheckCircle2 } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { enqueueOfflineMutation } from '../../sync/syncEngine';

const API_BASE = 'http://localhost:3002/api/v1';

const PRIORITY_COLORS: Record<string, string> = {
  ROUTINE: '#064E3B',
  PRIORITY: '#92400E',
  HIGH: '#7C2D12',
  EMERGENCY: '#7F1D1D',
};

interface TriageResult {
  suggestedPriority: string;
  confidence: number;
  explanationFactors: string[];
  modelVersion: string;
  safetyRuleTriggered: boolean;
}

function getFallbackResult(spO2: number, temp: number, symptoms: string[]): TriageResult {
  if (spO2 < 90) {
    return {
      suggestedPriority: 'EMERGENCY',
      confidence: 1.0,
      explanationFactors: [`CRITICAL: Oxygen saturation below 90% (${spO2}%) — Severe Hypoxia`],
      modelVersion: 'safety-rule-local-v1',
      safetyRuleTriggered: true,
    };
  }

  const factors: string[] = [];
  let priority = 'ROUTINE';
  let confidence = 0.85;

  if (spO2 <= 93) {
    priority = 'HIGH';
    confidence = 0.87;
    factors.push(`Low oxygen saturation (SpO2 ${spO2}%)`);
  }
  if (temp >= 38.0) {
    if (priority !== 'HIGH') priority = 'PRIORITY';
    factors.push(`Persistent elevated fever (${temp}°C)`);
  }
  if (symptoms.includes('Shortness of Breath') || symptoms.includes('Chest Pain')) {
    priority = 'HIGH';
    confidence = 0.91;
    factors.push('Reported respiratory or chest pain symptoms');
  }
  if (factors.length === 0) {
    factors.push('All vitals and symptoms within routine reference bounds');
  }

  return { suggestedPriority: priority, confidence, explanationFactors: factors, modelVersion: 'offline-rules-v1', safetyRuleTriggered: false };
}

export default function TriageAssessmentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const spO2 = parseFloat(String(params.spO2 || '92'));
  const temp = parseFloat(String(params.temp || '38.5'));
  const heartRate = parseInt(String(params.heartRate || '98'));
  const systolic = parseInt(String(params.systolic || '130'));
  const diastolic = parseInt(String(params.diastolic || '85'));
  const symptomsParam = String(params.symptoms || 'Fever,Shortness of Breath');
  const symptoms = symptomsParam.split(',').filter(Boolean);
  const duration = parseInt(String(params.duration || '5'));

  const [result, setResult] = useState<TriageResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [forwarded, setForwarded] = useState(false);

  useEffect(() => {
    const runTriage = async () => {
      try {
        const response = await fetch(`${API_BASE}/triage/assess`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patientAge: 42,
            symptoms,
            durationDays: duration,
            temperature: temp,
            heartRate,
            systolicBP: systolic,
            diastolicBP: diastolic,
            spO2,
          }),
        });
        const data = await response.json();
        setResult(data);
      } catch (_err) {
        // Offline: use local fallback
        setResult(getFallbackResult(spO2, temp, symptoms));
      } finally {
        setLoading(false);
      }
    };

    runTriage();
  }, []);

  const handleForwardToDoctor = async () => {
    if (!result) return;

    await enqueueOfflineMutation({
      clientUuid: `triage_${Date.now()}`,
      entityType: 'VITAL',
      operation: 'CREATE',
      payload: {
        patientId: 'pat_ramesh_patil',
        assessedById: 'wrk_sunita_more',
        suggestedPriority: result.suggestedPriority,
        confidence: result.confidence,
        explanationFactors: result.explanationFactors,
        modelVersion: result.modelVersion,
        safetyRuleTriggered: result.safetyRuleTriggered,
        forwardedAt: new Date().toISOString(),
      },
    });

    setForwarded(true);
    setTimeout(() => router.push('/(worker)/dashboard'), 1500);
  };

  if (loading) {
    return (
      <ScreenContainer scrollable={false}>
        <Header />
        <View style={s.centered}>
          <ActivityIndicator size="large" color="#06469B" />
          <Text style={s.loadingText}>Running Digital Triage Decision Support...</Text>
          <Text style={s.loadingSubText}>Evaluating safety rules & XGBoost model</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (forwarded) {
    return (
      <ScreenContainer scrollable={false}>
        <Header />
        <View style={s.centered}>
          <View style={s.successIcon}>
            <CheckCircle2 size={40} color="#FFFFFF" />
          </View>
          <Text style={s.successTitle}>Forwarded to Doctor Queue</Text>
          <Text style={s.successSub}>Patient prioritised. Doctor review required before treatment.</Text>
        </View>
      </ScreenContainer>
    );
  }

  if (!result) return null;

  const bgColor = PRIORITY_COLORS[result.suggestedPriority] || '#1E293B';
  const pctConf = Math.round(result.confidence * 100);

  return (
    <ScreenContainer scrollable={true}>
      <Header />
      <View style={s.body}>
        {/* AI disclaimer */}
        <View style={s.disclaimerCard}>
          <Info size={16} color="#06469B" />
          <Text style={s.disclaimerText}>
            DIGITAL TRIAGE — DECISION SUPPORT (PROTOTYPE){result.safetyRuleTriggered ? ' — SAFETY RULE TRIGGERED' : ''}
          </Text>
        </View>

        {/* Priority card */}
        <View style={[s.priorityCard, { backgroundColor: bgColor }]}>
          <Text style={s.priorityTag}>SUGGESTED PRIORITY LEVEL</Text>
          <View style={s.priorityRow}>
            <Text style={s.priorityValue}>{result.suggestedPriority}</Text>
            <View style={s.confidenceBadge}>
              <Text style={s.confidenceText}>{pctConf}% Confidence</Text>
            </View>
          </View>
          <Text style={s.priorityMeta}>
            Model: {result.modelVersion}
            {result.safetyRuleTriggered ? ' • ⚠ Safety Rules Override' : ' • Safety Rules Evaluated'}
          </Text>
        </View>

        {/* SHAP explanation */}
        <Card>
          <View style={s.cardHeader}>
            <Text style={s.cardTitle}>Explanation Factors (SHAP)</Text>
            <HelpCircle size={16} color="#94A3B8" />
          </View>
          {result.explanationFactors.map((factor, idx) => {
            const isEmergency = factor.includes('CRITICAL') || factor.includes('RED-FLAG');
            return (
              <View
                key={idx}
                style={[
                  s.shapRow,
                  {
                    backgroundColor: isEmergency ? '#FEF2F2' : idx === 0 ? '#FEF2F2' : idx === 1 ? '#FFFBEB' : '#EFF6FF',
                    borderColor: isEmergency ? '#FCA5A5' : idx === 0 ? '#FCA5A5' : idx === 1 ? '#FCD34D' : '#BFDBFE',
                  },
                ]}
              >
                <View style={s.shapLeft}>
                  {isEmergency || idx === 0 ? (
                    <ShieldAlert size={16} color={isEmergency ? '#DC2626' : '#B91C1C'} />
                  ) : idx === 1 ? (
                    <AlertTriangle size={16} color="#D97706" />
                  ) : (
                    <Info size={16} color="#1D4ED8" />
                  )}
                  <Text style={s.shapLabel}>{factor}</Text>
                </View>
              </View>
            );
          })}
        </Card>

        {/* Vital summary */}
        <Card>
          <Text style={s.cardTitle}>Recorded Vitals Summary</Text>
          <View style={s.vitalsGrid}>
            {[
              { label: 'SpO2', val: `${spO2}%`, alert: spO2 < 93 },
              { label: 'Temp', val: `${temp}°C`, alert: temp >= 38 },
              { label: 'Heart Rate', val: `${heartRate} bpm`, alert: heartRate > 100 },
              { label: 'BP', val: `${systolic}/${diastolic}`, alert: systolic >= 140 },
            ].map(({ label, val, alert }) => (
              <View key={label} style={[s.vitalChip, alert && s.vitalChipAlert]}>
                <Text style={[s.vitalLabel, alert && s.vitalLabelAlert]}>{label}</Text>
                <Text style={[s.vitalVal, alert && s.vitalValAlert]}>{val}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Doctor review notice */}
        <View style={s.reviewCard}>
          <View style={s.reviewHeader}>
            <Stethoscope size={18} color="#10A9CF" />
            <Text style={s.reviewTitle}>Healthcare Professional Review Required</Text>
          </View>
          <Text style={s.reviewDesc}>
            AI priority suggestions must be reviewed and accepted or overridden by a licensed doctor before final treatment decisions are made.
          </Text>
          <Button
            title="Forward to Doctor Priority Queue"
            variant="secondary"
            icon={<ArrowRight size={18} color="#FFFFFF" />}
            onPress={handleForwardToDoctor}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  body: { padding: 16 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  loadingText: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginTop: 16, textAlign: 'center' },
  loadingSubText: { color: '#64748B', fontSize: 12, marginTop: 6, textAlign: 'center' },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#107C41', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { color: '#1E293B', fontWeight: '800', fontSize: 22, marginBottom: 8 },
  successSub: { color: '#64748B', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  disclaimerCard: { backgroundColor: '#EFF6FF', borderWidth: 1, borderColor: '#BFDBFE', padding: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  disclaimerText: { color: '#06469B', fontSize: 11, fontWeight: '700', marginLeft: 8, flex: 1 },
  priorityCard: { padding: 20, borderRadius: 24, marginBottom: 16 },
  priorityTag: { color: '#FDE68A', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  priorityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  priorityValue: { color: '#FFFFFF', fontWeight: '900', fontSize: 40 },
  confidenceBadge: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  confidenceText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  priorityMeta: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  cardTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15 },
  shapRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 10 },
  shapLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  shapLabel: { fontSize: 12, fontWeight: '600', color: '#1E293B', marginLeft: 10, flex: 1 },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 8 },
  vitalChip: { width: '48%', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 10, marginBottom: 10, alignItems: 'center' },
  vitalChipAlert: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' },
  vitalLabel: { color: '#64748B', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  vitalLabelAlert: { color: '#B91C1C' },
  vitalVal: { color: '#1E293B', fontWeight: '800', fontSize: 18, marginTop: 4 },
  vitalValAlert: { color: '#DC2626' },
  reviewCard: { backgroundColor: '#0F172A', padding: 16, borderRadius: 24, marginTop: 4 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  reviewTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 14, marginLeft: 8 },
  reviewDesc: { color: '#94A3B8', fontSize: 12, marginBottom: 16, lineHeight: 18 },
});
