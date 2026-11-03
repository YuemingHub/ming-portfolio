import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const DIST = fileURLToPath(new URL("../dist/", import.meta.url));
const PORT = Number(process.env.PORT || 4173);
const ROUTES = new Set([
  "/",
  "/ecosystem",
  "/spaces",
  "/institution",
  "/expert-and-research",
  "/agent-space",
  "/evidence",
  "/cooperation",
]);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".pdf": "application/pdf",
};

const SENTINEL = `<!doctype html><html lang="zh"><head><title>Self Space sentinel</title></head>
<body><h1>Self Space SPA fallback sentinel</h1></body></html>`;

function send(res, status, type, body, headers = {}) {
  res.writeHead(status, { "Content-Type": type, "Cache-Control": "no-store", ...headers });
  res.end(body);
}

function serveFile(req, res, filePath) {
  const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
  res.writeHead(200, {
    "Content-Type": type,
    "Content-Length": statSync(filePath).size,
    "Cache-Control": "no-store",
  });
  if (req.method === "HEAD") return res.end();
  createReadStream(filePath).pipe(res);
}

const server = createServer((req, res) => {
  const url = new URL(req.url || "/", `http://127.0.0.1:${PORT}`);
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return send(res, 400, "text/plain", "bad request");
  }

  if (pathname === "/ming") {
    return send(res, 301, "text/plain", "", { Location: "/ming/" });
  }

  if (pathname.startsWith("/ming/")) {
    const route = pathname.slice("/ming".length);
    if (route !== "/" && ROUTES.has(route.replace(/\/+$/, "")) && route.endsWith("/")) {
      return send(res, 301, "text/plain", "", { Location: `/ming${route.replace(/\/+$/, "")}` });
    }
    if (route === "/" || ROUTES.has(route)) {
      return serveFile(req, res, join(DIST, "index.html"));
    }

    const relative = normalize(route).replace(/^([/\\])+/, "");
    const filePath = join(DIST, relative);
    if (filePath.startsWith(DIST) && existsSync(filePath) && statSync(filePath).isFile()) {
      return serveFile(req, res, filePath);
    }
    if (extname(route)) {
      return send(res, 404, "text/plain", "not found");
    }
    return serveFile(req, res, join(DIST, "index.html"));
  }

  return send(res, 200, "text/html; charset=utf-8", SENTINEL);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`test server: http://127.0.0.1:${PORT}/ming/ (dist: ${DIST})`);
});
