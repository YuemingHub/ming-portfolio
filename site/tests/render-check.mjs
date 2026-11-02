#!/usr/bin/env node
// 部署后的浏览器渲染检查。SPA 的标题、H1、canonical 由运行时写入，
// HTTP 脚本无法验证，这一层用真实 Chromium 打开公网地址复核。
//
//   cd site
//   npx playwright install chromium
//   node tests/render-check.mjs --base https://ymai.me --prefix /ming
import { chromium } from "@playwright/test";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ""), process.argv[i + 1]);
}
const BASE = (args.get("base") || "https://ymai.me").replace(/\/$/, "");
const PREFIX = (args.get("prefix") || "/ming").replace(/\/$/, "");
const CANONICAL_BASE = (args.get("canonical-base") || BASE).replace(/\/$/, "");

const routes = ["", "/ecosystem", "/spaces", "/institution", "/expert-and-research", "/agent-space", "/evidence", "/cooperation"];
const findings = [];

function check(name, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${detail}`);
  if (!ok) findings.push(name);
}

const browser = await chromium.launch();
try {
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  for (const route of routes) {
    const url = `${BASE}${PREFIX}${route || "/"}`;
    const expectedCanonical = `${CANONICAL_BASE}${PREFIX}${route || "/"}`;
    const errors = [];
    const failed = [];
    const onConsole = (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    };
    const onFailed = (req) => failed.push(`${req.failure()?.errorText} ${req.url()}`);
    page.on("console", onConsole);
    page.on("requestfailed", onFailed);

    const response = await page.goto(url, { waitUntil: "networkidle" });
    const title = await page.title();
    const h1 = (await page.locator("h1").first().textContent()) || "";
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(500);
    const brokenImages = await page.evaluate(() =>
      [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).length,
    );

    check(
      `渲染 ${url}`,
      response?.status() === 200 &&
        title.includes("YUE MING ECOSYSTEM") &&
        h1.trim().length > 4 &&
        canonical === expectedCanonical &&
        brokenImages === 0 &&
        errors.length === 0 &&
        failed.length === 0,
      `${response?.status()} title=${title || "无"} h1=${h1.trim() ? "有" : "无"} canonical=${canonical || "无"} 图片失败=${brokenImages} console=${errors.length} request=${failed.length}`,
    );
    page.off("console", onConsole);
    page.off("requestfailed", onFailed);
  }

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(`${BASE}${PREFIX}/`, { waitUntil: "networkidle" });
  const overflow = await mobilePage.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  check("手机 390 首页无横向溢出", overflow <= 1, `溢出 ${overflow}px`);
} finally {
  await browser.close();
}

console.log(`\n${findings.length === 0 ? "全部通过" : `${findings.length} 项失败`}`);
process.exitCode = findings.length === 0 ? 0 : 1;
