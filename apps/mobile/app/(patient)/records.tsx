import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FileText, Shield, Activity } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { usePatientStore } from '../../store/patientStore';
import BottomNavigation from '../../components/ui/BottomNavigation';

const demoRecords = [
  { id: 'rec_1', title: 'Lab Report: Complete Blood Count & SpO2', facility: 'Shivapur PHC Pathology Lab', doctor: 'Dr. Ananya Deshmukh', date: '04 Sep 2026', status: 'REPORT READY', summary: 'Hemoglobin: 13.2 g/dL, WBC: 8,500/mcL, SpO2: 92% (Low)' },
  { id: 'rec_2', title: 'Clinical Encounter Note — Acute Fever', facility: 'Shivapur PHC', doctor: 'Dr. Ananya Deshmukh', date: '04 Sep 2026', status: 'REVIEWED', summary: 'Patient evaluated for 5-day fever and mild dyspnea. Triage score: HIGH.' },
  { id: 'rec_3', title: 'Prescription: Paracetamol 500mg + Amoxicillin', facility: 'Mulshi Rural Hospital Pharmacy', doctor: 'Dr. K. S. Shinde', date: '04 Sep 2026', status: 'DISPENSED', summary: 'Paracetamol 500mg (1-0-1), Amoxicillin 500mg (1-1-1) x 5 days' },
];

const demoConsents = [
  { id: 'cns_1', purpose: 'Emergency Clinical Triage & Consultation', grantedTo: 'ASHA Workers & PHC Medical Officers', grantedAt: '01 Jan 2026' },
  { id: 'cns_2', purpose: 'Referral Record Transfer to Secondary/Tertiary Hospital', grantedTo: 'Mulshi Rural Hospital & Pune District Hospital', grantedAt: '04 Sep 2026' },
];

export default function RecordsScreen() {
  const { activeMember } = usePatientStore();
  const [activeTab, setActiveTab] = useState<'RECORDS' | 'CONSENTS'>('RECORDS');

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />
        <View style={s.body}>
          <Text style={s.title}>HEALTH RECORDS & CONSENT</Text>
          <Text style={s.sub}>Unified longitudinal health profile for <Text style={s.subBold}>{activeMember.name}</Text></Text>

          {/* Tab switcher */}
          <View style={s.tabs}>
            {(['RECORDS', 'CONSENTS'] as const).map((tab) => (
              <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={[s.tab, activeTab === tab && s.tabActive]}>
                <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                  {tab === 'RECORDS' ? `Medical Records (${demoRecords.length})` : `Consent Manager (${demoConsents.length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {activeTab === 'RECORDS' ? (
            demoRecords.map((rec) => (
              <Card key={rec.id}>
                <View style={s.recHeader}>
                  <View style={s.recLeft}>
                    <FileText size={18} color="#06469B" />
                    <Text style={s.recTitle}>{rec.title}</Text>
                  </View>
                  <Badge label={rec.status} type="ROUTINE" size="sm" />
                </View>
                <Text style={s.recFacility}>{rec.facility} • {rec.doctor}</Text>
                <Text style={s.recDate}>{rec.date}</Text>
                <View style={s.summaryBox}>
                  <Activity size={14} color="#94A3B8" style={{ marginRight: 6 }} />
                  <Text style={s.summaryText}>{rec.summary}</Text>
                </View>
              </Card>
            ))
          ) : (
            demoConsents.map((cns) => (
              <Card key={cns.id}>
                <View style={s.recHeader}>
                  <View style={s.recLeft}>
                    <Shield size={18} color="#107C41" />
                    <Text style={s.recTitle}>{cns.purpose}</Text>
                  </View>
                  <Badge label="ACTIVE" type="COMPLETED" size="sm" />
                </View>
                <Text style={s.recDate}><Text style={s.bold}>Granted To: </Text>{cns.grantedTo}</Text>
                <Text style={s.recMeta}>Granted Date: {cns.grantedAt}</Text>
              </Card>
            ))
          )}
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
  subBold: { fontWeight: '700', color: '#06469B' },
  tabs: { flexDirection: 'row', backgroundColor: '#E2E8F0', padding: 4, borderRadius: 16, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  tabTextActive: { color: '#06469B' },
  recHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  recLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  recTitle: { fontWeight: '700', color: '#1E293B', fontSize: 13, marginLeft: 8, flex: 1 },
  recFacility: { color: '#06469B', fontWeight: '600', fontSize: 12, marginBottom: 4 },
  recDate: { color: '#64748B', fontSize: 11, marginBottom: 8 },
  recMeta: { color: '#64748B', fontSize: 11, marginTop: 4 },
  bold: { fontWeight: '600', color: '#1E293B' },
  summaryBox: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'flex-start' },
  summaryText: { color: '#64748B', fontSize: 12, flex: 1 },
});
