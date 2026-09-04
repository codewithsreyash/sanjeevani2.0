import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { QrCode, Camera, CheckCircle2, ArrowLeft } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import BottomNavigation from '../../components/ui/BottomNavigation';

export default function QRScanScreen() {
  const router = useRouter();
  const [scanned, setScanned] = useState(false);
  const [facilityContext, setFacilityContext] = useState<any>(null);

  const handleSimulateScan = () => {
    setScanned(true);
    setFacilityContext({
      facilityId: 'fac_shivapur_phc',
      facilityName: 'Shivapur Primary Health Centre (PHC)',
      desk: 'Desk 02 — Registration & Triage',
      tokenAssigned: 'A-017',
    });
  };

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />

        <View style={s.body}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <ArrowLeft size={18} color="#06469B" />
            <Text style={s.backText}>Back</Text>
          </TouchableOpacity>

          <Text style={s.title}>SCAN FACILITY QR CODE</Text>
          <Text style={s.sub}>
            Scan the QR token displayed at PHC/Hospital registration desk for instant queueing.
          </Text>

          {!scanned ? (
            <View style={s.scannerCard}>
              <View style={s.scannerViewfinder}>
                <QrCode size={96} color="#10A9CF" />
                <View style={s.alignBadge}>
                  <Text style={s.alignText}>ALIGN QR CODE</Text>
                </View>
              </View>

              <Text style={s.scannerHint}>
                Point camera at facility registration desk QR code. No sensitive health records are stored directly inside the QR.
              </Text>

              <Button
                title="Simulate Facility QR Scan (Demo)"
                variant="secondary"
                icon={<Camera size={18} color="#FFFFFF" />}
                onPress={handleSimulateScan}
                style={{ marginTop: 4 }}
              />
            </View>
          ) : (
            <View style={s.successCard}>
              <View style={s.successIconBox}>
                <CheckCircle2 size={32} color="#107C41" />
              </View>
              <Text style={s.successTitle}>QR Scan Successful!</Text>
              <Text style={s.successSub}>Facility context resolved securely</Text>

              <View style={s.facilityDetailBox}>
                <Text style={s.detailLabel}>REGISTERED FACILITY</Text>
                <Text style={s.detailFacilityName}>{facilityContext.facilityName}</Text>
                <Text style={s.detailDesk}>{facilityContext.desk}</Text>
                <View style={s.tokenRow}>
                  <Text style={s.tokenLabel}>Assigned Token:</Text>
                  <Text style={s.tokenValue}>{facilityContext.tokenAssigned}</Text>
                </View>
              </View>

              <Button
                title="View Queue Token Details"
                variant="success"
                onPress={() => router.push('/(patient)/appointment-booking')}
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
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  backText: { color: '#06469B', fontWeight: '600', fontSize: 13, marginLeft: 6 },
  title: { color: '#1E293B', fontWeight: '700', fontSize: 16, marginBottom: 4 },
  sub: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  scannerCard: { backgroundColor: '#0F172A', padding: 24, borderRadius: 24, alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 12, elevation: 8 },
  scannerViewfinder: { width: 224, height: 224, borderRadius: 16, borderWidth: 2, borderColor: '#10A9CF', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(16,169,207,0.1)', marginBottom: 20, position: 'relative' },
  alignBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(16,169,207,0.3)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  alignText: { color: '#10A9CF', fontSize: 10, fontWeight: '700' },
  scannerHint: { color: '#94A3B8', fontSize: 12, textAlign: 'center', marginBottom: 16, lineHeight: 18 },
  successCard: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', padding: 20, borderRadius: 24, alignItems: 'center' },
  successIconBox: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#BBF7D0', marginBottom: 12 },
  successTitle: { color: '#064E3B', fontWeight: '700', fontSize: 18, textAlign: 'center' },
  successSub: { color: '#065F46', fontSize: 12, textAlign: 'center', marginTop: 4 },
  facilityDetailBox: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#BBF7D0', width: '100%', marginTop: 16 },
  detailLabel: { color: '#64748B', fontSize: 11, fontWeight: '700', marginBottom: 4 },
  detailFacilityName: { fontWeight: '700', color: '#1E293B', fontSize: 15, marginBottom: 4 },
  detailDesk: { color: '#06469B', fontWeight: '600', fontSize: 12 },
  tokenRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  tokenLabel: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  tokenValue: { color: '#10A9CF', fontWeight: '800', fontSize: 22 },
});
