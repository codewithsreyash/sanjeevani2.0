import { create } from 'zustand';

interface NetworkState {
  isOnline: boolean;
  pendingSyncCount: number;
  isSyncing: boolean;
  setOnline: (status: boolean) => void;
  toggleOfflineForDemo: () => void;
  setPendingCount: (count: number) => void;
  incrementPending: () => void;
  setIsSyncing: (status: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isOnline: true,
  pendingSyncCount: 0,
  isSyncing: false,
  setOnline: (isOnline) => set({ isOnline }),
  toggleOfflineForDemo: () => set((state) => ({ isOnline: !state.isOnline })),
  setPendingCount: (pendingSyncCount) => set({ pendingSyncCount }),
  incrementPending: () => set((state) => ({ pendingSyncCount: state.pendingSyncCount + 1 })),
  setIsSyncing: (isSyncing) => set({ isSyncing }),
}));
