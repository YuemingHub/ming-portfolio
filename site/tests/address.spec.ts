import { existsSync, readFileSync } from "node:fs";
import { test, expect } from "@playwright/test";

function readRepoFile(relative: string): string {
  const url = new URL(`../../${relative}`, import.meta.url);
  if (!existsSync(url)) throw new Error(`repo file not found: ${relative}`);
  return readFileSync(url, "utf8");
}

test("地址、OG、JSON-LD 与旧入口引用", async ({ page }) => {
  await page.goto("/ming/", { waitUntil: "networkidle" });

  const meta = await page.evaluate(() => {
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href") ?? "";
    const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute("content") ?? "";
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content") ?? "";
    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((node) => {
        try {
          return JSON.parse(node.textContent ?? "{}");
        } catch {
          return null;
        }
      })
      .filter(Boolean);
    const footerLinks = [...document.querySelectorAll(".footer-links a")].map((a) => ({
      text: a.textContent?.trim() ?? "",
      href: a.getAttribute("href") ?? "",
    }));
    return { canonical, ogUrl, ogImage, jsonLd, footerLinks };
  });

  expect(meta.canonical).toBe("https://ymai.me/ming/");
  expect(meta.ogUrl).toBe("https://ymai.me/ming/");
  expect(meta.ogImage).toBe("https://ymai.me/ming/og-card.png");
  expect(meta.jsonLd.length).toBeGreaterThan(0);
  expect(JSON.stringify(meta.jsonLd)).toContain("https://ymai.me/ming/");
  expect(meta.footerLinks.some((link) => link.href === "https://ymai.me/ming/")).toBeTruthy();
  expect(meta.footerLinks.some((link) => link.href === "https://ymai.fun/ming/")).toBeTruthy();

  const readme = readRepoFile("README.md");
  expect(readme).toContain("https://ymai.me/ming/");
  expect(readme).toContain("https://ymai.fun/ming/");
  expect(readme).toContain("https://yueminghub.github.io/ming-portfolio/");

  const content = readFileSync(new URL("../src/site/content.ts", import.meta.url), "utf8");
  expect(content).toContain('"https://ymai.fun"');
  expect(content).toContain('"https://ymai.me"');
});

test("子路径跳转与未知路径", async ({ request }) => {
  const noSlash = await request.get("/ming", { maxRedirects: 0 });
  expect(noSlash.status()).toBe(301);
  expect(noSlash.headers()["location"]).toBe("/ming/");

  const deepSlash = await request.get("/ming/spaces/", { maxRedirects: 0 });
  expect(deepSlash.status()).toBe(301);
  expect(deepSlash.headers()["location"]).toBe("/ming/spaces");

  const missing = await request.get("/ming/assets/does-not-exist.js");
  expect(missing.status()).toBe(404);

  const unknown = await request.get("/ming/does-not-exist");
  expect(unknown.status()).toBe(200);
  expect(await unknown.text()).toContain('id="root"');
});

// 这个用例只证明本机测试服务器没有把根站路径交给作品集；
// 生产 nginx 的隔离由 nginx-test/verify.mjs 用字节对比判断。
test("测试服务器根站隔离哨兵", async ({ request }) => {
  for (const path of ["/", "/gui/_next/static/chunks/x.js", "/_next/static/x.js", "/some/other/path"]) {
    const response = await request.get(path);
    expect(response.status(), path).toBe(200);
    expect(await response.text(), path).toContain("Self Space");
  }
});
