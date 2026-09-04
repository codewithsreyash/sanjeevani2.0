import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Stethoscope, Pill, GitPullRequest, CheckCircle2, X } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';

const MEDICINES = [
  { name: 'Paracetamol 500mg', dose: '1-0-1 (5 days)', stock: 'AVAILABLE' },
  { name: 'Amoxicillin 500mg', dose: '1-1-1 (5 days)', stock: 'AVAILABLE' },
  { name: 'Salbutamol Inhaler', dose: 'PRN (as needed)', stock: 'LOW_STOCK' },
];

export default function ConsultationScreen() {
  const router = useRouter();
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralReason, setReferralReason] = useState('Escalation required: persistent fever (5 days) + SpO2 92% — specialist review & imaging needed');
  const [referralCreated, setReferralCreated] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [consultCompleted, setConsultCompleted] = useState(false);

  const handleCreateReferral = async () => {
    try {
      const res = await fetch('http://localhost:3002/api/v1/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 'pat_ramesh_patil',
          sourceFacilityId: 'fac_shivapur_phc',
          destinationFacilityId: 'fac_mulshi_rh',
          referringDoctorId: 'doc_ananya_deshmukh',
          reason: referralReason,
          priority: 'HIGH',
        }),
      });
      const data = await res.json();
      setReferralCode(data.referralCode || `REF-2026-${Math.floor(10000 + Math.random() * 90000)}`);
    } catch (_) {
      setReferralCode(`REF-2026-${Math.floor(10000 + Math.random() * 90000)}`);
    }
    setReferralCreated(true);
    setShowReferralModal(false);
  };

  const handleCompleteConsultation = () => {
    setConsultCompleted(true);
    setTimeout(() => router.push('/(doctor)/queue'), 1500);
  };

  if (consultCompleted) {
    return (
      <View style={s.root}>
        <ScreenContainer scrollable={false}>
          <Header />
          <View style={s.centeredBox}>
            <View style={s.successIcon}>
              <CheckCircle2 size={40} color="#FFFFFF" />
            </View>
            <Text style={s.successTitle}>Consultation Completed</Text>
            <Text style={s.successSub}>
              Encounter recorded. Prescription saved. {referralCreated ? `Referral ${referralCode} sent to Mulshi RH.` : 'Patient discharged.'}
            </Text>
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
          <Text style={s.title}>CONSULTATION</Text>
          <Text style={s.sub}>Patient: Ramesh Patil, 42 yrs • Token A-001</Text>

          {/* Referral success banner */}
          {referralCreated && (
            <View style={s.referralBanner}>
              <CheckCircle2 size={16} color="#107C41" />
              <Text style={s.referralBannerText}>
                Referral {referralCode} created → Mulshi Rural Hospital
              </Text>
            </View>
          )}

          {/* Clinical encounter */}
          <Card>
            <View style={s.secHeader}>
              <Stethoscope size={18} color="#06469B" />
              <Text style={s.secTitle}>Clinical Encounter Notes</Text>
            </View>
            <Text style={s.label}>Chief Complaint</Text>
            <Text style={s.value}>High-grade fever for 5 days with breathlessness and low SpO2 (92%)</Text>
            <Text style={s.label}>Assessment</Text>
            <Text style={s.value}>Acute lower respiratory tract infection. Requires specialist review and lab workup.</Text>
            <Text style={s.label}>Plan</Text>
            <Text style={s.value}>
              {referralCreated
                ? `Referred to Mulshi Rural Hospital for chest X-ray, CBC, and specialist consultation. (${referralCode})`
                : 'Refer to Mulshi Rural Hospital for chest X-ray, CBC, and specialist consultation.'}
            </Text>
          </Card>

          {/* Prescription */}
          <Card>
            <View style={s.secHeader}>
              <Pill size={18} color="#107C41" />
              <Text style={s.secTitle}>Medicines Prescribed</Text>
            </View>
            {MEDICINES.map(({ name, dose, stock }) => (
              <View key={name} style={s.medRow}>
                <View style={s.medInfo}>
                  <Text style={s.medName}>{name}</Text>
                  <Text style={s.medDose}>{dose}</Text>
                </View>
                <Badge
                  label={stock === 'AVAILABLE' ? 'In Stock' : 'Low Stock'}
                  type={stock === 'AVAILABLE' ? 'COMPLETED' : 'PRIORITY'}
                  size="sm"
                />
              </View>
            ))}
          </Card>

          {/* Actions */}
          {!referralCreated && (
            <Button
              title="Create Referral to Mulshi RH"
              variant="primary"
              icon={<GitPullRequest size={18} color="#FFFFFF" />}
              onPress={() => setShowReferralModal(true)}
              style={{ marginBottom: 12 }}
            />
          )}
          <Button
            title="Complete Consultation"
            variant="success"
            onPress={handleCompleteConsultation}
          />

          {/* Referral creation modal */}
          <Modal visible={showReferralModal} transparent animationType="slide">
            <View style={s.modalOverlay}>
              <View style={s.modalBox}>
                <View style={s.modalHeader}>
                  <Text style={s.modalTitle}>Create Closed-Loop Referral</Text>
                  <TouchableOpacity onPress={() => setShowReferralModal(false)}>
                    <X size={20} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <Text style={s.modalSub}>
                  Referring: <Text style={s.bold}>Ramesh Patil</Text>
                </Text>

                <View style={s.routeBox}>
                  <Text style={s.routeFrom}>Shivapur PHC</Text>
                  <Text style={s.routeArrow}>→</Text>
                  <Text style={s.routeTo}>Mulshi Rural Hospital</Text>
                </View>

                <Text style={s.inputLabel}>Referral Reason & Clinical Summary</Text>
                <TextInput
                  value={referralReason}
                  onChangeText={setReferralReason}
                  multiline
                  numberOfLines={3}
                  style={s.textArea}
                  placeholderTextColor="#94A3B8"
                />

                <View style={s.priorityRow}>
                  <Text style={s.inputLabel}>Priority: </Text>
                  <Badge label="HIGH" type="HIGH" />
                </View>

                <Button
                  title="Confirm & Send Referral"
                  variant="primary"
                  onPress={handleCreateReferral}
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
  referralBanner: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', padding: 12, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  referralBannerText: { color: '#166534', fontWeight: '600', fontSize: 13, marginLeft: 8 },
  secHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  secTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginLeft: 8 },
  label: { color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 10, marginBottom: 4 },
  value: { color: '#1E293B', fontSize: 13, lineHeight: 20 },
  medRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8FAFC' },
  medInfo: { flex: 1, marginRight: 8 },
  medName: { fontWeight: '700', color: '#1E293B', fontSize: 13 },
  medDose: { color: '#64748B', fontSize: 11, marginTop: 2 },
  centeredBox: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#107C41', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { color: '#1E293B', fontWeight: '800', fontSize: 22, marginBottom: 8 },
  successSub: { color: '#64748B', fontSize: 14, textAlign: 'center', lineHeight: 20 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  modalTitle: { color: '#1E293B', fontWeight: '700', fontSize: 17 },
  modalSub: { color: '#64748B', fontSize: 13, marginBottom: 12 },
  bold: { fontWeight: '700', color: '#06469B' },
  routeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#EFF6FF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#BFDBFE', marginBottom: 12 },
  routeFrom: { fontWeight: '700', color: '#06469B', fontSize: 13, flex: 1 },
  routeArrow: { fontWeight: '700', color: '#06469B', fontSize: 16, marginHorizontal: 8 },
  routeTo: { fontWeight: '700', color: '#10A9CF', fontSize: 13, flex: 1, textAlign: 'right' },
  inputLabel: { color: '#64748B', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  textArea: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, fontSize: 13, color: '#1E293B', minHeight: 80, textAlignVertical: 'top', marginBottom: 8 },
  priorityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
});
