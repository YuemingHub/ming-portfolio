# 发布验证记录

生成时间：2026-10-25 13:19:50Z（UTC）· 生成命令：bash tools/record-verification.sh
本节全部为命令原始输出，未手工改写。

## 1. 部署状态

```text
$ git rev-parse --short HEAD
59cd71d
$ gh api repos/YuemingHub/ming-portfolio/pages
{"cname":null,"https_enforced":true,"source":{"branch":"main","path":"/"},"status":"built"}
```

## 2. 备份面内容与提交内容逐字节一致

```text
线上字节=29892  HEAD:index.html 字节=29892
线上 md5=3bca73c4d253  HEAD md5=3bca73c4d253
cmp=完全一致（线上服务的就是这个提交的内容）
$ curl -sI https://yueminghub.github.io/ming-portfolio/
Server: GitHub.com
Content-Type: text/html; charset=utf-8
Last-Modified: Sun, 25 Oct 2026 13:11:36 GMT
```

## 3. 页面内所有外链逐条核实

```text
CODE   URL                                                              TITLE
---------------------------------------------------------------------------------------------
ok   200 https://github.com/YuemingHub                                    [YuemingHub · GitHub] 
ok   200 https://github.com/YuemingHub/Ming-Gateway                       [GitHub - YuemingHub/Ming-Gateway: 零依赖 No] 
ok   200 https://github.com/YuemingHub/MingOS                             [GitHub - YuemingHub/MingOS: 一个空间如何被创建、理解] 
ok   200 https://github.com/YuemingHub/World-Space                        [GitHub - YuemingHub/World-Space · GitHub] 
ok   200 https://github.com/YuemingHub/ming-portfolio                     [GitHub - YuemingHub/ming-portfolio: Ming] 
ok   200 https://github.com/YuemingHub/ming-portfolio/issues/new          [Sign in to GitHub · GitHub] 
ok   200 https://mingos.cn/                                               [MingOS — 当 AI 越来越强，人在哪里] 
ok   200 https://ymai.fun/                                                [World Space · 进入] 
ok   200 https://ymai.love/                                               [Ymai — 这里，留给你们家。] 
ok   200 https://ymai.me/                                                 [Self Space · 这里，留给你自己。] 
ok   200 https://yueminghub.github.io/ming-portfolio/                     [Ming · 从真实问题出发，把事情做出来] 
ok   200 https://yueminghub.github.io/ming-portfolio/lrdf.html            [LRDF · 家长版：三步地图与常见问题] 
code=200 https://yueminghub.github.io/ming-portfolio/                     bytes=29892
----
RESULT=ALL_200
verify-links.sh 退出码=0
```

## 4. 既有生产站回归（作品集发布不得影响它们）

```text
https://ymai.fun/          HTTP 302
https://ymai.fun/ming/     HTTP 200
https://ymai.love/         HTTP 200
https://ymai.me/           HTTP 200
https://mingos.cn/         HTTP 200
$ gh api repos/YuemingHub/World-Space/commits/main
3f619d1 docs: publish Ming personal portfolio as separate page
```

> 结论（由上面实测的 200 推导）：正式面 https://ymai.fun/ming/ 已生效，由该域名所在服务器的 nginx 从独立静态目录直接提供，与备份面各自独立。
> 旧页面：World-Space 仓库 main 分支上的历史文件未删除；该域名此前对 /ming/ 的 404 由其应用自己答，与作品集仓库无关。

## 5. 真实浏览器量测（tools/audit-browser.mjs 原始输出，两个发布面 × 两个页面）

外部浏览器连接器（Qoder Browser Connector）本机未就绪，改用本机 Chrome 无头 + CDP 驱动线上地址，
量的是公网渲染结果而非本地文件。截图见同目录各 png（正式面前缀 fun-，家长版第二页含 lrdf-）。

```text
$ node D:/服务器/repos/ming-portfolio/tools/audit-browser.mjs https://ymai.fun/ming/ 9346 "fun-"
证据输出目录=D:\服务器\repos\ming-portfolio\evidence\
desktop 1440x900: scrollW=1425/1440 height=9369 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=19 项目块=0 标题="Ming · 从真实问题出发，把事情做出来"
tablet-768 768x1024: scrollW=753/768 height=10745 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=19 项目块=0 标题="Ming · 从真实问题出发，把事情做出来"
mobile-390 390x844: scrollW=390/390 height=14601 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=19 项目块=0 标题="Ming · 从真实问题出发，把事情做出来"
mobile-320 320x640: scrollW=320/320 height=16424 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=19 项目块=0 标题="Ming · 从真实问题出发，把事情做出来"
句内链接（豁免项，仅记录）=[]
键盘 Tab 可达（前 14 次）=14 个不同目标
打印介质：逐元素 239 项，对比度违规=0，深色区块底色=rgb(255, 255, 255)（应为白，否则白字白底）
JS 异常=0
----
RESULT=PASS
退出码=0
```

```text
$ node D:/服务器/repos/ming-portfolio/tools/audit-browser.mjs https://ymai.fun/ming/lrdf.html 9346 "fun-lrdf-"
证据输出目录=D:\服务器\repos\ming-portfolio\evidence\
desktop 1440x900: scrollW=1425/1440 height=7074 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=4 项目块=0 标题="LRDF · 家长版：三步地图与常见问题"
tablet-768 768x1024: scrollW=753/768 height=7673 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=4 项目块=0 标题="LRDF · 家长版：三步地图与常见问题"
mobile-390 390x844: scrollW=390/390 height=9624 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=4 项目块=0 标题="LRDF · 家长版：三步地图与常见问题"
mobile-320 320x640: scrollW=320/320 height=10780 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=4 项目块=0 标题="LRDF · 家长版：三步地图与常见问题"
句内链接（豁免项，仅记录）=[]
键盘 Tab 可达（前 14 次）=14 个不同目标
打印介质：逐元素 154 项，对比度违规=0，深色区块底色=rgb(255, 255, 255)（应为白，否则白字白底）
JS 异常=0
----
RESULT=PASS
退出码=0
```

```text
$ node D:/服务器/repos/ming-portfolio/tools/audit-browser.mjs https://yueminghub.github.io/ming-portfolio/ 9346 ""
证据输出目录=D:\服务器\repos\ming-portfolio\evidence\
desktop 1440x900: scrollW=1425/1440 height=9369 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=19 项目块=0 标题="Ming · 从真实问题出发，把事情做出来"
tablet-768 768x1024: scrollW=753/768 height=10745 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=19 项目块=0 标题="Ming · 从真实问题出发，把事情做出来"
mobile-390 390x844: scrollW=390/390 height=14601 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=19 项目块=0 标题="Ming · 从真实问题出发，把事情做出来"
mobile-320 320x640: scrollW=320/320 height=16424 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=19 项目块=0 标题="Ming · 从真实问题出发，把事情做出来"
句内链接（豁免项，仅记录）=[]
键盘 Tab 可达（前 14 次）=14 个不同目标
打印介质：逐元素 239 项，对比度违规=0，深色区块底色=rgb(255, 255, 255)（应为白，否则白字白底）
JS 异常=0
----
RESULT=PASS
退出码=0
```

```text
$ node D:/服务器/repos/ming-portfolio/tools/audit-browser.mjs https://yueminghub.github.io/ming-portfolio/lrdf.html 9346 "lrdf-"
证据输出目录=D:\服务器\repos\ming-portfolio\evidence\
desktop 1440x900: scrollW=1425/1440 height=7074 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=4 项目块=0 标题="LRDF · 家长版：三步地图与常见问题"
tablet-768 768x1024: scrollW=753/768 height=7673 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=4 项目块=0 标题="LRDF · 家长版：三步地图与常见问题"
mobile-390 390x844: scrollW=390/390 height=9624 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=4 项目块=0 标题="LRDF · 家长版：三步地图与常见问题"
mobile-320 320x640: scrollW=320/320 height=10780 溢出=false 截断=0 命中区<24px=0 失效锚点=0 外链=4 项目块=0 标题="LRDF · 家长版：三步地图与常见问题"
句内链接（豁免项，仅记录）=[]
键盘 Tab 可达（前 14 次）=14 个不同目标
打印介质：逐元素 154 项，对比度违规=0，深色区块底色=rgb(255, 255, 255)（应为白，否则白字白底）
JS 异常=0
----
RESULT=PASS
退出码=0
```

## 6. 交付 PDF 客观参数

```text
file=ming-portfolio-2026102502.pdf
bytes=902474 pages=9
Link=26 URI=22 Dest=4 Neither=0
带页内 Dest 的注释目标=top lrdf works
带 URI 的链接：
  https://ymai.love/
  https://github.com/YuemingHub/World-Space
  https://ymai.fun/
  https://mingos.cn/
  https://github.com/YuemingHub/MingOS
  https://ymai.me/
  https://yueminghub.github.io/ming-portfolio/lrdf.html
  https://yueminghub.github.io/ming-portfolio/lrdf.html
  https://ymai.love/
  https://ymai.me/
  https://ymai.fun/
  https://mingos.cn/
  https://github.com/YuemingHub/World-Space
  https://github.com/YuemingHub/MingOS
  https://github.com/YuemingHub/Ming-Gateway
  https://github.com/YuemingHub
  https://yueminghub.github.io/ming-portfolio/ming-portfolio-2026102502.pdf
  https://github.com/YuemingHub
  https://github.com/YuemingHub/ming-portfolio/issues/new
  https://github.com/YuemingHub/ming-portfolio
  https://ymai.fun/ming/
  https://yueminghub.github.io/ming-portfolio/
可点链接注释=26（按 /Subtype /Link 计）；其中带 URI=22、带页内 Dest=4
  对照：<a> 锚点分四类 站外=19 PDF=1 相对页=2 页内#=13（合计 35）
  对照：导航条与英雄区 CTA 在打印时被 display:none，页内 # 不进注释
  期望关系：带 URI 的注释数 = 站外 + PDF + 相对页（=22）；带页内 Dest 的注释数 ≤ 页内 # 数
  闭合=是
  页内注释上限自检=过（4 ≤ 13）
页面尺寸=/MediaBox [0 0 594.95996 841.91998]（594.96x841.92pt = A4）
内嵌字体=CourierNewPS-BoldMT CourierNewPSMT MicrosoftYaHei MicrosoftYaHei-Bold NSimSun SegoeUI SegoeUI-Bold 
```

## 7. 两个发布面逐条验收（tools/verify-surface.sh 原始输出）

```text
### 正式面 https://ymai.fun/ming/
ok    GET /ming/ 状态码 = 200
      /ming/ 标题 = Ming · 从真实问题出发，把事情做出来
ok    标题与已验收版本一致
ok    正文含「从真实问题出发」
ok    正文含「Family Space」
ok    正文含「Public Evidence」
ok    正文含「还没解决」
ok    未被登录页接管（无密码框、非登录页标题）
      GET /ming = 301 https://ymai.fun/ming/
ok    /ming 规范化跳转到 /ming/
      GET /ming/ming-portfolio-2026102502.pdf = 200 902474
ok    PDF 状态码 = 200
ok    PDF 魔数正确（是真 PDF 不是错误页）
ok    PDF 与仓库里那份逐字节一致 (md5=10ac99604127)
ok    /ming/ 内容与本地已验收版本逐字节一致 (md5=3bca73c4d253)
---- 第二页与共用样式
ok    GET /ming/lrdf.html = 200
ok    GET /ming/site.css = 200
      lrdf.html 取到 http=200 bytes=18858
ok    lrdf.html 正文是家长版（含「先接住」）
ok    首页有指向 lrdf.html 的链接
ok    首页引用共用样式 site.css
---- 既有系统回归（不跟随跳转，看原始应答）----
https://ymai.fun/                              HTTP 302 size=0 redir=https://ymai.fun/login
https://ymai.fun/login                         HTTP 200 size=847 redir=
https://ymai.fun/healthz                       HTTP 200 size=11 redir=
https://ymai.love/                             HTTP 200 size=191524 redir=
https://ymai.me/                               HTTP 200 size=21177 redir=
https://mingos.cn/                             HTTP 200 size=13045 redir=
https://api.ymai.fun/healthz                   HTTP 200 size=29 redir=
https://yueminghub.github.io/ming-portfolio/   HTTP 200 size=29892 redir=
---- 生产基线判定（部署 /ming/ 不得改变这三条）----
ok    https://ymai.fun/ 状态码 = 302
ok    https://ymai.fun/ 跳转目标 = https://ymai.fun/login
ok    https://ymai.fun/login 状态码 = 200
ok    https://ymai.fun/healthz 状态码 = 200
----
RESULT=PASS
退出码=0

### 备份面 https://yueminghub.github.io/ming-portfolio/
ok    GET /ming/ 状态码 = 200
      /ming/ 标题 = Ming · 从真实问题出发，把事情做出来
ok    标题与已验收版本一致
ok    正文含「从真实问题出发」
ok    正文含「Family Space」
ok    正文含「Public Evidence」
ok    正文含「还没解决」
ok    未被登录页接管（无密码框、非登录页标题）
      GET /ming-portfolio/ming-portfolio-2026102502.pdf = 200 902474
ok    PDF 状态码 = 200
ok    PDF 魔数正确（是真 PDF 不是错误页）
ok    PDF 与仓库里那份逐字节一致 (md5=10ac99604127)
ok    /ming/ 内容与本地已验收版本逐字节一致 (md5=3bca73c4d253)
---- 第二页与共用样式
ok    GET /ming-portfolio/lrdf.html = 200
ok    GET /ming-portfolio/site.css = 200
      lrdf.html 取到 http=200 bytes=18858
ok    lrdf.html 正文是家长版（含「先接住」）
ok    首页有指向 lrdf.html 的链接
ok    首页引用共用样式 site.css
---- 既有系统回归（不跟随跳转，看原始应答）----
https://yueminghub.github.io/                  HTTP 404 size=9115 redir=
https://yueminghub.github.io/login             HTTP 404 size=9115 redir=
https://yueminghub.github.io/healthz           HTTP 404 size=9115 redir=
https://ymai.love/                             HTTP 200 size=191524 redir=
https://ymai.me/                               HTTP 200 size=21177 redir=
https://mingos.cn/                             HTTP 200 size=13045 redir=
https://api.ymai.fun/healthz                   HTTP 200 size=29 redir=
https://yueminghub.github.io/ming-portfolio/   HTTP 200 size=29892 redir=
----
RESULT=PASS
退出码=0
```

## 8. 敏感信息自检（扫的是上面刚生成的这份待发布文件，含它自己）

```text
扫描文件（9 个，逐个点名）：
README.md .VERIFICATION.tmp index.html lrdf.html site.css audit-browser.mjs pdf-links.mjs verify-links.sh verify-surface.sh 
      其中的 .VERIFICATION.tmp 就是本文件落地前的临时体（改名后发布为 VERIFICATION.md），扫它=扫第 1–7 节全文
      本节与第 9 节在扫描之后才追加；它们只打印类别与命中行，不含模式原文
排除：tools/record-verification.sh —— 本装置自身就写着这些模式串，不排除会把自己当泄露（实测会把 7 处模式定义扫成命中）
凭据形状命中=0
生产布局形状命中=0
      判据覆盖六类：ECS 公网 IP、服务器 web 根目录、nginx 配置目录、机上备份目录、隧道内网段、静态根命名
```

## 9. 本装置汇总判定（由上面各段退出码推导）

```text
浏览器量测未通过的面数=0  链接/发布面/正式面判据未通过数=0  敏感自检命中=0
总判定=全部判据通过
```
