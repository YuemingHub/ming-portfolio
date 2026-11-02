import { test, expect } from "@playwright/test";
import { ROUTES, URL_FOR } from "./routes";

for (const route of ROUTES) {
  test(`${route.path} 键盘顺序与焦点可见`, async ({ page, browserName }) => {
    test.skip(
      browserName === "webkit",
      "Playwright WebKit 构建默认只用 Tab 聚焦表单控件，链接不进入 Tab 序列；原生 Tab 顺序无法执行，改由下方 WebKit 替代检查覆盖",
    );

    await page.goto(URL_FOR(route.path), { waitUntil: "networkidle" });

    await page.keyboard.press("Tab");
    const first = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      const style = el ? getComputedStyle(el) : null;
      return {
        text: el?.textContent?.trim() ?? "",
        tag: el?.tagName ?? "",
        outline: style?.outlineStyle ?? "",
        outlineWidth: style?.outlineWidth ?? "",
        boxShadow: style?.boxShadow ?? "",
      };
    });
    expect(first.text).toContain("跳到正文");
    expect(first.tag).toBe("A");
    expect(first.outline !== "none" || first.boxShadow !== "none", "focus indicator").toBeTruthy();

    const focusableCount = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
      )].filter((el) => el.offsetParent !== null || el === document.activeElement).length,
    );
    expect(focusableCount, "visible focusable elements").toBeGreaterThan(5);

    const seen = new Set<string>();
    for (let i = 0; i < focusableCount + 5; i += 1) {
      const current = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        return `${el.tagName}:${el.textContent?.trim().slice(0, 40) ?? ""}:${el.getAttribute("href") ?? ""}`;
      });
      if (!current) break;
      seen.add(current);
      await page.keyboard.press("Tab");
    }

    expect(seen.size, "unique focused elements").toBeGreaterThanOrEqual(Math.min(focusableCount, 8));
  });

  test(`${route.path} WebKit 跳转链接可用性`, async ({ page, browserName }) => {
    test.skip(browserName !== "webkit", "仅在 WebKit 运行");

    await page.goto(URL_FOR(route.path), { waitUntil: "networkidle" });

    const firstFocusable = await page.evaluate(() => {
      const el = document.querySelector<HTMLElement>(
        'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
      );
      return { text: el?.textContent?.trim() ?? "", className: el?.className ?? "" };
    });
    expect(firstFocusable.text).toContain("跳到正文");
    expect(firstFocusable.className).toContain("skip-link");

    await page.locator(".skip-link").focus();
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const el = document.activeElement as HTMLElement | null;
            const rect = el?.getBoundingClientRect();
            const style = el ? getComputedStyle(el) : null;
            return {
              text: el?.textContent?.trim() ?? "",
              top: rect?.top ?? -999,
              height: rect?.height ?? 0,
              outline: style?.outlineStyle ?? "",
            };
          }),
        { timeout: 5_000 },
      )
      .toMatchObject({ text: "跳到正文", outline: "solid" });

    const rect = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const r = el.getBoundingClientRect();
      return { top: r.top, height: r.height };
    });
    expect(rect.height, "skip link height").toBeGreaterThanOrEqual(24);
    expect(rect.top, "skip link visible after focus").toBeGreaterThanOrEqual(0);

    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
    await expect
      .poll(() => page.evaluate(() => `${document.activeElement?.tagName}#${document.activeElement?.id}`))
      .toBe("MAIN#main");
  });
}
