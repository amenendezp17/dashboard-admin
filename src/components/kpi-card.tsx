import { Minus, TrendingDown, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Kpi } from "@/lib/analytics";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const delta = kpi.deltaPct;
  const isUp = delta !== null && delta > 0.05;
  const isDown = delta !== null && delta < -0.05;

  return (
    <Card>
      <CardHeader className="pb-0">
        <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-3xl font-bold tabular-nums tracking-tight">{kpi.value}</span>
          {delta !== null && (
            <span
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium tabular-nums",
                isUp && "text-emerald-600 dark:text-emerald-400",
                isDown && "text-red-600 dark:text-red-400",
                !isUp && !isDown && "text-muted-foreground",
              )}
            >
              {isUp ? (
                <TrendingUp className="size-3.5" />
              ) : isDown ? (
                <TrendingDown className="size-3.5" />
              ) : (
                <Minus className="size-3.5" />
              )}
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{kpi.helpText}</p>
      </CardContent>
    </Card>
  );
}
