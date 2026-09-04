import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { HeartPulse } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';
import { enqueueOfflineMutation } from '../../sync/syncEngine';

const SYMPTOM_CATEGORIES = [
  'Fever', 'Cough', 'Shortness of Breath', 'Headache',
  'Fatigue', 'Diarrhea', 'Chest Pain', 'Vomiting',
  'Body Ache', 'Rash', 'Dizziness', 'Loss of Appetite',
];

export default function VitalsSymptomsScreen() {
  const router = useRouter();

  const [spO2, setSpO2] = useState('92');
  const [temp, setTemp] = useState('38.5');
  const [heartRate, setHeartRate] = useState('98');
  const [systolic, setSystolic] = useState('130');
  const [diastolic, setDiastolic] = useState('85');
  const [weight, setWeight] = useState('65');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Fever', 'Shortness of Breath']);
  const [duration, setDuration] = useState('5');
  const [saved, setSaved] = useState(false);

  const toggleSymptom = (sym: string) =>
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((x) => x !== sym) : [...prev, sym]
    );

  const handleSaveAndTriage = async () => {
    // Save vitals to offline queue
    await enqueueOfflineMutation({
      clientUuid: `vit_${Date.now()}`,
      entityType: 'VITAL',
      operation: 'CREATE',
      payload: {
        patientId: 'pat_ramesh_patil',
        temperature: parseFloat(temp),
        heartRate: parseInt(heartRate),
        bloodPressure: `${systolic}/${diastolic}`,
        spO2: parseInt(spO2),
        weight: parseFloat(weight),
        recordedBy: 'wrk_sunita_more',
      },
    });

    // Save symptoms to offline queue
    await enqueueOfflineMutation({
      clientUuid: `sym_${Date.now()}`,
      entityType: 'SYMPTOM',
      operation: 'CREATE',
      payload: {
        patientId: 'pat_ramesh_patil',
        symptoms: selectedSymptoms,
        durationDays: parseInt(duration),
        recordedBy: 'wrk_sunita_more',
      },
    });

    // Navigate to triage with all params
    router.push({
      pathname: '/(worker)/triage-assessment',
      params: {
        spO2,
        temp,
        heartRate,
        systolic,
        diastolic,
        symptoms: selectedSymptoms.join(','),
        duration,
      },
    } as any);
  };

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />
        <View style={s.body}>
          <Text style={s.title}>VITALS & SYMPTOMS CAPTURE</Text>
          <Text style={s.sub}>Patient: Ramesh Patil, 42 yrs • Shivapur Sector 2</Text>

          {/* Vital Signs */}
          <Card>
            <Text style={s.sectionTitle}>Vital Signs</Text>
            <View style={s.vitalsGrid}>
              {[
                { label: 'SpO2 (%)', val: spO2, set: setSpO2, alert: parseFloat(spO2) < 93 },
                { label: 'Temperature (°C)', val: temp, set: setTemp, alert: parseFloat(temp) >= 38 },
                { label: 'Heart Rate (bpm)', val: heartRate, set: setHeartRate, alert: parseInt(heartRate) > 100 },
                { label: 'Weight (kg)', val: weight, set: setWeight, alert: false },
              ].map(({ label, val, set, alert }) => (
                <View key={label} style={s.vitalItem}>
                  <Text style={s.inputLabel}>{label}</Text>
                  <TextInput
                    value={val}
                    onChangeText={set}
                    keyboardType="numeric"
                    style={[s.input, alert && s.inputAlert]}
                  />
                </View>
              ))}

              {/* Blood Pressure */}
              <View style={s.vitalItemFull}>
                <Text style={s.inputLabel}>Blood Pressure (mmHg)</Text>
                <View style={s.bpRow}>
                  <TextInput
                    value={systolic}
                    onChangeText={setSystolic}
                    keyboardType="numeric"
                    style={[s.input, s.bpInput, parseInt(systolic) >= 140 && s.inputAlert]}
                    placeholder="Systolic"
                    placeholderTextColor="#94A3B8"
                  />
                  <Text style={s.bpSlash}>/</Text>
                  <TextInput
                    value={diastolic}
                    onChangeText={setDiastolic}
                    keyboardType="numeric"
                    style={[s.input, s.bpInput, parseInt(diastolic) >= 90 && s.inputAlert]}
                    placeholder="Diastolic"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>
          </Card>

          {/* Symptoms */}
          <Card>
            <Text style={s.sectionTitle}>Primary Symptoms</Text>
            <Text style={s.sectionSub}>Select all that apply</Text>
            <View style={s.symptomsWrap}>
              {SYMPTOM_CATEGORIES.map((sym) => {
                const sel = selectedSymptoms.includes(sym);
                return (
                  <TouchableOpacity
                    key={sym}
                    onPress={() => toggleSymptom(sym)}
                    style={[s.chip, sel && s.chipActive]}
                  >
                    <Text style={[s.chipText, sel && s.chipTextActive]}>{sym}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={s.inputLabel}>Symptom Duration (Days)</Text>
            <TextInput
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              style={s.input}
            />
          </Card>

          <Button
            title="Save & Run Digital Triage"
            variant="primary"
            icon={<HeartPulse size={18} color="#FFFFFF" />}
            onPress={handleSaveAndTriage}
          />
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
  sectionTitle: { color: '#1E293B', fontWeight: '700', fontSize: 15, marginBottom: 4 },
  sectionSub: { color: '#64748B', fontSize: 12, marginBottom: 12 },
  vitalsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  vitalItem: { width: '48%', marginBottom: 12 },
  vitalItemFull: { width: '100%', marginBottom: 12 },
  inputLabel: { color: '#64748B', fontSize: 11, fontWeight: '700', marginBottom: 6 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', padding: 12, borderRadius: 12, fontSize: 15, fontWeight: '700', color: '#1E293B' },
  inputAlert: { borderColor: '#FCA5A5', backgroundColor: '#FEF2F2' },
  bpRow: { flexDirection: 'row', alignItems: 'center' },
  bpInput: { flex: 1, textAlign: 'center' },
  bpSlash: { marginHorizontal: 8, fontWeight: '700', color: '#64748B', fontSize: 18 },
  symptomsWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10, marginRight: 8, marginBottom: 8, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0' },
  chipActive: { backgroundColor: '#06469B', borderColor: '#06469B' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#1E293B' },
  chipTextActive: { color: '#FFFFFF' },
});
