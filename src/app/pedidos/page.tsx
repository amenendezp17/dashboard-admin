"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { getPedidosColumns } from "@/components/data-table/columns-pedidos";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog";
import { PedidoFormDialog } from "@/components/modals/pedido-form-dialog";
import { DemoBadge } from "@/components/demo-badge";
import { ResetDataButton } from "@/components/reset-data-button";
import { Button } from "@/components/ui/button";
import { usePedidosStore } from "@/lib/stores/pedidos-store";
import type { Pedido } from "@/lib/types";

export default function PedidosPage() {
  const pedidos = usePedidosStore((s) => s.items);
  const remove = usePedidosStore((s) => s.remove);
  const reset = usePedidosStore((s) => s.reset);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Pedido | null>(null);
  const [deleting, setDeleting] = useState<Pedido | null>(null);

  const columns = getPedidosColumns({
    onEdit: (pedido) => {
      setEditing(pedido);
      setFormOpen(true);
    },
    onDelete: (pedido) => setDeleting(pedido),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-sm text-muted-foreground">Sigue el estado de cada pedido.</p>
          <DemoBadge />
        </div>
        <div className="flex items-center gap-2">
          <ResetDataButton label="los pedidos" onReset={reset} />
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Nuevo pedido
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={pedidos} searchPlaceholder="Buscar por nº, cliente, producto…" />

      <PedidoFormDialog open={formOpen} onOpenChange={setFormOpen} pedido={editing} />
      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Eliminar ${deleting?.numero}`}
        description="Esta acción no se puede deshacer. El pedido se eliminará permanentemente del panel."
        onConfirm={() => {
          if (!deleting) return;
          remove(deleting.id);
          toast.success("Pedido eliminado");
        }}
      />
    </div>
  );
}
