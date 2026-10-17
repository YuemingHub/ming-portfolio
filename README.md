# Ming · 个人作品集

Ming（月明）的独立个人作品集网站。公开访问地址：

**https://yueminghub.github.io/ming-portfolio/**

这一页只回答一件事：他是谁、真实做过什么、做到什么程度、哪些还没解决，以及别人可以怎么核实。

## 这个仓库是什么

- 一个自包含的静态站点：`index.html` 单文件，内联样式，零依赖、零构建、零外部字体请求。
- 通过 GitHub Pages（GitHub 免费静态托管）发布，分支 `main`，根目录。
- **不属于任何产品**。它不是 Family Space / Self Space / World Space 的一部分，也不是 Qoder 的资产。
  维护作品集只需要改这个仓库，不需要进任何产品仓库。

## 维护规则

1. **不把真实家庭的内容放进来。** 不写咨询记录、可识别个人的信息、账号、密钥、服务器路径或部署配置。
2. **状态如实标注。** 已上线、源码公开、私有研发、研究中是四种不同状态，不能混写成"已交付成果"。
3. **每个链接都要能核实。** 改完内容跑一次 `bash tools/verify-links.sh`，逐条看返回码和页面标题。
4. **不绑定自定义域名。** 现有域名（`ymai.love`、`ymai.me`、`ymai.fun`、`mingos.cn`）都指向各自产品的生产服务，作品集只用 `github.io` 默认域名。
5. **不为每次申请另建一个网站。** 求职、合作、分享、创造者计划都用这一份，持续更新。
6. **改完跑客观量测。** `node tools/audit-browser.mjs` 会用真实浏览器量线上页：横向溢出、文字截断、
   点击命中区、失效锚点、外部依赖、键盘可达性，以及打印介质下的隐形文字（白字白底）。退出码非 0 就是没过。

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

页面内置 A4 打印样式（`@media print`），PDF 必须从**线上地址**打印，才能确认交付的是发布版本：

```bash
chrome --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=evidence/ming-portfolio-$(date +%Y%m%d).pdf \
  "https://yueminghub.github.io/ming-portfolio/"
```

`evidence/ming-portfolio-20261017.pdf` 是这样产出的第一份：7 页 A4、36 个可点链接、字体已内嵌子集。
重新生成时按日期另存，不要覆盖旧文件——它是那一版网页的交付凭据。

## 内容结构

| 节 | 内容 |
|---|---|
| 01 About | 背景、分工、三条自我约束 |
| 02 Selected Work | Family Space / World Space / MingOS / Self Space / Agent Space / LRDF，每项含「为什么做 · 为谁解决 · 现在做到 · 还没解决」 |
| 03 How I Build | 意图与验收标准 → 任务合同 → Agent 执行 → 独立复核 → 回到真实使用 |
| 04 Research | LRDF 方向与三个仍在研究的问题 |
| 05 Public Evidence | 可核实链接清单 + 明确不提供的东西 |
| 06 Contact | 可核实的公开联系渠道 |
