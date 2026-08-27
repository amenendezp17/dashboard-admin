import type {
  Cliente,
  ClienteEstado,
  Pedido,
  PedidoEstado,
  Usuario,
  UsuarioEstado,
  UsuarioPlan,
  UsuarioRol,
} from "./types";

// PRNG con semilla fija (mulberry32) para que los datos de ejemplo sean
// deterministas entre el render de servidor y el de cliente (sin esto,
// Math.random() rompería la hidratación de Next.js).
function mulberry32(seed: number) {
  let a = seed;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260827);

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickWeighted<T extends string>(weights: Record<T, number>): T {
  const entries = Object.entries(weights) as [T, number][];
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let r = rng() * total;
  for (const [key, w] of entries) {
    r -= w;
    if (r <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

function daysAgoISO(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

const NOMBRES = [
  "Lucía", "Mateo", "Sofía", "Hugo", "Martina", "Daniel", "Valeria", "Pablo",
  "Emma", "Alejandro", "Julia", "Marcos", "Carla", "Diego", "Paula", "Álvaro",
  "Noa", "Bruno", "Vera", "Iker", "Aitana", "Rubén", "Elena", "Marc",
  "Irene", "Adrián", "Claudia", "Óscar", "Nerea", "Gonzalo",
];
const APELLIDOS = [
  "García", "Fernández", "López", "Martínez", "Sánchez", "Pérez", "Gómez",
  "Ruiz", "Díaz", "Moreno", "Muñoz", "Álvarez", "Romero", "Navarro", "Torres",
  "Domínguez", "Vázquez", "Serrano", "Ramos", "Iglesias",
];
const EMPRESAS = [
  "Solaris Retail", "Bluewave Logistics", "Nortia Consulting", "Pixelcraft Studio",
  "Verde Capital", "Altamira Foods", "Kentia Software", "Rioja Digital",
  "Marejada Textil", "Cobalto Health", "Puente Sur Energía", "Loom & Co",
  "Aranza Biotech", "Ferro Industrial", "Nimbus Partners", "Delta Cero",
  "Estival Turismo", "Grava Materiales", "Salvia Farmacéutica", "Trébol Educación",
];
const PRODUCTOS = [
  "Plan Pro anual", "Plan Enterprise", "Licencia adicional", "Paquete de soporte",
  "Migración de datos", "Módulo de analítica", "Almacenamiento extra", "Onboarding a medida",
  "Integración API", "Formación de equipo",
];

function generateClientes(count: number): Cliente[] {
  const estadoWeights: Record<ClienteEstado, number> = {
    activo: 0.55,
    potencial: 0.28,
    inactivo: 0.17,
  };
  return Array.from({ length: count }, (_, i) => {
    const nombre = `${pick(NOMBRES)} ${pick(APELLIDOS)}`;
    const empresa = pick(EMPRESAS);
    return {
      id: `cli-${i + 1}`,
      nombre,
      email: `${nombre.toLowerCase().replace(/\s+/g, ".")}@${empresa
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "")}.com`,
      empresa,
      estado: pickWeighted(estadoWeights),
      fechaAlta: daysAgoISO(Math.floor(rng() * 360)),
      valorTotal: Math.round(400 + rng() * 24000),
    };
  });
}

function generatePedidos(count: number, clientes: Cliente[]): Pedido[] {
  const estadoWeights: Record<PedidoEstado, number> = {
    entregado: 0.4,
    enviado: 0.18,
    procesando: 0.16,
    pendiente: 0.16,
    cancelado: 0.1,
  };
  return Array.from({ length: count }, (_, i) => {
    const cliente = pick(clientes);
    return {
      id: `ped-${i + 1}`,
      numero: `PED-${1000 + i}`,
      clienteId: cliente.id,
      clienteNombre: cliente.nombre,
      producto: pick(PRODUCTOS),
      importe: Math.round(60 + rng() * 3200),
      estado: pickWeighted(estadoWeights),
      fecha: daysAgoISO(Math.floor(rng() * 360)),
    };
  });
}

function generateUsuarios(count: number): Usuario[] {
  const rolWeights: Record<UsuarioRol, number> = { viewer: 0.55, editor: 0.3, admin: 0.15 };
  const planWeights: Record<UsuarioPlan, number> = { free: 0.45, pro: 0.4, enterprise: 0.15 };
  const estadoWeights: Record<UsuarioEstado, number> = {
    activo: 0.72,
    invitado: 0.16,
    suspendido: 0.12,
  };
  return Array.from({ length: count }, (_, i) => {
    const nombre = `${pick(NOMBRES)} ${pick(APELLIDOS)}`;
    return {
      id: `usr-${i + 1}`,
      nombre,
      email: `${nombre.toLowerCase().replace(/\s+/g, ".")}@nimbus.app`,
      rol: pickWeighted(rolWeights),
      plan: pickWeighted(planWeights),
      estado: pickWeighted(estadoWeights),
      fechaAlta: daysAgoISO(Math.floor(rng() * 360)),
    };
  });
}

export const MOCK_CLIENTES = generateClientes(52);
export const MOCK_PEDIDOS = generatePedidos(64, MOCK_CLIENTES);
export const MOCK_USUARIOS = generateUsuarios(46);
