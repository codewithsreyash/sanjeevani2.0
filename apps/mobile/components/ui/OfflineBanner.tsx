import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react-native';
import { useNetworkStore } from '../../store/networkStore';
import { processSyncQueue } from '../../sync/syncEngine';

export const OfflineBanner: React.FC = () => {
  const { isOnline, pendingSyncCount, isSyncing, toggleOfflineForDemo } = useNetworkStore();

  const handleSync = async () => {
    await processSyncQueue();
  };

  if (isOnline && pendingSyncCount === 0) {
    return null;
  }

  return (
    <View style={[s.banner, { backgroundColor: !isOnline ? '#D97706' : '#043E7B' }]}>
      <TouchableOpacity onPress={toggleOfflineForDemo} activeOpacity={0.8} style={s.left}>
        {!isOnline ? (
          <WifiOff size={18} color="#FFFFFF" />
        ) : (
          <CheckCircle2 size={18} color="#10B981" />
        )}
        <View style={s.textBlock}>
          <Text style={s.title}>
            {!isOnline ? 'Offline Mode (Tap to toggle)' : 'Online Mode'}
          </Text>
          {pendingSyncCount > 0 && (
            <Text style={s.subtitle}>
              {pendingSyncCount} {pendingSyncCount === 1 ? 'update' : 'updates'} waiting to sync
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {pendingSyncCount > 0 && isOnline && (
        <TouchableOpacity onPress={handleSync} disabled={isSyncing} style={s.syncBtn}>
          {isSyncing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <RefreshCw size={12} color="#FFFFFF" />
              <Text style={s.syncText}>Sync Now</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const s = StyleSheet.create({
  banner: { paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  textBlock: { marginLeft: 8, flex: 1 },
  title: { color: '#FFFFFF', fontWeight: '600', fontSize: 12 },
  subtitle: { color: '#FDE68A', fontSize: 11, marginTop: 1 },
  syncBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, flexDirection: 'row', alignItems: 'center' },
  syncText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600', marginLeft: 4 },
});

export default OfflineBanner;
