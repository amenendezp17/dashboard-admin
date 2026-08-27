import { expect, test } from "@playwright/test";

test.describe("responsive (mobile)", () => {
  test("la sidebar fija se oculta y aparece el drawer con hamburguesa", async ({ page }) => {
    await page.goto("/clientes");

    await expect(page.getByRole("button", { name: "Abrir menú de navegación" })).toBeVisible();

    await page.getByRole("button", { name: "Abrir menú de navegación" }).click();
    const drawerNav = page.getByRole("navigation", { name: "Navegación principal" });
    await expect(drawerNav).toBeVisible();
    await drawerNav.getByRole("link", { name: "Pedidos", exact: true }).click();
    await expect(page).toHaveURL(/\/pedidos$/);
  });

  test("la tabla scrollea en horizontal dentro de su contenedor, sin overflow de página", async ({ page }) => {
    await page.goto("/clientes");

    const bodyScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyScrollWidth, "la página entera no debe scrollear en horizontal").toBeLessThanOrEqual(
      viewportWidth + 1,
    );

    const tableWrapperScrollable = await page.evaluate(() => {
      const wrapper = document.querySelector("table")?.parentElement;
      return !!wrapper && wrapper.scrollWidth > wrapper.clientWidth;
    });
    expect(tableWrapperScrollable, "la tabla debería poder scrollear dentro de su propio contenedor").toBe(true);
  });
});
