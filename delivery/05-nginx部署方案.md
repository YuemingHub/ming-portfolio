# nginx 部署方案（公开版）

- 编写日期：2026-11-02
- 对象：`integration/qoder-site-2026-11-02` 的构建产物
- 状态：方案与本地演练完成；**生产未执行**
- 边界：`NO_MERGE / NO_DEPLOY`

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
- 不合并 `main`，不改 GitHub Pages，不执行旧域名 301。

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
| 1 | Owner 明确授权部署 | 未授权 |
| 2 | 合并策略已决定 | 未决定，`NO_MERGE` |
| 3 | 真人读者测试、屏幕阅读器测试完成或 Owner 豁免 | 未执行 |
| 4 | 生产基线已保存 | 未执行（未部署） |
| 5 | nginx 配置备份与回滚命令已核对 | 仅本地演练 |
| 6 | 已确认 `/ming` 无更具体的现有 location | 待生产只读检查 |
| 7 | 已确认服务器 nginx 版本与运行方式 | 待生产只读检查 |

## 10. 本地已验证的范围

- `nginx-test/run.sh` 在本地 nginx 1.28.0 上执行 54 项检查：53 通过、1 项仅因 Windows 大小写不敏感跳过。
- 回滚目标 server（不含 `/ming/` 规则）验证：移除规则后 `/ming/`、`/ming/ecosystem`、`/` 均回到根站哨兵页面。
- 部署前后脚本与本机渲染检查通过，详见 [`03-测试结果`](03-测试结果.md) 与 [`evidence/`](evidence/)。

本地通过不等于生产通过；生产 nginx 的叠加配置、CDN 与真实响应仍需授权后重新验证。
