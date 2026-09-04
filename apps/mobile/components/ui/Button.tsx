import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleProp, ViewStyle, TextStyle, StyleSheet } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const VARIANT_BG: Record<string, string> = {
  primary: '#06469B',
  secondary: '#10A9CF',
  outline: 'transparent',
  danger: '#DC2626',
  success: '#107C41',
};
const VARIANT_BORDER: Record<string, string> = {
  primary: '#06469B',
  secondary: '#10A9CF',
  outline: '#06469B',
  danger: '#DC2626',
  success: '#107C41',
};
const VARIANT_TEXT: Record<string, string> = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  outline: '#06469B',
  danger: '#FFFFFF',
  success: '#FFFFFF',
};
const SIZE_PY: Record<string, number> = { sm: 8, md: 14, lg: 16 };
const SIZE_PX: Record<string, number> = { sm: 12, md: 20, lg: 24 };
const SIZE_MINH: Record<string, number> = { sm: 38, md: 48, lg: 56 };

export const Button: React.FC<ButtonProps> = ({
  title, onPress, variant = 'primary', size = 'md',
  loading = false, disabled = false, icon, style, textStyle,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[
        s.btn,
        {
          backgroundColor: VARIANT_BG[variant],
          borderColor: VARIANT_BORDER[variant],
          paddingVertical: SIZE_PY[size],
          paddingHorizontal: SIZE_PX[size],
          minHeight: SIZE_MINH[size],
          opacity: disabled ? 0.5 : 1,
          borderWidth: variant === 'outline' ? 2 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={VARIANT_TEXT[variant]} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[s.btnText, { color: VARIANT_TEXT[variant], marginLeft: icon ? 8 : 0 }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const s = StyleSheet.create({
  btn: {
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  btnText: { fontSize: 14, fontWeight: '700', textAlign: 'center' },
});

export default Button;
