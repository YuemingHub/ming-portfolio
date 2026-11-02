import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import { connect } from "node:net";
import { join } from "node:path";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i].replace(/^--/, ""), process.argv[i + 1]);
}

const ORIGIN = (args.get("origin") || "http://127.0.0.1:18089").replace(/\/$/, "");
const ROLLBACK_ORIGIN = (args.get("rollback-origin") || "http://127.0.0.1:18090").replace(/\/$/, "");
const PORTFOLIO = args.get("portfolio") || join(import.meta.dirname, "..", "site", "dist");
const SENTINEL_INDEX = args.get("sentinel") || join(import.meta.dirname, "fixtures", "selfspace", "index.html");

if (!existsSync(join(PORTFOLIO, "index.html"))) {
  console.error(`portfolio index not found: ${join(PORTFOLIO, "index.html")}`);
  process.exit(2);
}

const sha = (buf) => createHash("sha256").update(buf).digest("hex");
const portfolioIndex = readFileSync(join(PORTFOLIO, "index.html"));
const portfolioSha = sha(portfolioIndex);
const sentinelIndex = readFileSync(SENTINEL_INDEX);
const sentinelSha = sha(sentinelIndex);
const portfolioHtml = portfolioIndex.toString("utf8");

const rows = [];
let failed = 0;
let skipped = 0;

function check(name, ok, detail) {
  rows.push({ name, ok, detail });
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${detail}`);
}

function skip(name, detail) {
  skipped++;
  console.log(`SKIP  ${name}  ${detail}`);
}

async function get(origin, path, { method = "GET", redirect = "manual" } = {}) {
  const res = await fetch(origin + path, {
    method,
    redirect,
    headers: { "Accept-Encoding": "identity" },
  });
  const body = method === "HEAD" ? Buffer.alloc(0) : Buffer.from(await res.arrayBuffer());
  return {
    status: res.status,
    type: res.headers.get("content-type") || "",
    loc: res.headers.get("location") || "",
    length: res.headers.get("content-length") || "",
    body,
    sha: sha(body),
  };
}

function rawRequest(origin, path) {
  const url = new URL(origin);
  return new Promise((resolve, reject) => {
    const socket = connect({ host: url.hostname, port: Number(url.port) || 80 }, () => {
      socket.write(
        `GET ${path} HTTP/1.1\r\nHost: ${url.host}\r\nConnection: close\r\nAccept-Encoding: identity\r\n\r\n`,
      );
    });
    socket.setEncoding("latin1");
    let data = "";
    socket.on("data", (chunk) => {
      data += chunk;
    });
    socket.on("end", () => {
      const split = data.indexOf("\r\n\r\n");
      const head = split >= 0 ? data.slice(0, split) : data;
      const bodyText = split >= 0 ? data.slice(split + 4) : "";
      const status = Number(head.split("\r\n")[0].split(" ")[1]);
      const body = Buffer.from(bodyText, "latin1");
      resolve({ status, head, body, sha: sha(body) });
    });
    socket.on("error", reject);
  });
}

const routes = [
  "/ming/",
  "/ming/ecosystem",
  "/ming/spaces",
  "/ming/institution",
  "/ming/expert-and-research",
  "/ming/agent-space",
  "/ming/evidence",
  "/ming/cooperation",
];

for (const route of routes) {
  const { status, type, sha: bodySha, body } = await get(ORIGIN, route);
  check(
    `route ${route}`,
    status === 200 && type.includes("text/html") && bodySha === portfolioSha,
    `${status} ${type} ${body.length}B`,
  );
}

for (const route of routes.slice(1)) {
  const { status, loc } = await get(ORIGIN, route + "/");
  check(`trailing ${route}/`, status === 301 && loc === route, `${status} -> ${loc}`);
}

{
  const { status, loc } = await get(ORIGIN, "/ming");
  check("/ming no slash", status === 301 && loc === "/ming/", `${status} -> ${loc}`);
}

const discovered = [...portfolioHtml.matchAll(/(?:src|href)="\.\/(assets\/[^"]+)"/g)].map((m) => m[1]);
const jsAsset = discovered.find((p) => p.endsWith(".js"));
const cssAsset = discovered.find((p) => p.endsWith(".css"));
check("build emits JS asset", Boolean(jsAsset), jsAsset || "missing");
check("build emits CSS asset", Boolean(cssAsset), cssAsset || "missing");

const assets = [
  jsAsset && [jsAsset, /javascript/],
  cssAsset && [cssAsset, /text\/css/],
  ["media/ymai-fun.png", /image\/png/],
  ["media/mingos-cn.png", /image\/png/],
  ["favicon.svg", /image\/svg\+xml/],
  ["og-card.png", /image\/png/],
].filter(Boolean);

for (const [file, typeRe] of assets) {
  const url = `/ming/${file}`;
  const { status, type, sha: bodySha, body } = await get(ORIGIN, url);
  let localSha = "";
  try {
    localSha = sha(readFileSync(join(PORTFOLIO, file)));
  } catch {
    localSha = "missing";
  }
  check(
    `asset ${url}`,
    status === 200 && typeRe.test(type) && bodySha === localSha,
    `${status} ${type} ${body.length}B`,
  );
}

{
  const extra = "media/ymai-love.png";
  const { status, type, sha: bodySha } = await get(ORIGIN, `/ming/${extra}`);
  const localSha = sha(readFileSync(join(PORTFOLIO, extra)));
  check(
    `asset /ming/${extra}`,
    status === 200 && type.includes("image/png") && bodySha === localSha,
    `${status} ${type}`,
  );
}

for (const path of ["/ming/missing.js", "/ming/media/missing.png", "/ming/no-such.css"]) {
  const { status } = await get(ORIGIN, path);
  check(`missing file ${path} -> 404`, status === 404, String(status));
}

{
  const { status, type, sha: bodySha } = await get(ORIGIN, "/ming/no-such-route");
  check(
    "unknown route -> SPA fallback",
    status === 200 && type.includes("text/html") && bodySha === portfolioSha,
    `${status} ${type}`,
  );
}

for (const path of ["/", "/gui/_next/static/chunks/0~1ut8j7t4w5..css", "/_next/static/x.js", "/some/other/path"]) {
  const { status, type, sha: bodySha } = await get(ORIGIN, path);
  check(
    `isolation ${path}`,
    status === 200 && type.includes("text/html") && bodySha === sentinelSha,
    `${status} ${type}`,
  );
}

check("canonical", portfolioHtml.includes('rel="canonical" href="https://ymai.me/ming/"'), portfolioHtml.includes('rel="canonical" href="https://ymai.me/ming/"') ? "found" : "missing");
check("relative js", portfolioHtml.includes('src="./assets/'), portfolioHtml.includes('src="./assets/') ? "found" : "missing");
check("og url", portfolioHtml.includes('property="og:url" content="https://ymai.me/ming/"'), portfolioHtml.includes('property="og:url" content="https://ymai.me/ming/"') ? "found" : "missing");

// ——— 边界测试（在基线项之后追加） ———

{
  const { status, length, body } = await get(ORIGIN, "/ming/", { method: "HEAD" });
  check(
    "HEAD /ming/",
    status === 200 && body.length === 0 && Number(length) === portfolioIndex.length,
    `${status} length=${length} body=${body.length}B`,
  );
}

{
  const { status, sha: bodySha } = await get(ORIGIN, "/ming/?from=test");
  check("home with query", status === 200 && bodySha === portfolioSha, String(status));
}

{
  const { status, sha: bodySha } = await get(ORIGIN, "/ming/ecosystem?from=test");
  check("route with query", status === 200 && bodySha === portfolioSha, String(status));
}

{
  const { status, sha: bodySha } = await get(ORIGIN, "/ming/index.html");
  check("explicit index.html", status === 200 && bodySha === portfolioSha, String(status));
}

{
  const { status, type } = await get(ORIGIN, "/ming/assets/");
  check("asset directory is not HTML 200", status !== 200 || !type.includes("text/html"), `${status} ${type}`);
}

{
  const { status } = await get(ORIGIN, "/ming/ecosystem/index.html");
  check("nested missing index.html -> 404", status === 404, String(status));
}

{
  const { status, sha: bodySha } = await get(ORIGIN, "/ming/a/b/c");
  check("deep path SPA fallback", status === 200 && bodySha === portfolioSha, String(status));
}

{
  const { status, sha: bodySha } = await get(ORIGIN, "/ming/ecosystem-x");
  check("prefix lookalike is not redirected", status === 200 && bodySha === portfolioSha, String(status));
}

if (process.platform === "win32") {
  skip("case-sensitive /MING/ stays on root", "Windows 文件系统不区分大小写，本地无法复现；由 Linux CI 执行同一检查");
} else {
  const { status, sha: bodySha } = await get(ORIGIN, "/MING/");
  check("case-sensitive /MING/ stays on root", status === 200 && bodySha === sentinelSha, String(status));
}

{
  const { status, sha: bodySha } = await rawRequest(ORIGIN, "/ming/../");
  const ok = (status === 200 && bodySha === sentinelSha) || status === 301;
  check("raw traversal /ming/../ does not serve portfolio", ok, String(status));
}

{
  const { status, sha: bodySha } = await rawRequest(ORIGIN, "/ming/%2e%2e/");
  const ok = status !== 200 || bodySha !== portfolioSha;
  check("encoded traversal does not serve portfolio", ok, String(status));
}

{
  const { status, sha: bodySha } = await get(ORIGIN, "/ming//", { redirect: "follow" });
  check("double slash resolves", status === 200 && bodySha === portfolioSha, String(status));
}

{
  const { status, sha: bodySha } = await get(ORIGIN, "/ming/ecosystem/extra/");
  check("route subpath SPA fallback", status === 200 && bodySha === portfolioSha, String(status));
}

{
  const { status, sha: bodySha, loc } = await get(ORIGIN, "/ming/ecosystem/?a=1");
  const followed = await get(ORIGIN, `/ming/ecosystem?a=1`, { redirect: "follow" });
  check(
    "redirect keeps query",
    status === 301 && loc.startsWith("/ming/ecosystem") && followed.status === 200 && followed.sha === portfolioSha,
    `${status} -> ${loc} then ${followed.status}`,
  );
}

{
  const { status } = await get(ORIGIN, "/ming/missing.js", { method: "HEAD" });
  check("HEAD missing asset -> 404", status === 404, String(status));
}

for (const path of ["/ming/", "/ming/ecosystem", "/"]) {
  const { status, type, sha: bodySha } = await get(ROLLBACK_ORIGIN, path);
  check(
    `rollback ${path} stays on Self Space`,
    status === 200 && type.includes("text/html") && bodySha === sentinelSha,
    `${status} ${type}`,
  );
}

console.log(`\n${rows.length - failed}/${rows.length} passed${skipped ? `, ${skipped} skipped` : ""}`);
process.exit(failed ? 1 : 0);