import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Activity, ShieldAlert, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BottomNavigation from '../../components/ui/BottomNavigation';

const queue = [
  { id: 'q1', token: 'A-001', name: 'Ramesh Patil', age: 42, priority: 'HIGH', vitals: 'SpO2 92%, Temp 38.5°C', time: '09:00 AM', Icon: AlertTriangle, iconColor: '#EA580C' },
  { id: 'q2', token: 'A-002', name: 'Meena Shinde', age: 55, priority: 'PRIORITY', vitals: 'BP 160/95 mmHg', time: '09:05 AM', Icon: AlertTriangle, iconColor: '#D97706' },
  { id: 'q3', token: 'A-003', name: 'Sanjay Desai', age: 30, priority: 'ROUTINE', vitals: 'Fever 37.5°C, Cough', time: '09:10 AM', Icon: CheckCircle2, iconColor: '#107C41' },
  { id: 'q4', token: 'A-004', name: 'Kaveri Gaikwad', age: 18, priority: 'EMERGENCY', vitals: 'SpO2 86%, Difficulty Breathing', time: '09:12 AM', Icon: ShieldAlert, iconColor: '#DC2626' },
];

export default function DoctorQueueScreen() {
  const router = useRouter();
  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />
        <View style={s.body}>
          <View style={s.statsRow}>
            {[['Waiting', '14'], ['In Progress', '3'], ['Completed', '28']].map(([label, val]) => (
              <View key={label} style={s.statCard}>
                <Text style={s.statVal}>{val}</Text>
                <Text style={s.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          <Text style={s.sectionTitle}>Priority Triage Queue</Text>
          {queue.map((p) => (
            <Card key={p.id}>
              <View style={s.queueHeader}>
                <View style={s.tokenBadge}><Text style={s.tokenText}>{p.token}</Text></View>
                <View style={s.queueInfo}>
                  <Text style={s.patName}>{p.name}, {p.age} yrs</Text>
                  <Text style={s.patVitals}>{p.vitals}</Text>
                  <Text style={s.patTime}>{p.time}</Text>
                </View>
                <Badge label={p.priority} type={p.priority} size="sm" />
              </View>
              <TouchableOpacity onPress={() => router.push({ pathname: '/(doctor)/triage-review', params: { patientId: p.id, priority: p.priority } } as any)} style={s.reviewBtn}>
                <Text style={s.reviewBtnText}>Review & Accept AI Triage →</Text>
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
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: '#FFFFFF', marginHorizontal: 4, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  statVal: { color: '#06469B', fontWeight: '800', fontSize: 24 },
  statLabel: { color: '#64748B', fontSize: 11, marginTop: 2 },
  sectionTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginBottom: 12 },
  queueHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  tokenBadge: { backgroundColor: '#06469B', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  tokenText: { color: '#FFFFFF', fontWeight: '700', fontSize: 11 },
  queueInfo: { flex: 1, marginRight: 8 },
  patName: { fontWeight: '700', color: '#1E293B', fontSize: 14 },
  patVitals: { color: '#64748B', fontSize: 12, marginTop: 2 },
  patTime: { color: '#94A3B8', fontSize: 11, marginTop: 1 },
  reviewBtn: { backgroundColor: '#EFF6FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#BFDBFE', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  reviewBtnText: { color: '#06469B', fontWeight: '700', fontSize: 12 },
});
