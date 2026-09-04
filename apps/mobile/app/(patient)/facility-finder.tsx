import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Search, Building2, MapPin, UserCheck, Clock, Activity, Pill } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';

export interface FacilityDemo {
  id: string;
  name: string;
  type: string;
  district: string;
  distanceKm: number;
  doctorAvailable: boolean;
  estimatedWaitMins: number;
  diagnosticsAvailable: boolean;
  medicinesAvailable: boolean;
  teleconsultAvailable: boolean;
  services: string[];
}

export const SYNTHETIC_FACILITIES: FacilityDemo[] = [
  {
    id: 'fac_shivapur_sub',
    name: 'Shivapur Sub Centre',
    type: 'Sub Centre',
    district: 'Pune',
    distanceKm: 1.1,
    doctorAvailable: false,
    estimatedWaitMins: 10,
    diagnosticsAvailable: true,
    medicinesAvailable: true,
    teleconsultAvailable: true,
    services: ['Vitals Capture', 'Basic Medicines', 'ASHA Assisted Teleconsultation'],
  },
  {
    id: 'fac_shivapur_phc',
    name: 'Shivapur Primary Health Centre (PHC)',
    type: 'Primary Health Centre',
    district: 'Pune',
    distanceKm: 2.4,
    doctorAvailable: true,
    estimatedWaitMins: 22,
    diagnosticsAvailable: true,
    medicinesAvailable: true,
    teleconsultAvailable: true,
    services: ['Medical Officer OPD', 'Pathology Lab', 'Maternal & Child Health', 'Essential Medicines'],
  },
  {
    id: 'fac_mulshi_rh',
    name: 'Mulshi Rural Hospital',
    type: 'Rural Hospital',
    district: 'Pune',
    distanceKm: 4.2,
    doctorAvailable: true,
    estimatedWaitMins: 35,
    diagnosticsAvailable: true,
    medicinesAvailable: true,
    teleconsultAvailable: true,
    services: ['Inpatient Ward', 'Emergency Care', 'X-Ray & Ultrasound', 'Specialist Consults', 'Referral Desk'],
  },
  {
    id: 'fac_pune_dh',
    name: 'Pune District Hospital (Aundh)',
    type: 'District Hospital',
    district: 'Pune',
    distanceKm: 18.5,
    doctorAvailable: true,
    estimatedWaitMins: 45,
    diagnosticsAvailable: true,
    medicinesAvailable: true,
    teleconsultAvailable: true,
    services: ['Multi-Specialty Care', 'ICU', 'Advanced Diagnostics', 'Comprehensive Pharmacy'],
  },
];

const FILTER_TYPES = ['ALL', 'Sub Centre', 'Primary Health Centre', 'Rural Hospital', 'District Hospital'];

export default function FacilityFinderScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const filteredFacilities = SYNTHETIC_FACILITIES.filter((fac) => {
    const matchesSearch = fac.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          fac.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'ALL' || fac.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />

        <View style={s.body}>
          <Text style={s.title}>FIND PUBLIC HEALTH FACILITY</Text>
          <Text style={s.sub}>
            Intelligent recommendation considering distance, doctor availability & stock
          </Text>

          {/* Search Bar */}
          <View style={s.searchBox}>
            <Search size={18} color="#5A6473" />
            <TextInput
              placeholder="Search facility name, block or service..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={s.searchInput}
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* Type Filter Pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filtersRow}>
            {FILTER_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setSelectedType(t)}
                style={[s.filterPill, selectedType === t && s.filterPillActive]}
              >
                <Text style={[s.filterPillText, selectedType === t && s.filterPillTextActive]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Facility Cards */}
          {filteredFacilities.map((facility) => (
            <Card key={facility.id}>
              <View style={s.facilityHeader}>
                <View style={s.facilityLeft}>
                  <Building2 size={18} color="#06469B" />
                  <View style={s.facilityInfo}>
                    <Text style={s.facilityName}>{facility.name}</Text>
                    <Text style={s.facilityType}>{facility.type} • {facility.district}</Text>
                  </View>
                </View>
                <View style={s.distanceBadge}>
                  <MapPin size={12} color="#06469B" />
                  <Text style={s.distanceText}>{facility.distanceKm} km</Text>
                </View>
              </View>

              {/* Capability Grid */}
              <View style={s.capabilityGrid}>
                <View style={s.capabilityItem}>
                  <UserCheck size={14} color={facility.doctorAvailable ? '#107C41' : '#D97706'} />
                  <Text style={s.capabilityText}>
                    Doctor: {facility.doctorAvailable ? 'Available' : 'CHO On-Duty'}
                  </Text>
                </View>

                <View style={s.capabilityItem}>
                  <Clock size={14} color="#06469B" />
                  <Text style={s.capabilityText}>
                    Wait: ~{facility.estimatedWaitMins} mins
                  </Text>
                </View>

                <View style={s.capabilityItem}>
                  <Activity size={14} color={facility.diagnosticsAvailable ? '#107C41' : '#DC2626'} />
                  <Text style={s.capabilityText}>
                    Lab: {facility.diagnosticsAvailable ? 'Available' : 'Limited'}
                  </Text>
                </View>

                <View style={s.capabilityItem}>
                  <Pill size={14} color={facility.medicinesAvailable ? '#107C41' : '#DC2626'} />
                  <Text style={s.capabilityText}>
                    Stock: {facility.medicinesAvailable ? 'In Stock' : 'Low Stock'}
                  </Text>
                </View>
              </View>

              <Button
                title="Book Visit / Get Queue Token"
                variant="primary"
                size="sm"
                onPress={() => router.push('/(patient)/appointment-booking')}
                style={{ marginTop: 4 }}
              />
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
  searchBox: { backgroundColor: '#FFFFFF', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 14, color: '#1E293B' },
  filtersRow: { marginBottom: 16 },
  filterPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginRight: 8, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0' },
  filterPillActive: { backgroundColor: '#06469B', borderColor: '#06469B' },
  filterPillText: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  filterPillTextActive: { color: '#FFFFFF' },
  facilityHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 },
  facilityLeft: { flexDirection: 'row', alignItems: 'flex-start', flex: 1, marginRight: 8 },
  facilityInfo: { marginLeft: 8, flex: 1 },
  facilityName: { fontWeight: '700', color: '#1E293B', fontSize: 14 },
  facilityType: { color: '#06469B', fontWeight: '600', fontSize: 12, marginTop: 2 },
  distanceBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: '#BFDBFE', flexDirection: 'row', alignItems: 'center' },
  distanceText: { color: '#06469B', fontWeight: '700', fontSize: 12, marginLeft: 4 },
  capabilityGrid: { backgroundColor: '#F8FAFC', padding: 12, borderRadius: 12, marginBottom: 12, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  capabilityItem: { width: '48%', flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  capabilityText: { fontSize: 12, color: '#1E293B', marginLeft: 6, fontWeight: '500' },
});
