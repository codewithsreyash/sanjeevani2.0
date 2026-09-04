import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { UserPlus, CheckCircle2 } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';
import { enqueueOfflineMutation } from '../../sync/syncEngine';

export default function RegisterPatientScreen() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Female');
  const [village, setVillage] = useState('Shivapur Sector 2');
  const [mobile, setMobile] = useState('');
  const [mockAbha, setMockAbha] = useState('');
  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleRegister = async () => {
    const patientUuid = `pat_${Date.now()}`;
    const generatedAbha = mockAbha || `91-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    await enqueueOfflineMutation({
      clientUuid: patientUuid,
      entityType: 'PATIENT',
      operation: 'CREATE',
      payload: {
        fullName: fullName || 'New Rural Citizen',
        age: parseInt(age) || 30,
        gender,
        village,
        mobile: mobile || '9876543299',
        mockAbhaId: generatedAbha,
      },
    });

    setRegisteredSuccess(true);
  };

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />

        <View style={s.body}>
          <Text style={s.title}>REGISTER NEW PATIENT</Text>
          <Text style={s.sub}>
            Fast offline registration for frontline healthcare workers (ASHA/ANM/CHO)
          </Text>

          {!registeredSuccess ? (
            <Card>
              <Text style={s.inputLabel}>FULL NAME</Text>
              <TextInput
                placeholder="e.g. Kavita Shinde"
                value={fullName}
                onChangeText={setFullName}
                style={s.input}
                placeholderTextColor="#94A3B8"
              />

              <View style={s.row}>
                <View style={s.halfWidth}>
                  <Text style={s.inputLabel}>AGE (YEARS)</Text>
                  <TextInput
                    placeholder="e.g. 28"
                    value={age}
                    onChangeText={setAge}
                    keyboardType="numeric"
                    style={s.input}
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <View style={s.halfWidth}>
                  <Text style={s.inputLabel}>GENDER</Text>
                  <View style={s.genderRow}>
                    {['F', 'M', 'O'].map((g, i) => {
                      const full = ['Female', 'Male', 'Other'][i];
                      return (
                        <TouchableOpacity
                          key={g}
                          onPress={() => setGender(full)}
                          style={[s.genderBtn, gender === full && s.genderBtnActive]}
                        >
                          <Text style={[s.genderBtnText, gender === full && s.genderBtnTextActive]}>{g}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </View>

              <Text style={s.inputLabel}>VILLAGE / SECTOR</Text>
              <TextInput
                value={village}
                onChangeText={setVillage}
                style={s.input}
                placeholderTextColor="#94A3B8"
              />

              <Text style={s.inputLabel}>MOBILE NUMBER (OPTIONAL)</Text>
              <TextInput
                placeholder="10-digit phone"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
                style={s.input}
                placeholderTextColor="#94A3B8"
              />

              <Text style={s.inputLabel}>MOCK ABHA ID (OPTIONAL)</Text>
              <TextInput
                placeholder="Auto-generated if left blank"
                value={mockAbha}
                onChangeText={setMockAbha}
                style={[s.input, { marginBottom: 16 }]}
                placeholderTextColor="#94A3B8"
              />

              <Button
                title="Save Patient Record Offline"
                variant="primary"
                icon={<UserPlus size={18} color="#FFFFFF" />}
                onPress={handleRegister}
              />
            </Card>
          ) : (
            <View style={s.successCard}>
              <CheckCircle2 size={48} color="#107C41" />
              <Text style={s.successTitle}>Patient Registered!</Text>
              <Text style={s.successSub}>
                Record saved to local offline SQLite database. Mutation queued for sync.
              </Text>
              <Button
                title="Record Vitals & Digital Triage Now"
                variant="success"
                onPress={() => router.push('/(worker)/vitals-symptoms')}
                style={{ marginTop: 16 }}
              />
            </View>
          )}
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
  inputLabel: { color: '#64748B', fontSize: 11, fontWeight: '700', marginBottom: 6, marginTop: 4 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 12, borderRadius: 12, fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  halfWidth: { width: '48%' },
  genderRow: { flexDirection: 'row' },
  genderBtn: { flex: 1, paddingVertical: 12, borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, alignItems: 'center', marginRight: 4, backgroundColor: '#F8FAFC' },
  genderBtnActive: { backgroundColor: '#06469B', borderColor: '#06469B' },
  genderBtnText: { fontSize: 12, fontWeight: '700', color: '#1E293B' },
  genderBtnTextActive: { color: '#FFFFFF' },
  successCard: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', padding: 24, borderRadius: 24, alignItems: 'center' },
  successTitle: { fontWeight: '700', color: '#064E3B', fontSize: 18, marginTop: 12 },
  successSub: { color: '#065F46', fontSize: 12, textAlign: 'center', marginTop: 8 },
});
