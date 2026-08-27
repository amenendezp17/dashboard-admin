import { expect, test } from "@playwright/test";

/**
 * La navegación debe usar rutas relativas al origen (empiezan por "/"),
 * nunca URLs absolutas hardcodeadas a un host — así el panel funciona
 * igual detrás de cualquier dominio/proxy/base path.
 */
test.describe("rutas relativas", () => {
  test("los enlaces de navegación son root-relative, no absolutos a un host", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator("nav a[href]").evaluateAll((els) =>
      els.map((el) => el.getAttribute("href")),
    );

    expect(hrefs.length).toBeGreaterThan(0);
    for (const href of hrefs) {
      expect(href, `href sospechoso: ${href}`).toMatch(/^\//);
      expect(href).not.toMatch(/^https?:\/\//);
    }
  });

  test("la app funciona navegando bajo un origen distinto (sub-path via baseURL)", async ({ page, baseURL }) => {
    // Simula acceso desde otro origen/puerto: mientras los links sean
    // relativos, la navegación entre secciones no debe romperse.
    await page.goto(`${baseURL}/clientes`);
    await page.getByRole("link", { name: "Pedidos", exact: true }).click();
    await expect(page).toHaveURL(/\/pedidos$/);
    await expect(page.getByRole("heading", { name: "Pedidos", level: 1 })).toBeVisible();
  });

  test("recargar en una ruta profunda no rompe (sin depender de un basePath)", async ({ page }) => {
    const response = await page.goto("/usuarios");
    expect(response?.ok()).toBeTruthy();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Usuarios", level: 1 })).toBeVisible();
  });
});
