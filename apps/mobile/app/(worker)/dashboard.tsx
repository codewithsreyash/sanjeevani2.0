import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlus, HeartPulse, Search, ChevronRight } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BottomNavigation from '../../components/ui/BottomNavigation';

const assignedPatients = [
  { id: 'pat_ramesh_patil', name: 'Ramesh Patil', age: 42, village: 'Shivapur Sector 2', status: 'HIGH', reason: 'Fever 5d + SpO2 92%' },
  { id: 'pat_parvati_patil', name: 'Parvati Patil', age: 68, village: 'Shivapur Sector 2', status: 'PRIORITY', reason: 'Hypertension follow-up' },
  { id: 'pat_aarav_patil', name: 'Aarav Patil', age: 8, village: 'Shivapur Sector 1', status: 'ROUTINE', reason: 'Immunization due' },
];

const quickActions = [
  { label: 'Register Patient', Icon: UserPlus, color: '#06469B', bg: '#EFF6FF', border: '#BFDBFE', path: '/(worker)/register-patient' },
  { label: 'Vitals & Triage', Icon: HeartPulse, color: '#107C41', bg: '#F0FDF4', border: '#BBF7D0', path: '/(worker)/vitals-symptoms' },
  { label: 'Search Patient', Icon: Search, color: '#10A9CF', bg: '#ECFEFF', border: '#A5F3FC', path: '/(worker)/patient-search' },
];

export default function WorkerDashboardScreen() {
  const router = useRouter();
  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />
        <View style={s.body}>
          {/* Worker Header Card */}
          <View style={s.workerCard}>
            <View style={s.workerTop}>
              <View>
                <Text style={s.workerTag}>Sunita More — ASHA Worker</Text>
                <Text style={s.workerFacility}>Shivapur Primary Health Centre</Text>
              </View>
              <View style={s.sectorBadge}><Text style={s.sectorText}>SECTOR 2</Text></View>
            </View>
            <View style={s.kpiRow}>
              {[['Today Visits', '12', '#D1FAE5'], ['High Priority', '4', '#FDE68A'], ['Follow-ups', '3', '#D1FAE5'], ['Referrals', '2', '#BAE6FD']].map(([label, val, col]) => (
                <React.Fragment key={label}>
                  <View style={s.kpi}>
                    <Text style={[s.kpiLabel, { color: '#A7F3D0' }]}>{label}</Text>
                    <Text style={[s.kpiVal, { color: col }]}>{val}</Text>
                  </View>
                  {label !== 'Referrals' && <View style={s.kpiDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={s.sectionTitle}>Primary Worker Actions</Text>
          <View style={s.actionsRow}>
            {quickActions.map(({ label, Icon, color, bg, border, path }) => (
              <TouchableOpacity key={label} onPress={() => router.push(path as any)} style={s.actionCard}>
                <View style={[s.actionIcon, { backgroundColor: bg, borderColor: border }]}>
                  <Icon size={22} color={color} />
                </View>
                <Text style={s.actionLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Priority Patients */}
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Priority Patients</Text>
            <TouchableOpacity onPress={() => router.push('/(worker)/patient-search')}>
              <Text style={s.link}>View All Assigned →</Text>
            </TouchableOpacity>
          </View>
          {assignedPatients.map((pat) => (
            <Card key={pat.id}>
              <View style={s.patRow}>
                <View style={s.patLeft}>
                  <Text style={s.patName}>{pat.name}</Text>
                  <Text style={s.patAge}>({pat.age} yrs)</Text>
                </View>
                <Badge label={pat.status} type={pat.status} size="sm" />
              </View>
              <Text style={s.patMeta}>{pat.village} • {pat.reason}</Text>
              <TouchableOpacity onPress={() => router.push('/(worker)/vitals-symptoms')} style={s.triageBtn}>
                <Text style={s.triageBtnText}>Record Vitals & Digital Triage</Text>
                <ChevronRight size={14} color="#06469B" />
              </TouchableOpacity>
            </Card>
          ))}
        </View>
      </ScreenContainer>
      <BottomNavigation />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  body: { padding: 16 },
  workerCard: { backgroundColor: '#064E3B', padding: 16, borderRadius: 20, marginBottom: 20 },
  workerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: 'rgba(110,231,183,0.2)' },
  workerTag: { color: '#D1FAE5', fontSize: 12, fontWeight: '600' },
  workerFacility: { color: '#FFFFFF', fontWeight: '700', fontSize: 16, marginTop: 2 },
  sectorBadge: { backgroundColor: 'rgba(52,211,153,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(52,211,153,0.3)' },
  sectorText: { color: '#6EE7B7', fontSize: 11, fontWeight: '700' },
  kpiRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 14 },
  kpi: { alignItems: 'center' },
  kpiLabel: { fontSize: 10, marginBottom: 2 },
  kpiVal: { fontWeight: '800', fontSize: 20 },
  kpiDivider: { width: 1, backgroundColor: 'rgba(110,231,183,0.2)' },
  sectionTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  link: { color: '#06469B', fontWeight: '700', fontSize: 12 },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  actionCard: { width: '31%', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 6, borderWidth: 1 },
  actionLabel: { fontWeight: '700', color: '#1E293B', fontSize: 11, textAlign: 'center' },
  patRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  patLeft: { flexDirection: 'row', alignItems: 'center' },
  patName: { fontWeight: '700', color: '#1E293B', fontSize: 15 },
  patAge: { color: '#64748B', fontSize: 12, marginLeft: 6 },
  patMeta: { color: '#64748B', fontSize: 12, marginBottom: 10 },
  triageBtn: { backgroundColor: '#EFF6FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#BFDBFE', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  triageBtnText: { color: '#06469B', fontWeight: '700', fontSize: 12 },
});
