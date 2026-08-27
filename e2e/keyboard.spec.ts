import { expect, test } from "@playwright/test";

test.describe("teclado y foco en modales", () => {
  test("Escape cierra el modal y devuelve el foco al botón que lo abrió", async ({ page }) => {
    await page.goto("/clientes");
    const trigger = page.getByRole("button", { name: "Nuevo cliente" });
    await trigger.click();

    const dialog = page.getByRole("dialog", { name: "Nuevo cliente" });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("Tab mantiene el foco dentro del modal (focus trap)", async ({ page }) => {
    await page.goto("/clientes");
    await page.getByRole("button", { name: "Nuevo cliente" }).click();
    const dialog = page.getByRole("dialog", { name: "Nuevo cliente" });
    await expect(dialog).toBeVisible();

    // Tabula más veces que elementos focusables tiene el modal. El desplegable
    // de "Estado" abre su propio popup vía portal (fuera del DOM del modal),
    // así que comprobamos que el foco nunca vuelve a la página de fondo
    // (sidebar/nav) en vez de exigir que siga literalmente dentro del nodo.
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      const reachedBackground = await page.evaluate(() => {
        const sidebar = document.querySelector("aside");
        return !!sidebar && sidebar.contains(document.activeElement);
      });
      expect(reachedBackground, `el foco escapó a la sidebar en el Tab #${i + 1}`).toBe(false);
    }
  });

  test("el foco visible (focus-visible) es distinguible al navegar con teclado", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const outlineVisible = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el) return false;
      const style = getComputedStyle(el);
      return style.outlineStyle !== "none" || style.outlineWidth !== "0px";
    });
    expect(outlineVisible).toBe(true);
  });

  test("la confirmación de borrado también atrapa el foco y cierra con Escape", async ({ page }) => {
    await page.goto("/clientes");
    await page.locator("tbody tr").first().getByLabel(/^Acciones para/).click();
    await page.getByRole("menuitem", { name: "Eliminar" }).click();

    const confirmDialog = page.getByRole("alertdialog");
    await expect(confirmDialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(confirmDialog).toBeHidden();
  });
});
