import { create } from "zustand";

interface UIState {
  isCartOpen: boolean;
  isMenuOpen: boolean;
  isAudioPlaying: boolean;
  setOpenCart: (open: boolean) => void;
  setOpenMenu: (open: boolean) => void;
  setAudioPlaying: (playing: boolean) => void;
  toggleAudio: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isMenuOpen: false,
  isAudioPlaying: false,
  
  setOpenCart: (open) => set({ isCartOpen: open }),
  setOpenMenu: (open) => set({ isMenuOpen: open }),
  setAudioPlaying: (playing) => set({ isAudioPlaying: playing }),
  toggleAudio: () => set((state) => ({ isAudioPlaying: !state.isAudioPlaying })),
}));
