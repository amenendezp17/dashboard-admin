"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table/data-table";
import { getClientesColumns } from "@/components/data-table/columns-clientes";
import { ClienteFormDialog } from "@/components/modals/cliente-form-dialog";
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientesStore } from "@/lib/stores/clientes-store";
import type { Cliente } from "@/lib/types";

export default function ClientesPage() {
  const clientes = useClientesStore((s) => s.items);
  const hasHydrated = useClientesStore((s) => s.hasHydrated);
  const remove = useClientesStore((s) => s.remove);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [deleting, setDeleting] = useState<Cliente | null>(null);

  const columns = getClientesColumns({
    onEdit: (cliente) => {
      setEditing(cliente);
      setFormOpen(true);
    },
    onDelete: (cliente) => setDeleting(cliente),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">Gestiona la cartera de clientes del panel.</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          Nuevo cliente
        </Button>
      </div>

      {hasHydrated ? (
        <DataTable columns={columns} data={clientes} searchPlaceholder="Buscar por nombre, email, empresa…" />
      ) : (
        <Skeleton className="h-96 w-full" />
      )}

      <ClienteFormDialog open={formOpen} onOpenChange={setFormOpen} cliente={editing} />
      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Eliminar a ${deleting?.nombre}`}
        description="Esta acción no se puede deshacer. El cliente se eliminará permanentemente del panel."
        onConfirm={() => {
          if (!deleting) return;
          remove(deleting.id);
          toast.success("Cliente eliminado");
        }}
      />
    </div>
  );
}
