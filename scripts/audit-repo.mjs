#!/usr/bin/env node
// 公开仓库体检：禁止提交的路径、常见凭据形状、本机绝对路径、交付件是否齐全。
// 用法：node scripts/audit-repo.mjs（在仓库任意位置执行均可）
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: REPO, encoding: "buffer" })
  .toString("utf8")
  .split("\0")
  .filter(Boolean);

const findings = [];

const forbiddenPaths = [
  [/(^|\/)\.deploy\//, "部署脚本目录"],
  [/(^|\/)node_modules\//, "依赖目录"],
  [/^site\/dist\//, "构建产物"],
  [/(^|\/)test-results\//, "测试临时结果"],
  [/(^|\/)playwright-report\//, "测试报告"],
  [/(^|\/)nginx-test\/\.run\//, "nginx 测试临时目录"],
  [/(^|\/)\.qoder-sites/, "Qoder 站点本地配置"],
  [/(^|\/)\.DS_Store$/, "系统文件"],
  [/\.(key|pem|p12|pfx|p8)$/i, "密钥/证书文件"],
];

for (const file of tracked) {
  for (const [re, reason] of forbiddenPaths) {
    if (re.test(file)) findings.push(`${file}: 禁止提交（${reason}）`);
  }
  if (/(^|\/)\.env(\.|$)/.test(file) && !file.endsWith(".env.example")) {
    findings.push(`${file}: 环境变量文件不得入库`);
  }
}

const TEXT_EXT = /\.(md|ts|tsx|js|mjs|cjs|json|ya?ml|sh|html|css|txt|svg)$/i;
const SKIP_SCAN = [
  /^assets\//,
  /^site\/package-lock\.json$/,
  /^scripts\/audit-repo\.mjs$/,
  /^archive\/pre-qoder-2026-11-02\/tools\//,
];

const contentRules = [
  [/C:\\\\Users/i, "本机绝对路径（Windows）"],
  [/C:\/Users/i, "本机绝对路径（Windows）"],
  [/(^|[\s"'(/])_local\//, "工作区内部路径"],
  [/\/home\/[A-Za-z0-9._-]+\//, "本机绝对路径（Linux）"],
  [/\/root\//, "本机绝对路径（root）"],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, "私钥"],
  [/\bghp_[A-Za-z0-9]{20,}/, "GitHub token 形状"],
  [/\bsk-[A-Za-z0-9]{20,}/, "API key 形状"],
  [/\bAKIA[0-9A-Z]{16}\b/, "AWS access key 形状"],
  [/\bLTAI[0-9A-Za-z]{12,}\b/, "阿里云 access key 形状"],
  [/\bxox[baprs]-[A-Za-z0-9-]{10,}/, "Slack token 形状"],
  [/ssh-rsa AAAA[0-9A-Za-z+/]{20,}/, "SSH 公钥/私钥片段"],
  [/(?:password|passwd|secret|api[_-]?key|access[_-]?key)\s*[:=]\s*["'][^"'\s]{8,}["']/i, "疑似明文凭据"],
];

let scanned = 0;
for (const file of tracked) {
  if (!TEXT_EXT.test(file) || SKIP_SCAN.some((re) => re.test(file))) continue;
  const abs = join(REPO, file);
  if (!existsSync(abs) || statSync(abs).size > 2 * 1024 * 1024) continue;
  scanned += 1;
  const text = readFileSync(abs, "utf8");
  const lines = text.split(/\r?\n/);
  for (const [re, reason] of contentRules) {
    lines.forEach((line, index) => {
      if (re.test(line)) findings.push(`${file}:${index + 1}: ${reason}`);
    });
  }
}

const required = [
  "README.md",
  "index.html",
  "site/src/App.tsx",
  "site/tests/routes.spec.ts",
  "site/playwright.config.ts",
  "nginx-test/run.sh",
  "nginx-test/verify.mjs",
  "nginx-test/nginx.conf.template",
  ".github/workflows/ci.yml",
  "delivery/00-交付索引.md",
];
for (const file of required) {
  if (!existsSync(join(REPO, file))) findings.push(`缺少交付件：${file}`);
}

console.log(`tracked files: ${tracked.length}`);
console.log(`scanned text files: ${scanned}`);
if (findings.length === 0) {
  console.log("PASS  公开仓库体检未发现问题");
  process.exit(0);
}
console.log(`\n发现 ${findings.length} 项问题：`);
for (const finding of findings) console.log(`FAIL  ${finding}`);
process.exit(1);
