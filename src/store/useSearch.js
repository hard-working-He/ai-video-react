import { create } from 'zustand';

export const useSearchStore = create((set) => ({
  searchParams: '',
  setSearchParams: (searchParams) => set({ searchParams }),
}));

