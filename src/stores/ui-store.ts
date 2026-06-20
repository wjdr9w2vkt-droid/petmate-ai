import { create } from 'zustand'

interface UiState {
  isSidebarOpen: boolean
  selectedPetId: string | null
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setSelectedPetId: (id: string | null) => void
}

export const useUiStore = create<UiState>()((set) => ({
  isSidebarOpen: false,
  selectedPetId: null,
  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setSelectedPetId: (id) => set({ selectedPetId: id }),
}))
