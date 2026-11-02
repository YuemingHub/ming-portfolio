#!/usr/bin/env node
// 部署前基线 / 部署后验收。只发 HTTP 请求，不登录服务器、不修改任何配置。
//
//   node deploy/verify.mjs pre  --base https://ymai.me --prefix /ming --out .deploy-baseline
//   node deploy/verify.mjs post --base https://ymai.me --prefix /ming --baseline .deploy-baseline --expect-index ./index.html
//
// pre 记录根站、/ming/、一个 /gui/_next/ 资源的字节与 sha256。
// post 复测同一组字节，并检查路由、canonical、资源 MIME、缺失文件 404 与隔离。
// post 必须给出预期 index.html；否则无法证明线上字节属于这一次 release。
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [mode, ...rest] = process.argv.slice(2);
const args = new Map();
for (let i = 0; i < rest.length; i += 2) args.set(rest[i].replace(/^--/, ""), rest[i + 1]);

const BASE = (args.get("base") || "https://ymai.me").replace(/\/$/, "");
const PREFIX = (args.get("prefix") || "/ming").replace(/\/$/, "");
const CANONICAL_BASE = (args.get("canonical-base") || BASE).replace(/\/$/, "");
const OUT = args.get("out") || ".deploy-baseline";
const BASELINE = args.get("baseline") || ".deploy-baseline";
const EXPECT_INDEX = args.get("expect-index") || "";

if (mode !== "pre" && mode !== "post") {
  console.error("用法：node deploy/verify.mjs pre|post --base https://ymai.me --prefix /ming");
  process.exit(2);
}

if (mode === "post" && !EXPECT_INDEX) {
  console.error("post 必须提供 --expect-index <path/to/index.html>，用于把线上字节绑定到预期发布产物");
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
      "User-Agent": "ming-deploy-verify",
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
  const ming = await get(`${PREFIX}/`);
  const guiUrl = findGuiAsset(root.body.toString("utf8"));
  const gui = guiUrl ? await get(guiUrl) : null;

  writeFileSync(join(OUT, "root.html"), root.body);
  writeFileSync(join(OUT, "ming.html"), ming.body);
  if (gui) writeFileSync(join(OUT, "gui.bin"), gui.body);

  const manifest = {
    recordedAt: new Date().toISOString(),
    base: BASE,
    prefix: PREFIX,
    root: { status: root.status, sha256: root.sha, bytes: root.body.length, type: root.type },
    ming: { status: ming.status, sha256: ming.sha, bytes: ming.body.length, type: ming.type },
    gui: gui ? { url: guiUrl, status: gui.status, sha256: gui.sha, bytes: gui.body.length, type: gui.type } : null,
  };
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

  console.log(`已记录基线：${OUT}`);
  console.log(`  /            ${root.status} ${root.body.length}B ${root.sha.slice(0, 12)}`);
  console.log(`  ${PREFIX}/        ${ming.status} ${ming.body.length}B ${ming.sha.slice(0, 12)}`);
  console.log(`  gui           ${gui ? `${gui.status} ${gui.body.length}B ${gui.sha.slice(0, 12)}` : "未在根站找到 /gui/_next/ 资源"}`);
  check("根站可访问", root.status === 200, String(root.status));
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
  check("基线格式", manifest.base === BASE && manifest.prefix === PREFIX, `${manifest.base}${manifest.prefix}`);

  const root = await get("/");
  const ming = await get(`${PREFIX}/`);
  check(
    "根站字节未变化",
    root.status === manifest.root.status && root.sha === manifest.root.sha256,
    `${root.status} ${root.body.length}B ${root.sha.slice(0, 12)}`,
  );
  check(
    `${PREFIX}/ 返回 200 HTML`,
    ming.status === 200 && ming.type.includes("text/html"),
    `${ming.status} ${ming.type} ${ming.body.length}B`,
  );
  check(
    `${PREFIX}/ 与预期发布产物字节一致`,
    ming.sha === expectedSha && ming.body.length === expected.length,
    `${ming.body.length}B ${ming.sha.slice(0, 12)} vs ${expected.length}B ${expectedSha.slice(0, 12)}`,
  );

  if (manifest.gui) {
    const gui = await get(manifest.gui.url);
    check(
      "已引用 /gui/_next/ 资源字节未变化",
      gui.status === manifest.gui.status && gui.sha === manifest.gui.sha256,
      `${gui.status} ${gui.body.length}B ${gui.sha.slice(0, 12)}`,
    );
  } else {
    console.log("SKIP  根站未引用 /gui/_next/ 资源，隔离判据仅使用根站字节");
  }

  // 这是 SPA：路由的标题、H1、canonical 由浏览器运行时写入，HTTP 层只验证
  // 回退到同一份 index.html；渲染后的断言交给 tests/render-check.mjs。
  for (const route of routes) {
    const path = `${PREFIX}${route || "/"}`;
    const { status, type, sha: bodySha, body } = await get(path);
    check(
      `路由 ${path} 与 ${PREFIX}/ 字节一致`,
      status === 200 && type.includes("text/html") && bodySha === ming.sha,
      `${status} ${body.length}B ${bodySha.slice(0, 12)}`,
    );
  }

  {
    const html = ming.body.toString("utf8");
    const canonical = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1] || "";
    check("首页 canonical", canonical === `${CANONICAL_BASE}${PREFIX}/`, canonical || "无");
    check("首页引用相对 JS", html.includes('src="./assets/'), html.includes('src="./assets/') ? "found" : "missing");
  }

  for (const route of routes.slice(1)) {
    const { status, loc } = await get(`${PREFIX}${route}/`);
    check(`尾斜杠 ${PREFIX}${route}/`, status === 301 && loc === `${PREFIX}${route}`, `${status} -> ${loc}`);
  }

  {
    const { status, loc } = await get(PREFIX);
    check(`${PREFIX} 无尾斜杠`, status === 301 && loc === `${PREFIX}/`, `${status} -> ${loc}`);
  }

  {
    const unknown = await get(`${PREFIX}/no-such-route`);
    check(
      "未知路径回退与 index.html 字节一致",
      unknown.status === 200 && unknown.type.includes("text/html") && unknown.sha === ming.sha,
      `${unknown.status} ${unknown.body.length}B ${unknown.sha.slice(0, 12)}`,
    );
  }

  for (const path of [`${PREFIX}/missing.js`, `${PREFIX}/media/not-found.png`]) {
    const { status } = await get(path);
    check(`缺失资源 ${path} -> 404`, status === 404, String(status));
  }

  {
    const html = ming.body.toString("utf8");
    const assets = [...html.matchAll(/(?:src|href)="\.\/(assets\/[^"]+)"/g)].map((m) => m[1]);
    check("页面引用相对资源", assets.length > 0, assets.join(", "));
    for (const asset of assets) {
      const { status, type } = await get(`${PREFIX}/${asset}`);
      const expected = asset.endsWith(".js") ? "javascript" : asset.endsWith(".css") ? "text/css" : "";
      check(`资源 ${asset}`, status === 200 && (!expected || type.includes(expected)), `${status} ${type}`);
    }
  }
}

if (mode === "pre") await record();
else await verify();

console.log(
  `\n${findings.length > 0 ? `${findings.length} 项失败` : mode === "pre" ? "基线已记录" : "全部通过"}`,
);
process.exitCode = findings.length === 0 ? 0 : 1;
