"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { CLIENTE_ESTADO_TONE, StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Cliente } from "@/lib/types";
import { RowActions } from "./row-actions";

export function getClientesColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (cliente: Cliente) => void;
  onDelete: (cliente: Cliente) => void;
}): ColumnDef<Cliente, unknown>[] {
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
    { accessorKey: "empresa", header: "Empresa" },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <StatusBadge tone={CLIENTE_ESTADO_TONE[row.original.estado]} label={row.original.estado} />
      ),
    },
    {
      accessorKey: "fechaAlta",
      header: "Fecha de alta",
      cell: ({ row }) => formatDate(row.original.fechaAlta),
    },
    {
      accessorKey: "valorTotal",
      header: "Valor total",
      cell: ({ row }) => (
        <span className="tabular-nums">{formatCurrency(row.original.valorTotal)}</span>
      ),
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
