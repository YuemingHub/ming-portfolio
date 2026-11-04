import { test, expect } from "@playwright/test";

test("旅程 1 · 机构合作方：先看机构服务，再生成一页简报", async ({ page }, testInfo) => {
  await page.goto("/ming/institution", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { level: 1 })).toContainText("家庭教育机构");

  await page.getByRole("link", { name: "联系与合作" }).first().click();
  await expect(page).toHaveURL(/\/ming\/cooperation/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("先看真实资产");

  const form = page.locator(".brief-form");
  await form.locator("select").selectOption({ label: "家庭教育机构" });
  await form.locator("textarea").nth(0).fill("首咨之后，家长在 7 天内流失。");
  await form.locator("textarea").nth(1).fill("先用一次真实服务断点做 30 天小样本试点。");

  const preview = await page.locator(".brief-output textarea").inputValue();
  expect(preview).toContain("家庭教育机构");
  expect(preview).toContain("7 天内流失");
  expect(preview).toContain("30 天小样本试点");
  expect(preview).toContain("未发送、未保存");

  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.getByRole("button", { name: "复制这份简报" }).click();
  await expect(page.locator(".brief-status")).toContainText("已复制");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied.replace(/\r\n/g, "\n")).toBe(preview.replace(/\r\n/g, "\n"));

  await page.screenshot({ path: testInfo.outputPath("journey-1-institution.png"), fullPage: false });
});

test("旅程 2 · 技术评估者：核对体系关系与验证中状态", async ({ page }, testInfo) => {
  await page.goto("/ming/ecosystem", { waitUntil: "networkidle" });
  await expect(page.locator("body")).toContainText("公开链接");
  await expect(page.locator("body")).toContainText("不是数据流");
  await expect(page.locator("body")).toContainText("公开导航链接不等于数据互通");

  await page.goto("/ming/evidence", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /^VALIDATION/ }).click();
  await expect(page.locator(".filter-result")).toHaveText("显示 3 / 14 条记录");
  await expect(page.locator(".evidence-table tbody tr")).toHaveCount(3);
  await expect(page.getByRole("button", { name: /^HOLD 0$/ })).toBeVisible();

  await page.screenshot({ path: testInfo.outputPath("journey-2-technical.png"), fullPage: false });
});

test("旅程 3 · 家庭用户：只走公开入口，不触发登录或数据采集", async ({ page }, testInfo) => {
  await page.goto("/ming/spaces#family", { waitUntil: "networkidle" });
  await expect(page.locator("#family")).toBeVisible();
  await expect(page.locator("#family")).toContainText("让家庭被理解");
  await expect(page.locator("body")).toContainText("登录后的家庭页面与真实家庭数据不在本站展示");

  expect(await page.locator("input[type=password]").count()).toBe(0);
  expect(await page.locator("form").count()).toBe(0);
  const external = page.getByRole("link", { name: /打开 ymai\.love/ }).first();
  await expect(external).toHaveAttribute("href", "https://ymai.love");

  await page.screenshot({ path: testInfo.outputPath("journey-3-family.png"), fullPage: false });
});

test("旅程 4 · 研究/写作者：从专业页进入研究资产与证据", async ({ page }, testInfo) => {
  await page.goto("/ming/expert-and-research", { waitUntil: "networkidle" });
  for (const text of ["Expert OS", "LRDF", "Family Reality Lab", "家长读本"]) {
    await expect(page.locator("body")).toContainText(text);
  }
  await expect(page.locator("body")).toContainText("未关闭");

  await page.goto("/ming/evidence", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /^RESEARCH/ }).click();
  await expect(page.locator(".filter-result")).toHaveText("显示 3 / 14 条记录");
  await expect(page.locator(".evidence-table tbody tr")).toHaveCount(3);

  await page.screenshot({ path: testInfo.outputPath("journey-4-research.png"), fullPage: false });
});
