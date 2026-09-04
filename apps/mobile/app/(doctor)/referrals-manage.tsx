import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GitPullRequest, ChevronRight, ArrowRight, X, CheckCircle2 } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';

interface Referral {
  id: string;
  patientName: string;
  fromFacility: string;
  toFacility: string;
  status: string;
  priority: string;
  date: string;
  reason: string;
}

const INITIAL_REFERRALS: Referral[] = [
  {
    id: 'ref_1',
    patientName: 'Ramesh Patil',
    fromFacility: 'Shivapur PHC',
    toFacility: 'Mulshi Rural Hospital',
    status: 'APPOINTMENT_SCHEDULED',
    priority: 'HIGH',
    date: '04 Sep 2026',
    reason: 'Persistent fever + SpO2 92% — specialist review',
  },
  {
    id: 'ref_2',
    patientName: 'Meena Shinde',
    fromFacility: 'Shivapur PHC',
    toFacility: 'Pune District Hospital',
    status: 'SENT',
    priority: 'PRIORITY',
    date: '03 Sep 2026',
    reason: 'Uncontrolled hypertension requiring cardiology consult',
  },
  {
    id: 'ref_3',
    patientName: 'Kaveri Gaikwad',
    fromFacility: 'Shivapur PHC',
    toFacility: 'Mulshi Rural Hospital',
    status: 'OUTCOME_RECORDED',
    priority: 'EMERGENCY',
    date: '02 Sep 2026',
    reason: 'Acute respiratory distress — SpO2 86%',
  },
];

const NEXT_STATES: Record<string, string | null> = {
  CREATED: 'SENT',
  SENT: 'ACCEPTED',
  ACCEPTED: 'APPOINTMENT_SCHEDULED',
  APPOINTMENT_SCHEDULED: 'PATIENT_ARRIVED',
  PATIENT_ARRIVED: 'CONSULTATION_STARTED',
  CONSULTATION_STARTED: 'CONSULTATION_COMPLETED',
  CONSULTATION_COMPLETED: 'OUTCOME_RECORDED',
  OUTCOME_RECORDED: 'CARE_PLAN_RETURNED',
  CARE_PLAN_RETURNED: 'COMPLETED',
  COMPLETED: null,
  OUTCOME_RECORDED_COMPLETE: null,
};

export default function ReferralsManageScreen() {
  const router = useRouter();
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [selectedRef, setSelectedRef] = useState<Referral | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const handleTransition = async (ref: Referral) => {
    const nextState = NEXT_STATES[ref.status];
    if (!nextState) return;

    setTransitioning(true);
    try {
      await fetch(`http://localhost:3002/api/v1/referrals/${ref.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nextState, notes: `Transitioned by Dr. Ananya Deshmukh` }),
      });
    } catch (_) {
      // demo mode — update locally
    }

    setReferrals((prev) =>
      prev.map((r) => (r.id === ref.id ? { ...r, status: nextState } : r))
    );
    setTransitioning(false);
    setSelectedRef(null);
  };

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />
        <View style={s.body}>
          <Text style={s.title}>REFERRAL MANAGEMENT</Text>
          <Text style={s.sub}>Closed-loop referrals from Shivapur PHC</Text>

          {/* Summary stats */}
          <View style={s.statsRow}>
            {[
              ['Active', String(referrals.filter((r) => !['COMPLETED', 'CANCELLED', 'OUTCOME_RECORDED'].includes(r.status)).length), '#06469B'],
              ['Completed', String(referrals.filter((r) => ['COMPLETED', 'OUTCOME_RECORDED'].includes(r.status)).length), '#107C41'],
              ['Total', String(referrals.length), '#10A9CF'],
            ].map(([label, val, color]) => (
              <View key={label} style={s.statCard}>
                <Text style={[s.statVal, { color }]}>{val}</Text>
                <Text style={s.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {referrals.map((ref) => {
            const nextState = NEXT_STATES[ref.status];
            return (
              <Card key={ref.id}>
                <View style={s.refHeader}>
                  <View style={s.refLeft}>
                    <GitPullRequest size={18} color="#06469B" />
                    <Text style={s.patName}>{ref.patientName}</Text>
                  </View>
                  <Badge label={ref.priority} type={ref.priority} size="sm" />
                </View>

                <View style={s.routeBox}>
                  <Text style={s.routeFrom}>{ref.fromFacility}</Text>
                  <ArrowRight size={14} color="#06469B" />
                  <Text style={s.routeTo}>{ref.toFacility}</Text>
                </View>

                <Text style={s.reasonText}>{ref.reason}</Text>

                <View style={s.refFooter}>
                  <Text style={s.refDate}>{ref.date}</Text>
                  <Badge label={ref.status.replace(/_/g, ' ')} type={ref.status} size="sm" />
                </View>

                {nextState && (
                  <TouchableOpacity
                    onPress={() => setSelectedRef(ref)}
                    style={s.advanceBtn}
                  >
                    <Text style={s.advanceBtnText}>Advance → {nextState.replace(/_/g, ' ')}</Text>
                    <ChevronRight size={14} color="#06469B" />
                  </TouchableOpacity>
                )}
              </Card>
            );
          })}
        </View>
      </ScreenContainer>
      <BottomNavigation />

      {/* State transition confirmation modal */}
      <Modal visible={selectedRef !== null} transparent animationType="slide">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>Advance Referral State</Text>
              <TouchableOpacity onPress={() => setSelectedRef(null)}>
                <X size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
            {selectedRef && (
              <>
                <Text style={s.modalSub}>
                  Patient: <Text style={s.bold}>{selectedRef.patientName}</Text>
                </Text>
                <View style={s.transitionRow}>
                  <Badge label={selectedRef.status.replace(/_/g, ' ')} type={selectedRef.status} />
                  <ArrowRight size={18} color="#06469B" style={{ marginHorizontal: 10 }} />
                  <Badge
                    label={(NEXT_STATES[selectedRef.status] || '').replace(/_/g, ' ')}
                    type={NEXT_STATES[selectedRef.status] || ''}
                  />
                </View>
                <Button
                  title="Confirm State Transition"
                  variant="primary"
                  loading={transitioning}
                  onPress={() => handleTransition(selectedRef)}
                  style={{ marginTop: 16 }}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  body: { padding: 16 },
  title: { color: '#1E293B', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  sub: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', marginHorizontal: 4, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', elevation: 2 },
  statVal: { fontWeight: '800', fontSize: 22 },
  statLabel: { color: '#64748B', fontSize: 11, marginTop: 2 },
  refHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  refLeft: { flexDirection: 'row', alignItems: 'center' },
  patName: { fontWeight: '700', color: '#1E293B', fontSize: 15, marginLeft: 8 },
  routeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 8 },
  routeFrom: { fontWeight: '700', color: '#06469B', fontSize: 12, flex: 1 },
  routeTo: { fontWeight: '700', color: '#10A9CF', fontSize: 12, flex: 1, marginLeft: 6 },
  reasonText: { color: '#64748B', fontSize: 12, marginBottom: 10 },
  refFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  refDate: { color: '#94A3B8', fontSize: 12 },
  advanceBtn: { backgroundColor: '#F8FAFC', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  advanceBtnText: { color: '#06469B', fontWeight: '700', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  modalTitle: { color: '#1E293B', fontWeight: '700', fontSize: 17 },
  modalSub: { color: '#64748B', fontSize: 13, marginBottom: 16 },
  bold: { fontWeight: '700', color: '#06469B' },
  transitionRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
});
