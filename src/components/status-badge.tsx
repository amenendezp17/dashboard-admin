import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  danger: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-300",
  info: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
  neutral: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
};

/** Chip de estado — el color codifica el significado, no la marca. */
export function StatusBadge({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
        TONE_CLASSES[tone],
      )}
    >
      {label}
    </span>
  );
}

export const CLIENTE_ESTADO_TONE: Record<string, Tone> = {
  activo: "success",
  potencial: "warning",
  inactivo: "neutral",
};

export const PEDIDO_ESTADO_TONE: Record<string, Tone> = {
  entregado: "success",
  enviado: "info",
  procesando: "neutral",
  pendiente: "warning",
  cancelado: "danger",
};

export const USUARIO_ESTADO_TONE: Record<string, Tone> = {
  activo: "success",
  invitado: "warning",
  suspendido: "danger",
};
