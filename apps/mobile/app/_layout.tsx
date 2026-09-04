import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetInfo from '@react-native-community/netinfo';
import '../i18n'; // Initialize i18next
import { getLocalDB } from '../database/db';
import { useNetworkStore } from '../store/networkStore';

const queryClient = new QueryClient();

function NetworkListener() {
  const { setOnline } = useNetworkStore();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOnline(!!state.isConnected);
    });
    return () => unsubscribe();
  }, [setOnline]);

  return null;
}

export default function RootLayout() {
  useEffect(() => {
    // Initialize SQLite local database on app launch
    getLocalDB().catch((err) => console.error('Failed to init SQLite DB:', err));
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <NetworkListener />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)/role-select" />
          <Stack.Screen name="(patient)" />
          <Stack.Screen name="(worker)" />
          <Stack.Screen name="(doctor)" />
          <Stack.Screen name="(admin)" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
