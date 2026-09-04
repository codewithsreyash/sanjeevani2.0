import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Building2, CheckCircle2, Clock, ArrowRight } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';

const timeline = [
  { stage: 'Referral Initiated', facility: 'Shivapur Primary Health Centre (PHC)', actor: 'Dr. Ananya Deshmukh', date: '04 Sep 2026, 09:30 AM', status: 'COMPLETED', notes: 'Escalation required due to persistent fever & low SpO2 (92%). Evaluated via Digital Triage.' },
  { stage: 'Referral Accepted', facility: 'Mulshi Rural Hospital (RH)', actor: 'Dr. K. S. Shinde (Receiving Officer)', date: '04 Sep 2026, 10:15 AM', status: 'COMPLETED', notes: 'Bed & physician availability confirmed at Mulshi RH.' },
  { stage: 'Appointment Scheduled', facility: 'Mulshi Rural Hospital — OPD Counter 3', actor: 'Token: A-017', date: '04 Sep 2026, 11:30 AM', status: 'ACTIVE', notes: 'Please arrive 15 minutes prior to scheduled slot.' },
  { stage: 'Specialist Consultation & Outcome', facility: 'Mulshi Rural Hospital — General Medicine', actor: 'Pending Arrival', date: 'Estimated 11:45 AM', status: 'PENDING', notes: 'Encounter notes & return care plan will be recorded upon completion.' },
  { stage: 'Community Return Care Plan', facility: 'Shivapur Sector 2 (ASHA Sunita More)', actor: 'Follow-up Task', date: '05 Sep 2026', status: 'PENDING', notes: 'ASHA worker will conduct home outreach for blood pressure & medication follow-up.' },
];

export default function ReferralTrackerScreen() {
  const router = useRouter();
  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />
        <View style={s.body}>
          <View style={s.titleRow}>
            <View>
              <Text style={s.title}>CLOSED-LOOP REFERRAL</Text>
              <Text style={s.trackId}>Tracking ID: REF-2026-88412</Text>
            </View>
            <Badge label="HIGH PRIORITY" type="HIGH" />
          </View>

          <Card style={s.overviewCard}>
            <View style={s.facilityRow}>
              <View style={s.facilityItem}><Building2 size={16} color="#06469B" /><Text style={s.facilityName}>Shivapur PHC</Text></View>
              <ArrowRight size={16} color="#06469B" />
              <View style={s.facilityItem}><Building2 size={16} color="#10A9CF" /><Text style={[s.facilityName, { color: '#10A9CF' }]}>Mulshi Rural Hospital</Text></View>
            </View>
            <Text style={s.infoLine}><Text style={s.infoLabel}>Referring Doctor: </Text>Dr. Ananya Deshmukh</Text>
            <Text style={s.infoLine}><Text style={s.infoLabel}>Reason: </Text>Persistent high fever (5 days) + SpO2 92%</Text>
            <Text style={s.infoLine}><Text style={s.infoLabel}>Distance: </Text>4.2 km from Shivapur</Text>
          </Card>

          <Text style={s.sectionTitle}>Live Progress Timeline</Text>
          <View style={s.timelineContainer}>
            {timeline.map((item, idx) => {
              const completed = item.status === 'COMPLETED';
              const active = item.status === 'ACTIVE';
              const nodeColor = completed ? '#107C41' : active ? '#06469B' : '#CBD5E1';
              return (
                <View key={idx} style={s.timelineRow}>
                  <View style={s.nodeCol}>
                    <View style={[s.node, { backgroundColor: nodeColor, borderColor: active ? '#10A9CF' : nodeColor, borderWidth: active ? 2 : 0 }]}>
                      {completed ? <CheckCircle2 size={14} color="#FFF" /> : <Clock size={12} color={active ? '#FFF' : '#94A3B8'} />}
                    </View>
                    {idx < timeline.length - 1 && <View style={[s.connector, { backgroundColor: completed ? '#10B981' : '#E2E8F0' }]} />}
                  </View>
                  <View style={s.timelineContent}>
                    <View style={s.timelineHeader}>
                      <Text style={s.stageTitle}>{item.stage}</Text>
                      <Badge label={item.status} type={completed ? 'COMPLETED' : active ? 'HIGH' : 'PENDING'} size="sm" />
                    </View>
                    <Text style={s.stageFacility}>{item.facility}</Text>
                    <Text style={s.stageMeta}>{item.date} • {item.actor}</Text>
                    {item.notes && <View style={s.notesBox}><Text style={s.notesText}>{item.notes}</Text></View>}
                  </View>
                </View>
              );
            })}
          </View>

          <Button title="Back to Care Journey" variant="outline" onPress={() => router.push('/(patient)/my-care')} />
        </View>
      </ScreenContainer>
      <BottomNavigation />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  body: { padding: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  title: { color: '#1E293B', fontWeight: '700', fontSize: 16 },
  trackId: { color: '#64748B', fontSize: 12, marginTop: 2 },
  overviewCard: { backgroundColor: '#F0F7FF', borderColor: '#BFDBFE', marginBottom: 16 },
  facilityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#DBEAFE' },
  facilityItem: { flexDirection: 'row', alignItems: 'center' },
  facilityName: { fontWeight: '700', color: '#06469B', fontSize: 13, marginLeft: 6 },
  infoLine: { color: '#64748B', fontSize: 12, marginBottom: 4 },
  infoLabel: { fontWeight: '600', color: '#1E293B' },
  sectionTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginBottom: 12 },
  timelineContainer: { paddingLeft: 4 },
  timelineRow: { flexDirection: 'row', marginBottom: 20 },
  nodeCol: { width: 32, alignItems: 'center' },
  node: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  connector: { width: 2, flex: 1, marginTop: 4, marginBottom: -4 },
  timelineContent: { flex: 1, marginLeft: 12, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  timelineHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  stageTitle: { fontWeight: '700', color: '#1E293B', fontSize: 13, flex: 1, marginRight: 8 },
  stageFacility: { color: '#06469B', fontWeight: '600', fontSize: 12, marginBottom: 4 },
  stageMeta: { color: '#64748B', fontSize: 11, marginBottom: 8 },
  notesBox: { backgroundColor: '#F8FAFC', padding: 8, borderRadius: 8, borderWidth: 1, borderColor: '#F1F5F9' },
  notesText: { color: '#64748B', fontSize: 11 },
});
