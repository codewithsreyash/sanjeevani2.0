import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Building2, Video, GitPullRequest, QrCode, FileText, Shield, Users,
  Calendar, Stethoscope, Activity, Pill, Baby, Heart, PhoneCall, ChevronRight, CheckCircle2, Clock
} from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BottomNavigation from '../../components/ui/BottomNavigation';

const CAROUSEL_COLORS = ['#1D4ED8','#10A9CF','#043E7B','#4338CA','#065F46','#92400E','#6D28D9'];

const carouselItems = [
  { title: 'Find the Right Care', desc: 'Find the most appropriate nearby public healthcare service.', cta: 'Find Facility', Icon: Building2, path: '/(patient)/facility-finder' },
  { title: 'Assisted Teleconsultation', desc: 'Connect with a doctor with ASHA worker assistance.', cta: 'Start Consultation', Icon: Video, path: '/(patient)/appointment-booking' },
  { title: 'My Referrals', desc: 'Track referrals between public healthcare facilities.', cta: 'Track Referral', Icon: GitPullRequest, path: '/(patient)/referral-tracker' },
  { title: 'Scan & Register', desc: 'Scan a facility QR code for quicker registration.', cta: 'Scan Now', Icon: QrCode, path: '/(patient)/qr-scan' },
  { title: 'My Records', desc: 'View your connected health information & history.', cta: 'View Records', Icon: FileText, path: '/(patient)/records' },
  { title: 'Consent Management', desc: 'Manage permissions for health-record access.', cta: 'Manage Consent', Icon: Shield, path: '/(patient)/records' },
  { title: 'Family Health', desc: 'Manage healthcare journeys for linked family members.', cta: 'Manage Family', Icon: Users, path: '/(patient)/profile' },
];

const services = [
  { name: 'Teleconsultation', Icon: Video, color: '#06469B', path: '/(patient)/appointment-booking' },
  { name: 'Find Facility', Icon: Building2, color: '#10A9CF', path: '/(patient)/facility-finder' },
  { name: 'Appointments', Icon: Calendar, color: '#107C41', path: '/(patient)/appointment-booking' },
  { name: 'Referral Tracker', Icon: GitPullRequest, color: '#D97706', path: '/(patient)/referral-tracker' },
  { name: 'Diagnostics', Icon: Activity, color: '#9333EA', path: '/(patient)/records' },
  { name: 'Medicines', Icon: Pill, color: '#DC2626', path: '/(patient)/facility-finder' },
  { name: 'Maternal Health', Icon: Heart, color: '#EC4899', path: '/(patient)/my-care' },
  { name: 'Child Health', Icon: Baby, color: '#3B82F6', path: '/(patient)/my-care' },
  { name: 'Chronic Care', Icon: Stethoscope, color: '#059669', path: '/(patient)/records' },
  { name: 'Emergency', Icon: PhoneCall, color: '#B91C1C', path: '/(patient)/facility-finder' },
  { name: 'Records', Icon: FileText, color: '#4B5563', path: '/(patient)/records' },
  { name: 'Consents', Icon: Shield, color: '#7C3AED', path: '/(patient)/records' },
];

export default function PatientHomeScreen() {
  const router = useRouter();

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true} style={s.flex}>
        <Header />
        <View style={s.body}>
          {/* Hero */}
          <View style={s.hero}>
            <Text style={s.heroTag}>Welcome to</Text>
            <Text style={s.heroTitle}>SANJEEVANI</Text>
            <Text style={s.heroSub}>Connected Public Healthcare Network</Text>
          </View>

          {/* Carousel */}
          <Text style={s.sectionTitle}>Featured Healthcare Actions</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.carousel} contentContainerStyle={{ paddingHorizontal: 2 }}>
            {carouselItems.map((item, idx) => {
              const Ic = item.Icon;
              return (
                <View key={idx} style={[s.carouselCard, { backgroundColor: CAROUSEL_COLORS[idx] }]}>
                  <View>
                    <View style={s.carouselTop}>
                      <View style={s.carouselIconBox}>
                        <Ic size={20} color="#FFFFFF" />
                      </View>
                      <Text style={s.carouselNum}>0{idx + 1}/07</Text>
                    </View>
                    <Text style={s.carouselTitle}>{item.title}</Text>
                    <Text style={s.carouselDesc} numberOfLines={2}>{item.desc}</Text>
                  </View>
                  <TouchableOpacity onPress={() => router.push(item.path as any)} style={s.carouselBtn}>
                    <Text style={s.carouselBtnText}>{item.cta}</Text>
                    <ChevronRight size={14} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          {/* Care Journey Card */}
          <Card>
            <View style={s.careHeader}>
              <View>
                <Text style={s.careTitle}>MY CARE JOURNEY</Text>
                <Text style={s.careSub}>Active continuum of care</Text>
              </View>
              <TouchableOpacity onPress={() => router.push('/(patient)/my-care')}>
                <Text style={s.careLink}>View Full Timeline →</Text>
              </TouchableOpacity>
            </View>
            <View style={s.careRow}>
              <View style={[s.stageRow, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
                <View style={s.stageLeft}><CheckCircle2 size={18} color="#107C41" /><Text style={[s.stageLabel, { color: '#1E293B' }]}>Consultation (Shivapur PHC)</Text></View>
                <Badge label="COMPLETED" type="COMPLETED" size="sm" />
              </View>
              <View style={[s.stageRow, { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' }]}>
                <View style={s.stageLeft}><CheckCircle2 size={18} color="#107C41" /><Text style={[s.stageLabel, { color: '#1E293B' }]}>Diagnostics (Blood Test)</Text></View>
                <Badge label="REPORT READY" type="ROUTINE" size="sm" />
              </View>
              <View style={[s.stageRow, { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }]}>
                <View style={s.stageLeft}><Clock size={18} color="#06469B" /><Text style={[s.stageLabel, { color: '#06469B' }]}>Referral (Mulshi Rural Hospital)</Text></View>
                <Badge label="SCHEDULED" type="HIGH" size="sm" />
              </View>
              <View style={[s.stageRow, { backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }]}>
                <View style={s.stageLeft}><Clock size={18} color="#D97706" /><Text style={[s.stageLabel, { color: '#92400E' }]}>Community Follow-up (ASHA)</Text></View>
                <Badge label="PENDING" type="PENDING" size="sm" />
              </View>
            </View>
          </Card>

          {/* Services Grid */}
          <Text style={s.sectionTitle}>Public Health Services</Text>
          <View style={s.grid}>
            {services.map((srv, idx) => {
              const Si = srv.Icon;
              return (
                <TouchableOpacity key={idx} onPress={() => router.push(srv.path as any)} activeOpacity={0.8} style={s.gridItem}>
                  <View style={[s.gridIconBox, { backgroundColor: srv.color + '18' }]}>
                    <Si size={20} color={srv.color} />
                  </View>
                  <Text style={s.gridLabel}>{srv.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScreenContainer>
      <BottomNavigation />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  body: { padding: 16 },
  hero: { backgroundColor: '#06469B', padding: 16, borderRadius: 16, marginBottom: 16 },
  heroTag: { color: '#BFDBFE', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginTop: 2 },
  heroSub: { color: '#10A9CF', fontWeight: '600', fontSize: 13, marginTop: 2 },
  sectionTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginBottom: 10 },
  carousel: { marginBottom: 16, marginHorizontal: -4 },
  carouselCard: { width: 240, padding: 16, borderRadius: 16, marginRight: 12, height: 165, justifyContent: 'space-between' },
  carouselTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  carouselIconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  carouselNum: { color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: '700' },
  carouselTitle: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  carouselDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 4 },
  carouselBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 7, paddingHorizontal: 10, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  carouselBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 11 },
  careHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  careTitle: { color: '#1E293B', fontWeight: '700', fontSize: 14 },
  careSub: { color: '#64748B', fontSize: 11, marginTop: 2 },
  careLink: { color: '#06469B', fontWeight: '700', fontSize: 11 },
  careRow: { gap: 8 },
  stageRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderRadius: 12, borderWidth: 1, marginBottom: 6 },
  stageLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  stageLabel: { fontSize: 12, fontWeight: '600', marginLeft: 8, flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1, flexDirection: 'row', alignItems: 'center' },
  gridIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  gridLabel: { fontWeight: '600', color: '#1E293B', fontSize: 12, flex: 1 },
});
