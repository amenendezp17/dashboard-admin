import { create, type StoreApi, type UseBoundStore } from "zustand";
import { persist } from "zustand/middleware";

export interface EntityState<T extends { id: string }> {
  items: T[];
  hasHydrated: boolean;
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  _setHydrated: () => void;
}

/**
 * Fábrica de stores CRUD con persistencia en localStorage.
 *
 * `hasHydrated` empieza en false tanto en servidor como en el primer render
 * de cliente (mismo valor en ambos → sin desajuste de hidratación). Se pone
 * a true tras la rehidratación desde localStorage; las páginas deben esperar
 * a ese flag antes de pintar datos dependientes del storage.
 */
export function createEntityStore<T extends { id: string }>(
  storageKey: string,
  seed: T[],
): UseBoundStore<StoreApi<EntityState<T>>> {
  return create<EntityState<T>>()(
    persist(
      (set) => ({
        items: seed,
        hasHydrated: false,
        add: (item) => set((s) => ({ items: [item, ...s.items] })),
        update: (id, patch) =>
          set((s) => ({
            items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
          })),
        remove: (id) => set((s) => ({ items: s.items.filter((it) => it.id !== id) })),
        _setHydrated: () => set({ hasHydrated: true }),
      }),
      {
        name: storageKey,
        partialize: (state) => ({ items: state.items }) as Partial<EntityState<T>>,
        onRehydrateStorage: () => (state) => {
          state?._setHydrated();
        },
      },
    ),
  );
}
