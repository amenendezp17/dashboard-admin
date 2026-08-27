"use client";

import { cn } from "@/lib/utils";
import { RANGO_LABEL, type RangoFechas } from "@/lib/types";

const OPTIONS: RangoFechas[] = ["7d", "30d", "1y"];

export function RangeSelector({
  value,
  onChange,
}: {
  value: RangoFechas;
  onChange: (rango: RangoFechas) => void;
}) {
  return (
    <div role="radiogroup" aria-label="Rango de fechas" className="inline-flex rounded-lg border border-border bg-muted/50 p-1">
      {OPTIONS.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option)}
            className={cn(
              "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              active
                ? "bg-background text-foreground shadow-sm"
                : "text-slate-600 hover:text-foreground dark:text-slate-300 dark:hover:text-foreground",
            )}
          >
            {RANGO_LABEL[option]}
          </button>
        );
      })}
    </div>
  );
}
