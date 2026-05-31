import { create } from 'zustand';

interface UiState {
  selectedStudentId: string;
  setSelectedStudentId: (id: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  selectedStudentId: 'stu_001',
  setSelectedStudentId: (id) => set({ selectedStudentId: id }),
}));