# Ming · 个人作品集

Ming（月明）的独立个人作品集网站。

正式地址：**https://ymai.fun/ming/**
备份入口：**https://yueminghub.github.io/ming-portfolio/**（同一份内容）

这一页只回答一件事：他是谁、真实做过什么、做到什么程度、哪些还没解决，以及别人可以怎么核实。

## 这个仓库是什么

- 一个自包含的静态站点：`index.html`（作品集正文）+ `lrdf.html`（LRDF 家长版附卷）+ `site.css`
  （两页共用的 D1 档案台账样式，2026-10-25 从内联样式抽出来，避免两份样式各自漂移）。
  零依赖、零构建、零外部字体与 CDN 请求；改样式只改 `site.css` 一处。
- 仓库自身由 GitHub Pages（GitHub 免费静态托管）发布，分支 `main`，根目录；正式面另由
  `ymai.fun` 所在服务器的 nginx 从独立静态目录提供同一份文件（见下表）。
- **不属于任何产品**。它不是 Family Space / Self Space / World Space 的一部分，也不是 Qoder 的资产。
  维护作品集只需要改这个仓库，不需要进任何产品仓库。

## 维护规则

1. **不把真实家庭的内容放进来。** 不写咨询记录、可识别个人的信息、账号、密钥、服务器路径或部署配置。
2. **状态如实标注。** 已上线、源码公开、私有研发、研究中是四种不同状态，不能混写成"已交付成果"。
3. **每个链接都要能核实。** 改完内容跑一次 `bash tools/verify-links.sh`，逐条看返回码和页面标题。
4. **Pages 侧不绑自定义域名。** 本仓库的 GitHub Pages 站点只用 `github.io` 默认域名（Pages 配置里 `cname` 为空）。
   正式地址 `https://ymai.fun/ming/` 走的是另一条路：由 `ymai.fun` 所在服务器的 nginx 用一个**独立静态目录**直接提供这一页，
   不改 DNS、不改 ymai.fun 首页与登录逻辑、不占用任何产品站点的路径，也不进应用的发布树。
5. **不为每次申请另建一个网站。** 求职、合作、分享、创造者计划都用这一份，持续更新。
6. **改完跑客观量测。** `node tools/audit-browser.mjs` 会用真实浏览器量线上页：横向溢出、文字截断、
   点击命中区、失效锚点、外部依赖、键盘可达性，以及打印介质下的隐形文字（白字白底）。退出码非 0 就是没过。
7. **已退役的东西不当现行证据。** 案卷 05 只列当前还在成立、且能点开核实的项目；仓库一旦在 GitHub 上被归档
   （`isArchived=true`）或产品线地图判定退役，就要从证据表里撤下来。2026-10-25 据此移除了 AAOP 一行
   （该仓库 2026-09-25 已归档）。公开仓库总数仍按 API 实测写，并注明其中几个是归档件。
8. **页面链到的 PDF 必须在仓库根目录。** 两个发布面都是"根目录原样发布"，PDF 只放在 `evidence/` 会让
   备份面 404（2026-10-25 实测：正式面 200、Pages 面 404）。新 PDF 落库时根目录与 `evidence/` 各放一份，
   两份逐字节一致。

## 两个发布面，改完要同步两处

| 面 | 地址 | 怎么更新 |
|---|---|---|
| 正式 | https://ymai.fun/ming/ | push 之后，还要把同一份 `index.html`、`lrdf.html`、`site.css` 与 PDF 同步到服务器静态目录并重载 nginx |
| 备份入口 | https://yueminghub.github.io/ming-portfolio/ | `git push origin main` 即自动发布 |

同步命令与服务器内部路径**不写进本仓库**（公开仓库不放生产布局），在运维侧的
`.deploy/`（本仓库同级、已被 `.gitignore` 排除）里：`deploy-ming.sh` / `rollback-ming.sh`。
`deploy-ming.sh` 自带备份、`nginx -t` 闸门与"验收不过自动回滚"，不要绕过它手工改配置。

改完任一面之后，跑一次公网侧验收（对两个面各跑一次，逐条比对字节）：

```bash
bash tools/verify-surface.sh index.html                       # 正式面 ymai.fun/ming/
SITE=https://yueminghub.github.io BASE=/ming-portfolio \
  bash tools/verify-surface.sh index.html                     # 备份面 GitHub Pages
```

## 发布

推送即发布（Pages 构建约 30–90 秒）：

```bash
git push origin main
bash tools/verify-links.sh https://yueminghub.github.io/ming-portfolio/
```

`.nojekyll` 用于关闭 Jekyll 处理，保证文件按原样发布。

## 复跑验收并刷新验证记录

`evidence/VERIFICATION.md` 由脚本生成，内容全是命令原始输出，不是手写结论。改了内容或重新发布后刷新它：

```bash
# 先起一个带调试端口的无头浏览器（Chrome 或 Edge 均可）
chrome.exe --headless=new --remote-debugging-port=9333 --user-data-dir=<空目录> about:blank
# 再跑记录装置（内部会调用 tools/audit-browser.mjs）
bash tools/record-verification.sh
```

## 生成 PDF

页面内置 A4 打印样式（`@media print`），PDF 必须从**线上地址**打印，才能确认交付的是发布版本。

顺序有讲究：**先把页面里的下载链接改到新文件名并 push、等 Pages 出新版，再从线上打印**。
反过来做，PDF 里那条"下载这一页的 PDF"链接会指回上一版文件（2026-10-19 这轮踩过，重打了一次）。

```bash
chrome --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=evidence/ming-portfolio-$(date +%Y%m%d).pdf \
  "https://yueminghub.github.io/ming-portfolio/"
```

两份交付件的实测参数：

| 文件 | 对应页面 | 字节 | 页数 | 可点链接注释 |
|---|---|---|---|---|
| `ming-portfolio-20261017.pdf` | 双发布面首版 | 622656 | 7 | 22 |
| `ming-portfolio-20261019.pdf` | 收掉四处观感问题之后 | 483402 | 7 | 22 |
| `ming-portfolio-2026102401.pdf` | 补齐分享/识别标准件（favicon、og 分享卡、JSON-LD）+ 核实日期刷新 | 483903 | 7 | 22 |
| `ming-portfolio-2026102402.pdf` | 整页换装 D1 档案台账（宋体标题/明字章/印章状态徽/台账证据表，内容逐句保真） | 755005 | 7 | 23 |
| `ming-portfolio-20261025.pdf` | 补 LRDF 普通人版框架附卷（`#lrdf`）+ 撤下已归档的 AAOP + 核验日期刷新 10-25 | 909308 | 9 | 24 |

> `20261025` 版的 24 个注释实测构成：**20 个带 `/URI`**（19 条站外 `<a>` + 1 条指向本 PDF 自己的下载链接）
> + **4 个带页内 `/Dest`**（目标分别是 `#top`、`#lrdf`、`#lrdf`、`#works`）。页面里一共 13 个 `#` 锚点，
> 只有这 4 个进了注释：其余 9 个（导航条 7 个 + 英雄区 2 个）在打印样式里被 `display:none` 掉了。
> 这一版起 LRDF 的跳转在纸上也是可点的。复测命令：`node tools/pdf-links.mjs ming-portfolio-20261025.pdf`。

> 注：`2026102402` 版的 23 = 22 个锚点注释 + 1 处长链接换行被 Chrome 拆成的第二个注释（锚点数未变）。
> 2026-10-24 起，页面视觉制式经 Owner 从三方向初稿中选定 **D1 档案台账**（技能 huashu-design 的三方向门流程）。

> **2026-10-25 更正（署名：本轮 Owner Agent）：下面这条"GitHub Pages 服务端异常"的旧结论是错的，特此作废。**
> 实测反证：`https://yueminghub.github.io/ming-portfolio/evidence/ming-portfolio-2026102402.pdf` 返回 **200 / 755005 字节**，
> 而页面链的根路径 `.../ming-portfolio-2026102402.pdf` 返回 404 —— 因为 2026-10-23 起新 PDF 只被加进了 `evidence/`，
> 从来没有进过仓库根目录（`git log --diff-filter=A -- 'ming-portfolio-*.pdf'` 实测：根目录只有 20261017 与 20261019 两份）。
> 也就是说备份面 404 是**本仓库自己的路径问题**，不是 GitHub 的服务异常；当时"构建产物 tar 里有该文件"验的正是 `evidence/` 那个路径，
> 所以怎么等都不会好。官方面一直正常，是因为 `deploy-ming.sh` 把 PDF 装进了静态根目录。
> 修法见维护规则第 8 条；本轮起新 PDF 根目录与 `evidence/` 各一份。

> 2026-10-23/24 排查记录（**已被上面的更正关闭**）：本轮多个新 PDF 路径（`ming-portfolio-20261023.pdf`、
> `ming-portfolio-20261024.pdf`、`ming-portfolio-2026102401.pdf`、`ming-portfolio-2026102402.pdf`）在 GitHub Pages 备份面上出现服务异常：
> git 仓库与构建产物 tar 里都有该文件（逐字节亲验）、部署状态 success、raw.githubusercontent 可直读 200，
> 但 Pages 服务层持续 404（Fastly 头显示 MISS，非边缘缓存）；同批的 og-card.png 与老 PDF 始终正常，
> 从未请求过的新路径也秒 200——唯独新 evidence PDF 长时间不出。已排除：缓存 TTL、部署时序
> （等 builds/latest=built 后首探仍 404）、空提交强推重部署、改路径×3、18 分钟零探测静置。
> 曾观察到 `ming-portfolio-20261023-a.pdf` 在其部署约 8 分钟后短暂恢复 200，下次部署后又 404，
> 提示是服务端多副本不一致，非本仓库问题。**官方面（ymai.fun/ming/）不经 GitHub，完全正常。**
> 若将来备份面 PDF 可访问，重跑 `bash tools/record-verification.sh` 刷新记录即可关闭本条。

可点链接数按 `/Subtype /Link` 计。**不要拿 `/URI` 的 token 数当链接数**——它在每个注释里出现多次，
上一版 README 写的"42 个可点链接"就是这么数出来的（`20261025` 版实测 `/URI` token=40、注释只有 24 个）。
字体已内嵌子集。

> **2026-10-25 更正（署名：本轮 Owner Agent）：这一段旧解释里"9 个页内 `#` 锚点在纸上没有可跳目标，不进注释"是错的，特此作废。**
> 拿同一把尺（`tools/pdf-links.mjs`）回头量历史四版：`20261017 / 20261019 / 2026102401` 都是
> **22 个注释 = 21 个带 `/URI`（20 条站外 `<a>` + 1 条 PDF 链接）+ 1 个带页内 `/Dest`（`#top`）**，
> 也就是说 9 个页内锚点里 **有 1 个一直是进注释的**；其余 8 个不进，真正原因是打印样式把
> `.toc` 与 `.cta-row` 整块 `display:none` 掉了，跟"没有可跳目标"无关。
> 旧文字把 22 写成"21 个外部链接 + 1 个 PDF 相对链接"，实测站外 `<a>` 是 20 条（第 21 个 `href="http…"` 是
> `<link rel="canonical">`，它不是注释；当时两个错互相抵了才让判据看起来闭合）。
两个发布面的 `index.html` 逐字节一致（md5 见 `evidence/VERIFICATION.md`），所以从任一面打印得到的都是同一份内容。
重新生成时按日期另存，不要覆盖旧文件——它是那一版网页的交付凭据。

## 内容结构

| 节 | 内容 |
|---|---|
| 01 About | 背景、分工、三条自我约束 |
| 02 Selected Work | Family Space / World Space / MingOS / Self Space / Agent Space / LRDF，每项含「为什么做 · 为谁解决 · 现在做到 · 还没解决」 |
| 03 How I Build | 意图与验收标准 → 任务合同 → Agent 执行 → 独立复核 → 回到真实使用 |
| 04 Research | LRDF 方向与三个仍在研究的问题 |
| 附卷 LRDF Public Framework | `#lrdf`：LRDF 的普通人版三步框架（先接住 → 再动起来 → 学会长大）+ 最看重的几句话 + 它不是什么 + 安全边界。文本据 LRDF 私有仓 `framework/public/zh-CN/`（家长与公众版 V1）整理，遵守其 `governance/02_对外禁用与谨慎表述.md`；结尾如实写明"概念框架 ≠ 可公开验证的成果" |
| 05 Public Evidence | 可核实链接清单 + 明确不提供的东西 |
| 06 Contact | 可核实的公开联系渠道 |
