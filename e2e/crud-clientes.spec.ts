import { expect, test } from "@playwright/test";

const NOMBRE = "Cliente E2E Playwright";
const NOMBRE_EDITADO = "Cliente E2E Editado";
const EMAIL = "e2e.playwright@example.com";
const EMPRESA = "QA Corp";

test.describe("CRUD de clientes (positivo)", () => {
  test("crear, editar y eliminar un cliente funciona dentro de la sesión", async ({ page }) => {
    await page.goto("/clientes");

    // --- Crear ---
    await page.getByRole("button", { name: "Nuevo cliente" }).click();
    const createDialog = page.getByRole("dialog", { name: "Nuevo cliente" });
    await expect(createDialog).toBeVisible();

    await createDialog.getByLabel("Nombre").fill(NOMBRE);
    await createDialog.getByLabel("Email").fill(EMAIL);
    await createDialog.getByLabel("Empresa").fill(EMPRESA);
    await createDialog.getByRole("button", { name: "Crear cliente" }).click();

    await expect(createDialog).toBeHidden();
    await expect(page.getByText("Cliente creado")).toBeVisible();

    await page.getByPlaceholder("Buscar por nombre, email, empresa…").fill(NOMBRE);
    const row = page.locator("tbody tr", { hasText: NOMBRE });
    await expect(row).toBeVisible();
    await expect(row.getByText(EMAIL)).toBeVisible();

    // --- Editar ---
    await row.getByLabel(/^Acciones para/).click();
    await page.getByRole("menuitem", { name: "Editar" }).click();
    const editDialog = page.getByRole("dialog", { name: "Editar cliente" });
    await expect(editDialog).toBeVisible();
    await editDialog.getByLabel("Nombre").fill(NOMBRE_EDITADO);
    await editDialog.getByRole("button", { name: "Guardar cambios" }).click();
    await expect(editDialog).toBeHidden();
    await expect(page.getByText("Cliente actualizado")).toBeVisible();

    await page.getByPlaceholder("Buscar por nombre, email, empresa…").fill(NOMBRE_EDITADO);
    await expect(page.locator("tbody tr", { hasText: NOMBRE_EDITADO })).toBeVisible();

    // --- Eliminar (con confirmación) ---
    await page.locator("tbody tr", { hasText: NOMBRE_EDITADO }).getByLabel(/^Acciones para/).click();
    await page.getByRole("menuitem", { name: "Eliminar" }).click();
    const confirmDialog = page.getByRole("alertdialog");
    await expect(confirmDialog).toBeVisible();
    await expect(confirmDialog).toContainText(NOMBRE_EDITADO);
    await confirmDialog.getByRole("button", { name: "Eliminar" }).click();

    await expect(page.getByText("Cliente eliminado")).toBeVisible();
    await expect(page.locator("tbody tr", { hasText: NOMBRE_EDITADO })).toHaveCount(0);
  });

  test("cancelar el borrado no elimina el registro", async ({ page }) => {
    await page.goto("/clientes");
    const firstRow = page.locator("tbody tr").first();
    const nombre = (await firstRow.locator("td").first().innerText()).split("\n")[0];

    await firstRow.getByLabel(/^Acciones para/).click();
    await page.getByRole("menuitem", { name: "Eliminar" }).click();
    const confirmDialog = page.getByRole("alertdialog");
    await confirmDialog.getByRole("button", { name: "Cancelar" }).click();
    await expect(confirmDialog).toBeHidden();

    await page.getByPlaceholder("Buscar por nombre, email, empresa…").fill(nombre);
    await expect(page.locator("tbody tr", { hasText: nombre })).toBeVisible();
  });
});
