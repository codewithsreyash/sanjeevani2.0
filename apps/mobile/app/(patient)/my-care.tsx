import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { HeartPulse, CheckCircle2, Clock, ArrowRight } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BottomNavigation from '../../components/ui/BottomNavigation';

const stages = [
  { stage: '1. Registration & Identification', facility: 'Shivapur Sub Centre (ASHA Sunita More)', status: 'COMPLETED', date: '04 Sep 2026, 08:45 AM', Icon: CheckCircle2, color: '#107C41' },
  { stage: '2. Vitals & Symptoms Digital Triage', facility: 'SpO2 92%, Temp 38.5°C — Priority HIGH', status: 'COMPLETED', date: '04 Sep 2026, 09:00 AM', Icon: CheckCircle2, color: '#107C41' },
  { stage: '3. Healthcare Professional Review', facility: 'Dr. Ananya Deshmukh Accepted Priority HIGH', status: 'COMPLETED', date: '04 Sep 2026, 09:15 AM', Icon: CheckCircle2, color: '#107C41' },
  { stage: '4. Closed-Loop Referral', facility: 'Shivapur PHC → Mulshi Rural Hospital', status: 'APPOINTMENT SCHEDULED', date: '04 Sep 2026, 11:30 AM', Icon: Clock, color: '#06469B', actionPath: '/(patient)/referral-tracker', actionLabel: 'Track Referral Progress →' },
  { stage: '5. Diagnostic & Medicine Fulfillment', facility: 'Mulshi RH Lab & Pharmacy', status: 'PENDING', date: 'Est. 04 Sep 2026, 12:30 PM', Icon: Clock, color: '#D97706' },
  { stage: '6. Community Follow-Up Outreach', facility: 'ASHA Home Outreach Task', status: 'PENDING', date: '05 Sep 2026', Icon: Clock, color: '#D97706' },
];

export default function MyCareScreen() {
  const router = useRouter();
  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />
        <View style={s.body}>
          <Text style={s.title}>CONTINUOUS CARE JOURNEY</Text>
          <Text style={s.sub}>End-to-end active continuum connecting Sub Centre, PHC & Hospital</Text>

          <View style={s.episodeCard}>
            <View style={s.episodeLeft}>
              <Text style={s.episodeTag}>Active Care Episode</Text>
              <Text style={s.episodeTitle}>Acute Respiratory & Fever Evaluation</Text>
              <Text style={s.episodeFacility}>Assigned Facility: Mulshi Rural Hospital</Text>
            </View>
            <View style={s.episodeIcon}>
              <HeartPulse size={24} color="#FFFFFF" />
            </View>
          </View>

          {stages.map((stg, idx) => {
            const Ic = stg.Icon;
            return (
              <Card key={idx}>
                <View style={s.stageHeader}>
                  <View style={s.stageLeft}>
                    <Ic size={18} color={stg.color} />
                    <Text style={s.stageTitle}>{stg.stage}</Text>
                  </View>
                  <Badge label={stg.status} type={stg.status} size="sm" />
                </View>
                <Text style={s.stageFacility}>{stg.facility}</Text>
                <Text style={s.stageDate}>{stg.date}</Text>
                {stg.actionPath && (
                  <TouchableOpacity onPress={() => router.push(stg.actionPath as any)} style={s.actionBtn}>
                    <Text style={s.actionBtnText}>{stg.actionLabel}</Text>
                    <ArrowRight size={14} color="#06469B" />
                  </TouchableOpacity>
                )}
              </Card>
            );
          })}
        </View>
      </ScreenContainer>
      <BottomNavigation />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  body: { padding: 16 },
  title: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  sub: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  episodeCard: { backgroundColor: '#06469B', padding: 16, borderRadius: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  episodeLeft: { flex: 1, marginRight: 12 },
  episodeTag: { color: '#BFDBFE', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  episodeTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  episodeFacility: { color: '#10A9CF', fontSize: 12, fontWeight: '500', marginTop: 2 },
  episodeIcon: { width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  stageHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  stageLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  stageTitle: { fontWeight: '700', color: '#1E293B', fontSize: 13, marginLeft: 8, flex: 1 },
  stageFacility: { color: '#06469B', fontWeight: '600', fontSize: 12, marginLeft: 26, marginBottom: 4 },
  stageDate: { color: '#64748B', fontSize: 11, marginLeft: 26, marginBottom: 4 },
  actionBtn: { marginLeft: 26, backgroundColor: '#EFF6FF', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, borderWidth: 1, borderColor: '#BFDBFE', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 },
  actionBtnText: { color: '#06469B', fontWeight: '700', fontSize: 12 },
});
