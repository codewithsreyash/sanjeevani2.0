import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pill } from 'lucide-react-native';
import { ScreenContainer } from '../../components/ui/ScreenContainer';
import Header from '../../components/ui/Header';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import BottomNavigation from '../../components/ui/BottomNavigation';

export default function StockAlertsScreen() {
  const alerts = [
    {
      facility: 'Shivapur Primary Health Centre',
      medicine: 'Amoxicillin 500mg Tablets',
      status: 'OUT_OF_STOCK',
      quantity: 0,
      reorderLevel: 200,
      alternative: 'Available at Mulshi Rural Hospital (4.2 km)',
    },
    {
      facility: 'Shivapur Sub Centre',
      medicine: 'Iron Folic Acid (IFA) Tablets',
      status: 'LOW_STOCK',
      quantity: 45,
      reorderLevel: 150,
      alternative: 'Sufficient stock at Shivapur PHC',
    },
    {
      facility: 'Mulshi Rural Hospital',
      medicine: 'Paracetamol 500mg Tablets',
      status: 'AVAILABLE',
      quantity: 1200,
      reorderLevel: 300,
      alternative: 'Stock level optimal',
    },
  ];

  return (
    <View style={s.root}>
      <ScreenContainer scrollable={true}>
        <Header />

        <View style={s.body}>
          <Text style={s.title}>DISTRICT MEDICINE STOCK ALERTS</Text>
          <Text style={s.sub}>
            Real-time pharmacy inventory monitor across facilities
          </Text>

          {alerts.map((item, idx) => (
            <Card key={idx}>
              <View style={s.headerRow}>
                <View style={s.medicineRow}>
                  <Pill size={18} color="#06469B" />
                  <Text style={s.medicineName}>{item.medicine}</Text>
                </View>
                <Badge label={item.status} type={item.status} size="sm" />
              </View>

              <Text style={s.facilityText}>{item.facility}</Text>
              <Text style={s.quantityText}>
                Current Stock: <Text style={s.boldText}>{item.quantity} units</Text> (Reorder threshold: {item.reorderLevel})
              </Text>

              <View style={s.altBox}>
                <Text style={s.altText}>
                  <Text style={s.altTitle}>Inter-Facility Supply Recommendation:</Text> {item.alternative}
                </Text>
              </View>
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
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  medicineRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  medicineName: { fontWeight: '700', color: '#1E293B', fontSize: 14, marginLeft: 8, flex: 1 },
  facilityText: { color: '#06469B', fontWeight: '600', fontSize: 12, marginBottom: 4 },
  quantityText: { color: '#64748B', fontSize: 12, marginBottom: 8 },
  boldText: { fontWeight: '700', color: '#1E293B' },
  altBox: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  altText: { color: '#64748B', fontSize: 12 },
  altTitle: { fontWeight: '700', color: '#06469B' },
});
