# Nimbus — Panel Admin

Dashboard/panel admin ficticio (tipo SaaS interno) con métricas, gráficos y CRUD completo sobre tres entidades: **Clientes**, **Pedidos** y **Usuarios**. Sin backend — todo se persiste en `localStorage` vía Zustand.



## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui (Base UI) · Recharts · TanStack Table v8 · Zustand · next-themes · Playwright + axe-core

## Arrancar

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Cómo probar el CRUD completo

1. Ve a **Clientes**, **Pedidos** o **Usuarios** en la sidebar (funciona igual en las tres).
2. **Crear**: botón "Nuevo cliente/pedido/usuario" arriba a la derecha → rellena el formulario → "Crear". Aparece un toast de confirmación y la fila nueva en la tabla.
3. **Editar**: en la fila del registro, abre el menú "···" → "Editar" → cambia algún campo → "Guardar cambios".
4. **Eliminar**: menú "···" → "Eliminar" → confirma en el diálogo (nunca borra sin confirmación).
5. **Persistencia**: recarga la página (F5) — los cambios siguen ahí porque se guardan en `localStorage` (claves `nimbus-clientes`, `nimbus-pedidos`, `nimbus-usuarios`). Para resetear a los datos de ejemplo, borra esas claves desde DevTools → Application → Local Storage.
6. **Tabla**: prueba la búsqueda en tiempo real, el orden por columna (clic en cabeceras) y la paginación.
7. **Overview**: cambia el selector "Últimos 7 días / 30 días / Año" — los 4 KPIs y ambos gráficos reaccionan al rango.
8. **Mobile**: reduce el ancho de ventana (< 768px) — la sidebar se convierte en drawer (botón hamburguesa) y la tabla scrollea en horizontal sin romper la página.

## Tests e2e

```bash
npx playwright test
```

Cubre: smoke (5 rutas, sin errores de consola), CRUD positivo con persistencia, rutas relativas, accesibilidad WCAG 2.1 AA (axe-core) en cada página y con modal abierto, foco atrapado + cierre con Escape en modales, y responsive/scroll horizontal en mobile.

## Build de producción

```bash
npm run build && npm run start
```
