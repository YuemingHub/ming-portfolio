# 发布验证记录

生成时间：2026-10-17 13:32:53Z（UTC）· 生成命令：bash tools/record-verification.sh
本节全部为命令原始输出，未手工改写。

## 1. 部署状态

```text
$ git rev-parse --short HEAD
f0cf65d
$ gh api repos/YuemingHub/ming-portfolio/pages
{"cname":null,"https_enforced":true,"source":{"branch":"main","path":"/"},"status":"built"}
```

## 2. 线上内容与提交内容逐字节一致

```text
线上字节=41120  HEAD:index.html 字节=41120
线上 md5=447a0b479443  HEAD md5=447a0b479443
cmp=完全一致（线上服务的就是这个提交的内容）
$ curl -sI https://yueminghub.github.io/ming-portfolio/
Server: GitHub.com
Content-Type: text/html; charset=utf-8
Last-Modified: Sat, 17 Oct 2026 13:30:33 GMT
```

## 3. 页面内所有外链逐条核实

```text
CODE   URL                                                              TITLE
---------------------------------------------------------------------------------------------
ok   200 https://github.com/YuemingHub                                    [YuemingHub · GitHub] 
ok   200 https://github.com/YuemingHub/Adaptive-Agent-Orchestration-Proto [GitHub - YuemingHub/Adaptive-Agent-Orche] 
ok   200 https://github.com/YuemingHub/Ming-Gateway                       [GitHub - YuemingHub/Ming-Gateway: 零依赖 No] 
ok   200 https://github.com/YuemingHub/MingOS                             [GitHub - YuemingHub/MingOS: 一个空间如何被创建、理解] 
ok   200 https://github.com/YuemingHub/World-Space                        [GitHub - YuemingHub/World-Space · GitHub] 
ok   200 https://github.com/YuemingHub/ming-portfolio                     [GitHub - YuemingHub/ming-portfolio: Ming] 
ok   200 https://github.com/YuemingHub/ming-portfolio/issues/new          [Sign in to GitHub · GitHub] 
ok   200 https://mingos.cn/                                               [MingOS — 当 AI 越来越强，人在哪里] 
ok   200 https://ymai.fun/                                                [World Space · 进入] 
ok   200 https://ymai.love/                                               [Ymai — 这里，留给你们家。] 
ok   200 https://ymai.me/                                                 [Self Space · 这里，留给你自己。] 
code=200 https://yueminghub.github.io/ming-portfolio/                     bytes=41120
----
RESULT=ALL_200
```

## 4. 既有生产站回归（作品集发布不得影响它们）

```text
https://ymai.fun/          HTTP 302
https://ymai.fun/ming/     HTTP 404
https://ymai.love/         HTTP 200
https://ymai.me/           HTTP 200
https://mingos.cn/         HTTP 200
$ gh api repos/YuemingHub/World-Space/commits/main
3f619d1 docs: publish Ming personal portfolio as separate page
```

> 说明：ymai.fun/ming/ 返回 404 与本次发布无关——ymai.fun 的 DNS 指向自建服务器（nginx），
> GitHub Pages 上的 ming/index.html 从未通过该域名对外服务。旧页面文件仍保留在 World-Space 仓库 main 分支，未删除。

## 5. 敏感信息自检（公开仓库不得含凭据形状）

```text
扫描文件：index.html README.md tools/*.sh
凭据形状命中=0
服务器路径/内网地址/主机 IP 形状命中=0
```

## 6. 真实浏览器量测（tools/audit-browser.mjs 原始输出）

外部浏览器连接器（Qoder Browser Connector）本机未就绪，改用本机 Chrome 无头 + CDP 驱动线上地址，
量的是公网渲染结果而非本地文件。截图见同目录各 png。

```text
desktop 1440x900: scrollW=1425/1440 height=7779 溢出=false 截断=0 命中区<24px=1 失效锚点=0 外链=18 项目块=6 标题="Ming · 从真实问题出发，把事情做出来"
tablet-768 768x1024: scrollW=753/768 height=10785 溢出=false 截断=0 命中区<24px=1 失效锚点=0 外链=18 项目块=6 标题="Ming · 从真实问题出发，把事情做出来"
mobile-390 390x844: scrollW=390/390 height=13302 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=18 项目块=6 标题="Ming · 从真实问题出发，把事情做出来"
mobile-320 320x640: scrollW=320/320 height=14337 溢出=false 截断=0 命中区<24px=1 失效锚点=0 外链=18 项目块=6 标题="Ming · 从真实问题出发，把事情做出来"
句内链接（豁免项，仅记录）=[{"t":"ming-portfolio","w":81,"h":16}]
键盘 Tab 可达（前 14 次）=14 个不同目标
打印介质：逐元素 189 项，对比度违规=0，深色区块底色=rgb(255, 255, 255)（应为白，否则白字白底）
JS 异常=0
----
RESULT=PASS
退出码=0
```

## 7. 交付 PDF 客观参数

```text
文件=ming-portfolio-20261017.pdf 字节=615954
页数=7（A4 单页）
可点链接注释=36
页面尺寸=/MediaBox [0 0 594.95996 841.91998]（594.96x841.92pt = A4）
内嵌字体=Georgia MicrosoftYaHei MicrosoftYaHei-Bold SegoeUI SegoeUI-Bold SegoeUI-Semibold 
```
