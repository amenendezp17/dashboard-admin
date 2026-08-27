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
import { useUsuariosStore } from "@/lib/stores/usuarios-store";
import type { Usuario } from "@/lib/types";

const schema = z.object({
  nombre: z.string().trim().min(2, "Mínimo 2 caracteres"),
  email: z.string().trim().email("Email no válido"),
  rol: z.enum(["admin", "editor", "viewer"]),
  plan: z.enum(["free", "pro", "enterprise"]),
  estado: z.enum(["activo", "suspendido", "invitado"]),
});

type FormValues = z.infer<typeof schema>;

interface UsuarioFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario?: Usuario | null;
}

/** Modal de creación/edición de un usuario. */
export function UsuarioFormDialog({ open, onOpenChange, usuario }: UsuarioFormDialogProps) {
  const add = useUsuariosStore((s) => s.add);
  const update = useUsuariosStore((s) => s.update);
  const isEditing = Boolean(usuario);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nombre: "", email: "", rol: "viewer", plan: "free", estado: "invitado" },
  });

  useEffect(() => {
    if (open) {
      reset(
        usuario
          ? {
              nombre: usuario.nombre,
              email: usuario.email,
              rol: usuario.rol,
              plan: usuario.plan,
              estado: usuario.estado,
            }
          : { nombre: "", email: "", rol: "viewer", plan: "free", estado: "invitado" },
      );
    }
  }, [open, usuario, reset]);

  function onSubmit(values: FormValues) {
    if (usuario) {
      update(usuario.id, values);
      toast.success("Usuario actualizado");
    } else {
      add({ id: crypto.randomUUID(), fechaAlta: new Date().toISOString(), ...values });
      toast.success("Usuario creado");
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Actualiza los datos del usuario." : "Invita a un nuevo usuario al panel."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-1.5">
              <Label htmlFor="usuario-nombre">Nombre</Label>
              <Input id="usuario-nombre" {...register("nombre")} aria-invalid={!!errors.nombre} />
              {errors.nombre && <p className="text-sm text-destructive">{errors.nombre.message}</p>}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="usuario-email">Email</Label>
              <Input id="usuario-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
              {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="usuario-rol">Rol</Label>
                <Controller
                  control={control}
                  name="rol"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="usuario-rol">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="usuario-plan">Plan</Label>
                <Controller
                  control={control}
                  name="plan"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="usuario-plan">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor="usuario-estado">Estado</Label>
                <Controller
                  control={control}
                  name="estado"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="usuario-estado">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="activo">Activo</SelectItem>
                        <SelectItem value="invitado">Invitado</SelectItem>
                        <SelectItem value="suspendido">Suspendido</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isEditing ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
