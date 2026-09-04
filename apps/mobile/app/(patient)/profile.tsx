import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { User, ShieldCheck, Globe, Lock, HelpCircle, Info, LogOut, ChevronRight, Check } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';
import BottomNavigation from '../../components/ui/BottomNavigation';

export default function ProfileScreen() {
  const router = useRouter();
  const { logout, language } = useAuthStore();
  const { activeMember, familyMembers, setActiveMember } = usePatientStore();

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />
        <View style={s.body}>
          {/* Profile Card */}
          <Card style={s.profileCard}>
            <View style={s.avatarCircle}>
              <User size={40} color="#06469B" />
            </View>
            <Text style={s.name}>{activeMember.name}</Text>
            <Text style={s.nameDetail}>{activeMember.relationship} • {activeMember.age} yrs • {activeMember.gender}</Text>
            <View style={s.abhaBadge}>
              <ShieldCheck size={14} color="#107C41" />
              <Text style={s.abhaText}>ABHA ID: {activeMember.mockAbhaId}</Text>
            </View>
          </Card>

          {/* Family */}
          <Text style={s.sectionTitle}>Linked Family Profiles</Text>
          <Card style={s.familyCard}>
            {familyMembers.map((m) => (
              <TouchableOpacity key={m.id} onPress={() => setActiveMember(m)} style={[s.familyRow, activeMember.id === m.id && s.familyRowActive]}>
                <View style={s.familyLeft}>
                  <View style={s.familyAvatar}><User size={18} color="#06469B" /></View>
                  <View style={s.familyInfo}>
                    <Text style={s.familyName}>{m.name}</Text>
                    <Text style={s.familyMeta}>{m.relationship} • {m.age} yrs</Text>
                  </View>
                </View>
                {activeMember.id === m.id && <Check size={18} color="#06469B" />}
              </TouchableOpacity>
            ))}
          </Card>

          {/* Settings */}
          <Card style={s.settingsCard}>
            {[
              { Icon: Globe, label: 'Language (भाषा)', right: language.toUpperCase(), rightIsText: true },
              { Icon: Lock, label: 'Privacy & Consents', right: null, rightIsText: false },
              { Icon: HelpCircle, label: 'Help & Support', right: null, rightIsText: false },
              { Icon: Info, label: 'About Sanjeevani', right: 'v1.0.0 (SIH 2026)', rightIsText: true },
            ].map(({ Icon, label, right, rightIsText }, idx, arr) => (
              <TouchableOpacity key={label} style={[s.settingRow, idx < arr.length - 1 && s.settingBorder]}>
                <View style={s.settingLeft}>
                  <Icon size={18} color="#06469B" />
                  <Text style={s.settingLabel}>{label}</Text>
                </View>
                {rightIsText ? (
                  <Text style={s.settingMeta}>{right}</Text>
                ) : (
                  <ChevronRight size={18} color="#94A3B8" />
                )}
              </TouchableOpacity>
            ))}
          </Card>

          <Button title="Switch Role / Logout" variant="outline" icon={<LogOut size={16} color="#06469B" />} onPress={() => { logout(); router.push('/'); }} />
        </View>
      </ScreenContainer>
      <BottomNavigation />
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  body: { padding: 16 },
  profileCard: { alignItems: 'center', paddingVertical: 24, marginBottom: 20 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EFF6FF', borderWidth: 2, borderColor: '#06469B', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { fontWeight: '700', color: '#1E293B', fontSize: 20, marginBottom: 4 },
  nameDetail: { color: '#64748B', fontSize: 12 },
  abhaBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: '#BBF7D0', marginTop: 12 },
  abhaText: { color: '#166534', fontSize: 12, fontWeight: '700', marginLeft: 6 },
  sectionTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginBottom: 10 },
  familyCard: { padding: 8, marginBottom: 16 },
  familyRow: { padding: 12, borderRadius: 14, marginBottom: 6, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  familyRowActive: { backgroundColor: '#EFF6FF', borderColor: '#06469B' },
  familyLeft: { flexDirection: 'row', alignItems: 'center' },
  familyAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  familyInfo: { marginLeft: 12 },
  familyName: { fontWeight: '700', color: '#1E293B', fontSize: 14 },
  familyMeta: { color: '#64748B', fontSize: 12, marginTop: 2 },
  settingsCard: { padding: 4, marginBottom: 20 },
  settingRow: { padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingLabel: { fontWeight: '600', color: '#1E293B', fontSize: 14, marginLeft: 12 },
  settingMeta: { color: '#06469B', fontSize: 12, fontWeight: '700', textTransform: 'uppercase' },
});
