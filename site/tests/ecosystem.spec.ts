import { test, expect } from "@playwright/test";

test("体系图包含 MKI 与 dsh ShengLuo，并保留验证边界", async ({ page }, testInfo) => {
  await page.goto("/ming/ecosystem", { waitUntil: "networkidle" });

  await expect(page.locator(".map-node")).toHaveCount(12);
  await expect(page.locator(".map-edge-list > p")).toHaveCount(10);
  await expect(page.locator(".zone-role")).toHaveCount(5);
  await expect(page.locator(".page-meta")).toContainText("12 个节点");
  await expect(page.locator(".page-meta")).toContainText("10 条关系");
  await expect(page.locator(".zone-role").filter({ hasText: "研究与知识" })).toContainText("MKI");
  await expect(page.locator(".zone-role").filter({ hasText: "连接与执行" })).toContainText("ShengLuo · dsh");

  const nodes = page.locator(".map-node");
  const mki = nodes.filter({ hasText: "MKI" });
  await expect(mki).toBeVisible();
  await mki.click();
  await expect(mki).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".panel-title")).toHaveText("MKI");
  await expect(page.locator(".panel-statuses")).toContainText("VALIDATION");
  await expect(page.locator(".map-panel")).toContainText("获授权的真实知识读取与公众可用性还没有验证");

  const shengluo = nodes.filter({ hasText: "ShengLuo · dsh" });
  await expect(shengluo).toBeVisible();
  await shengluo.click();
  await expect(shengluo).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".panel-title")).toHaveText("ShengLuo · dsh");
  await expect(page.locator(".panel-statuses")).toContainText("VALIDATION");
  await expect(page.locator(".map-panel")).toContainText("dsh-shengluo 是发行仓，不是开发真源");
  await expect(page.locator(".map-panel")).toContainText("不能宣称公众可安装当前版本");

  const layout = await page.locator(".map-canvas").evaluate((canvas) => {
    const outer = canvas.getBoundingClientRect();
    const boxes = [...canvas.querySelectorAll<HTMLElement>(".map-node")].map((node) => {
      const rect = node.getBoundingClientRect();
      return { name: node.textContent, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    });
    const outside = boxes.filter((box) =>
      box.left < outer.left - 1 || box.right > outer.right + 1 || box.top < outer.top - 1 || box.bottom > outer.bottom + 1,
    );
    const overlaps = boxes.flatMap((box, index) =>
      boxes.slice(index + 1).filter((other) =>
        box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top,
      ).map((other) => [box.name, other.name]),
    );
    return { outside: outside.map((box) => box.name), overlaps };
  });
  expect(layout.outside).toEqual([]);
  expect(layout.overlaps).toEqual([]);

  await page.locator(".map-layout").screenshot({ path: testInfo.outputPath("ecosystem-mki-shengluo.png") });
});
