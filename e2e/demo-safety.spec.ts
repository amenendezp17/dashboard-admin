import { expect, test } from "@playwright/test";

/**
 * Es una demo pública: nadie debe poder dejar los datos rotos de forma
 * permanente para el siguiente visitante. El estado vive solo en memoria
 * durante la sesión — un F5 siempre vuelve al dataset de ejemplo.
 */
test.describe("seguridad de la demo (datos no persistentes)", () => {
  test("recargar la página descarta los cambios y vuelve a los datos de ejemplo", async ({ page }) => {
    const nombre = "Cliente Efímero";

    await page.goto("/clientes");
    await page.getByRole("button", { name: "Nuevo cliente" }).click();
    const dialog = page.getByRole("dialog", { name: "Nuevo cliente" });
    await dialog.getByLabel("Nombre").fill(nombre);
    await dialog.getByLabel("Email").fill("efimero@example.com");
    await dialog.getByLabel("Empresa").fill("Efímero SA");
    await dialog.getByRole("button", { name: "Crear cliente" }).click();
    await expect(dialog).toBeHidden();

    await page.getByPlaceholder("Buscar por nombre, email, empresa…").fill(nombre);
    await expect(page.locator("tbody tr", { hasText: nombre })).toBeVisible();

    await page.reload();
    await page.getByPlaceholder("Buscar por nombre, email, empresa…").fill(nombre);
    await expect(page.locator("tbody tr", { hasText: nombre })).toHaveCount(0);
  });

  test("no se escribe ningún dato editable de clientes/pedidos/usuarios en localStorage", async ({ page }) => {
    await page.goto("/clientes");
    await page.getByRole("button", { name: "Nuevo cliente" }).click();
    const dialog = page.getByRole("dialog", { name: "Nuevo cliente" });
    await dialog.getByLabel("Nombre").fill("Nunca Guardado");
    await dialog.getByLabel("Email").fill("nunca@example.com");
    await dialog.getByLabel("Empresa").fill("N/A");
    await dialog.getByRole("button", { name: "Crear cliente" }).click();
    await expect(dialog).toBeHidden();

    const keys = await page.evaluate(() => Object.keys(window.localStorage));
    const dataKeys = keys.filter((k) => /cliente|pedido|usuario/i.test(k));
    expect(dataKeys, `no debería haber claves de datos CRUD en localStorage, encontradas: ${dataKeys}`).toEqual([]);
  });

  test('el botón "Restablecer datos de ejemplo" descarta los cambios sin recargar', async ({ page }) => {
    const nombre = "Cliente A Borrar Con Reset";

    await page.goto("/clientes");
    await page.getByRole("button", { name: "Nuevo cliente" }).click();
    const dialog = page.getByRole("dialog", { name: "Nuevo cliente" });
    await dialog.getByLabel("Nombre").fill(nombre);
    await dialog.getByLabel("Email").fill("reset@example.com");
    await dialog.getByLabel("Empresa").fill("Reset SA");
    await dialog.getByRole("button", { name: "Crear cliente" }).click();
    await expect(dialog).toBeHidden();

    await page.getByPlaceholder("Buscar por nombre, email, empresa…").fill(nombre);
    await expect(page.locator("tbody tr", { hasText: nombre })).toBeVisible();

    await page.getByRole("button", { name: "Restablecer datos de ejemplo" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Restablecer" }).click();
    await expect(page.getByText("Datos de ejemplo restablecidos")).toBeVisible();

    await page.getByPlaceholder("Buscar por nombre, email, empresa…").fill(nombre);
    await expect(page.locator("tbody tr", { hasText: nombre })).toHaveCount(0);
  });

  test("cancelar el restablecimiento no borra nada", async ({ page }) => {
    await page.goto("/pedidos");
    const totalAntes = await page.getByText(/de \d+ registros/).innerText();

    await page.getByRole("button", { name: "Restablecer datos de ejemplo" }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Cancelar" }).click();
    await expect(page.getByRole("alertdialog")).toBeHidden();

    await expect(page.getByText(/de \d+ registros/)).toHaveText(totalAntes);
  });

  test('el aviso "Datos de demostración" es visible en Overview y en las 3 secciones CRUD', async ({ page }) => {
    for (const path of ["/", "/clientes", "/pedidos", "/usuarios"]) {
      await page.goto(path);
      await expect(page.getByText("Datos de demostración")).toBeVisible();
    }
  });
});
