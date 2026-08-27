import { expect, test } from "@playwright/test";

const ROUTES: { path: string; heading: string }[] = [
  { path: "/", heading: "Overview" },
  { path: "/clientes", heading: "Clientes" },
  { path: "/pedidos", heading: "Pedidos" },
  { path: "/usuarios", heading: "Usuarios" },
  { path: "/ajustes", heading: "Ajustes" },
];

test.describe("smoke", () => {
  for (const route of ROUTES) {
    test(`${route.path} carga sin errores de consola`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") errors.push(msg.text());
      });
      page.on("pageerror", (err) => errors.push(String(err)));

      const response = await page.goto(route.path);
      expect(response?.ok()).toBeTruthy();
      await expect(page.getByRole("heading", { name: route.heading, level: 1 })).toBeVisible();
      expect(errors, `Errores de consola en ${route.path}:\n${errors.join("\n")}`).toEqual([]);
    });
  }

  test("la navegación de la sidebar visita las 5 secciones", async ({ page }) => {
    await page.goto("/");
    for (const route of ROUTES.slice(1)) {
      await page.getByRole("link", { name: route.heading, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${route.path}$`));
      await expect(page.getByRole("heading", { name: route.heading, level: 1 })).toBeVisible();
    }
  });
});
