import type { MapNode, MapZone, Project, Status, StatusMeta } from "./types";

export const SITE = {
  name: "YUE MING ECOSYSTEM",
  title: "让生命与世界更好地连接",
  version: "2026.11",
  verifiedAt: "2026-11-02",
  canonical: "https://ymai.me/",
  selfSpace: "https://ymai.me/gui/",
  legacy: "https://ymai.fun/ming/",
  backup: "https://yueminghub.github.io/ming-portfolio/",
  note: "本页项目状态以 2026-11-02 的公开页面与仓库文档核验为准；Self Space 的资源路径修复单独标注 2026-11-03。未标注 LIVE_VERIFIED 的能力不视为已上线。",
};

export const CONTACT = {
  channel: "GitHub Issues",
  url: "https://github.com/YuemingHub/ming-portfolio/issues/new",
  note: "这是目前唯一确认可用的公开联系通道。本站不收集联系信息，也不公布未核实的邮箱、微信或社交账号。",
};

export const KNOWN_INCIDENTS = [
  {
    id: "self-space-assets",
    title: "Self Space 生产资源路径故障",
    date: "2026-11-02",
    status: "RESOLVED · 2026-11-03",
    impact: "ymai.me 的 Next.js 资源请求返回 SPA HTML，首次访问页面缺少样式。",
    handling: "2026-11-03 将 Self Space 修正到其构建原生路径 /gui/ 并完成公网复核；作品集入口指向 https://ymai.me/gui/ 。真实线上截图仍标记 EVIDENCE_PENDING，待补拍。",
  },
];

export const STATUS_META: Record<Status, StatusMeta> = {
  LIVE_VERIFIED: {
    label: "LIVE_VERIFIED",
    zh: "生产环境已核验",
    description: "公开地址当前可访问，页面文字与入口已逐项核对。",
    tone: "live",
  },
  CODE_ACCEPTED: {
    label: "CODE_ACCEPTED",
    zh: "代码审查接受",
    description: "代码与验收材料已被接受，但不等于已经部署上线。",
    tone: "code",
  },
  PROTOTYPE: {
    label: "PROTOTYPE",
    zh: "可运行原型",
    description: "存在可运行或可检查的原型，不等于正式产品。",
    tone: "prototype",
  },
  VALIDATION: {
    label: "VALIDATION",
    zh: "正在验证",
    description: "已进入真实或合成场景验证，仍有未关闭的验证任务。",
    tone: "validation",
  },
  RESEARCH: {
    label: "RESEARCH",
    zh: "研究 / 理论探索",
    description: "属于研究、写作或理论探索，不是已证实的结论或已发布产品。",
    tone: "research",
  },
  HOLD: {
    label: "HOLD",
    zh: "存在发布阻断",
    description: "有未关闭的发布阻断，当前不应对外宣称可用。",
    tone: "hold",
  },
  PLANNED: {
    label: "PLANNED",
    zh: "尚未实现",
    description: "只有方向或设计，没有可核验的实现。",
    tone: "planned",
  },
};

export const STATUS_ORDER: Status[] = [
  "LIVE_VERIFIED",
  "CODE_ACCEPTED",
  "PROTOTYPE",
  "VALIDATION",
  "RESEARCH",
  "HOLD",
  "PLANNED",
];

export const PROJECTS: Project[] = [
  {
    id: "family-space",
    name: "Family Space",
    en: "家庭空间 · ymai.love",
    audience: "家庭",
    capability: "今天、我家、回望、我的四个生活入口；家庭记录、重要脉络与纠错机制。",
    status: "LIVE_VERIFIED",
    evidence: [
      { label: "ymai.love 公开页", kind: "public", href: "https://ymai.love" },
      { label: "公开页文字核验：今天 / 我家 / 回望 / 我的", kind: "measurement" },
      { label: "桌面端实拍截图", kind: "screenshot", href: "/media/ymai-love.png" },
      { label: "部署与运行身份核验（内部记录，不公开）", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "登录后的家庭页面与真实家庭数据不在本站展示；企业微信入口未在本轮核验线上可用性。",
    publicUrl: "https://ymai.love",
    route: "/spaces#family",
  },
  {
    id: "self-space",
    name: "Self Space",
    en: "自我空间 · ymai.me",
    audience: "个人",
    capability: "说出来、留下、回来：可以说话，关掉窗口不会丢，以后还能回来。",
    status: "LIVE_VERIFIED",
    evidence: [
      { label: "Self Space 公开页", kind: "public", href: "https://ymai.me/gui/" },
      { label: "公开页文字核验：说出来 / 留下 / 回来", kind: "measurement" },
      { label: "Self Space 真实线上截图 · EVIDENCE_PENDING（待补拍）", kind: "pending" },
      { label: "生产资源路径故障诊断与修复记录（内部记录，不公开）", kind: "private-doc" },
      { label: "生产部署与回滚记录（内部记录，不公开）", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "2026-11-02 生产页面存在独立资源路径故障；2026-11-03 已修正为 /gui/ 并完成公网复核。对话与长期记忆能力需登录后核验；本站未获取账号，因此不宣称登录后体验已验收。真实线上截图仍标记 EVIDENCE_PENDING。",
    publicUrl: "https://ymai.me/gui/",
    route: "/spaces#self",
  },
  {
    id: "world-space",
    name: "World Space",
    en: "世界空间 · ymai.fun",
    audience: "零基础成人、孩子与家长",
    capability: "7 个「你想做什么事」目标入口；每个目标给出默认工具、第一步、如实限制与现实结果。",
    status: "LIVE_VERIFIED",
    evidence: [
      { label: "ymai.fun 公开页", kind: "public", href: "https://ymai.fun" },
      { label: "公开页文字核验：7 个目标 + 三步上手", kind: "measurement" },
      { label: "桌面端实拍截图", kind: "screenshot", href: "/media/ymai-fun.png" },
      { label: "产品契约与行动—现实回路记录（内部记录，不公开）", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "推荐的是第三方工具；其可用性、价格与名额不由本站保证。资源目录要求 90 天内重新核查。",
    publicUrl: "https://ymai.fun",
    route: "/spaces#world",
  },
  {
    id: "mingos-site",
    name: "MingOS 公开站",
    en: "体系总入口 · mingos.cn",
    audience: "公众",
    capability: "用「我与自己 / 我与家庭 / 我与世界」三种关系解释三个入口为什么存在。",
    status: "LIVE_VERIFIED",
    evidence: [
      { label: "mingos.cn 公开页", kind: "public", href: "https://mingos.cn" },
      { label: "公开页文字核验：三种关系 + 三个入口", kind: "measurement" },
      { label: "桌面端实拍截图", kind: "screenshot", href: "/media/mingos-cn.png" },
    ],
    verified: "2026-11-02",
    limits: "公开站是理念与导航层，不是运行时。三个空间目前没有统一登录、共享数据或共享记忆。",
    publicUrl: "https://mingos.cn",
    route: "/ecosystem",
  },
  {
    id: "family-service-os",
    name: "Family Service OS",
    en: "机构服务系统",
    audience: "家庭教育 / 家庭咨询机构的咨询师、主管、经营者",
    capability: "咨询师个案工作台、主管介入视图、经营者服务健康度；用合成数据跑通服务闭环。",
    status: "CODE_ACCEPTED",
    evidence: [
      { label: "代码评审与合成数据验收记录（内部记录，不公开）", kind: "private-doc" },
      { label: "攻击、权限、生命周期、恢复等多组测试记录（内部记录，不公开）", kind: "private-doc" },
      { label: "真实数据与生产启用状态：均未放行（内部记录，不公开）", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "代码验收已通过（合成数据）；未部署、未合入主线、未接入真实机构数据；测试通过不等于机构现场验证。",
    route: "/institution",
  },
  {
    id: "expert-os",
    name: "Yueming Expert OS",
    en: "专业判断辅助系统",
    audience: "专业工作者",
    capability: "15 类场景库、6 个已启用 Agent、6 个 Skill、安全门与 F01–F05 判据。",
    status: "VALIDATION",
    evidence: [
      { label: "系统结构与真实启用数量核验（内部记录，不公开）", kind: "private-doc" },
      { label: "复合案例真跑记录（2026-09-29，内部记录，不公开）", kind: "private-doc" },
      { label: "风险分诊与安全门问题：已修复（内部记录，不公开）", kind: "private-doc" },
      { label: "转介资源与总质检闸：仍未关闭（内部记录，不公开）", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "未达到独立对外商用标准；未完成同行可用性与可复现性验证；不替代专业判断与责任。",
    route: "/expert-and-research#expert-os",
  },
  {
    id: "wecom-channel",
    name: "Family Space · WeCom 入口",
    en: "企业微信服务入口",
    audience: "家庭",
    capability: "在企业微信服务群里 @家明；近场对话、长期事实、暂时理解三层记忆边界。",
    status: "CODE_ACCEPTED",
    evidence: [
      { label: "入口定位与三层记忆边界核验（内部记录，不公开）", kind: "private-doc" },
      { label: "服务关系记录：AI 持续在场，真人真正负责（内部记录，不公开）", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "本轮未核验其线上服务群可用性与真实家庭接入情况；不公开任何家庭对话或记忆内容。",
  },
  {
    id: "lrdf",
    name: "LRDF",
    en: "生命恢复与发展体系",
    audience: "专业者、研究者",
    capability: "生命承接 → 能动恢复 → 生命成熟；概念、命题、方法、现实研究与治理文件。",
    status: "RESEARCH",
    evidence: [
      { label: "核心架构与边界核验（内部记录，不公开）", kind: "private-doc" },
      { label: "资料治理规则：仓库不保存原始家庭咨询资料", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "理论假设不是科学共识；不是诊断系统，不替代医疗与心理治疗。",
    route: "/expert-and-research#lrdf",
  },
  {
    id: "book",
    name: "《先看清，再伸手》",
    en: "书稿",
    audience: "父母、同行、研究者",
    capability: "四部十一章及结语完整书稿持续修订；以 LRDF 为思想主线，区分两代理论。",
    status: "RESEARCH",
    evidence: [
      { label: "完整书稿记录（2026-10-27，内部记录，不公开）", kind: "private-doc" },
      { label: "读者、边界与「不是什么」记录（内部记录，不公开）", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "未出版；作者终审、独立专业审查与真人理解验证未完成。文件检查不能代替读者验证。",
    route: "/expert-and-research#book",
  },
  {
    id: "reality-lab",
    name: "Family Reality Lab",
    en: "真实问题与公开现实测试",
    audience: "研究、内容与产品改进",
    capability: "真实家长原话 → AI 真实回答 → Ming 观察 → 公开表达 → 现实反馈 → Family Space 改进。",
    status: "RESEARCH",
    evidence: [
      { label: "期数记录 13 份（001–007、009–014）", kind: "private-doc" },
      { label: "问题表：家长原话、标签、状态与期数", kind: "private-doc" },
      { label: "来源与使用规则：原话 / 提炼 / 公开评论分开", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "公开发布状态未在本轮核验；原始家庭资料不上网；本研究不构成效果证明。",
    route: "/expert-and-research#lab",
  },
  {
    id: "agent-space",
    name: "Agent Space",
    en: "长期协作工作空间",
    audience: "Agent、协作者、项目现场",
    capability: "Agent Entry、Reality Resolver、Context Broker、Capability Gateway 四项工作方法。",
    status: "VALIDATION",
    evidence: [
      { label: "工作方法边界核验：四个职责与不拥有什么（内部记录，不公开）", kind: "private-doc" },
      { label: "真实项目中的多轮执行、独立核验与发布记录（内部记录，不公开）", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "不是可交付软件产品，也不是运行时平台；能力项多为工作方法与协作协议，尚未产品化。",
    route: "/agent-space",
  },
  {
    id: "mingos-protocol",
    name: "MingOS v0.1",
    en: "跨空间协议骨架",
    audience: "体系设计者、研究者",
    capability: "Space、Actor、Context Ledger、Intent Contract、Task/Authorization、Evidence/Handoff、Continuity Bundle 七类公共骨架。",
    status: "PROTOTYPE",
    evidence: [
      { label: "v0.1 范围与明确不做（内部记录，不公开）", kind: "private-doc" },
      { label: "交接包验证与恢复记录（内部记录，不公开）", kind: "private-doc" },
      { label: "版本状态：默认冻结（2026-09-25，内部记录，不公开）", kind: "private-doc" },
    ],
    verified: "2026-11-02",
    limits: "不是三个空间的底层运行时，也没有被生产采用；当前默认冻结，不扩建平台抽象。",
  },
  {
    id: "institution-offers",
    name: "机构服务方案",
    en: "试销中的服务形式",
    audience: "家庭教育机构",
    capability: "服务断点诊断、首咨后的 7 天跟进设计、导师工作流、30 天机构试点。",
    status: "VALIDATION",
    evidence: [
      { label: "服务形式定义与试点设想", kind: "private-doc" },
      { label: "无可验证的提升比例对外披露", kind: "measurement" },
    ],
    verified: "2026-11-02",
    limits: "属于试销假设，不是已验证的标准产品；价格与交付范围按机构实际情况单独核定，本站不公开报价。",
    route: "/institution#offers",
  },
  {
    id: "unified-continuity",
    name: "三个空间的统一连续体验",
    en: "统一登录 / 共享数据 / 共享记忆",
    audience: "跨空间用户",
    capability: "方向已提出：同一个人在不同空间之间不必重复讲述。",
    status: "PLANNED",
    evidence: [
      { label: "当前边界说明：三个空间各自独立（内部记录，不公开）", kind: "private-doc" },
      { label: "无统一登录、无共享数据、无共享记忆 / 上下文 / 运行时", kind: "measurement" },
    ],
    verified: "2026-11-02",
    limits: "尚未实现；本站不把三个空间画成已经数据互通。",
  },
];

export const PROJECT_COUNT = PROJECTS.length;

export const STATUS_COUNTS = STATUS_ORDER.reduce(
  (counts, status) => ({
    ...counts,
    [status]: PROJECTS.filter((project) => project.status === status).length,
  }),
  {} as Record<Status, number>,
);

export const MAP_ZONES: MapZone[] = [
  { id: "life", index: "A", title: "人与生活空间", en: "LIFE SPACES" },
  { id: "service", index: "B", title: "专业服务系统", en: "PROFESSIONAL SYSTEMS" },
  { id: "knowledge", index: "C", title: "研究与知识", en: "RESEARCH & KNOWLEDGE" },
  { id: "execution", index: "D", title: "连接与执行", en: "CONNECTION & EXECUTION" },
  { id: "technology", index: "E", title: "技术探索与支撑", en: "TECHNICAL EXPLORATION" },
];

export const MAP_NODES: MapNode[] = [
  {
    id: "family",
    name: "Family Space",
    en: "家庭空间",
    zone: "life",
    audience: "家庭",
    problem: "家庭每天发生的事需要被保存、理解、纠正，并在需要时获得持续支持。",
    statuses: ["LIVE_VERIFIED"],
    capabilities: ["今天 / 我家 / 回望 / 我的", "重要的事被记住", "理解错了可以纠正", "企业微信入口（代码接受，未核验线上）"],
    limits: "登录后的家庭页面与真实家庭数据不对外展示。",
    links: [
      { label: "打开 ymai.love", href: "https://ymai.love" },
      { label: "看三个空间", internal: "/spaces#family" },
    ],
  },
  {
    id: "self",
    name: "Self Space",
    en: "自我空间",
    zone: "life",
    audience: "个人",
    problem: "需要一个能整理自己、理解经历、保存经验、持续认识自己的空间。",
    statuses: ["LIVE_VERIFIED"],
    capabilities: ["说出来", "留下：关掉窗口不会丢", "回来：以后还能看见"],
    limits: "不是心理咨询网站，也不是人生导师；登录后能力未在本轮公开核验。",
    links: [
      { label: "打开 Self Space", href: "https://ymai.me/gui/" },
      { label: "看三个空间", internal: "/spaces#self" },
    ],
  },
  {
    id: "world",
    name: "World Space",
    en: "世界空间",
    zone: "life",
    audience: "零基础成人、孩子与家长",
    problem: "面对很多 AI 工具，不知道从哪开始，也不知道怎样用到真实任务里。",
    statuses: ["LIVE_VERIFIED"],
    capabilities: ["7 个目标入口", "每个目标一个默认工具与第一步", "三步上手兜底", "打开工具不等于做成"],
    limits: "推荐第三方工具；可用性、价格与名额不由本站保证。",
    links: [
      { label: "打开 ymai.fun", href: "https://ymai.fun" },
      { label: "看三个空间", internal: "/spaces#world" },
    ],
  },
  {
    id: "fso",
    name: "Family Service OS",
    en: "机构服务系统",
    zone: "service",
    audience: "机构咨询师、主管、经营者",
    problem: "课程、导师与咨询经验很难组织成连续、可复核、可改进的服务体系。",
    statuses: ["CODE_ACCEPTED"],
    capabilities: ["咨询师：我的家庭 / 个案工作台", "主管：今日需要我介入的人", "经营者：经营与服务健康度"],
    limits: "未部署、未合入主线、真实数据与生产启用被阻断。",
    links: [{ label: "看机构服务", internal: "/institution" }],
  },
  {
    id: "expert",
    name: "Yueming Expert OS",
    en: "专业判断辅助",
    zone: "service",
    audience: "专业工作者",
    problem: "专业知识、经验与判断方法需要变成可检查、可修正的辅助能力。",
    statuses: ["VALIDATION"],
    capabilities: ["15 类场景库", "6 个启用 Agent + 1 个部分 + 2 个刻意不建", "6 个 Skill", "F01–F05 判据"],
    limits: "转介资源与总质检闸仍有未关闭问题；未完成同行可用性验证；不是自动咨询系统。",
    links: [{ label: "看专业与研究", internal: "/expert-and-research#expert-os" }],
  },
  {
    id: "lrdf",
    name: "LRDF",
    en: "生命恢复与发展体系",
    zone: "knowledge",
    audience: "专业者、研究者",
    problem: "从真实生活出发，建立能够接受证据检验的判断方法。",
    statuses: ["RESEARCH"],
    capabilities: ["生命承接 → 能动恢复 → 生命成熟", "概念、命题、方法", "现实研究与治理边界"],
    limits: "理论假设不是科学共识；不替代医疗与心理治疗。",
    links: [{ label: "读 LRDF", internal: "/expert-and-research#lrdf" }],
  },
  {
    id: "lab",
    name: "Family Reality Lab",
    en: "真实问题实验室",
    zone: "knowledge",
    audience: "研究、内容与产品改进",
    problem: "真实家庭问题怎样转成可研究、可验证、可观察、可修正的素材。",
    statuses: ["RESEARCH"],
    capabilities: ["真实家长原话", "13 份期数记录", "原话 / 提炼 / 评论分开", "现实反馈回路"],
    limits: "公开发布状态未核验；原始家庭资料不上网。",
    links: [{ label: "看研究", internal: "/expert-and-research#lab" }],
  },
  {
    id: "book",
    name: "《先看清，再伸手》",
    en: "书稿",
    zone: "knowledge",
    audience: "父母、同行、研究者",
    problem: "在复杂、不确定的真实生活中，作出有依据、负责任、可修正的下一步选择。",
    statuses: ["RESEARCH"],
    capabilities: ["四部十一章及结语", "以 LRDF 为思想主线", "区分两代理论", "作者审阅稿持续修订"],
    limits: "未出版；作者终审与独立专业审查未完成。",
    links: [{ label: "看书稿", internal: "/expert-and-research#book" }],
  },
  {
    id: "agent",
    name: "Agent Space",
    en: "连接与执行",
    zone: "execution",
    audience: "普通人、专业人士、组织",
    problem: "如何以更低摩擦借用已有的 AI、工具、知识、技术与现实资源。",
    statuses: ["VALIDATION"],
    capabilities: ["Agent Entry", "Reality Resolver", "Context Broker", "Capability Gateway"],
    limits: "不是软件产品，也不是运行时平台；能力项尚未产品化。",
    links: [{ label: "了解 Agent Space", internal: "/agent-space" }],
  },
  {
    id: "mingos",
    name: "MingOS",
    en: "公开站 + v0.1 协议骨架",
    zone: "technology",
    audience: "公众 / 体系设计者",
    problem: "跨空间如何保存脉络、形成意图、配置权限，并用证据确认结果。",
    statuses: ["LIVE_VERIFIED", "PROTOTYPE"],
    capabilities: ["mingos.cn 公开站", "Space / Actor / Context Ledger", "Intent / Authorization", "Evidence / Continuity Bundle"],
    limits: "公开站不是运行时；v0.1 默认冻结；不宣称是其他系统的底层基础设施。",
    links: [
      { label: "打开 mingos.cn", href: "https://mingos.cn" },
      { label: "看证据", internal: "/evidence" },
    ],
  },
];

export const FSO_SCENARIOS = [
  {
    index: "01",
    title: "首次咨询结束，家庭不知道接下来怎么办",
    body: "谈话发生了，但下一步行动、谁负责、什么时候回看，都没有留在同一个地方。",
  },
  {
    index: "02",
    title: "不同导师对同一个家庭掌握的信息不一致",
    body: "每个人都在帮忙，但事实、理解和承诺散落在不同人的记忆与聊天记录里。",
  },
  {
    index: "03",
    title: "家长获得了建议，但没有持续支持",
    body: "建议在当下成立，生活一变就失效；没有人把后来发生的事带回服务过程。",
  },
  {
    index: "04",
    title: "机构无法清楚看见服务到底发生了什么",
    body: "经营者看到的是结果和感觉，很难看见过程里的断点、风险和可复用的经验。",
  },
];

export const SERVICE_LOOP = [
  { step: "01", title: "首次咨询", body: "先听清楚家庭带来的具体问题，不急着给方案。" },
  { step: "02", title: "事实与需求整理", body: "把事实、家庭自己的解释、专业推测和未知分开记录。" },
  { step: "03", title: "专业人员确认", body: "由承担专业责任的人确认理解与边界，再决定下一步。" },
  { step: "04", title: "家庭行动计划", body: "把下一步写成家庭能执行、导师能跟进的具体行动。" },
  { step: "05", title: "导师跟进", body: "在真实生活里观察行动发生了什么，而不是只问「有没有照做」。" },
  { step: "06", title: "阶段复盘", body: "回看事实、行动与结果，允许原来的理解被修正。" },
  { step: "07", title: "修正下一阶段支持", body: "根据复盘调整支持强度、角色与目标，进入下一轮。" },
];

export const SERVICE_OFFERS = [
  {
    name: "服务断点诊断",
    body: "沿着咨询、交付、跟进、复盘四个环节，找出家庭服务最容易断掉的位置。",
    form: "诊断工作坊 + 断点清单",
  },
  {
    name: "首咨后的 7 天跟进设计",
    body: "把首次咨询结束后的七天，设计成家庭能执行、导师能接手的连续动作。",
    form: "流程设计 + 跟进模板",
  },
  {
    name: "导师工作流",
    body: "让不同导师看到同一组事实、责任与家庭承诺，减少交接损耗。",
    form: "角色分工 + 交接规则",
  },
  {
    name: "30 天机构试点",
    body: "在一个真实服务小组里跑一轮闭环，用过程证据判断哪些设计值得保留。",
    form: "试点陪跑 + 阶段复盘",
  },
];

export const EXPERT_EVIDENCE = [
  { label: "场景库", value: "15 类", note: "场景样本、话术体系、分阶段干预、孩子状态库" },
  { label: "Agent 层", value: "6 + 1 + 2", note: "6 个已启用、1 个部分启用、2 个因缺内容刻意不建" },
  { label: "Skill", value: "6 个", note: "风险分诊、问题分型、家长画像、干预路径、话术、案例转资产" },
  { label: "判据", value: "F01–F05", note: "其中 F05 专门测「该不该说」，而不只是「说得好不好」" },
];

export const EXPERT_FIXES = {
  fixed: [
    "风险分诊与转介话术冲突：安全处置与转介话术改由风险分诊自己提供，禁令收窄为「不得生成教育处置类内容」。",
    "安全门从未被任何判据测过：新增 F05，用「看起来非常专业」的 mutation 样本验证系统会在该停时停。",
  ],
  open: [
    "转介资源库为空：各地热线会变化，系统目前只输出「当地心理危机干预热线」，未凭记忆写死号码。",
    "总质检闸残缺：被指定为「输出前必过」的规则库缺第四模块，且部分要求会与安全门冲突。",
  ],
};

export const LRDF_ITEMS = [
  { title: "理论核心", body: "生命承接 → 能动恢复 → 生命成熟。不是固定阶段，也不是三道必经关口；人可以回退，也可以重新需要承接。" },
  { title: "研究问题", body: "在真实家庭处境里，什么样的理解与行动能让人重新拥有下一步，而不是先符合某个标准。" },
  { title: "证据来源", body: "真实实践、心理学与发展科学、教育学、行为科学、精神医学、社会学、哲学与伦理学等持续审查。" },
  { title: "竞争解释", body: "同一变化可能来自关系、环境、时间或偶然事件；理论必须允许竞争解释，而不是只收集支持自己的材料。" },
  { title: "待验证假设", body: "概念与命题保留证据状态；不把作者提出的方法写成已被证明的普遍规律。" },
];

export const BOOK_ITEMS = [
  { title: "为什么写", body: "父母在真实生活里面对的往往不是知识不足，而是看不清当下发生了什么、不知道该不该伸手。" },
  { title: "面向谁", body: "家长、同行与研究者。家长拿到「今天可以试的一件事」，同行看到判断链，研究者看到证据与反例。" },
  { title: "核心问题", body: "先看清：事实、解释、推测与未知分开；再伸手：在边界内做一个可观察、可修正的下一步。" },
  { title: "理论与实践", body: "以现行 LRDF 为思想主线，同时保留第一代九层的历史原貌；两代理论分开呈现。" },
];

export const LAB_STEPS = [
  { title: "真实问题", body: "从家长原话和真实生活事件进入，不先加工成「案例」。" },
  { title: "可研究的问题", body: "把模糊的困扰转成可以观察、可以反驳的问题。" },
  { title: "可验证的假设", body: "写清楚我们以为什么、依据是什么、什么情况下算错。" },
  { title: "可观察的证据", body: "保留原话、行动与后来发生的变化，区分事实、解释与评论。" },
  { title: "可修正的方法", body: "把现实反馈带回 Family Space 与专业方法，允许下一轮修改。" },
];

export const AGENT_CAPABILITIES = [
  { name: "需求理解", state: "practice", note: "先把真实目标、约束与不做什么写清楚，再进入执行。" },
  { name: "能力发现", state: "practice", note: "用真源地图与能力目录找到世界上已经存在的能力，而不是从零造。" },
  { name: "现有资源借用", state: "practice", note: "Resource First：能借就借，能换就换，不把自建当成默认答案。" },
  { name: "多 Agent 协作", state: "practice", note: "按角色拆分写作、实现、独立核验与裁决，减少单点自证。" },
  { name: "执行与验证", state: "practice", note: "把改动送到真实运行、测试与现实路径里，而不是停在文档。" },
  { name: "结果交付", state: "practice", note: "以公开入口、可访问页面与可复核证据作为交付，而不是「已完成」的口头结论。" },
  { name: "经验沉淀", state: "partial", note: "经验写回仓库与交接文档，但还没有形成可复用的产品能力。" },
  { name: "根据现实变化调整", state: "partial", note: "已有修订与回滚实践；持续调整仍依赖具体项目，而非统一机制。" },
];

export const AGENT_CASES = [
  {
    index: "01",
    title: "Family Space：把真实使用带回发布",
    problem: "真实家庭使用暴露出记录生命周期、隐私边界与连续性的问题，不能靠演示页面判断。",
    borrowed: "沿用现有 runtime、部署清单与独立核验流程，不另起一套系统。",
    executed: "在发布分支完成收敛，2026-11-02 生产上线。",
    tested: "用部署身份、公开入口与独立检查确认上线对象；测试通过不替代家庭现场验证。",
    found: "真实使用的边界问题需要按记录生命周期逐项处理，不能只修可见页面。",
    fixed: "把修正与回滚锚点留在发布记录里；线上 runtime 身份以部署清单为准。",
    delivered: "ymai.love 继续作为公开入口，登录后能力与真实家庭数据不对外展示。",
  },
  {
    index: "02",
    title: "World Space：从「工具大全」改成「你想做什么」",
    problem: "普通人面对大量 AI 工具，不知道从哪开始；列工具清单并没有让人真正开始。",
    borrowed: "借用世界上已有的免费、中文、手机可用的工具，不重新开发基础设施。",
    executed: "把首页改成 7 个目标入口；每个入口给默认工具、第一步、限制与现实结果。",
    tested: "逐入口审计「打开工具」和「现实里出现结果」的区别。",
    found: "打开一个工具，不等于事情做成；需要把「做到什么算开始」写清楚。",
    fixed: "新增行动-现实回路、失败说明与资源 90 天复核要求。",
    delivered: "ymai.fun 作为公开入口；第三方工具的可用性不由本站保证。",
  },
  {
    index: "03",
    title: "Expert OS：第一次真跑，发现安全门没有判据",
    problem: "系统看起来结构完整，但从未拿真实形态的复合案例跑完整链路。",
    borrowed: "用现有场景库、Skill 与规则引擎，不先扩建新平台。",
    executed: "2026-09-29 用合成复合案例逐步执行一条完整判断链路，记录断链位置。",
    tested: "发现风险分诊与转介话术冲突，且安全门从未被任何判据测过。",
    found: "「说得好不好」的测试全绿，也不能证明系统在该停时会停。",
    fixed: "修复上述问题并新增 F05；保留转介资源与总质检闸两项未关闭问题。",
    delivered: "系统进入 VALIDATION，而不是对外宣称可商用。",
  },
  {
    index: "04",
    title: "MingOS：把「跨空间」缩回可验证的骨架",
    problem: "跨空间协议很容易膨胀成平台叙事，但没有证据证明三个空间需要统一运行时。",
    borrowed: "保留已核实的公共语义，借用现有仓库与文档，不新建大平台。",
    executed: "v0.1 只做 Space、Actor、Context Ledger、Intent、Authorization、Evidence、Continuity Bundle。",
    tested: "用 Continuity Bundle CLI 验证交接包完整性与可恢复性。",
    found: "没有重复的真实失败能证明跨空间运行时的必要性。",
    fixed: "2026-09-25 起默认冻结，不扩建平台抽象。",
    delivered: "公开站继续解释三种关系；v0.1 作为原型保留，不宣称底层基础设施。",
  },
];

export const PARTNER_TYPES = [
  {
    id: "institution",
    label: "家庭教育机构",
    headline: "从一次真实服务断点开始",
    body: "不先承诺整套系统。先看一次首咨后的跟进、一次导师交接或一次阶段复盘，找出最值得修的一个断点。",
    offer: "服务断点诊断 / 7 天跟进设计 / 导师工作流 / 30 天试点",
  },
  {
    id: "professional",
    label: "专业工作者",
    headline: "一起检验专业判断能不能被复用",
    body: "把真实判断链拿出来，区分事实、推测与未知；先做小样本的可复现验证，不把个人经验直接包装成产品。",
    offer: "专业判断路径梳理 / 案例复盘 / 同行可用性测试",
  },
  {
    id: "technology",
    label: "技术伙伴",
    headline: "把 AI 与 Agent 接到真实业务里",
    body: "从具体任务开始：哪些能力该借、哪些该自建、怎样验证结果真的发生，而不是先做一个通用平台。",
    offer: "能力选型 / Agent 协作流程 / 执行与验证设计",
  },
  {
    id: "research",
    label: "研究伙伴",
    headline: "让真实家庭问题进入可检验的研究",
    body: "儿童发展、家庭关系与教育实践的研究，需要真实问题、竞争解释与可修正的证据，而不是只收集支持结论的材料。",
    offer: "问题转化 / 研究设计 / 证据与边界审查",
  },
  {
    id: "resource",
    label: "资源与投资伙伴",
    headline: "看见资产、关系与仍在验证的部分",
    body: "我们更愿意先对齐已经做出来的产品、真实入口与未完成的风险，再讨论长期建设，而不是先讲一个宏大的结果。",
    offer: "产品与证据浏览 / 阶段对齐 / 长期建设讨论",
  },
];

export const EVIDENCE_RULES = [
  "测试通过不等同于真实用户验证。",
  "代码接受不等同于部署上线。",
  "原型不等同于正式产品。",
  "研究假设不等同于已证实结论。",
  "证据必须分层标注：公开可核、内部留档、待补；内部记录不对外披露原文、链接或文件名。",
  "不向公众暴露私有仓库、密钥、家庭隐私或内部安全实现细节。",
];

export const EVIDENCE_LAYERS = [
  {
    id: "public",
    title: "公开可核",
    description: "任何人都能独立打开或对照的公开页面与公开截图。",
  },
  {
    id: "internal",
    title: "内部留档",
    description: "代码验收、部署、研究记录，以及不附公开链接的核验记录；只说明存在与结论，不公开链接、原文或文件名。",
  },
  {
    id: "pending",
    title: "待补",
    description: "当前无法诚实展示、等待独立修复或后续复核的证据；不拿替代图或推测补位。",
  },
] as const;

export const MAP_AGGREGATION_NOTE =
  "体系图收录 10 个节点；证据页收录 14 条项目记录。差异来自：MingOS 公开站与 v0.1 协议骨架合并为 1 个节点；WeCom 入口归入 Family Space；机构服务方案归入 Family Service OS；“统一连续体验”是未实现方向，未画成节点。";
