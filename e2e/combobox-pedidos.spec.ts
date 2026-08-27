import { expect, test } from "@playwright/test";

/**
 * Regresión: el selector de cliente en "Nuevo pedido" era un <Select> plano
 * con 50+ filas sin buscador (lento e imposible de filtrar). Ahora es un
 * combobox con búsqueda — este test fija ese comportamiento.
 */
test.describe("combobox de cliente en Pedidos", () => {
  test("se puede buscar y seleccionar un cliente por nombre", async ({ page }) => {
    await page.goto("/pedidos");
    await page.getByRole("button", { name: "Nuevo pedido" }).click();

    const dialog = page.getByRole("dialog", { name: "Nuevo pedido" });
    await expect(dialog).toBeVisible();

    await dialog.locator("#pedido-cliente").click();
    const searchInput = page.locator('[data-slot="command-input"]');
    await expect(searchInput).toBeVisible();

    await searchInput.fill("Aitana");
    await page.waitForTimeout(100);
    const options = page.locator('[data-slot="command-item"]');
    await expect(options.first()).toBeVisible();
    const optionCount = await options.count();
    for (let i = 0; i < optionCount; i++) {
      await expect(options.nth(i)).toContainText("Aitana");
    }

    await options.first().click();
    await expect(searchInput).toBeHidden();
    await expect(dialog.locator("#pedido-cliente")).toContainText("Aitana");

    await dialog.getByLabel("Producto").fill("Producto E2E combobox");
    await dialog.getByRole("button", { name: "Crear pedido" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByText("Pedido creado")).toBeVisible();

    await page.getByPlaceholder("Buscar por nº, cliente, producto…").fill("Producto E2E combobox");
    await expect(page.locator("tbody tr", { hasText: "Producto E2E combobox" })).toBeVisible();
  });

  test("Escape cierra el combobox sin cerrar el modal de pedido", async ({ page }) => {
    await page.goto("/pedidos");
    await page.getByRole("button", { name: "Nuevo pedido" }).click();
    const dialog = page.getByRole("dialog", { name: "Nuevo pedido" });

    await dialog.locator("#pedido-cliente").click();
    await expect(page.locator('[data-slot="command-input"]')).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.locator('[data-slot="command-input"]')).toBeHidden();
    await expect(dialog).toBeVisible();
  });
});
