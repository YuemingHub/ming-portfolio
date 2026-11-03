# 部署与回滚（公开版）

本目录只放**可执行、可参数化**的验证脚本；真实服务器路径、账号、备份目录属于运维内部信息，不进入公开仓库。

> 当前状态：`DEPLOYED / REAL_TESTS_PENDING`（2026-11-03）。作品集位于 `https://ymai.me/` 根路径；`/ming/*` 301 到根路径；Self Space 位于其构建原生的 `https://ymai.me/gui/`。以下命令只用于已授权的发布。

## 1. 边界

只做四件事：

1. 用独立静态目录存放作品集构建产物。
2. 把 `ymai.me` 的 `location /` 指向作品集 `current`。
3. 保留 Self Space 的 `/gui/` 映射与 `/ming` 历史 301。
4. 原子切换 `current` 软链接。

默认不做：不改 `/api/`、`/health`、`/api/wechat`，不改 Self Space 代码或其 release，不改 DNS/证书，不重启服务器（只 reload nginx），不执行旧域名 301，不删除任何历史文件或旧 release。2026-11-03 的 `www.ymai.me` 修复是 Owner 单独授权后的例外，记录见 §8。

## 2. 前置只读检查（服务器上执行，由运维会话完成）

- 记录 nginx 版本、完整配置、配置备份位置。
- 确认 `ymai.me` 的 443 server 块与现有 SPA fallback 写法。
- 确认 `/ming` 没有更具体的既有 location。
- 确认 nginx 运行用户能进入新目录。
- 确认进程管理方式（systemd 或其他）与 reload 命令。

具体路径与备份命令由运维会话保存，不写入本仓库。

## 3. 目录布局

```text
<PORTFOLIO_PARENT>/
├── releases/
│   └── <RELEASE_ID>/
│       └── ming/            # index.html / assets / media / favicon.svg / og-card.png / .nojekyll
└── current -> releases/<RELEASE_ID>
```

上传只取构建产物 6 项，不复制 `site/`、`archive/`、`README.md`、测试与交付文档。

```bash
REL=<PORTFOLIO_PARENT>/releases/<RELEASE_ID>
install -d -m 755 "$REL/ming"
rsync -a index.html assets media favicon.svg og-card.png .nojekyll "$REL/ming/"
find "$REL" -type d -exec chmod 755 {} +
find "$REL" -type f -exec chmod 644 {} +
```

原子切换：

```bash
ln -s "releases/<RELEASE_ID>" <PORTFOLIO_PARENT>/current.next
mv -Tf <PORTFOLIO_PARENT>/current.next <PORTFOLIO_PARENT>/current
```

## 3. nginx 片段

完整内容见 [`nginx-root.conf`](nginx-root.conf)。要点：

- `location = /ming`、`location = /ming/` → 301 `/`；`location ^~ /ming/` 把子路径 301 到根路径。
- `location = /gui` → 301 `/gui/`；`location ^~ /gui/` 的 `root` 指向 Self Space 发布父目录（其产物自带 `gui/` 一级），`try_files $uri $uri/ =404`。
- `/assets/`、`/media/`、`/favicon.svg`、`/og-card.png` 指向作品集 `current`，缺失即 404，不回退成 SPA HTML。
- `location /` 指向作品集 `current`，7 条页面尾斜杠 301 成无尾斜杠，再回退 `index.html`。

在 `ymai.me` 的 HTTPS server 块内 `include` 该片段；片段已包含 `location /`，因此原 server 块中的 `location /` 必须移除，避免重复定义。`/api/`、`/health`、`/api/wechat` 的既有 location 保持不变。

## 4. 部署前基线

```bash
node deploy/verify-root.mjs pre --base https://ymai.me --out <BACKUP_DIR>/baseline-root
```

记录 `/`、`/gui/`、`/gui/space/`、`/health`、`/ming/` 的字节与 sha256，以及 Self Space 首页引用的一个 `/gui/_next/` 资源。**必须**在改动前执行。

## 5. 上线

1. 取固定提交的构建产物上传到新 release。
2. 更新片段、移除 server 块里旧的 `location /`。
3. `nginx -t`。
4. 原子切换 `current`。
5. `systemctl reload nginx`（不 restart）。
6. 立即执行：

```bash
node deploy/verify-root.mjs post --base https://ymai.me \
  --baseline <BACKUP_DIR>/baseline-root \
  --expect-index <RELEASE_DIR>/ming/index.html
```

`post` 检查：根路径与本次 release 字节一致、根路径不再是 Self Space、8 条路由、canonical、相对 JS/CSS、`/gui/` 首页与基线一致、`/gui/space/` 命中真实路由、`/gui/_next/` 资源不是 HTML、`/health` 未变、`/ming` 系列 301、尾斜杠 301、未知路径回退、缺失资源 404。`--expect-index` 必填，否则旧 release 或上传错包也会与线上自身一致而全项通过。

渲染层：

```bash
cd site
npx playwright install chromium
node tests/render-check.mjs --base https://ymai.me
```

逐条打开 8 个路由，检查运行时写入的标题、H1、canonical、图片、console error、失败请求，以及手机 390 无横向溢出。Self Space 另用真实浏览器打开 `https://ymai.me/gui/`，确认样式生效、`/gui/_next/` 资源不是 HTML、`/gui/space/` 可访问。

任一失败按 [`../delivery/06-回滚方案.md`](../delivery/06-回滚方案.md) 撤回。

## 6. 历史子路径脚本

`verify.mjs` 与 `nginx-test/` 保留的是 2026-11-03 早先 `/ming/` 子路径部署的验证工程，作为历史回滚点与演练记录；当前根路径发布请使用 `verify-root.mjs`。

## 7. 执行条件

| # | 条件 | 当前 |
| --- | --- | --- |
| 1 | Owner 明确授权部署 | 已授权（2026-11-03） |
| 2 | 合并策略决定 | 已合并，merge commit `e44b48f` |
| 3 | 真人测试/屏幕阅读器完成或 Owner 豁免 | 未执行；Owner 授权先上线并另行排期 |
| 4 | 生产基线已记录 | 已完成（2026-11-03 根路径切换前） |
| 5 | 生产 nginx 备份与回滚命令已核对 | 已完成 |
| 6 | Self Space 原生 `/gui/` 映射已确认 | 已确认并经生产复核 |

## 8. `www.ymai.me`（2026-11-03 追加）

修复前 `www` 的 CNAME 仍指向 Coze，nginx 没有 `www` server 块，证书也不含 `www` SAN。三项同时修复后才可用：

1. DNS：`www` CNAME → `ymai.me`，TTL 600。
2. nginx：新增 `www.ymai.me` 的 80 与 443 server 块，均 301 到 `https://ymai.me$request_uri`；`nginx -t` 后 `systemctl reload nginx`。
3. 证书：`certbot --nginx --cert-name ymai.me --expand`，把 `www.ymai.me` 加入 SAN；之后跑一次 `certbot renew --dry-run`。

验证：

```bash
nslookup www.ymai.me 1.1.1.1
curl --noproxy '*' -sSI http://www.ymai.me/  | sed -n '1,8p'
curl --noproxy '*' -sSI https://www.ymai.me/ | sed -n '1,8p'
curl --noproxy '*' -sS -L -o /dev/null -w '%{http_code} %{url_effective}
' https://www.ymai.me/cooperation
```

预期：公共解析显示 `www.ymai.me` 是 `ymai.me` 的别名；HTTP 与 HTTPS 均 301；联系页最终 200 且地址为 `https://ymai.me/cooperation`。

只回滚 www：删除 `www` server 块并 reload；DNS 可保持 CNAME 或恢复为修复前的 Coze 目标。连同内容回滚：把 `current` 切回 `20261103-root-1040`。详见 [`../delivery/06-回滚方案.md`](../delivery/06-回滚方案.md) §13。

## 9. 本轮发现并修复的验收脚本缺陷

`deploy/verify-root.mjs` 的 Self Space `_next` 资源检查原先从根站 `root.body` 中找资源 URL；根站是作品集 HTML，里面没有 `/gui/_next/`，所以即使 Self Space 正常也会报“未找到资源 URL”。已改为从 `gui.body` 中找。改后同一份生产基线跑出 34/34，而不是靠放宽断言。
