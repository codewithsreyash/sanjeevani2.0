import { create } from 'zustand';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  age: number;
  gender: string;
  mockAbhaId: string;
}

export const DEMO_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'pat_ramesh_patil',
    name: 'Ramesh Patil',
    relationship: 'Self',
    age: 42,
    gender: 'Male',
    mockAbhaId: '91-8765-4321-0987',
  },
  {
    id: 'pat_sunita_patil',
    name: 'Sunita Patil',
    relationship: 'Spouse',
    age: 38,
    gender: 'Female',
    mockAbhaId: '91-8765-4321-0988',
  },
  {
    id: 'pat_aarav_patil',
    name: 'Aarav Patil',
    relationship: 'Child (Son)',
    age: 8,
    gender: 'Male',
    mockAbhaId: '91-8765-4321-0989',
  },
  {
    id: 'pat_parvati_patil',
    name: 'Parvati Patil',
    relationship: 'Dependent (Mother)',
    age: 68,
    gender: 'Female',
    mockAbhaId: '91-8765-4321-0990',
  },
];

interface PatientState {
  activeMember: FamilyMember;
  familyMembers: FamilyMember[];
  setActiveMember: (member: FamilyMember) => void;
  addFamilyMember: (member: FamilyMember) => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  activeMember: DEMO_FAMILY_MEMBERS[0],
  familyMembers: DEMO_FAMILY_MEMBERS,
  setActiveMember: (activeMember) => set({ activeMember }),
  addFamilyMember: (member) =>
    set((state) => ({ familyMembers: [...state.familyMembers, member] })),
}));
