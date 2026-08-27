import { MOCK_CLIENTES } from "@/lib/mock-data";
import type { Cliente } from "@/lib/types";
import { createEntityStore } from "./create-entity-store";

export const useClientesStore = createEntityStore<Cliente>("nimbus-clientes", MOCK_CLIENTES);
