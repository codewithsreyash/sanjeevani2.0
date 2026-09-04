import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BarChart2, TrendingUp, AlertCircle } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import BottomNavigation from '../../components/ui/BottomNavigation';

const kpis = [
  { label: 'Facilities Active', value: '47', sub: '3 PHCs flagged for attention', color: '#06469B' },
  { label: 'Today Referrals', value: '312', sub: '94% closed-loop completion rate', color: '#107C41' },
  { label: 'High Priority Cases', value: '28', sub: '↑ 6 from yesterday', color: '#EA580C' },
  { label: 'Stock Alerts', value: '9', sub: '3 critical items', color: '#DC2626' },
];

export default function AdminOverviewScreen() {
  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />
        <View style={s.body}>
          <Text style={s.title}>DISTRICT OPERATIONS OVERVIEW</Text>
          <Text style={s.sub}>Pune District • Live Healthcare Dashboard</Text>

          <View style={s.kpiGrid}>
            {kpis.map((k) => (
              <View key={k.label} style={[s.kpiCard, { borderTopWidth: 3, borderTopColor: k.color }]}>
                <Text style={[s.kpiVal, { color: k.color }]}>{k.value}</Text>
                <Text style={s.kpiLabel}>{k.label}</Text>
                <Text style={s.kpiSub}>{k.sub}</Text>
              </View>
            ))}
          </View>

          <Card>
            <View style={s.secHeader}>
              <BarChart2 size={18} color="#06469B" />
              <Text style={s.secTitle}>Referral Closure Rate</Text>
            </View>
            {[['Shivapur PHC', '94%', '#107C41'], ['Mulshi RH', '88%', '#D97706'], ['Vadgaon SC', '72%', '#DC2626']].map(([name, pct, color]) => (
              <View key={name} style={s.barRow}>
                <Text style={s.barLabel}>{name}</Text>
                <View style={s.barBg}>
                  <View style={[s.barFill, { width: pct as any, backgroundColor: color }]} />
                </View>
                <Text style={[s.barPct, { color }]}>{pct}</Text>
              </View>
            ))}
          </Card>

          <Card>
            <View style={s.secHeader}>
              <AlertCircle size={18} color="#DC2626" />
              <Text style={s.secTitle}>System Alerts</Text>
            </View>
            {['Salbutamol Inhaler — 3 facilities below threshold', 'Paracetamol 500mg — Mulshi RH: 0 units', 'Amoxicillin 250mg — Shivapur PHC: 12 units'].map((alert) => (
              <View key={alert} style={s.alertRow}>
                <View style={s.alertDot} />
                <Text style={s.alertText}>{alert}</Text>
              </View>
            ))}
          </Card>
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
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 16 },
  kpiCard: { width: '48%', backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2 },
  kpiVal: { fontWeight: '800', fontSize: 28, marginBottom: 4 },
  kpiLabel: { color: '#1E293B', fontWeight: '700', fontSize: 13 },
  kpiSub: { color: '#64748B', fontSize: 11, marginTop: 4 },
  secHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  secTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginLeft: 8 },
  barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  barLabel: { color: '#1E293B', fontWeight: '600', fontSize: 12, width: 100 },
  barBg: { flex: 1, height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, marginHorizontal: 8, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  barPct: { fontWeight: '700', fontSize: 12, width: 40, textAlign: 'right' },
  alertRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  alertDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#DC2626', marginTop: 4, marginRight: 8 },
  alertText: { color: '#64748B', fontSize: 12, flex: 1 },
});
