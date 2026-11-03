# nginx 部署方案（公开版）

- 编写日期：2026-11-02
- 生产执行：2026-11-03
- 对象：`integration/qoder-site-2026-11-02` 的构建产物（已合并为 `e44b48f`）
- 状态：方案、本地演练与生产部署均已完成；生产验证见 [`03` §9–§10](03-测试结果.md)
- 边界：正式入口为 <https://ymai.me/>；`/ming` 301 到根路径；Self Space 未改代码，恢复在 `/gui/`；旧域名 301、历史资产删除均未执行

> 2026-11-03 晚些时候 Owner 改变入口方案：作品集从 `/ming/` 切到 `ymai.me` 根路径，Self Space 放回构建原生的 `/gui/`。§1–§11 保留为子路径部署的历史记录；当前结构与执行记录见 §12。

> 本文件不写真实服务器路径、账号、备份目录或完整生产配置。公开仓库只保留可参数化的步骤与校验脚本；实际路径由运维会话在授权后填入。

## 1. 部署边界

只做三件事：

1. 新增一个独立静态目录，存放作品集构建产物。
2. 在 `ymai.me` 的 HTTPS server 块中新增 `/ming/` 前缀规则，优先于现有 SPA fallback。
3. 原子切换 `current` 软链接，让 `/ming/` 指向新版本。

不做：

- 不改根站 `location /`、`root` 或 SPA fallback。
- 不改 `/gui/`、`/_next/` 或任何现有资源规则。
- 不改 DNS、证书、Self Space 配置。
- 不重启服务器，只在 `nginx -t` 通过后 reload nginx。
- 不删除旧站、旧 PDF、旧仓库或任何历史文件。
- 部署动作本身不合并 `main`（合并已在部署前单独完成，merge commit `e44b48f`）；不改 GitHub Pages，不执行旧域名 301。

## 2. 部署前只读检查

在服务器执行，结果由运维会话保存到内部备份目录（不写入本仓库）：

```bash
nginx -v
nginx -T > <BACKUP_DIR>/nginx-before.conf 2>&1
cp -a /etc/nginx <BACKUP_DIR>/nginx-backup
```

确认：

- `ymai.me` 的 443 server 块位置，以及现有 SPA fallback 的写法。
- 配置是单文件还是 `include` 结构，决定新增片段还是直接插入 `location`。
- `/ming` 没有更具体的既有 `location`。
- nginx 运行用户能进入新目录（逐级目录权限可读可执行）。
- 进程管理方式：systemd 或直接 nginx；据此选择 reload 命令。
- 若服务器不是 nginx + systemd，停止并调整命令，不硬套本文。

把以下值交给后续命令：

| 占位符 | 含义 | 来源 |
| --- | --- | --- |
| `<PORTFOLIO_PARENT>` | 作品集发布根目录 | 运维会话选定 |
| `<RELEASE_ID>` | 本次发布标识 | 建议 `<日期>-<提交前 7 位>` |
| `<RELEASE_DIR>` | 本次发布的产物目录 | 通常为 `<PORTFOLIO_PARENT>/releases/<RELEASE_ID>` |
| `<SNIPPET_PATH>` | nginx 片段路径 | 随现有配置结构决定 |
| `<BACKUP_DIR>` | 配置与基线备份目录 | 运维会话选定 |

## 3. 目录布局与原子切换

```text
<PORTFOLIO_PARENT>/
├── releases/
│   └── <RELEASE_ID>/
│       └── ming/
│           ├── index.html
│           ├── assets/
│           ├── media/
│           ├── favicon.svg
│           ├── og-card.png
│           └── .nojekyll
└── current -> releases/<RELEASE_ID>
```

只上传构建产物 6 项，不复制 `site/`、`archive/`、`README.md`、测试与交付文档。

```bash
REL=<PORTFOLIO_PARENT>/releases/<RELEASE_ID>
install -d -m 755 "$REL/ming"
rsync -a index.html assets media favicon.svg og-card.png .nojekyll "$REL/ming/"
find "$REL" -type d -exec chmod 755 {} +
find "$REL" -type f -exec chmod 644 {} +
```

按服务器实际用户与组调整属主；不要为了省事改成 777。

原子切换（第一次没有 `current` 也适用）：

```bash
ln -s "releases/<RELEASE_ID>" <PORTFOLIO_PARENT>/current.next
mv -Tf <PORTFOLIO_PARENT>/current.next <PORTFOLIO_PARENT>/current
```

旧 release 目录保留，不删除；回滚时把 `current` 指回旧版本。

## 4. nginx 片段

与 [`nginx-test/nginx.conf.template`](../nginx-test/nginx.conf.template) 的主 server 规则**行为等价，但 `root` 的位置不同**：模板把 `root __WWW__` 放在 server 级，`run.sh` 把产物复制到 `www/ming/`，所以 `location ^~ /ming/` 内不再声明；上线片段必须在该 location 内显式写 `root <PORTFOLIO_PARENT>/current;` 与 `index index.html;`，不能沿用生产主站点 server 级的 `root`，否则 `/ming/` 会指向主站目录。片段里的这两行不是重复声明，不要删除。

```nginx
location = /ming {
    absolute_redirect off;
    return 301 /ming/;
}

location ^~ /ming/ {
    absolute_redirect off;
    root <PORTFOLIO_PARENT>/current;
    index index.html;

    # 只规范化 7 个已知页面路由，避免与目录路径形成 301 循环
    rewrite ^/ming/(ecosystem|spaces|institution|expert-and-research|agent-space|evidence|cooperation)/$ /ming/$1 permanent;

    # 带扩展名的缺失文件必须 404，不能被 SPA fallback 伪装成 200 HTML
    location ~ ^/ming/.*\.[A-Za-z0-9]+$ {
        try_files $uri =404;
    }

    try_files $uri $uri/ /ming/index.html;
}
```

在现有 `ymai.me` HTTPS server 块内加入：

```nginx
include <SNIPPET_PATH>;
```

不新建同名 server，不改现有 `location /`。nginx 按匹配规则选择 location，不按书写顺序。

规则要点：

- `location = /ming`：无尾斜杠精确跳转。
- `location ^~ /ming/`：`^~` 阻止服务器级正则（如静态资源缓存规则）抢走 `/ming/assets/*`，同时不影响 `/gui/_next/*`。
- `rewrite` 只匹配 7 个已知页面路由，避免把 `/ming/assets` 这类目录也 301 掉。
- 嵌套正则只处理带扩展名的请求，缺失资源返回 404。
- 无扩展名未知路径回退 `index.html`，交给前端路由。
- `absolute_redirect off` 让跳转返回相对 `Location`，避免代理/TLS 下生成错误的协议或端口。

## 5. 预部署基线（必须保存）

```bash
node deploy/verify.mjs pre --base https://ymai.me --prefix /ming --out <BACKUP_DIR>/baseline
```

必须记录：

- 根站 `/` 的状态码、字节数、`Content-Type` 与 sha256。
- `/ming/` 部署前的响应（当前应为 Self Space 的 SPA fallback）。
- 若根站实际引用了 `/gui/_next/` 资源，至少记录一个资源及其字节；未引用时如实记为 SKIP，不能用 SKIP 冒充通过。
- 部署时间、nginx 版本、配置备份位置。

基线必须在任何写入之前完成。缺少基线时停止部署。

## 6. 上线步骤

1. 确认 Owner 授权与第 9 节条件全部满足。
2. 从固定提交取根目录产物；不使用“最新分支”临时打包。
3. 按第 3 节上传并切换 `current`。
4. 写入第 4 节片段并加入 `include`。
5. `nginx -t`。
6. 通过后 reload：systemd 用 `systemctl reload nginx`，否则用 `nginx -s reload`。
7. 立即执行第 7 节验证；任一项失败按 [`06-回滚方案`](06-回滚方案.md) 撤回。
8. 观察至少 30 分钟，检查 nginx error log 与访问日志中的 5xx。

不执行 `systemctl restart nginx`，不重启服务器，不动数据库或其他站点。

## 7. 部署后验证

### 7.1 HTTP 与隔离

```bash
node deploy/verify.mjs post --base https://ymai.me --prefix /ming --baseline <BACKUP_DIR>/baseline --expect-index <RELEASE_DIR>/index.html
```

检查项：

- `/ming/` 的字节与本次 release 的 `index.html` 完全一致；仅在 `/ming/` 与自身比较通过、但没有绑定预期产物时，不能算通过。
- 根站 `/` 字节与基线完全一致。
- 若基线记录了 `/gui/_next/` 资源，其字节与基线与现状一致。
- 8 条路由均 200，且内容与同一份 `index.html` 一致（SPA fallback）。
- 7 条尾斜杠 301 到无斜杠；`/ming` 301 到 `/ming/`。
- 未知路径回退 `index.html`；缺失的 `.js` / `.png` 返回 404。
- 页面引用相对资源，JS/CSS 的 MIME 正确。
- 首页 canonical 为 `https://ymai.me/ming/`。

找不到 `/gui/_next/` 引用时脚本如实记录 SKIP，不伪造通过。

`--expect-index` 为必填：缺少时脚本以 exit 2 拒绝执行；预期文件被改动一个字节时，`/ming/ 与预期发布产物字节一致` 会 FAIL 并以 exit 1 结束。回滚验证则把预期文件换成 `<BACKUP_DIR>/baseline/ming.html`（部署前基线），见 `06`。

### 7.2 渲染层

HTTP 只能看到 SPA 外壳，标题、H1、canonical 由浏览器运行时写入，必须另做渲染检查：

```bash
cd site
npx playwright install chromium
node tests/render-check.mjs --base https://ymai.me --prefix /ming
```

逐条打开 8 个路由，检查渲染后的标题、H1、canonical、图片、console error、失败请求，以及手机 390 宽无横向溢出。

### 7.3 浏览器与缓存

- 用真实浏览器走一遍四段旅程（见 [`09-用户旅程与真人测试卡片`](09-用户旅程与真人测试卡片.md)）。
- 如果 `ymai.me` 前面有 CDN/反向代理：确认 `/ming/*` 不被旧 SPA fallback 缓存；HTML 使用较短缓存或 `no-cache`；带哈希的 `assets/*` 可长缓存；清理 `/ming/` 旧缓存后再验收。
- 不假设 CDN 一定存在；以响应头和 `nginx -T` 为准。

## 8. 失败判定

立即回滚的情况：

- `nginx -t` 失败，或 reload 后 `/ming/` 仍返回 Self Space fallback。
- 任一页面 404、资源 MIME 错误、CSS/JS/图片未加载。
- 根站 `/` 或已记录的 `/gui/_next/` 响应字节与基线不一致。
- 证据页、深链、尾斜杠出现循环跳转。
- nginx error log 出现与本规则相关的 5xx 或 rewrite 循环。

回滚步骤见 [`06-回滚方案`](06-回滚方案.md)。

## 9. 执行前置条件

| # | 条件 | 当前状态 |
| --- | --- | --- |
| 1 | Owner 明确授权部署 | 已授权（2026-11-03） |
| 2 | 合并策略已决定 | 已合并：merge commit `e44b48f` |
| 3 | 真人读者测试、屏幕阅读器测试完成或 Owner 豁免 | 未执行；Owner 已授权先上线并另行排期（见 `07`） |
| 4 | 生产基线已保存 | 已完成（根站与 `/ming/` 均为 21361B，sha256 `564a76ed4b5c…`） |
| 5 | nginx 配置备份与回滚命令已核对 | 已完成；配置备份保存在服务器内部目录 |
| 6 | 已确认 `/ming` 无更具体的现有 location | 已确认（目标 server 块内无 `/ming` 规则） |
| 7 | 已确认服务器 nginx 版本与运行方式 | nginx/1.18.0 (Ubuntu) + systemd；reload 不 restart |

## 10. 本地已验证的范围

- `nginx-test/run.sh` 在本地 nginx 1.28.0 上执行 54 项检查：53 通过、1 项仅因 Windows 大小写不敏感跳过。
- 回滚目标 server（不含 `/ming/` 规则）验证：移除规则后 `/ming/`、`/ming/ecosystem`、`/` 均回到根站哨兵页面。
- 部署前后脚本与本机渲染检查通过，详见 [`03-测试结果`](03-测试结果.md) 与 [`evidence/`](evidence/)。

本地通过不等于生产通过；生产环境已按本方案实际执行并复验，见 §11。

## 11. 生产执行记录（2026-11-03）

### 11.1 实际对象

| 项目 | 值 |
| --- | --- |
| 正式入口 | `https://ymai.me/ming/` |
| 目标 server 块 | `ymai.me` 的独立 server 块（根站为 Self Space） |
| 发布提交 | `e44b48f`（merge commit；tree 与 `4b271f0` 相同） |
| 发布标识 | `20261103-4b271f0` |
| 产物 `index.html` | 2644B，sha256 `b68c8cf88650…` |
| 部署前 `/ming/` | 回落到根站同一份 21361B HTML（Self Space） |
| 部署后 `/ming/` | 2644B，与本次产物字节一致 |
| nginx | 1.18.0 (Ubuntu)，systemd；`NRestarts=0` |

公开仓库不记录服务器真实发布根目录、配置目录与备份目录；这些值保存在运维会话的内部部署记录中。片段内容与第 4 节一致，`root` 指向发布根的 `current`。

### 11.2 执行顺序

1. 从 `e44b48f` 的 tree 构建，确认根目录产物与 `site/dist` 完全一致（`cmp` / `diff -r` 通过）。
2. 记录部署前基线；备份 nginx 配置与 `nginx -T` 输出。
3. 上传 6 类产物到新 release 目录，设置目录 755、文件 644。
4. 原子切换 `current` 软链接；旧 release 保留。
5. 写入 `ymai.me` 专用片段（未复用 `ymai.fun` 的既有片段）。
6. 在目标 server 块中加入一行 `include`；与备份做 diff，确认只多这一行。
7. `nginx -t` 通过后 `systemctl reload nginx`，未 restart。

### 11.3 结果

- `deploy/verify.mjs post`：28/28 `PASS`，包括产物字节绑定、根站字节未变、8 路由、301、404、MIME 与 canonical。
- `render-check.mjs`：8 路由 + 手机 390 宽共 11/11 `PASS`。
- 相邻站点回归：`ymai.me/`、`/health`、`ymai.fun/`、`ymai.fun/ming/`（旧版 29892B）、`ymai.love/`、`mingos.cn/` 均 200。
- 30 分钟观察：每 5 分钟复测 `/ming/`、根站与一条路由，7/7 个样本正常，未出现 5xx；公开样本表见 [`evidence/production-deploy-20261103.txt`](evidence/production-deploy-20261103.txt) 第 6 节。

### 11.4 回滚点

配置备份、`nginx -T` 前后 diff、旧 server 配置副本与本次片段副本均保存在服务器内部备份目录。撤回顺序见 [`06-回滚方案`](06-回滚方案.md) §7。回滚不删除 release 目录，不删除历史资产。

## 12. 根路径切换与 Self Space 恢复（2026-11-03）

### 12.1 变更内容

| 项目 | 变更 |
| --- | --- |
| 作品集 | `https://ymai.me/` 直接提供构建产物，不再使用 `/ming/` 作为正式地址 |
| 旧链接 | `/ming` 与 `/ming/` 301 到 `/`；`/ming/<路由>` 301 到 `/<路由>` |
| Self Space | 代码与构建产物未改；按 Next.js 导出原生的 `basePath=/gui` 放回 `https://ymai.me/gui/` |
| 入口 | 桌面导航、移动导航、页脚、首页与「三个空间」页均指向 `https://ymai.me/gui/` |
| 隔离 | `/api/`、`/health`、`/api/wechat` 保持原样；`/assets/`、`/media/` 缺失返回 404 |

根因：此前根站 `location /` 的 `root` 指向 Self Space 导出的 `gui` 目录，而页面内资源地址是 `/gui/_next/…`，请求被拼成 `<root>/gui/_next/…` 后找不到，回退成 `index.html`。因此 Self Space 在根路径与 `/gui/` 下都只剩 HTML、没有 JS/CSS。

### 12.2 配置结构（公开版）

片段由 `ymai.me` server 块 include，包含：

- `location = /ming`、`location = /ming/` → 301 `/`；`location ^~ /ming/` 保留子路径并 301 到根路径。
- `location = /gui` → 301 `/gui/`；`location ^~ /gui/` 的 `root` 指向 Self Space 发布父目录，`try_files $uri $uri/ =404`。
- `location ^~ /assets/`、`/media/`、`= /favicon.svg`、`= /og-card.png` 指向作品集 `current`，缺失即 404。
- `location /` 指向作品集 `current`，只把 7 条页面的尾斜杠 301 成无尾斜杠，再回退 `index.html`。

完整片段见 [`deploy/nginx-root.conf`](../deploy/nginx-root.conf)；其中不包含任何真实服务器路径以外的凭据或配置。

### 12.3 执行顺序

1. 记录变更前基线：根站与 `/gui/`、`/gui/space/` 均为 21361B（Self Space 首页）；`/gui/_next/` 资源返回 `text/html`，确认故障存在。
2. 备份 `ymai.me` server 块与片段、`nginx -T` 输出与关键入口状态（保存在服务器内部备份目录）。
3. 上传新构建到新的 release 目录，`index.html` 与 JS/CSS 的 sha256 与本机产物逐一相等。
4. 更新片段并删除 server 块中旧的 `location /`（Self Space 根映射），`nginx -t` 通过。
5. 原子切换 `current` 软链接，`systemctl reload nginx`；未 restart，`NRestarts=0`。
6. 执行 `deploy/verify-root.mjs post`、`render-check.mjs` 与 Self Space 浏览器复核。

### 12.4 结果

- `deploy/verify-root.mjs post`：34/34 `PASS`。根路径与本次产物字节一致；8 路由一致；canonical 为 `https://ymai.me/`；`/gui/` 首页字节与基线一致；`/gui/space/` 命中 11117B 真实页；`/gui/_next/` CSS 返回 `text/css` 85631B；`/ming` 系列 301 正确；未知路径回退；缺失资源 404。
- `render-check.mjs`：根路径 8 路由 + 手机 390 宽共 9/9 `PASS`。
- Self Space：4 个入口链接；点击落到 `/gui/`；标题与 45px MingOS Serif 样式生效；`/gui/` 的 12 个、`/gui/space/` 的 11 个 `/gui/_next/` 资源均非 HTML；`/gui/` console error 0、失败请求 0；`/gui/space/` 正常渲染（唯一失败请求是未登录时的 `/api/me` 401，属预期）；入口可键盘聚焦。
- 首次切换后发现 Spaces 页仍写着 Self Space 资源故障待修；修正该表述、重新构建并重跑全量测试后，以 `20261103-root-0956` 重发。随后 Linux CI 发现 `site/index.html` 的 CRLF 使本机与 CI 产物字节不一致，统一为 LF 后再次重建、重跑全量测试（93 / 24），以 `20261103-root-1040` 发布；nginx 始终未再改动，历史 release 与旧 JS 均保留。
- 相邻站点：`ymai.me/health`、`ymai.fun/`、`ymai.fun/ming/`、`ymai.love/`、`mingos.cn/`、`api.ymai.fun/healthz` 均 200。
- 日志：观察窗口（10:36–11:10）访问日志共 208 条，`5xx=0`；error log 无 `/ming` / `/gui` 报错。
- 30 分钟 7/7 样本正常：`/` 2619B / `ac081d8cc5b4`、`/gui/` 21361B、`/health` 与 `/ecosystem` 均 200，见 [`03` §10](03-测试结果.md)。

### 12.5 回滚

见 [`06-回滚方案`](06-回滚方案.md) §8：恢复 server 块与旧片段、切回上一 release、reload，即可回到 `/ming/` 子路径方案；旧 release 与 Self Space 产物均未删除。

## 13. `www.ymai.me` 修复与联系通道发布（2026-11-03）

### 13.1 根因

`www.ymai.me` 打不开不是单点故障，而是三层同时缺失：

| 层 | 修复前 | 结果 |
| --- | --- | --- |
| DNS | `www` 的 CNAME 指向 `ms8qmmdpyy.coze-dns-01.com`（Coze 托管） | HTTP 被 302 到 `https://webblock.volcengine.com`，HTTPS 连接被重置 |
| nginx | 没有 `server_name www.ymai.me` 的 server 块 | 即使解析到服务器，也没有规则接住 |
| 证书 | `ymai.me` 证书 SAN 只有 `ymai.me`、`ymai.love` | `https://www...` 会证书不匹配 |

### 13.2 变更

1. **DNS**：`www` CNAME 改为 `ymai.me`，TTL 600。变更前记录已备份。
2. **nginx**：新增以下两个 server 块；只 `systemctl reload nginx`，未 restart。

```nginx
server {
  listen 80;
  server_name www.ymai.me;
  location / { return 301 https://ymai.me$request_uri; }
}

server {
  listen 443 ssl;
  server_name www.ymai.me;
  ssl_certificate     /etc/letsencrypt/live/ymai.me/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/ymai.me/privkey.pem;
  include /etc/letsencrypt/options-ssl-nginx.conf;
  ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
  return 301 https://ymai.me$request_uri;
}
```

3. **证书**：`certbot --nginx --cert-name ymai.me --expand`，把 `www.ymai.me` 加入 SAN；`certbot renew --dry-run` 通过。
4. **联系通道**：站点新增联系与合作页的三条通道，构建发布为 `20261103-contact-1209`；nginx 根路径规则、Self Space 与 `/ming` 跳转未改。

### 13.3 验证

| 检查 | 读数 |
| --- | --- |
| 公共 DNS | `www.ymai.me CNAME ymai.me`；与根域名同一 A 记录 |
| `http://www.ymai.me/` | 301，`Location: https://ymai.me/` |
| `https://www.ymai.me/` | 301，`Location: https://ymai.me/` |
| `https://www.ymai.me/cooperation` | 跟随跳转后 200，最终地址 `https://ymai.me/cooperation` |
| 证书 | 2026-11-03 至 2027-02-01；SAN `www.ymai.me, ymai.love, ymai.me` |
| 真实 Chromium | HTTP、HTTPS、`/cooperation` 三次均落到根域名；联系页 3 个通道、2 张图加载完成、错误 0 |
| 生产产物 | 根 `index.html` 2619B / `31ddffafb678`；JS `index-CbCwha_U.js` 317280B / `5316e00af435`；CSS `index-CEkBwN0k.css` 177608B / `f79890fa6236`；与本地构建逐字节一致 |
| 回归 | `verify-root.mjs post` 34/34；`render-check` 9/9；旧构建资源仍 200 |

完整输出见 [`evidence/production-contact-www-20261103.txt`](evidence/production-contact-www-20261103.txt)。

### 13.4 回滚点

- DNS：把 `www` 的 CNAME 恢复为 `ms8qmmdpyy.coze-dns-01.com`，TTL 600。
- nginx：删除 `www.ymai.me` 的 80/443 server 块，`nginx -t` 后 reload。
- 内容：把 `current` 切回 `20261103-root-1040`；旧 release 与旧构建资源均保留。
- 证书不回滚：新增 `www` SAN 不影响 `ymai.me` 与 `ymai.love` 的现有访问。

详见 [`06-回滚方案`](06-回滚方案.md) §13。
