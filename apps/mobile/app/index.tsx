import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, HeartPulse, UserCheck, Stethoscope, Building2, ArrowRight } from 'lucide-react-native';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { Role } from '@sanjeevani/shared-types';

const ROLES = [
  { role: Role.PATIENT, label: 'Citizen / Patient', desc: 'Appointments, referral timelines & health records', Icon: UserCheck, color: '#06469B', bg: '#EFF6FF', border: '#BFDBFE' },
  { role: Role.HEALTH_WORKER, label: 'Healthcare Worker (ASHA)', desc: 'Offline vitals capture, triage & community follow-ups', Icon: HeartPulse, color: '#107C41', bg: '#F0FDF4', border: '#BBF7D0' },
  { role: Role.DOCTOR, label: 'Doctor / Medical Officer', desc: 'Priority queue, AI review (Accept/Override) & referrals', Icon: Stethoscope, color: '#10A9CF', bg: '#ECFEFF', border: '#A5F3FC' },
  { role: Role.ADMIN, label: 'District Administrator', desc: 'Facility load, referral loop audit & stock alerts', Icon: Building2, color: '#5A6473', bg: '#F8FAFC', border: '#E2E8F0' },
];

export default function SplashScreen() {
  const router = useRouter();
  const { loginDemo } = useAuthStore();

  const handleRoleSelect = (role: Role) => {
    loginDemo(role);
    if (role === Role.PATIENT) router.push('/(patient)/home');
    else if (role === Role.HEALTH_WORKER) router.push('/(worker)/dashboard');
    else if (role === Role.DOCTOR) router.push('/(doctor)/queue');
    else if (role === Role.ADMIN) router.push('/(admin)/overview');
  };

  return (
    <ScreenContainer scrollable={true}>
      {/* Hero banner */}
      <View style={s.hero}>
        <View style={s.heroCenter}>
          <View style={s.logoCircle}>
            <HeartPulse size={44} color="#10A9CF" />
          </View>
          <Text style={s.appName}>SANJEEVANI</Text>
          <Text style={s.appSubtitle}>Connected Public Healthcare Network</Text>
          <View style={s.govBadge}>
            <Text style={s.govBadgeText}>Government of Maharashtra Prototype</Text>
          </View>
        </View>
      </View>

      <View style={s.body}>
        <Text style={s.selectTitle}>Select Role to Begin</Text>
        <Text style={s.selectSub}>Experience the connected care journey across all 4 system personas.</Text>

        {ROLES.map(({ role, label, desc, Icon, color, bg, border }) => (
          <TouchableOpacity
            key={role}
            onPress={() => handleRoleSelect(role)}
            activeOpacity={0.85}
            style={[s.roleCard, { borderColor: border }]}
          >
            <View style={s.roleLeft}>
              <View style={[s.iconBox, { backgroundColor: bg, borderColor: border }]}>
                <Icon size={24} color={color} />
              </View>
              <View style={s.roleText}>
                <Text style={s.roleLabel}>{label}</Text>
                <Text style={s.roleDesc}>{desc}</Text>
              </View>
            </View>
            <ArrowRight size={20} color={color} />
          </TouchableOpacity>
        ))}

        <Button
          title="Login with Mobile & OTP"
          variant="outline"
          onPress={() => router.push('/(auth)/role-select' as any)}
        />
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: '#06469B', paddingTop: 48, paddingBottom: 40, paddingHorizontal: 24, borderBottomLeftRadius: 36, borderBottomRightRadius: 36 },
  heroCenter: { alignItems: 'center' },
  logoCircle: { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(16,169,207,0.4)', marginBottom: 16 },
  appName: { color: '#FFFFFF', fontWeight: '800', fontSize: 28, letterSpacing: 2, textAlign: 'center' },
  appSubtitle: { color: '#BFDBFE', fontSize: 13, fontWeight: '600', textAlign: 'center', marginTop: 4 },
  govBadge: { backgroundColor: 'rgba(16,169,207,0.2)', borderWidth: 1, borderColor: 'rgba(16,169,207,0.4)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 999, marginTop: 12 },
  govBadgeText: { color: '#10A9CF', fontSize: 11, fontWeight: '700' },
  body: { padding: 20 },
  selectTitle: { color: '#1E293B', fontWeight: '700', fontSize: 17, textAlign: 'center', marginBottom: 4 },
  selectSub: { color: '#64748B', fontSize: 12, textAlign: 'center', marginBottom: 20 },
  roleCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roleLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  roleText: { marginLeft: 12, flex: 1 },
  roleLabel: { color: '#1E293B', fontWeight: '700', fontSize: 15 },
  roleDesc: { color: '#64748B', fontSize: 12, marginTop: 2 },
});
