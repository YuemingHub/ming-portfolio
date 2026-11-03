#!/usr/bin/env node
// 根路径部署的前置基线 / 部署后验收。只发 HTTP 请求。
//
//   node deploy/verify-root.mjs pre  --base https://ymai.me --out .deploy-baseline-root
//   node deploy/verify-root.mjs post --base https://ymai.me --baseline .deploy-baseline-root --expect-index ./index.html
//
// 关键判据：
//   - 根路径字节与预期 release 完全一致；
//   - Self Space 的 /gui/ 首页与 /gui/_next/ 资源保持可用（资源不得回退成 HTML）；
//   - /health 与基线一致；/ming 与 /ming/* 301 到根路径；
//   - 作品集路由、尾斜杠、404、canonical 与相对资源。
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [mode, ...rest] = process.argv.slice(2);
const args = new Map();
for (let i = 0; i < rest.length; i += 2) args.set(rest[i].replace(/^--/, ""), rest[i + 1]);

const BASE = (args.get("base") || "https://ymai.me").replace(/\/$/, "");
const OUT = args.get("out") || ".deploy-baseline-root";
const BASELINE = args.get("baseline") || ".deploy-baseline-root";
const EXPECT_INDEX = args.get("expect-index") || "";

if (mode !== "pre" && mode !== "post") {
  console.error("用法：node deploy/verify-root.mjs pre|post --base https://ymai.me");
  process.exit(2);
}

if (mode === "post" && !EXPECT_INDEX) {
  console.error("post 必须提供 --expect-index <path/to/index.html>");
  process.exit(2);
}

const routes = [
  "",
  "/ecosystem",
  "/spaces",
  "/institution",
  "/expert-and-research",
  "/agent-space",
  "/evidence",
  "/cooperation",
];

const sha = (buf) => createHash("sha256").update(buf).digest("hex");

async function get(path, { redirect = "manual" } = {}) {
  const res = await fetch(BASE + path, {
    redirect,
    headers: {
      "Accept-Encoding": "identity",
      "User-Agent": "ming-deploy-verify-root",
      Connection: "close",
    },
  });
  const body = Buffer.from(await res.arrayBuffer());
  return {
    status: res.status,
    type: res.headers.get("content-type") || "",
    loc: res.headers.get("location") || "",
    body,
    sha: sha(body),
  };
}

const findings = [];
function check(name, ok, detail) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${detail}`);
  if (!ok) findings.push(name);
}

function findGuiAsset(html) {
  const match = html.match(/\/gui\/_next\/[^"')\s]+?\.(?:js|css)/);
  return match ? match[0] : "";
}

async function record() {
  mkdirSync(OUT, { recursive: true });
  const root = await get("/");
  const gui = await get("/gui/");
  const space = await get("/gui/space/");
  const health = await get("/health");
  const ming = await get("/ming/");
  const guiAssetUrl = findGuiAsset(root.body.toString("utf8"));
  const guiAsset = guiAssetUrl ? await get(guiAssetUrl) : null;

  writeFileSync(join(OUT, "root.html"), root.body);
  writeFileSync(join(OUT, "gui.html"), gui.body);
  writeFileSync(join(OUT, "ming.html"), ming.body);
  if (guiAsset) writeFileSync(join(OUT, "gui.bin"), guiAsset.body);
  writeFileSync(join(OUT, "health.bin"), health.body);

  const manifest = {
    recordedAt: new Date().toISOString(),
    base: BASE,
    root: { status: root.status, sha256: root.sha, bytes: root.body.length, type: root.type },
    gui: { status: gui.status, sha256: gui.sha, bytes: gui.body.length, type: gui.type },
    space: { status: space.status, sha256: space.sha, bytes: space.body.length, type: space.type },
    health: { status: health.status, sha256: health.sha, bytes: health.body.length, type: health.type },
    ming: { status: ming.status, sha256: ming.sha, bytes: ming.body.length, type: ming.type },
    guiAsset: guiAsset
      ? { url: guiAssetUrl, status: guiAsset.status, bytes: guiAsset.body.length, type: guiAsset.type }
      : null,
  };
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`已记录基线：${OUT}`);
  for (const [name, item] of Object.entries(manifest)) {
    if (!item || typeof item !== "object" || !("status" in item)) continue;
    console.log(`  ${name.padEnd(8)} ${item.status} ${item.bytes}B ${item.sha256?.slice(0, 12) ?? ""} ${item.type ?? ""}`);
  }
  check("根站可访问", root.status === 200, String(root.status));
  check("Self Space /gui/ 可访问", gui.status === 200, String(gui.status));
}

async function verify() {
  const manifest = JSON.parse(readFileSync(join(BASELINE, "manifest.json"), "utf8"));
  let expected;
  try {
    expected = readFileSync(EXPECT_INDEX);
  } catch {
    console.error(`无法读取预期发布产物：${EXPECT_INDEX}`);
    process.exit(2);
  }
  const expectedSha = sha(expected);
  check("基线格式", manifest.base === BASE, manifest.base);

  const root = await get("/");
  check(
    "根路径 200 HTML 且与预期发布产物字节一致",
    root.status === 200 && root.type.includes("text/html") && root.sha === expectedSha && root.body.length === expected.length,
    `${root.status} ${root.type} ${root.body.length}B ${root.sha.slice(0, 12)} vs ${expected.length}B ${expectedSha.slice(0, 12)}`,
  );
  check(
    "根路径已不是 Self Space 首页",
    root.sha !== manifest.root.sha256 && root.sha !== manifest.gui.sha256,
    `root=${root.sha.slice(0, 12)} self-space=${manifest.root.sha256.slice(0, 12)}`,
  );

  for (const route of routes) {
    const path = route || "/";
    const { status, type, sha: bodySha, body } = await get(path);
    check(
      `路由 ${path} 与根 index 字节一致`,
      status === 200 && type.includes("text/html") && bodySha === root.sha,
      `${status} ${body.length}B ${bodySha.slice(0, 12)}`,
    );
  }

  {
    const html = root.body.toString("utf8");
    const canonical = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1] || "";
    check("首页 canonical 为根路径", canonical === `${BASE}/`, canonical || "无");
    check("首页引用相对 JS", html.includes('src="./assets/'), html.includes('src="./assets/') ? "found" : "missing");
    const assets = [...html.matchAll(/(?:src|href)="\.\/(assets\/[^"]+)"/g)].map((m) => m[1]);
    check("首页引用相对资源", assets.length > 0, assets.join(", "));
    for (const asset of assets) {
      const res = await get(`/${asset}`);
      const want = asset.endsWith(".js") ? "javascript" : asset.endsWith(".css") ? "text/css" : "";
      check(`资源 ${asset}`, res.status === 200 && (!want || res.type.includes(want)), `${res.status} ${res.type}`);
    }
  }

  {
    const gui = await get("/gui/");
    check(
      "Self Space /gui/ 首页字节与基线一致",
      gui.status === 200 && gui.type.includes("text/html") && gui.sha === manifest.gui.sha256,
      `${gui.status} ${gui.body.length}B ${gui.sha.slice(0, 12)}`,
    );
    const space = await get("/gui/space/");
    const spaceIndex = await get("/gui/space/index.html");
    // 基线里的 /gui/space/ 是被首页兜底的 21361B；修复后应命中原生静态页。
    check(
      "Self Space /gui/space/ 命中真实路由页而非首页回退",
      space.status === 200 &&
        space.type.includes("text/html") &&
        space.body.length > 1000 &&
        space.sha !== root.sha &&
        space.sha === spaceIndex.sha,
      `${space.status} ${space.body.length}B ${space.sha.slice(0, 12)} vs index ${spaceIndex.body.length}B`,
    );
    if (manifest.guiAsset) {
      const asset = await get(manifest.guiAsset.url);
      check(
        "Self Space /gui/_next 资源返回真实 JS/CSS 而非 HTML",
        asset.status === 200 && !asset.type.includes("text/html") && asset.body.length > 1000,
        `${asset.status} ${asset.type} ${asset.body.length}B`,
      );
    } else {
      check("Self Space 首页引用 /gui/_next 资源", false, "未找到资源 URL");
    }
  }

  {
    const health = await get("/health");
    check(
      "/health 与基线一致",
      health.status === manifest.health.status && health.sha === manifest.health.sha256,
      `${health.status} ${health.body.length}B`,
    );
  }

  {
    const a = await get("/ming");
    check("/ming 301 到根", a.status === 301 && a.loc === "/", `${a.status} -> ${a.loc}`);
    const b = await get("/ming/");
    check("/ming/ 301 到根", b.status === 301 && b.loc === "/", `${b.status} -> ${b.loc}`);
    const c = await get("/ming/ecosystem");
    check("/ming/ecosystem 301 到 /ecosystem", c.status === 301 && c.loc === "/ecosystem", `${c.status} -> ${c.loc}`);
    const d = await get("/ming/ecosystem/");
    const followed = await get("/ming/ecosystem/", { redirect: "follow" });
    check(
      "/ming/ecosystem/ 最终落到 200",
      d.status === 301 && followed.status === 200 && followed.sha === root.sha,
      `${d.status} -> ${d.loc}, final ${followed.status}`,
    );
  }

  for (const route of routes.slice(1)) {
    const { status, loc } = await get(`${route}/`);
    check(`尾斜杠 ${route}/`, status === 301 && loc === route, `${status} -> ${loc}`);
  }

  {
    const unknown = await get("/no-such-route");
    check(
      "未知路径回退与根 index 字节一致",
      unknown.status === 200 && unknown.sha === root.sha,
      `${unknown.status} ${unknown.body.length}B`,
    );
  }

  for (const path of ["/assets/does-not-exist.js", "/media/does-not-exist.png"]) {
    const { status } = await get(path);
    check(`缺失资源 ${path} -> 404`, status === 404, String(status));
  }
}

if (mode === "pre") await record();
else await verify();

console.log(`\n${findings.length > 0 ? `${findings.length} 项失败` : mode === "pre" ? "基线已记录" : "全部通过"}`);
process.exitCode = findings.length === 0 ? 0 : 1;
