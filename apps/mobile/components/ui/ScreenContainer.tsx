import React from 'react';
import { View, ScrollView, StatusBar, StyleProp, ViewStyle, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import OfflineBanner from './OfflineBanner';

interface ScreenContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = true,
  style,
  contentContainerStyle,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.root, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]}>
      <StatusBar barStyle="light-content" backgroundColor="#06469B" translucent={false} />
      <OfflineBanner />
      {scrollable ? (
        <ScrollView
          style={[s.flex, style]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[{ paddingBottom: 32 }, contentContainerStyle]}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[s.flex, style]}>{children}</View>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F8FAFC' },
  flex: { flex: 1 },
});

export default ScreenContainer;
