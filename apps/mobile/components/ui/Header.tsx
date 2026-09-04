import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { ShieldCheck, Globe, Bell, UserCheck, RefreshCw, ChevronDown, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { usePatientStore } from '../../store/patientStore';
import { Role } from '@sanjeevani/shared-types';

export const Header: React.FC = () => {
  const router = useRouter();
  const { user, role, language, setLanguage, switchRole } = useAuthStore();
  const { activeMember, familyMembers, setActiveMember } = usePatientStore();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showFamilyModal, setShowFamilyModal] = useState(false);

  const getRoleBadgeLabel = (r: Role) => {
    switch (r) {
      case Role.PATIENT: return 'Patient Mode';
      case Role.HEALTH_WORKER: return 'ASHA / ANM Mode';
      case Role.DOCTOR: return 'Doctor Mode';
      case Role.ADMIN: return 'Admin Mode';
    }
  };

  const handleSwitchRole = (r: Role) => {
    switchRole(r);
    setShowRoleModal(false);
    // Navigate to the correct home screen for the chosen role
    if (r === Role.PATIENT) router.replace('/(patient)/home');
    else if (r === Role.HEALTH_WORKER) router.replace('/(worker)/dashboard');
    else if (r === Role.DOCTOR) router.replace('/(doctor)/queue');
    else if (r === Role.ADMIN) router.replace('/(admin)/overview');
  };

  return (
    <View style={s.header}>
      {/* Top row */}
      <View style={s.topRow}>
        <View>
          <View style={s.logoRow}>
            <Text style={s.logoText}>SANJEEVANI</Text>
            <View style={s.prototypeBadge}>
              <Text style={s.prototypeText}>PROTOTYPE</Text>
            </View>
          </View>
          <Text style={s.subTitle}>Connected Public Healthcare</Text>
        </View>
        <View style={s.actions}>
          <TouchableOpacity onPress={() => setShowLangModal(true)} style={s.langBtn}>
            <Globe size={14} color="#FFFFFF" />
            <Text style={s.langText}>{language.toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowRoleModal(true)} style={s.roleBtn}>
            <RefreshCw size={12} color="#FFFFFF" />
            <Text style={s.roleBtnText}>Role</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.bellBtn}>
            <Bell size={16} color="#FFFFFF" />
            <View style={s.bellDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* User card */}
      <View style={s.userCard}>
        <View style={s.userLeft}>
          <View style={s.avatar}>
            <UserCheck size={20} color="#10A9CF" />
          </View>
          <View style={s.userInfo}>
            <View style={s.nameRow}>
              <Text style={s.nameText}>
                Hi, {role === Role.PATIENT ? activeMember.name : user?.fullName || 'User'}!
              </Text>
              {role === Role.PATIENT && (
                <TouchableOpacity onPress={() => setShowFamilyModal(true)} style={s.familyBtn}>
                  <Text style={s.familyBtnText}>{activeMember.relationship}</Text>
                  <ChevronDown size={10} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
            <View style={s.abhaRow}>
              <ShieldCheck size={12} color="#10B981" />
              <Text style={s.abhaText}>
                {role === Role.PATIENT
                  ? activeMember.mockAbhaId ? 'ABHA Linked' : 'ABHA Pending'
                  : user?.facilityName || user?.district || getRoleBadgeLabel(role)}
              </Text>
            </View>
          </View>
        </View>
        <View style={s.roleTag}>
          <Text style={s.roleTagText}>{getRoleBadgeLabel(role)}</Text>
        </View>
      </View>

      {/* Role Modal */}
      <Modal visible={showRoleModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>Switch Application Role</Text>
            <Text style={s.modalSub}>Experience Sanjeevani from different healthcare perspectives.</Text>
            {Object.values(Role).map((r) => (
              <TouchableOpacity
                key={r}
                onPress={() => handleSwitchRole(r)}
                style={[s.optionRow, role === r && s.optionActive]}
              >
                <View>
                  <Text style={s.optionLabel}>{getRoleBadgeLabel(r)}</Text>
                  <Text style={s.optionDesc}>
                    {r === Role.PATIENT && 'Citizen access, appointments & care history'}
                    {r === Role.HEALTH_WORKER && 'ASHA/ANM offline vitals, triage & outreach'}
                    {r === Role.DOCTOR && 'Priority queue, consultations & referrals'}
                    {r === Role.ADMIN && 'Operational KPIs, stock & referral audit'}
                  </Text>
                </View>
                {role === r && <Check size={18} color="#06469B" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowRoleModal(false)} style={s.cancelBtn}>
              <Text style={s.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Language Modal */}
      <Modal visible={showLangModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { maxWidth: 320 }]}>
            <Text style={s.modalTitle}>Select Language / भाषा</Text>
            {[['en', 'English'], ['mr', 'मराठी (Marathi)'], ['hi', 'हिंदी (Hindi)']].map(([code, label]) => (
              <TouchableOpacity
                key={code}
                onPress={() => { setLanguage(code as 'en' | 'mr' | 'hi'); setShowLangModal(false); }}
                style={[s.optionRow, language === code && s.optionActive]}
              >
                <Text style={s.optionLabel}>{label}</Text>
                {language === code && <Check size={16} color="#06469B" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowLangModal(false)} style={s.cancelBtn}>
              <Text style={s.cancelText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Family Modal */}
      <Modal visible={showFamilyModal} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={[s.modalBox, { maxWidth: 320 }]}>
            <Text style={s.modalTitle}>Switch Patient Profile</Text>
            <Text style={s.modalSub}>View records for linked family members</Text>
            {familyMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                onPress={() => { setActiveMember(member); setShowFamilyModal(false); }}
                style={[s.optionRow, activeMember.id === member.id && s.optionActive]}
              >
                <View>
                  <Text style={s.optionLabel}>{member.name}</Text>
                  <Text style={s.optionDesc}>{member.relationship} • {member.age} yrs</Text>
                </View>
                {activeMember.id === member.id && <Check size={16} color="#06469B" />}
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setShowFamilyModal(false)} style={s.cancelBtn}>
              <Text style={s.cancelText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const s = StyleSheet.create({
  header: { backgroundColor: '#06469B', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoText: { color: '#FFFFFF', fontWeight: '800', fontSize: 20, letterSpacing: 1 },
  prototypeBadge: { backgroundColor: 'rgba(16,169,207,0.3)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, marginLeft: 8 },
  prototypeText: { color: '#10A9CF', fontSize: 10, fontWeight: '700' },
  subTitle: { color: '#BFDBFE', fontSize: 12, fontWeight: '500', marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  langBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, flexDirection: 'row', alignItems: 'center' },
  langText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600', marginLeft: 4 },
  roleBtn: { backgroundColor: '#10A9CF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, flexDirection: 'row', alignItems: 'center' },
  roleBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', marginLeft: 4 },
  bellBtn: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 8, borderRadius: 999, position: 'relative' },
  bellDot: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  userCard: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  userLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(16,169,207,0.2)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(16,169,207,0.4)' },
  userInfo: { marginLeft: 12, flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  nameText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  familyBtn: { marginLeft: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  familyBtnText: { color: '#DBEAFE', fontSize: 10, fontWeight: '600' },
  abhaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  abhaText: { color: '#6EE7B7', fontSize: 11, fontWeight: '500', marginLeft: 4 },
  roleTag: { backgroundColor: '#043E7B', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(96,165,250,0.3)' },
  roleTagText: { color: '#10A9CF', fontSize: 11, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modalBox: { backgroundColor: '#FFFFFF', borderRadius: 24, padding: 20, width: '100%', maxWidth: 420 },
  modalTitle: { color: '#1E293B', fontWeight: '700', fontSize: 17, marginBottom: 4 },
  modalSub: { color: '#64748B', fontSize: 12, marginBottom: 16 },
  optionRow: { padding: 12, borderRadius: 16, marginBottom: 10, backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  optionActive: { backgroundColor: '#EFF6FF', borderColor: '#06469B' },
  optionLabel: { fontWeight: '700', color: '#1E293B', fontSize: 14 },
  optionDesc: { color: '#64748B', fontSize: 12, marginTop: 2 },
  cancelBtn: { marginTop: 8, paddingVertical: 10, alignItems: 'center' },
  cancelText: { color: '#64748B', fontWeight: '600', fontSize: 14 },
});

export default Header;
