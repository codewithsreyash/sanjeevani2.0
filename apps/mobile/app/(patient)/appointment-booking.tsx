import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ticket, Clock, Building2, User, CheckCircle2 } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';

export default function AppointmentBookingScreen() {
  const router = useRouter();
  const [tokenGenerated, setTokenGenerated] = useState(true);

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />

        <View style={s.body}>
          <Text style={s.title}>FACILITY QUEUE & APPOINTMENTS</Text>
          <Text style={s.sub}>
            Real-time queue tracking & teleconsultation token generator
          </Text>

          {/* ACTIVE QUEUE TOKEN CARD */}
          {tokenGenerated && (
            <View style={s.tokenCard}>
              <View style={s.tokenHeader}>
                <View style={s.tokenTitleRow}>
                  <Ticket size={20} color="#10A9CF" />
                  <Text style={s.tokenTitleText}>ACTIVE QUEUE TOKEN</Text>
                </View>
                <Badge label="ON TIME" type="ROUTINE" size="sm" />
              </View>

              <View style={s.tokenCenterBox}>
                <Text style={s.tokenSub}>Token Number</Text>
                <Text style={s.tokenVal}>A-017</Text>
                <Text style={s.tokenFacility}>Shivapur Primary Health Centre — OPD 1</Text>
              </View>

              <View style={s.tokenMetaRow}>
                <View style={s.tokenMetaCol}>
                  <Text style={s.metaLabel}>Patients Ahead</Text>
                  <Text style={s.metaVal}>4</Text>
                </View>
                <View style={s.metaDivider} />
                <View style={s.tokenMetaCol}>
                  <Text style={s.metaLabel}>Estimated Time</Text>
                  <Text style={s.metaValCyan}>11:40 AM</Text>
                </View>
                <View style={s.metaDivider} />
                <View style={s.tokenMetaCol}>
                  <Text style={s.metaLabel}>Doctor</Text>
                  <Text style={s.metaValSmall}>Dr. Deshmukh</Text>
                </View>
              </View>
            </View>
          )}

          {/* BOOK NEW APPOINTMENT FORM */}
          <Card>
            <Text style={s.cardTitle}>Book OPD Slot or Teleconsultation</Text>

            <Text style={s.sectionLabel}>Select Healthcare Facility</Text>
            <View style={s.facilityBox}>
              <View style={s.facilityRow}>
                <Building2 size={18} color="#06469B" />
                <Text style={s.facilityName}>Shivapur PHC (2.4 km)</Text>
              </View>
              <CheckCircle2 size={16} color="#107C41" />
            </View>

            <Text style={s.sectionLabel}>Consultation Mode</Text>
            <View style={s.modeRow}>
              <TouchableOpacity style={[s.modeBtn, s.modeBtnActive]}>
                <User size={16} color="#06469B" />
                <Text style={s.modeActiveText}>In-Person OPD</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.modeBtn}>
                <Clock size={16} color="#64748B" />
                <Text style={s.modeInactiveText}>Assisted Teleconsult</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Generate Token / Confirm Booking"
              variant="primary"
              onPress={() => setTokenGenerated(true)}
            />
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
  tokenCard: { backgroundColor: '#06469B', padding: 20, borderRadius: 24, marginBottom: 20 },
  tokenHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  tokenTitleRow: { flexDirection: 'row', alignItems: 'center' },
  tokenTitleText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13, marginLeft: 8 },
  tokenCenterBox: { alignItems: 'center', marginVertical: 12, backgroundColor: 'rgba(255,255,255,0.1)', padding: 16, borderRadius: 16 },
  tokenSub: { color: '#BFDBFE', fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  tokenVal: { color: '#10A9CF', fontWeight: '800', fontSize: 36, marginVertical: 4, letterSpacing: 2 },
  tokenFacility: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
  tokenMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 12 },
  tokenMetaCol: { alignItems: 'center' },
  metaLabel: { color: '#BFDBFE', fontSize: 10, marginBottom: 2 },
  metaVal: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  metaValCyan: { color: '#10A9CF', fontWeight: '700', fontSize: 16 },
  metaValSmall: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
  metaDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.2)' },
  cardTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginBottom: 12 },
  sectionLabel: { color: '#64748B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6, marginTop: 4 },
  facilityBox: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  facilityRow: { flexDirection: 'row', alignItems: 'center' },
  facilityName: { fontWeight: '600', color: '#1E293B', fontSize: 14, marginLeft: 8 },
  modeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  modeBtn: { width: '48%', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  modeBtnActive: { backgroundColor: '#EFF6FF', borderColor: '#06469B' },
  modeActiveText: { fontWeight: '700', color: '#06469B', fontSize: 12, marginLeft: 8 },
  modeInactiveText: { fontWeight: '600', color: '#64748B', fontSize: 12, marginLeft: 8 },
});
