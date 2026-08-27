"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { PEDIDO_ESTADO_TONE, StatusBadge } from "@/components/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { Pedido } from "@/lib/types";
import { RowActions } from "./row-actions";

export function getPedidosColumns({
  onEdit,
  onDelete,
}: {
  onEdit: (pedido: Pedido) => void;
  onDelete: (pedido: Pedido) => void;
}): ColumnDef<Pedido, unknown>[] {
  return [
    { accessorKey: "numero", header: "Nº pedido" },
    { accessorKey: "clienteNombre", header: "Cliente" },
    { accessorKey: "producto", header: "Producto" },
    {
      accessorKey: "importe",
      header: "Importe",
      cell: ({ row }) => <span className="tabular-nums">{formatCurrency(row.original.importe)}</span>,
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <StatusBadge tone={PEDIDO_ESTADO_TONE[row.original.estado]} label={row.original.estado} />
      ),
    },
    {
      accessorKey: "fecha",
      header: "Fecha",
      cell: ({ row }) => formatDate(row.original.fecha),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <RowActions
          label={row.original.numero}
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      ),
    },
  ];
}
