"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { StatusBadge, USUARIO_ESTADO_TONE } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import type { Usuario } from "@/lib/types";
import { RowActions } from "./row-actions";

export function getUsuariosColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (usuario: Usuario) => void;
  onDelete: (usuario: Usuario) => void;
}): ColumnDef<Usuario, unknown>[] {
  return [
    {
      accessorKey: "nombre",
      header: "Nombre",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-foreground">{row.original.nombre}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    { accessorKey: "rol", header: "Rol" },
    { accessorKey: "plan", header: "Plan" },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <StatusBadge tone={USUARIO_ESTADO_TONE[row.original.estado]} label={row.original.estado} />
      ),
    },
    {
      accessorKey: "fechaAlta",
      header: "Fecha de alta",
      cell: ({ row }) => formatDate(row.original.fechaAlta),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions
          label={row.original.nombre}
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      ),
    },
  ];
}
