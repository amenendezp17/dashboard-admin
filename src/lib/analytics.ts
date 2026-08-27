import { eachDayOfInterval, eachMonthOfInterval, endOfDay, format, isWithinInterval, startOfDay, subDays } from "date-fns";
import { es } from "date-fns/locale";

import type { Cliente, Pedido, PedidoEstado, RangoFechas, Usuario } from "./types";
import { RANGO_DIAS } from "./types";

function rangeInterval(rango: RangoFechas) {
  const end = endOfDay(new Date());
  const start = startOfDay(subDays(end, RANGO_DIAS[rango] - 1));
  return { start, end };
}

function inRange(iso: string, interval: { start: Date; end: Date }): boolean {
  return isWithinInterval(new Date(iso), interval);
}

export interface Kpi {
  label: string;
  value: string;
  deltaPct: number | null;
  helpText: string;
}

export function computeKpis(
  clientes: Cliente[],
  pedidos: Pedido[],
  usuarios: Usuario[],
  rango: RangoFechas,
): Kpi[] {
  const current = rangeInterval(rango);
  const days = RANGO_DIAS[rango];
  const previous = {
    start: startOfDay(subDays(current.start, days)),
    end: endOfDay(subDays(current.start, 1)),
  };

  const inCurrent = pedidos.filter((p) => inRange(p.fecha, current));
  const inPrevious = pedidos.filter((p) => inRange(p.fecha, previous));

  const ingresos = inCurrent
    .filter((p) => p.estado !== "cancelado")
    .reduce((sum, p) => sum + p.importe, 0);
  const ingresosPrev = inPrevious
    .filter((p) => p.estado !== "cancelado")
    .reduce((sum, p) => sum + p.importe, 0);

  const totalPedidos = inCurrent.length;
  const totalPedidosPrev = inPrevious.length;

  const entregados = inCurrent.filter((p) => p.estado === "entregado").length;
  const entregadosPrev = inPrevious.filter((p) => p.estado === "entregado").length;
  const conversion = totalPedidos === 0 ? 0 : (entregados / totalPedidos) * 100;
  const conversionPrev = totalPedidosPrev === 0 ? 0 : (entregadosPrev / totalPedidosPrev) * 100;

  const usuariosActivos = usuarios.filter((u) => u.estado === "activo").length;

  return [
    {
      label: "Ingresos",
      value: new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(
        ingresos,
      ),
      deltaPct: pctDelta(ingresos, ingresosPrev),
      helpText: `Pedidos no cancelados · ${clientes.length} clientes en cartera`,
    },
    {
      label: "Pedidos",
      value: totalPedidos.toString(),
      deltaPct: pctDelta(totalPedidos, totalPedidosPrev),
      helpText: "Total de pedidos en el rango",
    },
    {
      label: "Usuarios activos",
      value: usuariosActivos.toString(),
      deltaPct: null,
      helpText: `De ${usuarios.length} usuarios totales`,
    },
    {
      label: "Tasa de conversión",
      value: `${conversion.toFixed(1)}%`,
      deltaPct: pctDelta(conversion, conversionPrev),
      helpText: "Pedidos entregados sobre el total",
    },
  ];
}

function pctDelta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

export interface RevenuePoint {
  label: string;
  ingresos: number;
}

export function buildRevenueSeries(pedidos: Pedido[], rango: RangoFechas): RevenuePoint[] {
  const { start, end } = rangeInterval(rango);
  const relevant = pedidos.filter((p) => p.estado !== "cancelado" && inRange(p.fecha, { start, end }));

  if (rango === "1y") {
    const months = eachMonthOfInterval({ start, end });
    return months.map((monthStart) => {
      const monthKey = format(monthStart, "yyyy-MM");
      const total = relevant
        .filter((p) => format(new Date(p.fecha), "yyyy-MM") === monthKey)
        .reduce((sum, p) => sum + p.importe, 0);
      return { label: format(monthStart, "MMM", { locale: es }), ingresos: total };
    });
  }

  const days = eachDayOfInterval({ start, end });
  return days.map((day) => {
    const dayKey = format(day, "yyyy-MM-dd");
    const total = relevant
      .filter((p) => format(new Date(p.fecha), "yyyy-MM-dd") === dayKey)
      .reduce((sum, p) => sum + p.importe, 0);
    return { label: format(day, "d MMM", { locale: es }), ingresos: total };
  });
}

export interface EstadoPoint {
  estado: PedidoEstado;
  label: string;
  total: number;
}

const ESTADO_LABEL: Record<PedidoEstado, string> = {
  pendiente: "Pendiente",
  procesando: "Procesando",
  enviado: "Enviado",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export function buildEstadoSeries(pedidos: Pedido[], rango: RangoFechas): EstadoPoint[] {
  const interval = rangeInterval(rango);
  const relevant = pedidos.filter((p) => inRange(p.fecha, interval));
  const order: PedidoEstado[] = ["pendiente", "procesando", "enviado", "entregado", "cancelado"];
  return order.map((estado) => ({
    estado,
    label: ESTADO_LABEL[estado],
    total: relevant.filter((p) => p.estado === estado).length,
  }));
}
