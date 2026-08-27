"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClienteCombobox } from "./cliente-combobox";
import { useClientesStore } from "@/lib/stores/clientes-store";
import { usePedidosStore } from "@/lib/stores/pedidos-store";
import type { Pedido } from "@/lib/types";

const schema = z.object({
  clienteId: z.string().min(1, "Selecciona un cliente"),
  producto: z.string().trim().min(2, "Mínimo 2 caracteres"),
  importe: z.coerce.number().min(0, "Debe ser 0 o mayor"),
  estado: z.enum(["pendiente", "procesando", "enviado", "entregado", "cancelado"]),
  fecha: z.string().min(1, "Fecha requerida"),
});

type FormValues = z.infer<typeof schema>;

interface PedidoFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido?: Pedido | null;
}

function toDateInput(iso: string): string {
  return iso.slice(0, 10);
}

/** Modal de creación/edición de un pedido. */
export function PedidoFormDialog({ open, onOpenChange, pedido }: PedidoFormDialogProps) {
  const clientes = useClientesStore((s) => s.items);
  const pedidos = usePedidosStore((s) => s.items);
  const add = usePedidosStore((s) => s.add);
  const update = usePedidosStore((s) => s.update);
  const isEditing = Boolean(pedido);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      clienteId: "",
      producto: "",
      importe: 0,
      estado: "pendiente",
      fecha: toDateInput(new Date().toISOString()),
    },
  });

  useEffect(() => {
    if (open) {
      reset(
        pedido
          ? {
              clienteId: pedido.clienteId,
              producto: pedido.producto,
              importe: pedido.importe,
              estado: pedido.estado,
              fecha: toDateInput(pedido.fecha),
            }
          : {
              clienteId: clientes[0]?.id ?? "",
              producto: "",
              importe: 0,
              estado: "pendiente",
              fecha: toDateInput(new Date().toISOString()),
            },
      );
    }
    // clientes intencionalmente fuera de deps: solo se usa como default inicial al abrir.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pedido, reset]);

  function onSubmit(values: FormValues) {
    const cliente = clientes.find((c) => c.id === values.clienteId);
    const clienteNombre = cliente?.nombre ?? "—";
    const fechaISO = new Date(values.fecha).toISOString();

    if (pedido) {
      update(pedido.id, { ...values, clienteNombre, fecha: fechaISO });
      toast.success("Pedido actualizado");
    } else {
      const numero = `PED-${1000 + pedidos.length}`;
      add({ id: crypto.randomUUID(), numero, clienteNombre, ...values, fecha: fechaISO });
      toast.success("Pedido creado");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar pedido" : "Nuevo pedido"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Actualiza los datos del pedido." : "Registra un nuevo pedido."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="pedido-cliente">Cliente</Label>
              <Controller
                control={control}
                name="clienteId"
                render={({ field }) => (
                  <ClienteCombobox id="pedido-cliente" clientes={clientes} value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.clienteId && <p className="text-sm text-destructive">{errors.clienteId.message}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="pedido-producto">Producto</Label>
              <Input id="pedido-producto" {...register("producto")} aria-invalid={!!errors.producto} />
              {errors.producto && <p className="text-sm text-destructive">{errors.producto.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="pedido-importe">Importe (€)</Label>
                <Input
                  id="pedido-importe"
                  type="number"
                  min={0}
                  step={1}
                  {...register("importe")}
                  aria-invalid={!!errors.importe}
                />
                {errors.importe && <p className="text-sm text-destructive">{errors.importe.message}</p>}
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="pedido-fecha">Fecha</Label>
                <Input id="pedido-fecha" type="date" {...register("fecha")} aria-invalid={!!errors.fecha} />
                {errors.fecha && <p className="text-sm text-destructive">{errors.fecha.message}</p>}
              </div>
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="pedido-estado">Estado</Label>
              <Controller
                control={control}
                name="estado"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="pedido-estado">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="procesando">Procesando</SelectItem>
                      <SelectItem value="enviado">Enviado</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || clientes.length === 0}>
              {isEditing ? "Guardar cambios" : "Crear pedido"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
