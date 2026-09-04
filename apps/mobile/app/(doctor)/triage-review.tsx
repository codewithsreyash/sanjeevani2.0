import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';

const PRIORITIES = ['ROUTINE', 'PRIORITY', 'HIGH', 'EMERGENCY'];

export default function TriageReviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ priority?: string; patientId?: string }>();
  const aiPriority = String(params.priority || 'HIGH');

  const [showOverride, setShowOverride] = useState(false);
  const [overridePriority, setOverridePriority] = useState(aiPriority);
  const [rationale, setRationale] = useState('');
  const [decision, setDecision] = useState<'ACCEPTED' | 'OVERRIDDEN' | null>(null);

  const handleAccept = async () => {
    try {
      await fetch('http://localhost:3002/api/v1/triage/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: `trg_${Date.now()}`,
          reviewerDoctorId: 'doc_ananya_deshmukh',
          finalPriority: aiPriority,
          isOverridden: false,
        }),
      });
    } catch (_) {
      // API not reachable — demo mode continues
    }
    setDecision('ACCEPTED');
  };

  const handleConfirmOverride = async () => {
    if (!rationale.trim()) return;
    try {
      await fetch('http://localhost:3002/api/v1/triage/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assessmentId: `trg_${Date.now()}`,
          reviewerDoctorId: 'doc_ananya_deshmukh',
          finalPriority: overridePriority,
          isOverridden: true,
          overrideReason: rationale,
        }),
      });
    } catch (_) {
      // API not reachable — demo mode continues
    }
    setShowOverride(false);
    setDecision('OVERRIDDEN');
  };

  if (decision) {
    return (
      <View style={s.root}>
        <ScreenContainer scrollable={false}>
          <Header />
          <View style={s.decisionBox}>
            <View style={[s.decisionIcon, { backgroundColor: decision === 'ACCEPTED' ? '#107C41' : '#D97706' }]}>
              {decision === 'ACCEPTED'
                ? <CheckCircle2 size={36} color="#FFF" />
                : <AlertTriangle size={36} color="#FFF" />}
            </View>
            <Text style={s.decisionTitle}>Priority {decision}</Text>
            <Text style={s.decisionSub}>
              {decision === 'ACCEPTED'
                ? `AI suggestion of "${aiPriority}" accepted and confirmed. Patient queued for consultation.`
                : `Priority overridden to "${overridePriority}" with clinical rationale recorded.`}
            </Text>
            {rationale ? (
              <View style={s.rationaleBox}>
                <Text style={s.rationaleText}>Clinical Rationale: {rationale}</Text>
              </View>
            ) : null}
            <Button
              title="Go to Consultation"
              variant="primary"
              onPress={() => router.push('/(doctor)/consultation')}
              style={{ marginTop: 24 }}
            />
          </View>
        </ScreenContainer>
        <BottomNavigation />
      </View>
    );
  }

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />
        <View style={s.body}>
          <Text style={s.title}>TRIAGE REVIEW</Text>
          <Text style={s.sub}>Patient: Ramesh Patil, 42 yrs • Token A-001</Text>

          {/* AI Recommendation */}
          <Card>
            <Text style={s.cardTitle}>AI Decision Support — Suggested Priority</Text>
            <View style={s.aiRow}>
              <Text style={s.aiPriority}>{aiPriority}</Text>
              <Badge label={aiPriority} type={aiPriority} />
            </View>
            <Text style={s.aiSub}>Confidence: 87% • Key Factors: Low SpO2 (92%), Fever (38.5°C)</Text>
            <View style={s.factorList}>
              {['Low oxygen saturation (SpO2 92%)', 'Persistent elevated fever (38.5°C, 5 days)', 'Reported shortness of breath'].map((f) => (
                <View key={f} style={s.factorRow}>
                  <View style={s.factorDot} />
                  <Text style={s.factorText}>{f}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Patient vitals snapshot */}
          <Card>
            <Text style={s.cardTitle}>Vitals Snapshot</Text>
            <View style={s.vitalsGrid}>
              {[
                { label: 'SpO2', val: '92%', alert: true },
                { label: 'Temp', val: '38.5°C', alert: true },
                { label: 'Heart Rate', val: '98 bpm', alert: false },
                { label: 'BP', val: '130/85', alert: false },
              ].map(({ label, val, alert }) => (
                <View key={label} style={[s.vitalChip, alert && s.vitalChipAlert]}>
                  <Text style={[s.vitalLabel, alert && s.vitalLabelAlert]}>{label}</Text>
                  <Text style={[s.vitalVal, alert && s.vitalValAlert]}>{val}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Actions */}
          <Button
            title="✓ Accept AI Priority Suggestion"
            variant="success"
            onPress={handleAccept}
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Override Priority with Clinical Rationale"
            variant="outline"
            onPress={() => setShowOverride(true)}
          />

          {/* Override Modal */}
          <Modal visible={showOverride} transparent animationType="slide">
            <View style={s.modalOverlay}>
              <View style={s.modalBox}>
                <View style={s.modalHeader}>
                  <Text style={s.modalTitle}>Override Priority</Text>
                  <TouchableOpacity onPress={() => setShowOverride(false)}>
                    <X size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>
                <Text style={s.modalSub}>
                  Select the correct priority level and provide your clinical rationale.
                </Text>

                {PRIORITIES.map((p) => (
                  <TouchableOpacity
                    key={p}
                    onPress={() => setOverridePriority(p)}
                    style={[s.optionRow, overridePriority === p && s.optionRowActive]}
                  >
                    <Badge label={p} type={p} />
                    {overridePriority === p && (
                      <CheckCircle2 size={18} color="#107C41" />
                    )}
                  </TouchableOpacity>
                ))}

                <Text style={s.inputLabel}>Clinical Rationale (required)</Text>
                <TextInput
                  value={rationale}
                  onChangeText={setRationale}
                  multiline
                  numberOfLines={3}
                  placeholder="Enter your clinical reasoning for the override..."
                  style={s.textArea}
                  placeholderTextColor="#94A3B8"
                />
                <Button
                  title="Confirm Override"
                  variant="danger"
                  disabled={!rationale.trim()}
                  onPress={handleConfirmOverride}
                  style={{ marginTop: 12 }}
                />
              </View>
            </View>
          </Modal>
        </View>
      </ScreenContainer>
      <BottomNavigation />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  body: { padding: 16 },
  title: { color: '#1E293B', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  sub: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  cardTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginBottom: 12 },
  aiRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  aiPriority: { color: '#1E293B', fontWeight: '900', fontSize: 36 },
  aiSub: { color: '#64748B', fontSize: 12, marginBottom: 10 },
  factorList: { marginTop: 8 },
  factorRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  factorDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#06469B', marginTop: 5, marginRight: 8 },
  factorText: { color: '#64748B', fontSize: 12, flex: 1 },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: 4 },
  vitalChip: { width: '48%', backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 10, marginBottom: 10, alignItems: 'center' },
  vitalChipAlert: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' },
  vitalLabel: { color: '#64748B', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  vitalLabelAlert: { color: '#B91C1C' },
  vitalVal: { color: '#1E293B', fontWeight: '800', fontSize: 18, marginTop: 4 },
  vitalValAlert: { color: '#DC2626' },
  decisionBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  decisionIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  decisionTitle: { color: '#1E293B', fontWeight: '800', fontSize: 24, marginBottom: 8 },
  decisionSub: { color: '#64748B', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  rationaleBox: { marginTop: 16, backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  rationaleText: { color: '#64748B', fontSize: 13 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  modalTitle: { color: '#1E293B', fontWeight: '700', fontSize: 17 },
  modalSub: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  optionRow: { padding: 12, borderRadius: 12, marginBottom: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionRowActive: { backgroundColor: '#F0FDF4', borderColor: '#107C41' },
  inputLabel: { color: '#64748B', fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 8 },
  textArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 13, color: '#1E293B', minHeight: 80, textAlignVertical: 'top' },
});
