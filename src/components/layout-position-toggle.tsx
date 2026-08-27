"use client";

import { cn } from "@/lib/utils";
import { useLayoutStore } from "@/lib/stores/layout-store";
import { SIDEBAR_POSITION_LABEL, type SidebarPosition } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const OPTIONS: SidebarPosition[] = ["left", "right", "top", "bottom"];

function PositionPreview({ position, active }: { position: SidebarPosition; active: boolean }) {
  const barClass = cn("absolute rounded-[2px]", active ? "bg-primary" : "bg-slate-400 dark:bg-slate-500");
  const barStyle: Record<SidebarPosition, string> = {
    left: "left-1 top-1 bottom-1 w-1.5",
    right: "right-1 top-1 bottom-1 w-1.5",
    top: "top-1 left-1 right-1 h-1.5",
    bottom: "bottom-1 left-1 right-1 h-1.5",
  };

  return (
    <span className="relative inline-block h-8 w-11 rounded-md border border-border bg-muted/50">
      <span className={cn(barClass, barStyle[position])} aria-hidden="true" />
    </span>
  );
}

/** Elige en qué borde de la pantalla vive la navegación (sidebar vertical o barra horizontal). */
export function LayoutPositionToggle() {
  const position = useLayoutStore((s) => s.position);
  const setPosition = useLayoutStore((s) => s.setPosition);
  const hasHydrated = useLayoutStore((s) => s.hasHydrated);

  if (!hasHydrated) return <Skeleton className="h-16 w-full max-w-md" />;

  return (
    <div role="radiogroup" aria-label="Posición de la navegación" className="flex flex-wrap gap-3">
      {OPTIONS.map((option) => {
        const active = option === position;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setPosition(option)}
            className={cn(
              "flex flex-col items-center gap-2 rounded-lg border p-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active ? "border-primary bg-secondary" : "border-border hover:bg-muted/50",
            )}
          >
            <PositionPreview position={option} active={active} />
            <span className={cn("text-xs font-medium", active ? "text-secondary-foreground" : "text-foreground")}>
              {SIDEBAR_POSITION_LABEL[option]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
