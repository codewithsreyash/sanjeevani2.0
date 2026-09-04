import { create } from 'zustand';
import { Role, WorkerType } from '@sanjeevani/shared-types';

export interface UserProfile {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: Role;
  workerType?: WorkerType;
  facilityId?: string;
  facilityName?: string;
  village?: string;
  district?: string;
  mockAbhaId?: string;
  isAbhaLinked?: boolean;
}

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  role: Role;
  language: 'en' | 'mr' | 'hi';
  setLanguage: (lang: 'en' | 'mr' | 'hi') => void;
  loginDemo: (role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

export const DEMO_USERS: Record<Role, UserProfile> = {
  [Role.PATIENT]: {
    id: 'pat_ramesh_patil',
    fullName: 'Ramesh Patil',
    phoneNumber: '9876543210',
    role: Role.PATIENT,
    village: 'Shivapur',
    district: 'Pune',
    mockAbhaId: '91-8765-4321-0987',
    isAbhaLinked: true,
  },
  [Role.HEALTH_WORKER]: {
    id: 'wrk_sunita_more',
    fullName: 'Sunita More',
    phoneNumber: '9876543211',
    role: Role.HEALTH_WORKER,
    workerType: WorkerType.ASHA,
    facilityId: 'fac_shivapur_phc',
    facilityName: 'Shivapur PHC',
    village: 'Shivapur Sector 2',
    district: 'Pune',
  },
  [Role.DOCTOR]: {
    id: 'doc_ananya_deshmukh',
    fullName: 'Dr. Ananya Deshmukh',
    phoneNumber: '9876543212',
    role: Role.DOCTOR,
    facilityId: 'fac_mulshi_rh',
    facilityName: 'Mulshi Rural Hospital',
    district: 'Pune',
  },
  [Role.ADMIN]: {
    id: 'adm_pune_district',
    fullName: 'S. K. Kulkarni',
    phoneNumber: '9876543213',
    role: Role.ADMIN,
    district: 'Pune District',
  },
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true, // Default to authenticated demo state for smooth review
  user: DEMO_USERS[Role.PATIENT],
  role: Role.PATIENT,
  language: 'en',
  setLanguage: (language) => set({ language }),
  loginDemo: (role) => {
    set({
      isAuthenticated: true,
      role,
      user: DEMO_USERS[role],
    });
  },
  logout: () => set({ isAuthenticated: false, user: null }),
  switchRole: (role) => {
    set({
      role,
      user: DEMO_USERS[role],
    });
  },
}));
