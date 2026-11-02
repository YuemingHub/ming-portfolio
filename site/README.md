# YUE MING ECOSYSTEM · 作品集源码

**正式入口：<https://ymai.me/ming/>**

这是 `ming-portfolio` 的静态站点源码。构建产物部署在 `/ming/` 子路径；同一份构建也适用于 GitHub Pages 备份入口 `/ming-portfolio/`。

## 运行

要求 Node `^22.13.0 || >=24.0.0`。

```sh
npm ci
npm run dev
```

默认地址 <http://127.0.0.1:5173/>，子路径为 <http://127.0.0.1:5173/ming/>。

## 构建

```sh
npm run build
```

构建产物在 `dist/`。资源使用相对路径（`vite.config.ts` 中 `base: "./"`），运行时根据地址识别 `/ming/`、`/ming-portfolio/` 或根路径；同一份产物不需要为不同入口分别构建。

部署要求：

- `/ming/` 必须由独立的静态目录承载，不能被 Self Space 的 SPA fallback 接管。
- `/ming` 无尾斜杠应 301 到 `/ming/`；深链尾斜杠应 301 到无尾斜杠形式。
- 不修改 ymai.me 根站路由，不接管 `/gui/_next/` 等现有资源路径。

## 结构

- `src/site/`：站点内容、状态、证据、关系图与路由数据
- `src/pages/`：8 个页面
- `src/components/`：页面框架、体系图与状态组件
- `public/media/`：公开页截图
- `public/og-card.png`：分享卡片

## 数据边界

站点只展示公开页与内部记录支持的结论，不包含真实家庭数据、私有仓库链接或内部工程材料。Self Space 截图标记为 `EVIDENCE_PENDING`，等待独立修复后补拍。详见站点 `/evidence` 页面。
