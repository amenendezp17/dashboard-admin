"use client";

import { RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ResetDataButtonProps {
  /** Nombre en femenino/masculino tal cual va en la frase, ej. "los clientes". */
  label: string;
  onReset: () => void;
}

/** Vuelve el dataset de una entidad a los datos de ejemplo, sin recargar la página. */
export function ResetDataButton({ label, onReset }: ResetDataButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <RotateCcw className="size-4" />
        Restablecer datos de ejemplo
      </Button>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Restablecer {label}?</AlertDialogTitle>
            <AlertDialogDescription>
              Se descartan los cambios hechos en esta sesión y vuelven los datos de ejemplo originales. No se puede
              deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onReset();
                setOpen(false);
                toast.success("Datos de ejemplo restablecidos");
              }}
            >
              Restablecer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
