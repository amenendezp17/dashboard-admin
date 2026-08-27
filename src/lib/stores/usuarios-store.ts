import { MOCK_USUARIOS } from "@/lib/mock-data";
import type { Usuario } from "@/lib/types";
import { createEntityStore } from "./create-entity-store";

export const useUsuariosStore = createEntityStore<Usuario>(MOCK_USUARIOS);
