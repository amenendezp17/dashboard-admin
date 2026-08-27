import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { SidebarPosition } from "@/lib/types";

interface LayoutState {
  position: SidebarPosition;
  hasHydrated: boolean;
  setPosition: (position: SidebarPosition) => void;
  _setHydrated: () => void;
}

/** Dónde vive la barra de navegación del panel — configurable en Ajustes. */
export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      position: "left",
      hasHydrated: false,
      setPosition: (position) => set({ position }),
      _setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name: "nimbus-layout",
      partialize: (state) => ({ position: state.position }) as Partial<LayoutState>,
      onRehydrateStorage: () => (state) => {
        state?._setHydrated();
      },
    },
  ),
);
