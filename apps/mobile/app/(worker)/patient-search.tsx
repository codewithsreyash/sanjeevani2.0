import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, UserCheck, ChevronRight } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BottomNavigation from '../../components/ui/BottomNavigation';
import { DEMO_FAMILY_MEMBERS } from '../../store/patientStore';

export default function PatientSearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const filtered = DEMO_FAMILY_MEMBERS.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.mockAbhaId.includes(query)
  );

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />

        <View style={s.body}>
          <Text style={s.title}>COMMUNITY PATIENT DIRECTORY</Text>
          <Text style={s.sub}>
            Search offline cached patients by name, village sector, or ABHA ID
          </Text>

          <View style={s.searchBox}>
            <Search size={18} color="#5A6473" />
            <TextInput
              placeholder="Type patient name, ABHA or mobile number..."
              value={query}
              onChangeText={setQuery}
              style={s.searchInput}
              placeholderTextColor="#94A3B8"
            />
          </View>

          {filtered.map((patient) => (
            <Card key={patient.id}>
              <View style={s.patientHeader}>
                <View style={s.patientLeft}>
                  <View style={s.avatarBox}>
                    <UserCheck size={20} color="#06469B" />
                  </View>
                  <View style={s.patientInfo}>
                    <Text style={s.patientName}>{patient.name}</Text>
                    <Text style={s.patientMeta}>
                      {patient.age} yrs • {patient.gender} • Sector 2
                    </Text>
                  </View>
                </View>
                <Badge label="ASSIGNED" type="COMPLETED" size="sm" />
              </View>

              <View style={s.abhaBox}>
                <Text style={s.abhaText}>ABHA: {patient.mockAbhaId}</Text>
                <Text style={s.syncText}>Local Sync OK</Text>
              </View>

              <TouchableOpacity
                onPress={() => router.push('/(worker)/vitals-symptoms')}
                style={s.actionBtn}
              >
                <Text style={s.actionBtnText}>Open Patient File & Record Vitals</Text>
                <ChevronRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </Card>
          ))}
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
  searchBox: { backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#1E293B' },
  patientHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  patientLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatarBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BFDBFE', marginRight: 12 },
  patientInfo: { flex: 1 },
  patientName: { fontWeight: '700', color: '#1E293B', fontSize: 15 },
  patientMeta: { color: '#64748B', fontSize: 12, marginTop: 2 },
  abhaBox: { backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  abhaText: { color: '#64748B', fontSize: 12 },
  syncText: { color: '#107C41', fontSize: 12, fontWeight: '700' },
  actionBtn: { backgroundColor: '#06469B', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  actionBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
});
