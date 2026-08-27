"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { getPedidosColumns } from "@/components/data-table/columns-pedidos";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog";
import { PedidoFormDialog } from "@/components/modals/pedido-form-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePedidosStore } from "@/lib/stores/pedidos-store";
import type { Pedido } from "@/lib/types";

export default function PedidosPage() {
  const pedidos = usePedidosStore((s) => s.items);
  const hasHydrated = usePedidosStore((s) => s.hasHydrated);
  const remove = usePedidosStore((s) => s.remove);

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
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-sm text-muted-foreground">Sigue el estado de cada pedido.</p>
        </div>
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

      {hasHydrated ? (
        <DataTable columns={columns} data={pedidos} searchPlaceholder="Buscar por nº, cliente, producto…" />
      ) : (
        <Skeleton className="h-96 w-full" />
      )}

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
