import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { ROUTES, URL_FOR } from "./routes";

for (const route of ROUTES) {
  test(`${route.path} WCAG 2 A/AA`, async ({ page }) => {
    await page.goto(URL_FOR(route.path), { waitUntil: "networkidle" });
    await expect(page.locator("h1")).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze();

    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.nodes.length} nodes`).join("\n"),
    ).toEqual([]);
    expect(results.passes.length, "axe passes").toBeGreaterThan(0);
  });
}
