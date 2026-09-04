import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';

export default function WorkerLayout() {
  return (
    <View style={s.root}>
      <Slot />
    </View>
  );
}

const s = StyleSheet.create({ root: { flex: 1, backgroundColor: '#F8FAFC' } });
