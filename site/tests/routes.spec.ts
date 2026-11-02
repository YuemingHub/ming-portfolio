import { test, expect } from "@playwright/test";
import { ROUTES, URL_FOR } from "./routes";

for (const route of ROUTES) {
  test(`${route.path} 路由、资源与内部链接`, async ({ page, request }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message}`));
    page.on("requestfailed", (req) => failedRequests.push(`${req.failure()?.errorText} ${req.url()}`));

    const response = await page.goto(URL_FOR(route.path), { waitUntil: "networkidle" });
    expect(response?.status(), "HTTP status").toBe(200);
    await expect(page).toHaveTitle(route.title);
    await expect(page.locator("h1")).toHaveText(route.h1);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(route.canonical);

    // Scroll through the page the way a reader would, so lazy images enter the
    // viewport instead of being skipped by an instant jump to the bottom.
    await page.evaluate(async () => {
      const step = Math.max(200, Math.floor(window.innerHeight * 0.8));
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 120));
      }
      window.scrollTo(0, document.body.scrollHeight);
    });

    if (route.images > 0) {
      await expect
        .poll(
          () =>
            page.evaluate(() =>
              [...document.images]
                .filter((img) => !img.complete || img.naturalWidth === 0)
                .map((img) => img.currentSrc || img.src),
            ),
          { timeout: 15_000, message: `images not loaded on ${route.path}` },
        )
        .toEqual([]);
    }

    const images = await page.evaluate(() =>
      [...document.images].map((img) => ({
        src: img.getAttribute("src"),
        complete: img.complete,
        width: img.naturalWidth,
      })),
    );
    expect(images.length, "image count").toBe(route.images);
    for (const image of images) {
      expect(image.complete && image.width > 0, `image failed: ${image.src}`).toBeTruthy();
    }

    const background = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(background).toBe("rgb(244, 241, 232)");

    const hrefs = await page.locator("a[href]").evaluateAll((nodes) =>
      [...new Set(nodes.map((node) => node.getAttribute("href")).filter(Boolean))] as string[],
    );
    expect(hrefs.length, "link count").toBeGreaterThan(5);

    const origin = "http://127.0.0.1:4173";
    const rootAbsolute = hrefs.filter((href) => href.startsWith("/") && !href.startsWith("/ming"));
    expect(rootAbsolute, "root-absolute internal links").toEqual([]);
    for (const href of hrefs) {
      if (!href.startsWith("/ming") && !href.startsWith("#")) continue;
      const target = new URL(href, `${origin}${URL_FOR(route.path)}`);
      const response2 = await request.get(target.origin + target.pathname);
      expect(response2.status(), `internal link from ${route.path}: ${href}`).toBe(200);
      if (target.hash) {
        const id = decodeURIComponent(target.hash.slice(1));
        await page.goto(target.origin + target.pathname, { waitUntil: "domcontentloaded" });
        await expect.poll(() => page.locator(`#${id}`).count(), {
          timeout: 10_000,
          message: `anchor ${href}`,
        }).toBeGreaterThan(0);
      }
    }

    expect(consoleErrors, "console errors").toEqual([]);
    expect(failedRequests, "failed requests").toEqual([]);
  });
}
