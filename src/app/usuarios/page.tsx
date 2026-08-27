"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { getUsuariosColumns } from "@/components/data-table/columns-usuarios";
import { DataTable } from "@/components/data-table/data-table";
import { DeleteConfirmDialog } from "@/components/modals/delete-confirm-dialog";
import { UsuarioFormDialog } from "@/components/modals/usuario-form-dialog";
import { DemoBadge } from "@/components/demo-badge";
import { ResetDataButton } from "@/components/reset-data-button";
import { Button } from "@/components/ui/button";
import { useUsuariosStore } from "@/lib/stores/usuarios-store";
import type { Usuario } from "@/lib/types";

export default function UsuariosPage() {
  const usuarios = useUsuariosStore((s) => s.items);
  const remove = useUsuariosStore((s) => s.remove);
  const reset = useUsuariosStore((s) => s.reset);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [deleting, setDeleting] = useState<Usuario | null>(null);

  const columns = getUsuariosColumns({
    onEdit: (usuario) => {
      setEditing(usuario);
      setFormOpen(true);
    },
    onDelete: (usuario) => setDeleting(usuario),
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-sm text-muted-foreground">Administra los usuarios de la app.</p>
          <DemoBadge />
        </div>
        <div className="flex items-center gap-2">
          <ResetDataButton label="los usuarios" onReset={reset} />
          <Button
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Nuevo usuario
          </Button>
        </div>
      </div>

      <DataTable columns={columns} data={usuarios} searchPlaceholder="Buscar por nombre, email…" />

      <UsuarioFormDialog open={formOpen} onOpenChange={setFormOpen} usuario={editing} />
      <DeleteConfirmDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Eliminar a ${deleting?.nombre}`}
        description="Esta acción no se puede deshacer. El usuario se eliminará permanentemente del panel."
        onConfirm={() => {
          if (!deleting) return;
          remove(deleting.id);
          toast.success("Usuario eliminado");
        }}
      />
    </div>
  );
}
