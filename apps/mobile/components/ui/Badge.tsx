import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ShieldAlert, AlertTriangle, Clock, CheckCircle2, Info } from 'lucide-react-native';
import { PriorityLevel, ReferralStatus } from '@sanjeevani/shared-types';

interface BadgeProps {
  label?: string;
  type?: PriorityLevel | ReferralStatus | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, type, size = 'md' }) => {
  const displayLabel = label || type || 'STATUS';
  const upper = (type || displayLabel).toString().toUpperCase();

  let bg = '#EFF6FF';
  let border = '#BFDBFE';
  let textColor = '#06469B';
  let IconComponent = Info;
  let iconColor = '#06469B';

  if (upper === PriorityLevel.ROUTINE || upper === 'COMPLETED' || upper === 'OUTCOME_RECORDED') {
    bg = '#F0FDF4'; border = '#86EFAC'; textColor = '#166534';
    IconComponent = CheckCircle2; iconColor = '#107C41';
  } else if (upper === PriorityLevel.PRIORITY || upper === 'PENDING' || upper === 'SENT') {
    bg = '#FFFBEB'; border = '#FCD34D'; textColor = '#92400E';
    IconComponent = Clock; iconColor = '#D97706';
  } else if (upper === PriorityLevel.HIGH || upper === 'ACCEPTED' || upper === 'APPOINTMENT_SCHEDULED' || upper === 'SCHEDULED') {
    bg = '#FFF7ED'; border = '#FDBA74'; textColor = '#7C2D12';
    IconComponent = AlertTriangle; iconColor = '#EA580C';
  } else if (upper === PriorityLevel.EMERGENCY || upper === 'CRITICAL' || upper === 'OVERDUE') {
    bg = '#FEF2F2'; border = '#FCA5A5'; textColor = '#7F1D1D';
    IconComponent = ShieldAlert; iconColor = '#DC2626';
  }

  const iconSize = size === 'sm' ? 11 : 13;
  const fontSize = size === 'sm' ? 10 : 11;
  const px = size === 'sm' ? 7 : 10;
  const py = size === 'sm' ? 2 : 4;

  return (
    <View style={[s.badge, { backgroundColor: bg, borderColor: border, paddingHorizontal: px, paddingVertical: py }]}>
      <IconComponent size={iconSize} color={iconColor} />
      <Text style={[s.label, { color: textColor, fontSize, marginLeft: 4 }]}>{displayLabel}</Text>
    </View>
  );
};

const s = StyleSheet.create({
  badge: {
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: { fontWeight: '700' },
});

export default Badge;
