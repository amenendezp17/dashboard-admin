import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const PAGES = ["/", "/clientes", "/pedidos", "/usuarios", "/ajustes"];

test.describe("accesibilidad (WCAG 2.1 AA vía axe-core)", () => {
  for (const path of PAGES) {
    test(`${path} no tiene violaciones críticas/serias`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();

      const blocking = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious",
      );

      expect(
        blocking,
        blocking.map((v) => `${v.id} (${v.impact}): ${v.help}\n  ${v.nodes.map((n) => n.target).join(", ")}`).join("\n"),
      ).toEqual([]);
    });
  }

  test("el modal de creación no tiene violaciones y el foco entra en él", async ({ page }) => {
    await page.goto("/clientes");
    await page.getByRole("button", { name: "Nuevo cliente" }).click();
    const dialog = page.getByRole("dialog", { name: "Nuevo cliente" });
    await expect(dialog).toBeVisible();

    // El foco debe quedar atrapado dentro del modal (requisito no negociable).
    const focusInsideDialog = await page.evaluate(() => {
      const dialogEl = document.querySelector('[data-slot="dialog-content"]');
      return !!dialogEl && dialogEl.contains(document.activeElement);
    });
    expect(focusInsideDialog).toBe(true);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    const blocking = results.violations.filter((v) => v.impact === "critical" || v.impact === "serious");
    expect(blocking, blocking.map((v) => v.id).join(", ")).toEqual([]);
  });
});
