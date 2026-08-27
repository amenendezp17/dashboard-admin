# Especificación — Proyecto 3: Dashboard / Panel Admin (SaaS)

> Documento listo para pegar en Claude Code. Tercer proyecto del portfolio: demuestra visualización de datos y CRUD.

---

## 1. Objetivo

Panel de administración ficticio (tipo SaaS interno) que permita:
- Ver métricas clave de un vistazo (KPIs + gráficos).
- Gestionar registros con operaciones CRUD completas (crear, leer, actualizar, eliminar).
- Sensación de "herramienta de trabajo real", no una tabla suelta.

Ejemplo de dominio sugerido: gestión de clientes/pedidos de una tienda, o gestión de usuarios de una app SaaS.

---

## 2. Stack tecnológico

| Capa | Elección | Por qué |
|---|---|---|
| Framework | **Next.js 14 (App Router) + TypeScript** | Consistencia con el resto del portfolio |
| Estilos | **Tailwind CSS** | Rapidez y consistencia visual |
| Componentes UI | **shadcn/ui** | Tablas, modales, dropdowns accesibles ya montados — acelera mucho un dashboard |
| Gráficos | **Recharts** | Librería de gráficos React más estándar, ligera, buena con Tailwind |
| Tablas | **TanStack Table** | Sort, filtro y paginación sin reinventar la rueda |
| Estado / datos | **Zustand + localStorage** | Simula persistencia de un backend real sin necesitar uno |
| Hosting | **Vercel** | Igual que el resto |

---

## 3. Estructura de páginas/secciones

Layout con sidebar fija (colapsable en mobile):

1. **Overview** (`/`) — 4 tarjetas KPI (ej. ingresos, usuarios activos, pedidos, tasa de conversión) + 2 gráficos (línea de tendencia + barras por categoría)
2. **Registros** (`/registros`) — tabla con todos los registros: búsqueda, filtro por estado, orden por columna, paginación
3. **Modal de creación/edición** — formulario dentro de un modal (no página aparte) para crear o editar un registro
4. **Confirmación de borrado** — modal de confirmación antes de eliminar (nunca borrado directo sin confirmar)
5. **Ajustes** (`/ajustes`) — página simple con toggle de tema y datos de perfil ficticios (demuestra que el panel tiene más de una sección)

---

## 4. Requisitos técnicos no negociables

- CRUD completo funcional contra el estado local (persistido en `localStorage`, no hace falta backend)
- Tabla con: búsqueda en tiempo real, orden ascendente/descendente por columna, paginación (no cargar 200 filas de golpe)
- Modales accesibles: cierran con `Escape`, foco atrapado dentro mientras están abiertos (shadcn/ui ya lo resuelve, no lo rompas)
- Gráficos con datos que reaccionen a un selector de rango (ej. "Últimos 7 días / 30 días / Año")
- Responsive: en mobile la tabla no se rompe (scroll horizontal contenido, no overflow de toda la página)
- Sidebar colapsable en mobile (drawer/hamburger)

---

## 5. Datos a rellenar (placeholders)

```
NOMBRE_PANEL = "Nimbus"
DOMINIO = "Gestión de clientes + Gestión de pedidos + Gestión de usuarios (3 secciones CRUD independientes, no un único dominio)"

CAMPOS_REGISTRO_CLIENTES = ["nombre", "email", "empresa", "estado (activo/inactivo/potencial)", "fecha de alta", "valor total (€)"]
CAMPOS_REGISTRO_PEDIDOS  = ["nº pedido", "cliente", "producto", "importe (€)", "estado (pendiente/procesando/enviado/entregado/cancelado)", "fecha"]
CAMPOS_REGISTRO_USUARIOS = ["nombre", "email", "rol (admin/editor/viewer)", "plan (free/pro/enterprise)", "estado (activo/suspendido/invitado)", "fecha de alta"]
```

**Identidad de marca**: logo "Vector N" (monograma geométrico, elegido entre 3 opciones presentadas), paleta indigo (#4F46E5 / #818CF8) + slate, sidebar oscura fija en ambos temas, favicon `src/app/icon.svg`.

**Tests e2e** (Playwright + axe-core, ver `e2e/`): smoke, CRUD positivo con persistencia, rutas relativas, accesibilidad WCAG 2.1 AA, foco/teclado en modales, responsive — los 23 en verde antes de dar el proyecto por terminado (ver README para cómo correrlos).

---

## 6. Prompt para pegar en Claude Code

```
Crea un dashboard/panel admin en Next.js 14 (App Router) + TypeScript + Tailwind CSS,
siguiendo la especificación completa de spec-proyecto-dashboard-admin.md.

Pasos:
1. Scaffoldea el proyecto, instala shadcn/ui, recharts, @tanstack/react-table, zustand.
2. Crea el layout con sidebar colapsable (sección 3).
3. Implementa Overview con 4 KPIs y 2 gráficos con selector de rango de fechas.
4. Implementa la tabla de Registros con búsqueda, orden y paginación (TanStack Table).
5. Implementa el CRUD completo: modal de crear/editar y modal de confirmación de borrado,
   todo persistido en localStorage vía Zustand.
6. Asegura accesibilidad de los modales (foco atrapado, cierre con Escape).
7. Verifica que la tabla es usable en mobile sin romper el layout.
8. Al terminar, dime cómo probar el CRUD completo (crear, editar, borrar un registro).
```

---

## 7. Siguiente paso

1. Elige el dominio del panel (clientes, pedidos, usuarios...) y los campos de cada registro.
2. Pega este archivo + el prompt de la sección 6 en una sesión nueva de Claude Code.
