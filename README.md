# YUE MING ECOSYSTEM · 作品集

**正式入口：<https://ymai.me/ming/>**

这是月明（Ming）的体系作品集：解释三个空间、机构服务、专业与研究、Agent Space，以及每个项目当前做到哪里、还在验证什么。站点面向家庭、机构负责人、专业同行与合作方，强调可追溯的状态和明确的边界，不把未验证的能力写成已上线。

## 入口

| 用途 | 地址 | 状态 |
| --- | --- | --- |
| 正式入口 | <https://ymai.me/ming/> | 部署后生效 |
| 旧入口 | <https://ymai.fun/ming/> | 历史兼容，保留 |
| 备份入口 | <https://yueminghub.github.io/ming-portfolio/> | 保留 |

同一份构建产物可分别部署到这三个地址；资源使用相对路径，运行时根据地址识别子路径，不需要分别构建。正式入口在部署后生效，旧入口与备份入口当前仍是历史版本。

## 页面

- `/` 首页：体系主张、14 条项目记录、七种状态与体系图
- `/ecosystem` 体系总览：5 个区、10 个节点、8 条关系
- `/spaces` 三个空间：Family / Self / World 的公开入口与边界
- `/institution` 机构服务：问题、工作面、七步闭环与服务形式
- `/expert-and-research` 专业与研究：Expert OS、LRDF、书稿、Family Reality Lab
- `/agent-space` Agent Space：协作通道与“连接不等于集成”
- `/evidence` 证据与进展：14 条记录、41 条分层证据、状态定义
- `/cooperation` 联系与合作：五类合作对象与本地简报生成器

## 源码与构建

源码在 [`site/`](site/)，使用 React + TypeScript + Vite 构建为静态站点。

```sh
cd site
npm ci
npm run build
```

构建产物输出到 `site/dist/`，本仓库根目录保存的是可直接静态托管的构建结果。

部署约束：

- `/ming/` 必须由独立静态目录承载，不能被 Self Space 的 SPA fallback 接管。
- `/ming` 无尾斜杠应 301 到 `/ming/`；深链尾斜杠 301 到无尾斜杠形式。
- 不修改 ymai.me 根站路由，不接管 `/gui/_next/` 等现有资源路径。
- 完整部署与回滚步骤由 Owner 授权的发布流程单独执行。

## 证据边界

- 公开证据包括四个公开页与三张公开页截图；其余为内部记录，只说明存在与结论，不公开链接、原文或文件名。
- **Self Space 截图为 `EVIDENCE_PENDING`**：2026-11-02 公开页出现独立资源路径故障。故障截图只作内部诊断记录，不作为正常产品展示证据；待独立修复并完成公网复核后补拍。
- 三个空间尚未实现统一登录、共享数据或共享记忆。
- 本站不使用分析脚本、不收集访客数据、不加载外部字体或追踪代码。

更详细的逐项状态与限制见站点 `/evidence` 页面。

## 历史

迁移前的静态作品集与全部历史证据保存在 [`archive/pre-qoder-2026-11-02/`](archive/pre-qoder-2026-11-02/)，包括旧页面、CSS、PDF 与截图。旧仓库历史与标签完整保留，未删除。

## 联系

合作相关问题请通过 [GitHub Issues](https://github.com/YuemingHub/ming-portfolio/issues/new) 提交。本站不收集联系信息，也不公布未核实的邮箱、微信或社交账号。
