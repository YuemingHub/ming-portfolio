import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { ROUTES, URL_FOR } from "./routes";

for (const route of ROUTES) {
  test(`手机 390 · ${route.path}`, async ({ page }) => {
    await page.goto(URL_FOR(route.path), { waitUntil: "networkidle" });

    const layout = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      viewport: window.innerWidth,
    }));
    expect(layout.scrollWidth, "horizontal overflow").toBeLessThanOrEqual(layout.clientWidth + 1);
    expect(layout.viewport).toBe(390);

    const toggle = page.locator(".menu-toggle");
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const mobileNav = page.locator(".mobile-nav.is-open");
    await expect(mobileNav).toBeVisible();
    expect(await mobileNav.locator("a").count()).toBeGreaterThan(5);
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    const smallTargets = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>("a[href],button:not([disabled])")]
        .filter((el) => el.offsetParent !== null)
        .filter((el) => !el.closest("p"))
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            text: (el.textContent ?? "").trim().slice(0, 32),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        })
        .filter((item) => item.width < 24 || item.height < 24),
    );
    expect(smallTargets, JSON.stringify(smallTargets)).toEqual([]);

    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(
      results.violations,
      results.violations.map((v) => `${v.id}: ${v.nodes.length} nodes`).join("\n"),
    ).toEqual([]);
  });
}
