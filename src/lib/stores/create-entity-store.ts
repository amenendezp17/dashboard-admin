import { create, type StoreApi, type UseBoundStore } from "zustand";

export interface EntityState<T extends { id: string }> {
  items: T[];
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  /** Vuelve al dataset de ejemplo original — usado por "Restablecer datos de ejemplo". */
  reset: () => void;
}

/**
 * Fábrica de stores CRUD en memoria (sin persistencia).
 *
 * Es una demo pública: el estado vive solo durante la sesión del navegador.
 * Un F5 vuelve siempre a los datos de ejemplo — nadie puede dejar el dataset
 * roto de forma permanente para el siguiente visitante. `seed` nunca se muta
 * (add/update/remove siempre crean arrays nuevos), así que sirve como target
 * estable para `reset()`.
 */
export function createEntityStore<T extends { id: string }>(
  seed: T[],
): UseBoundStore<StoreApi<EntityState<T>>> {
  return create<EntityState<T>>()((set) => ({
    items: seed,
    add: (item) => set((s) => ({ items: [item, ...s.items] })),
    update: (id, patch) =>
      set((s) => ({
        items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
      })),
    remove: (id) => set((s) => ({ items: s.items.filter((it) => it.id !== id) })),
    reset: () => set({ items: seed }),
  }));
}
