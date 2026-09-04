import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, HeartPulse, QrCode, FileText, User, Search, ClipboardList, Stethoscope, Activity, BarChart2 } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { Role } from '@sanjeevani/shared-types';

const PRIMARY = '#06469B';
const INACTIVE = '#94A3B8';

export const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { role } = useAuthStore();

  const nav = (path: string) => { try { router.push(path as any); } catch { } };
  const isActive = (seg: string) => !!pathname?.includes(seg);
  const ic = (seg: string) => isActive(seg) ? PRIMARY : INACTIVE;

  const Tab = ({ path, seg, label, Icon }: { path: string; seg: string; label: string; Icon: any }) => (
    <TouchableOpacity onPress={() => nav(path)} style={s.tab}>
      <Icon size={22} color={ic(seg)} />
      <Text style={[s.tabLabel, { color: ic(seg), fontWeight: isActive(seg) ? '700' : '500' }]}>{label}</Text>
    </TouchableOpacity>
  );

  if (role === Role.PATIENT) {
    return (
      <View style={s.bar}>
        <Tab path="/(patient)/home" seg="/home" label="Home" Icon={Home} />
        <Tab path="/(patient)/my-care" seg="/my-care" label="My Care" Icon={HeartPulse} />
        <TouchableOpacity onPress={() => nav('/(patient)/qr-scan')} style={s.fab}>
          <QrCode size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Tab path="/(patient)/records" seg="/records" label="Records" Icon={FileText} />
        <Tab path="/(patient)/profile" seg="/profile" label="Profile" Icon={User} />
      </View>
    );
  }

  if (role === Role.HEALTH_WORKER) {
    return (
      <View style={s.bar}>
        <Tab path="/(worker)/dashboard" seg="/dashboard" label="Dashboard" Icon={Home} />
        <Tab path="/(worker)/patient-search" seg="/patient-search" label="Search" Icon={Search} />
        <TouchableOpacity onPress={() => nav('/(worker)/vitals-symptoms')} style={[s.fab, { backgroundColor: '#10A9CF' }]}>
          <HeartPulse size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Tab path="/(worker)/followups-list" seg="/followups-list" label="Follow-ups" Icon={ClipboardList} />
        <Tab path="/(patient)/profile" seg="/profile" label="Profile" Icon={User} />
      </View>
    );
  }

  if (role === Role.DOCTOR) {
    return (
      <View style={s.bar}>
        <Tab path="/(doctor)/queue" seg="/queue" label="Triage Queue" Icon={Activity} />
        <Tab path="/(doctor)/consultation" seg="/consultation" label="Consult" Icon={Stethoscope} />
        <Tab path="/(doctor)/referrals-manage" seg="/referrals-manage" label="Referrals" Icon={ClipboardList} />
        <Tab path="/(patient)/profile" seg="/profile" label="Profile" Icon={User} />
      </View>
    );
  }

  return (
    <View style={s.bar}>
      <Tab path="/(admin)/overview" seg="/overview" label="Overview" Icon={BarChart2} />
      <Tab path="/(admin)/referrals-monitor" seg="/referrals-monitor" label="Referral Loop" Icon={ClipboardList} />
      <Tab path="/(admin)/stock-alerts" seg="/stock-alerts" label="Stock Alerts" Icon={Activity} />
    </View>
  );
};

const s = StyleSheet.create({
  bar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  tab: { alignItems: 'center', justifyContent: 'center', flex: 1, paddingVertical: 4 },
  tabLabel: { fontSize: 10, marginTop: 3 },
  fab: {
    backgroundColor: PRIMARY,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
});

export default BottomNavigation;
