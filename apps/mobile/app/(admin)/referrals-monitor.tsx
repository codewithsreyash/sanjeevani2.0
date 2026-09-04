import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BottomNavigation from '../../components/ui/BottomNavigation';

const activeReferrals = [
  {
    id: 'REF-2026-88412',
    patient: 'Ramesh Patil',
    from: 'Shivapur PHC',
    to: 'Mulshi Rural Hospital',
    doctor: 'Dr. Ananya Deshmukh',
    state: 'CARE_PLAN_RETURNED',
    priority: 'HIGH',
    updated: '10 mins ago',
  },
  {
    id: 'REF-2026-88413',
    patient: 'Sunita Patil',
    from: 'Shivapur Sub Centre',
    to: 'Shivapur PHC',
    doctor: 'ASHA Sunita More',
    state: 'APPOINTMENT_SCHEDULED',
    priority: 'PRIORITY',
    updated: '25 mins ago',
  },
];

export default function ReferralsMonitorScreen() {
  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />

        <View style={s.body}>
          <Text style={s.title}>DISTRICT REFERRAL LOOP MONITOR</Text>
          <Text style={s.sub}>
            Closed-loop tracking across primary, secondary & tertiary facilities
          </Text>

          {activeReferrals.map((ref) => (
            <Card key={ref.id}>
              <View style={s.headerRow}>
                <View style={s.patientRow}>
                  <Text style={s.patientName}>{ref.patient}</Text>
                  <Text style={s.patientId}>({ref.id})</Text>
                </View>
                <Badge label={ref.state} type={ref.priority} size="sm" />
              </View>

              <View style={s.routeBox}>
                <Text style={s.fromText}>{ref.from}</Text>
                <ArrowRight size={14} color="#06469B" style={s.arrow} />
                <Text style={s.toText}>{ref.to}</Text>
              </View>

              <Text style={s.metaText}>
                Initiated by: {ref.doctor} • Updated {ref.updated}
              </Text>
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
  title: { color: '#1E293B', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  sub: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  patientRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  patientName: { fontWeight: '700', color: '#1E293B', fontSize: 15 },
  patientId: { color: '#64748B', fontSize: 12, marginLeft: 8 },
  routeBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginVertical: 8 },
  fromText: { fontWeight: '700', color: '#06469B', fontSize: 12, flex: 1 },
  arrow: { marginHorizontal: 8 },
  toText: { fontWeight: '700', color: '#10A9CF', fontSize: 12, flex: 1 },
  metaText: { color: '#64748B', fontSize: 12, marginTop: 4 },
});
