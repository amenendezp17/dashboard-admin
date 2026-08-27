// Tipos de dominio compartidos por las tres entidades gestionables del panel.

export type ClienteEstado = "activo" | "inactivo" | "potencial";

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  empresa: string;
  estado: ClienteEstado;
  fechaAlta: string; // ISO date
  valorTotal: number; // €
}

export type PedidoEstado =
  | "pendiente"
  | "procesando"
  | "enviado"
  | "entregado"
  | "cancelado";

export interface Pedido {
  id: string;
  numero: string; // ej. "PED-1042"
  clienteId: string;
  clienteNombre: string;
  producto: string;
  importe: number; // €
  estado: PedidoEstado;
  fecha: string; // ISO date
}

export type UsuarioRol = "admin" | "editor" | "viewer";
export type UsuarioPlan = "free" | "pro" | "enterprise";
export type UsuarioEstado = "activo" | "suspendido" | "invitado";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: UsuarioRol;
  plan: UsuarioPlan;
  estado: UsuarioEstado;
  fechaAlta: string; // ISO date
}

export type SidebarPosition = "left" | "right" | "top" | "bottom";

export const SIDEBAR_POSITION_LABEL: Record<SidebarPosition, string> = {
  left: "Izquierda",
  right: "Derecha",
  top: "Arriba",
  bottom: "Abajo",
};

export type RangoFechas = "7d" | "30d" | "1y";

export const RANGO_LABEL: Record<RangoFechas, string> = {
  "7d": "Últimos 7 días",
  "30d": "Últimos 30 días",
  "1y": "Último año",
};

export const RANGO_DIAS: Record<RangoFechas, number> = {
  "7d": 7,
  "30d": 30,
  "1y": 365,
};
