import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  markOnly?: boolean;
  /** "sidebar": fondo oscuro fijo (sidebar/drawer). "default": fondo normal, sigue el tema. */
  tone?: "sidebar" | "default";
}

/** Marca "Vector N" de Nimbus — mismo trazado que el favicon (icon.svg). */
export function Logo({ className, markOnly = false, tone = "sidebar" }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
        <rect x="10" y="12" width="10" height="40" rx="2" fill="#818CF8" />
        <rect x="44" y="12" width="10" height="40" rx="2" fill="#818CF8" />
        <path d="M20 12 54 52h-10L10 12h10Z" fill="#C7D2FE" />
      </svg>
      {!markOnly && (
        <span
          className={cn(
            "text-base font-bold tracking-tight",
            tone === "sidebar" ? "text-sidebar-foreground" : "text-foreground",
          )}
        >
          Nimbus
        </span>
      )}
    </div>
  );
}
