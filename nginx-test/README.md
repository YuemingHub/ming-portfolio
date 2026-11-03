# nginx 子路径测试工程

用真实 nginx 1.28.0 验证 `/ming/` 前缀部署：作品集独占该前缀、根站与 `/gui/`、`/_next/` 不被接管、缺失资源不被 SPA fallback 伪装成 200。

## 一条命令

```bash
# 有 Docker（CI 与推荐方式）
bash nginx-test/run.sh

# 本机已有 nginx 可执行文件
NGINX_BIN=/path/to/nginx bash nginx-test/run.sh
```

脚本会：

1. 若 `site/dist/index.html` 不存在，先在 `site/` 执行 `npm ci && npm run build`；
2. 生成临时根目录：`www/`（根站 sentinel + `ming/` 作品集）与 `rollback/`（只有根站 sentinel）；
3. 用 `nginx.conf.template` 生成配置，启动 18089（候选部署态）与 18090（回滚目标态）；
4. 运行 `verify.mjs`，打印逐项 PASS/FAIL，失败退出码非 0；
5. 结束时停止服务并清理临时目录（`KEEP=1` 可保留现场）。

可覆盖的环境变量：`TEST_PORT`、`ROLLBACK_PORT`、`SITE_DIR`、`KEEP`。

## 配置在测什么

`nginx.conf.template` 模拟生产的关键路由规则（不含生产站点的全部指令）：

- `location = /ming` → 301 `/ming/`
- `location ^~ /ming/` → 独立前缀；已知页面路由的尾斜杠只重定向一次
- 带扩展名的请求走 `try_files $uri =404`，缺失文件不会被 `index.html` 顶替
- 其余路径走根站 SPA fallback
- `absolute_redirect off`，重定向 `Location` 为相对地址

回滚 server（18090）故意不含任何 `/ming/` 规则，用来证明撤掉规则后 `/ming/` 会回到根站 SPA，而不是继续接管。

## 覆盖范围

`verify.mjs` 共 54 项：原有 33 项（8 条路由、7 个尾斜杠重定向、`/ming`、6 个静态资源、3 个缺失文件、未知路由 fallback、4 个隔离哨兵、canonical / 相对 JS / OG）加 21 项边界、资源完整性与回滚检查。原有 33 项来自本轮之前的外部验收清单，仓库中没有更早的脚本；这里用 `verify.mjs` 重建，逐项名称即下列类别：

- `HEAD`、查询字符串、显式 `index.html`
- 构建必须实际产出 JS 与 CSS，避免资源检查在缺资源时静默消失
- 资源目录、嵌套缺失 `index.html`、深层路径、前缀相似路径
- 大小写路径、原始/编码路径穿越、双斜杠
- 重定向保留查询串、缺失资源的 `HEAD`
- 回滚目标：`/ming/`、`/ming/ecosystem`、`/` 都停留在根站 sentinel

大小写检查在 Windows 上会显示 `SKIP`（文件系统不区分大小写），由 Linux CI 执行同一项。

## 边界

- 该工程验证的是 nginx 路由与静态资源行为，不代表生产服务器已完成变更；生产部署仍需 Owner 授权。
- 测试配置**不包含**生产 server 可能存在的 `error_page 404`、`proxy_intercept_errors` 或缓存指令。部署前必须检查：如果生产把 404 改写成 SPA 首页，本地 `=404` 判据会在生产失效；此时需要在 `/ming/` 内显式覆盖，确保缺失资源仍返回 404。
- `fixtures/selfspace/index.html` 是测试用哨兵页，不是 Self Space 的真实代码或页面。
- Docker 不可用时不会静默跳过：脚本以退出码 2 结束并要求提供 `NGINX_BIN`。
- 本机模式会打印 `nginx -v` 的实际版本；Docker 模式固定使用 `nginx:1.28.0`。
