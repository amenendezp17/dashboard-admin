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
import { useClientesStore } from "@/lib/stores/clientes-store";
import type { Cliente } from "@/lib/types";

const schema = z.object({
  nombre: z.string().trim().min(2, "Mínimo 2 caracteres"),
  email: z.string().trim().email("Email no válido"),
  empresa: z.string().trim().min(2, "Mínimo 2 caracteres"),
  estado: z.enum(["activo", "inactivo", "potencial"]),
  valorTotal: z.coerce.number().min(0, "Debe ser 0 o mayor"),
});

type FormValues = z.infer<typeof schema>;

interface ClienteFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente | null;
}

/** Modal de creación/edición de un cliente. */
export function ClienteFormDialog({ open, onOpenChange, cliente }: ClienteFormDialogProps) {
  const add = useClientesStore((s) => s.add);
  const update = useClientesStore((s) => s.update);
  const isEditing = Boolean(cliente);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", email: "", empresa: "", estado: "potencial", valorTotal: 0 },
  });

  useEffect(() => {
    if (open) {
      reset(
        cliente
          ? {
              nombre: cliente.nombre,
              email: cliente.email,
              empresa: cliente.empresa,
              estado: cliente.estado,
              valorTotal: cliente.valorTotal,
            }
          : { nombre: "", email: "", empresa: "", estado: "potencial", valorTotal: 0 },
      );
    }
  }, [open, cliente, reset]);

  function onSubmit(values: FormValues) {
    if (cliente) {
      update(cliente.id, values);
      toast.success("Cliente actualizado");
    } else {
      add({ id: crypto.randomUUID(), fechaAlta: new Date().toISOString(), ...values });
      toast.success("Cliente creado");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar cliente" : "Nuevo cliente"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Actualiza los datos del cliente." : "Añade un cliente al panel."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="cliente-nombre">Nombre</Label>
              <Input id="cliente-nombre" {...register("nombre")} aria-invalid={!!errors.nombre} />
              {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="cliente-email">Email</Label>
              <Input id="cliente-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="cliente-empresa">Empresa</Label>
              <Input id="cliente-empresa" {...register("empresa")} aria-invalid={!!errors.empresa} />
              {errors.empresa && <p className="text-sm text-destructive">{errors.empresa.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="cliente-estado">Estado</Label>
                <Controller
                  control={control}
                  name="estado"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="cliente-estado">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="potencial">Potencial</SelectItem>
                        <SelectItem value="inactivo">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="cliente-valor">Valor total (€)</Label>
                <Input
                  id="cliente-valor"
                  type="number"
                  min={0}
                  step={1}
                  {...register("valorTotal")}
                  aria-invalid={!!errors.valorTotal}
                />
                {errors.valorTotal && (
                  <p className="text-sm text-destructive">{errors.valorTotal.message}</p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Guardar cambios" : "Crear cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
