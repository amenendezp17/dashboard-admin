"use client";

import { useMemo, useState } from "react";

import { CategoryBarChart } from "@/components/charts/category-bar-chart";
import { RangeSelector } from "@/components/charts/range-selector";
import { RevenueLineChart } from "@/components/charts/revenue-line-chart";
import { KpiCard } from "@/components/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buildEstadoSeries, buildRevenueSeries, computeKpis } from "@/lib/analytics";
import { useClientesStore } from "@/lib/stores/clientes-store";
import { usePedidosStore } from "@/lib/stores/pedidos-store";
import { useUsuariosStore } from "@/lib/stores/usuarios-store";
import type { RangoFechas } from "@/lib/types";

export default function OverviewPage() {
  const clientes = useClientesStore((s) => s.items);
  const pedidos = usePedidosStore((s) => s.items);
  const usuarios = useUsuariosStore((s) => s.items);
  const clientesHydrated = useClientesStore((s) => s.hasHydrated);
  const pedidosHydrated = usePedidosStore((s) => s.hasHydrated);
  const usuariosHydrated = useUsuariosStore((s) => s.hasHydrated);
  const hasHydrated = clientesHydrated && pedidosHydrated && usuariosHydrated;

  const [rango, setRango] = useState<RangoFechas>("30d");

  const kpis = useMemo(() => computeKpis(clientes, pedidos, usuarios, rango), [clientes, pedidos, usuarios, rango]);
  const revenueSeries = useMemo(() => buildRevenueSeries(pedidos, rango), [pedidos, rango]);
  const estadoSeries = useMemo(() => buildEstadoSeries(pedidos, rango), [pedidos, rango]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Métricas clave del panel de un vistazo.</p>
        </div>
        <RangeSelector value={rango} onChange={setRango} />
      </div>

      {hasHydrated ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {kpis.map((kpi) => (
              <KpiCard key={kpi.label} kpi={kpi} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueLineChart data={revenueSeries} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pedidos por estado</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryBarChart data={estadoSeries} />
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )}
    </div>
  );
}
