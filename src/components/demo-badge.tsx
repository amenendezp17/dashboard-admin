import { FlaskConical } from "lucide-react";

/** Aviso discreto de que esto es una demo: nada de lo editado sobrevive a un F5. */
export function DemoBadge() {
  return (
    <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <FlaskConical className="size-3.5" aria-hidden="true" />
      Datos de demostración — los cambios no se guardan
    </span>
  );
}
