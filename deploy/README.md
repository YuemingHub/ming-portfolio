# 部署与回滚（公开版）

本目录只放**可执行、可参数化**的验证脚本；真实服务器路径、账号、备份目录属于运维内部信息，不进入公开仓库。

> 当前状态：`DEPLOYED / REAL_TESTS_PENDING`（2026-11-03 部署）。以下命令仍只用于已授权的发布；生产真实路径与备份目录不进入公开仓库。

## 1. 边界

只做三件事：

1. 新增独立静态目录，存放作品集构建产物。
2. 在 `ymai.me` 的 HTTPS server 块中新增 `/ming/` 前缀规则。
3. 原子切换 `current` 软链接。

不做：不改根站 `location /`、不改 `/gui/` 与 `/_next/`、不改 DNS/证书、不重启服务器（只 reload nginx）、部署动作本身不合并 `main`（合并已单独完成）、不执行旧域名 301、不删除任何历史文件。

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

## 4. nginx 片段

与 [`nginx-test/nginx.conf.template`](../nginx-test/nginx.conf.template) 中的主 server 规则一致：

```nginx
location = /ming {
    absolute_redirect off;
    return 301 /ming/;
}

location ^~ /ming/ {
    absolute_redirect off;
    root <PORTFOLIO_PARENT>/current;
    index index.html;

    rewrite ^/ming/(ecosystem|spaces|institution|expert-and-research|agent-space|evidence|cooperation)/$ /ming/$1 permanent;

    location ~ ^/ming/.*\.[A-Za-z0-9]+$ {
        try_files $uri =404;
    }

    try_files $uri $uri/ /ming/index.html;
}
```

在现有 `ymai.me` HTTPS server 块内加入该片段（`include <SNIPPET_PATH>;`）。不新建同名 server，不改现有 `location /`。

## 5. 部署前基线

```bash
node deploy/verify.mjs pre --base https://ymai.me --prefix /ming --out <BACKUP_DIR>/baseline
```

记录根站 `/`、`/ming/` 的字节和 sha256；若根站实际引用了 `/gui/_next/` 资源，再记录其中一个。**必须**在改动前执行。未引用时脚本记为 SKIP，不冒充通过。

## 6. 上线

1. 取固定提交的根目录产物上传。
2. 切换 `current`。
3. 写入片段并 include。
4. `nginx -t`。
5. `systemctl reload nginx`（或实际 reload 命令）。
6. 立即执行：

```bash
node deploy/verify.mjs post --base https://ymai.me --prefix /ming --baseline <BACKUP_DIR>/baseline --expect-index <RELEASE_DIR>/index.html
```

`post` 会检查：`/ming/` 与本次 release 的 `index.html` 字节一致、根站与 `/gui/_next/` 字节未变化、8 条路由回退到同一份 `index.html`、尾斜杠 301、`/ming` 301、未知路径回退、缺失资源 404、相对 JS/CSS 可加载、首页 canonical。`--expect-index` 是必填项：没有它，旧 release 或上传错包也会与 `/ming/` 自身一致而全项通过。

SPA 的标题、H1、canonical 由浏览器运行时写入，再用渲染层复查：

```bash
cd site
npx playwright install chromium
node tests/render-check.mjs --base https://ymai.me --prefix /ming
```

它逐条打开 8 个路由，检查渲染后的标题、H1、canonical、图片、console error、失败请求，以及手机 390 无横向溢出。

本地用其他地址演练时加 `--canonical-base https://ymai.me`；Git Bash 需加 `MSYS_NO_PATHCONV=1` 防止 `/ming` 被改写成本机路径。

任一失败按 [`06-回滚方案`](../delivery/06-回滚方案.md) 撤回。

## 7. 回滚演练

`nginx-test/run.sh` 同时启动 18090 回滚目标 server（不含 `/ming/` 规则），并断言：

- `/ming/` 返回根站 sentinel；
- `/ming/ecosystem` 返回根站 sentinel；
- `/` 返回根站 sentinel。

本地演练已通过（见 [`delivery/evidence/nginx-test-output.txt`](../delivery/evidence/nginx-test-output.txt)）。生产回滚动作本身未执行。

## 8. 执行条件

| # | 条件 | 当前 |
| --- | --- | --- |
| 1 | Owner 明确授权部署 | 已授权（2026-11-03） |
| 2 | 合并策略决定（先合并 main 或允许从候选提交部署） | 已合并，merge commit `e44b48f` |
| 3 | 真人测试/屏幕阅读器完成或 Owner 豁免 | 未执行；Owner 授权先上线并另行排期 |
| 4 | 生产基线已记录 | 已完成（21361B / `564a76ed4b5c…`） |
| 5 | 生产 nginx 备份与回滚命令已核对 | 已完成 |
| 6 | 已确认 `/ming` 无更具体 location | 已确认 |
