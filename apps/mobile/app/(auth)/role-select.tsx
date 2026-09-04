import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, ShieldCheck, HeartPulse, UserCheck, Stethoscope, Building2, ArrowRight, ArrowLeft, Lock } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/authStore';
import { Role } from '@sanjeevani/shared-types';

const ROLES = [
  { role: Role.PATIENT, label: 'Citizen / Patient', desc: 'Appointments, referral timelines & health records', Icon: UserCheck, color: '#06469B', bg: '#EFF6FF', border: '#BFDBFE' },
  { role: Role.HEALTH_WORKER, label: 'Healthcare Worker (ASHA)', desc: 'Offline vitals capture, triage & community follow-ups', Icon: HeartPulse, color: '#107C41', bg: '#F0FDF4', border: '#BBF7D0' },
  { role: Role.DOCTOR, label: 'Doctor / Medical Officer', desc: 'Priority queue, AI review (Accept/Override) & referrals', Icon: Stethoscope, color: '#10A9CF', bg: '#ECFEFF', border: '#A5F3FC' },
  { role: Role.ADMIN, label: 'District Administrator', desc: 'Facility load, referral loop audit & stock alerts', Icon: Building2, color: '#5A6473', bg: '#F8FAFC', border: '#E2E8F0' },
];

type Step = 'phone' | 'otp' | 'role';

export default function RoleSelectScreen() {
  const router = useRouter();
  const { loginDemo } = useAuthStore();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role>(Role.PATIENT);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');

  const handleRequestOtp = () => {
    if (phone.length < 10) return;
    setLoading(true);
    // Simulate OTP send delay
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
    }, 800);
  };

  const handleVerifyOtp = () => {
    if (otp !== '123456') {
      setOtpError('Invalid OTP. Use 123456 for demo.');
      return;
    }
    setOtpError('');
    setStep('role');
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    loginDemo(role);
    if (role === Role.PATIENT) router.replace('/(patient)/home');
    else if (role === Role.HEALTH_WORKER) router.replace('/(worker)/dashboard');
    else if (role === Role.DOCTOR) router.replace('/(doctor)/queue');
    else if (role === Role.ADMIN) router.replace('/(admin)/overview');
  };

  return (
    <ScreenContainer scrollable={true}>
      {/* Header banner */}
      <View style={s.hero}>
        <View style={s.heroCenter}>
          <View style={s.logoCircle}>
            <HeartPulse size={36} color="#10A9CF" />
          </View>
          <Text style={s.appName}>SANJEEVANI</Text>
          <Text style={s.appSub}>Connected Public Healthcare Network</Text>
        </View>
      </View>

      <View style={s.body}>
        {/* Back button */}
        <TouchableOpacity onPress={() => step === 'phone' ? router.back() : setStep(step === 'otp' ? 'phone' : 'otp')} style={s.backBtn}>
          <ArrowLeft size={18} color="#06469B" />
          <Text style={s.backText}>{step === 'phone' ? 'Back to Demo Login' : 'Back'}</Text>
        </TouchableOpacity>

        {/* Step: Phone */}
        {step === 'phone' && (
          <View>
            <Text style={s.stepTitle}>Enter Mobile Number</Text>
            <Text style={s.stepSub}>We'll send a verification OTP to your registered mobile number.</Text>

            <View style={s.inputBox}>
              <Phone size={18} color="#64748B" />
              <TextInput
                style={s.input}
                placeholder="10-digit mobile number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={s.demoHint}>
              <ShieldCheck size={14} color="#107C41" />
              <Text style={s.demoHintText}>Demo: Enter any 10-digit number. OTP will be 123456</Text>
            </View>

            <Button
              title="Send OTP"
              variant="primary"
              loading={loading}
              disabled={phone.length < 10}
              onPress={handleRequestOtp}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        {/* Step: OTP */}
        {step === 'otp' && (
          <View>
            <Text style={s.stepTitle}>Enter Verification Code</Text>
            <Text style={s.stepSub}>OTP sent to +91 {phone}</Text>

            <View style={s.inputBox}>
              <Lock size={18} color="#64748B" />
              <TextInput
                style={s.input}
                placeholder="6-digit OTP"
                value={otp}
                onChangeText={(v) => { setOtp(v); setOtpError(''); }}
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {otpError ? <Text style={s.errorText}>{otpError}</Text> : null}

            <View style={s.demoHint}>
              <ShieldCheck size={14} color="#107C41" />
              <Text style={s.demoHintText}>Hackathon Demo OTP: 123456</Text>
            </View>

            <Button
              title="Verify & Continue"
              variant="primary"
              disabled={otp.length < 6}
              onPress={handleVerifyOtp}
              style={{ marginTop: 16 }}
            />
          </View>
        )}

        {/* Step: Role Select */}
        {step === 'role' && (
          <View>
            <Text style={s.stepTitle}>Select Your Healthcare Role</Text>
            <Text style={s.stepSub}>Choose the role that describes your position in the healthcare system.</Text>

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
          </View>
        )}
      </View>
    </ScreenContainer>
  );
}

const s = StyleSheet.create({
  hero: { backgroundColor: '#06469B', paddingTop: 40, paddingBottom: 32, paddingHorizontal: 24, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  heroCenter: { alignItems: 'center' },
  logoCircle: { width: 68, height: 68, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(16,169,207,0.4)', marginBottom: 12 },
  appName: { color: '#FFFFFF', fontWeight: '800', fontSize: 24, letterSpacing: 2 },
  appSub: { color: '#BFDBFE', fontSize: 12, fontWeight: '600', marginTop: 4 },
  body: { padding: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backText: { color: '#06469B', fontWeight: '600', fontSize: 13, marginLeft: 6 },
  stepTitle: { color: '#1E293B', fontWeight: '700', fontSize: 18, marginBottom: 6 },
  stepSub: { color: '#64748B', fontSize: 13, marginBottom: 20, lineHeight: 18 },
  inputBox: { backgroundColor: '#F8FAFC', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: '#1E293B', marginLeft: 10 },
  demoHint: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0FDF4', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#BBF7D0' },
  demoHintText: { color: '#166534', fontSize: 12, fontWeight: '600', marginLeft: 6 },
  errorText: { color: '#DC2626', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  roleCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roleLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  iconBox: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  roleText: { marginLeft: 12, flex: 1 },
  roleLabel: { color: '#1E293B', fontWeight: '700', fontSize: 15 },
  roleDesc: { color: '#64748B', fontSize: 12, marginTop: 2 },
});
