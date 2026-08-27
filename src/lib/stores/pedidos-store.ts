import { MOCK_PEDIDOS } from "@/lib/mock-data";
import type { Pedido } from "@/lib/types";
import { createEntityStore } from "./create-entity-store";

export const usePedidosStore = createEntityStore<Pedido>("nimbus-pedidos", MOCK_PEDIDOS);
