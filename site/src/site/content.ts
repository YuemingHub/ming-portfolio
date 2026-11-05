import type { MapNode, MapZone, Project, Status, StatusMeta } from "./types";

const VERIFIED_AT = "2026-11-02"; // 改这个日期 = 声明 14 条都在那天重核过；未重核不许改

export const SITE = {
  name: "YUE MING ECOSYSTEM",
  title: "让生命与世界更好地连接",
  version: "2026.11",
  verifiedAt: VERIFIED_AT,
  canonical: "https://ymai.me/",
  selfSpace: "https://ymai.me/gui/",
  legacy: "https://ymai.fun/ming/",
  backup: "https://yueminghub.github.io/ming-portfolio/",
  note: `项目状态以 ${VERIFIED_AT} 核对过的公开页面和仓库记录为准。没有标 LIVE_VERIFIED 的能力，不当作已经上线。`,
};

export const CONTACT = {
  email: "mingos2026@163.com",
  douyin: { name: "Ming", id: "YMHomeLink", image: "/media/contact-douyin.png" },
  wechat: { image: "/media/contact-wechat.jpg" },
  channel: "GitHub Issues",
  url: "https://github.com/YuemingHub/ming-portfolio/issues/new",
  note: "抖音、公众号与邮箱都能找到我们。",
};

export const STATUS_META: Record<Status, StatusMeta> = {
  LIVE_VERIFIED: {
    label: "LIVE_VERIFIED",
    zh: "公开页已确认",
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
    description: "已经在真实或模拟场景里试用，但还有没验完的地方。",
    tone: "validation",
  },
  RESEARCH: {
    label: "RESEARCH",
    zh: "研究 / 理论探索",
    description: "属于研究、写作或理论探索，不是已经证实的结论，也不是已经发布的产品。",
    tone: "research",
  },
  HOLD: {
    label: "HOLD",
    zh: "还不能发布",
    description: "还有没解决的问题挡在前面，现在不能说它可用。",
    tone: "hold",
  },
  PLANNED: {
    label: "PLANNED",
    zh: "尚未实现",
    description: "只有方向或设计，还没有能拿出来核对的东西。",
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
    capability: "今天、我家、回望、我的四个生活入口；重要的事记得住，说错了也能改。",
    status: "LIVE_VERIFIED",
    evidence: [
      { label: "ymai.love 公开页", kind: "public", href: "https://ymai.love" },
      { label: "公开页文字：今天 / 我家 / 回望 / 我的", kind: "measurement" },
      { label: "桌面端实拍截图", kind: "screenshot", href: "/media/ymai-love.png" },
      { label: "部署对象与线上版本：已核对", kind: "private-doc" },
    ],
    verified: VERIFIED_AT,
    limits: "登录后的家庭页面与真实家庭数据不在本站展示；企业微信入口这次没有核对线上是否可用。",
    publicUrl: "https://ymai.love",
    route: "/spaces#family",
  },
  {
    id: "self-space",
    name: "Self Space",
    en: "自我空间 · ymai.me",
    audience: "个人",
    capability: "公开页描述：说出来、留下、回来——可以说话，关掉窗口不会丢，以后还能回来。",
    status: "LIVE_VERIFIED",
    evidence: [
      { label: "Self Space 公开页", kind: "public", href: "https://ymai.me/gui/" },
      { label: "公开页文字：说出来 / 留下 / 回来", kind: "measurement" },
      { label: "Self Space 真实线上截图（2026-11-03）", kind: "screenshot", href: "/media/ymai-self.png" },
      { label: "公开入口访问问题的修复记录", kind: "private-doc" },
      { label: "生产部署与回滚记录", kind: "private-doc" },
    ],
    verified: VERIFIED_AT,
    limits: "公开入口在 2026-11-03 重新核对过。登录后的对话和长期记忆这次没有账号，没法核对，所以不对登录后的体验下结论。",
    publicUrl: "https://ymai.me/gui/",
    route: "/spaces#self",
  },
  {
    id: "world-space",
    name: "World Space",
    en: "世界空间 · ymai.fun",
    audience: "零基础成人、孩子与家长",
    capability: "7 个「你想做什么事」目标入口；每个目标都写清默认工具、第一步、限制，以及现实里应该看到什么。",
    status: "LIVE_VERIFIED",
    evidence: [
      { label: "ymai.fun 公开页", kind: "public", href: "https://ymai.fun" },
      { label: "公开页文字：7 个目标 + 三步上手", kind: "measurement" },
      { label: "桌面端实拍截图", kind: "screenshot", href: "/media/ymai-fun.png" },
      { label: "产品契约与行动—现实回路记录", kind: "private-doc" },
    ],
    verified: VERIFIED_AT,
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
      { label: "公开页文字：三种关系 + 三个入口", kind: "measurement" },
      { label: "桌面端实拍截图", kind: "screenshot", href: "/media/mingos-cn.png" },
    ],
    verified: VERIFIED_AT,
    limits: "公开站只讲理念和指路，本身不是运行系统。三个空间现在没有统一登录，也不共享数据或记忆。",
    publicUrl: "https://mingos.cn",
    route: "/ecosystem",
  },
  {
    id: "family-service-os",
    name: "Family Service OS",
    en: "机构服务系统",
    audience: "家庭教育 / 家庭咨询机构的咨询师、主管、经营者",
    capability: "咨询师的家庭工作台、主管今天该介入谁、经营者的整体服务状况；用模拟数据把服务流程跑通。",
    status: "CODE_ACCEPTED",
    evidence: [
      { label: "代码评审与合成数据验收记录", kind: "private-doc" },
      { label: "攻击、权限、生命周期、恢复等多组测试记录", kind: "private-doc" },
      { label: "真实数据与生产使用：都还没有开始", kind: "private-doc" },
    ],
    verified: VERIFIED_AT,
    limits: "代码审查已通过（用的是模拟数据），但还没部署、没合进主线，也没接真实机构数据。测试通过，不等于在机构现场验证过。",
    route: "/institution",
  },
  {
    id: "expert-os",
    name: "Yueming Expert OS",
    en: "专业判断辅助系统",
    audience: "专业工作者",
    capability: "15 类场景库、6 个已启用 Agent、6 个 Skill、安全这一关和 F01–F05 检查项。",
    status: "VALIDATION",
    evidence: [
      { label: "系统结构与真实启用数量：已核对", kind: "private-doc" },
      { label: "复合案例真跑记录（2026-09-29）", kind: "private-doc" },
      { label: "风险分级与安全这一关的问题：已修复", kind: "private-doc" },
      { label: "转介资源与最后一道质量检查：仍未解决", kind: "private-doc" },
    ],
    verified: VERIFIED_AT,
    limits: "还不能独立对外商用；同行能不能用、换案例稳不稳，都还没验证完；它不替代专业判断和责任。",
    route: "/expert-and-research#expert-os",
  },
  {
    id: "wecom-channel",
    name: "Family Space · WeCom 入口",
    en: "企业微信服务入口",
    audience: "家庭",
    capability: "在企业微信服务群里 @家明 就能说话；这次聊的、长期记得的事、当下的理解，分三层保存，不混在一起。",
    status: "CODE_ACCEPTED",
    evidence: [
      { label: "入口定位与三层记忆边界：已核对", kind: "private-doc" },
      { label: "服务关系记录：AI 一直在场，真人才是负责的人", kind: "private-doc" },
      { label: "服务群线上是否可用、真实家庭怎么接进来：本轮未核对", kind: "pending" },
    ],
    verified: VERIFIED_AT,
    limits: "这次没有核对服务群线上能不能用，也没有核对真实家庭是怎么接进来的；任何家庭对话或记忆内容都不公开。",
  },
  {
    id: "lrdf",
    name: "LRDF",
    en: "生命恢复与发展体系",
    audience: "专业者、研究者",
    capability: "生命承接 → 能动恢复 → 生命成熟；整套理论分六层：体系正文、概念、命题、方法、现实研究、治理。",
    status: "RESEARCH",
    evidence: [
      { label: "六层结构、三种知识来源与依据等级：已核对", kind: "private-doc" },
      { label: "资料治理规则：仓库不保存原始家庭咨询资料", kind: "private-doc" },
    ],
    verified: VERIFIED_AT,
    limits: "理论还在验证，不是科学界的共识；它不是诊断工具，也不能替代医疗或心理治疗。",
    route: "/expert-and-research#lrdf",
  },
  {
    id: "book",
    name: "《先看清，再伸手》",
    en: "家长读本",
    audience: "父母、同行、研究者",
    capability: "把 LRDF 写成家长读得懂的一本书；四部十一章加结语，主线是现在这一版 LRDF，两代理论分开讲。",
    status: "RESEARCH",
    evidence: [
      { label: "作者审阅稿记录（2026-10-27）", kind: "private-doc" },
      { label: "读者、边界与「不是什么」记录", kind: "private-doc" },
    ],
    verified: VERIFIED_AT,
    limits: "现在是完整的作者审阅稿，还没出版，作者终审和独立的专业审查都还没做完。文件检查代替不了读者读完之后的检验。",
    route: "/expert-and-research#book",
  },
  {
    id: "reality-lab",
    name: "Family Reality Lab",
    en: "真实问题与公开现实测试",
    audience: "研究、内容与产品改进",
    capability: "家长的原话 → AI 直接回答（不修饰）→ 月明观察 → 公开写出来 → 看现实反馈 → 回到 Family Space 改进。",
    status: "RESEARCH",
    evidence: [
      { label: "期数记录 13 份（001–007、009–014）", kind: "private-doc" },
      { label: "问题清单：家长原话、分类、进度与期数", kind: "private-doc" },
      { label: "材料使用规则：原话、提炼和公开评论分开标注", kind: "private-doc" },
      { label: "各期内容实际公开到哪一步：本轮未核对", kind: "pending" },
    ],
    verified: VERIFIED_AT,
    limits: "这些内容公开到了哪一步，这次没有核对；原始家庭资料不上网；这项研究不能当作效果证明。",
    route: "/expert-and-research#lab",
  },
  {
    id: "agent-space",
    name: "Agent Space",
    en: "长期协作工作空间",
    audience: "Agent、协作者、项目现场",
    capability: "四种工作方法：怎么进场、怎么把现实问题拆开、怎么交接上下文、怎么借用外部能力。",
    status: "VALIDATION",
    evidence: [
      { label: "工作方法边界：四个职责各管什么、不碰什么", kind: "private-doc" },
      { label: "真实项目里的多轮执行、独立检查和发布记录", kind: "private-doc" },
    ],
    verified: VERIFIED_AT,
    limits: "它不是一个能交付的软件产品，也不是运行平台；这些能力大多还是工作方法和协作习惯，还没有做成产品。",
    route: "/agent-space",
  },
  {
    id: "mingos-protocol",
    name: "MingOS v0.1",
    en: "跨空间协议骨架",
    audience: "体系设计者、研究者",
    capability: "七类公共骨架：空间、参与者、上下文账本、意图约定、任务与授权、证据与交接、连续性包。",
    status: "PROTOTYPE",
    evidence: [
      { label: "v0.1 范围与明确不做", kind: "private-doc" },
      { label: "交接包的完整性与恢复记录", kind: "private-doc" },
      { label: "版本状态：默认停在这里（2026-09-25）", kind: "private-doc" },
    ],
    verified: VERIFIED_AT,
    limits: "它不是三个空间底下那层运行系统，也没有在真实业务里用过；现在默认停在这里，不再往上加新的平台概念。",
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
    verified: VERIFIED_AT,
    limits: "这是一种试销中的设想，还不是验证过的标准产品；价格和交付范围按每家机构的实际情况单独谈，本站不公开报价。",
    route: "/institution#offers",
  },
  {
    id: "unified-continuity",
    name: "三个空间的统一连续体验",
    en: "统一登录 / 共享数据 / 共享记忆",
    audience: "跨空间用户",
    capability: "只是提出了一个方向：同一个人在三个空间之间走来走去，不用把话再讲一遍。",
    status: "PLANNED",
    evidence: [
      { label: "没有统一登录，不共享数据，也不共享记忆、上下文或运行系统", kind: "measurement" },
    ],
    verified: VERIFIED_AT,
    limits: "这些都还没有做；本站也不会把三个空间画成已经连在一起。",
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
    capabilities: ["今天 / 我家 / 回望 / 我的", "重要的事被记住", "理解错了可以纠正", "企业微信入口（代码已通过，线上这次没核对）"],
    limits: "登录后的家庭页面和真实家庭数据，都不在本站展示。",
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
    capabilities: ["公开页：说出来", "公开页：留下（关掉窗口不会丢）", "公开页：回来（以后还能看见）"],
    limits: "它不是心理咨询网站，也不是人生导师；登录后的样子这次没有公开核对。",
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
    problem: "课程、导师和咨询经验很难串成一条连续的服务，也很难复查和改进。",
    statuses: ["CODE_ACCEPTED"],
    capabilities: ["咨询师：我的家庭 / 个案工作台", "主管：今天需要我介入的人", "经营者：经营与服务整体状况"],
    limits: "还没上线、还没合进主线，真实数据和生产使用都还没开始。",
    links: [{ label: "看机构服务", internal: "/institution" }],
  },
  {
    id: "expert",
    name: "Yueming Expert OS",
    en: "专业判断辅助",
    zone: "service",
    audience: "专业工作者",
    problem: "专业知识、经验和判断方法，需要变成能检查、也能改的辅助工具。",
    statuses: ["VALIDATION"],
    capabilities: ["15 类场景库", "6 个启用 Agent + 1 个部分 + 2 个刻意不建", "6 个 Skill", "F01–F05 五项检查"],
    limits: "转介资源和最后一道质量检查还有未关闭的问题；同行能不能用还没验证；它不是自动咨询系统。",
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
    capabilities: ["生命承接 → 能动恢复 → 生命成熟", "六层结构：正文 / 概念 / 命题 / 方法 / 研究 / 治理", "三种知识来源分开登记"],
    limits: "理论仍在验证，不是科学共识；不替代医疗与心理治疗。",
    links: [{ label: "读 LRDF", internal: "/expert-and-research#lrdf" }],
  },
  {
    id: "lab",
    name: "Family Reality Lab",
    en: "真实问题实验室",
    zone: "knowledge",
    audience: "研究、内容与产品改进",
    problem: "真实的家庭问题，怎么变成能研究、能观察、也能被现实推翻的材料。",
    statuses: ["RESEARCH"],
    capabilities: ["家长的原话", "13 份期数记录", "原话、提炼和评论分开", "现实反馈回到产品"],
    limits: "公开到了哪一步这次没核对；原始家庭资料不上网。",
    links: [{ label: "看研究", internal: "/expert-and-research#lab" }],
  },
  {
    id: "book",
    name: "《先看清，再伸手》",
    en: "家长读本",
    zone: "knowledge",
    audience: "父母、同行、研究者",
    problem: "把 LRDF 的判断方法写成普通家长能读、能用的一本书。",
    statuses: ["RESEARCH"],
    capabilities: ["家长可读的 LRDF 载体", "四部十一章及结语", "以现行 LRDF 为思想主线", "作者审阅稿持续修订"],
    limits: "完整作者审阅稿；未出版，作者终审与独立专业审查未完成。",
    links: [{ label: "看家长读本", internal: "/expert-and-research#book" }],
  },
  {
    id: "agent",
    name: "Agent Space",
    en: "连接与执行",
    zone: "execution",
    audience: "普通人、专业人士、组织",
    problem: "怎样更省力地借用世界上已有的 AI、工具、知识和真实资源。",
    statuses: ["VALIDATION"],
    capabilities: ["怎么进场", "把现实问题拆开", "交接上下文", "借用外部能力"],
    limits: "不是软件产品，也不是运行平台；这些能力还没有做成产品。",
    links: [{ label: "了解 Agent Space", internal: "/agent-space" }],
  },
  {
    id: "mingos",
    name: "MingOS",
    en: "公开站 + v0.1 协议骨架",
    zone: "technology",
    audience: "公众 / 体系设计者",
    problem: "跨空间怎样记住来龙去脉、说清要做什么、划清谁能做什么，再拿证据确认结果。",
    statuses: ["LIVE_VERIFIED", "PROTOTYPE"],
    capabilities: ["mingos.cn 公开站", "空间 / 参与者 / 上下文账本", "意图 / 授权", "证据 / 连续性包"],
    limits: "公开站只是一处讲清楚的地方，不是运行系统；v0.1 已经停在这里；也不说它是别的系统最底下的那层。",
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
    body: "经营者看到的是结果和感觉，很难看见过程里的断点、风险，以及以后还能用的经验。",
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
    body: "在一个真实服务小组里完整跑一轮，看哪些设计值得留下、哪些要改。",
    form: "试点陪跑 + 阶段复盘",
  },
];

export const EXPERT_EVIDENCE = [
  { label: "场景库", value: "15 类", note: "场景样本、可以照着说的话、分阶段应对、孩子状态怎么记" },
  { label: "Agent 层", value: "6 + 1 + 2", note: "6 个已启用，1 个做了一半，2 个因为还没内容，想清楚后决定不做" },
  { label: "Skill", value: "6 个", note: "看风险、分清问题类型、了解家长处境、给干预路径、准备话术、把案例整理成以后还能用的东西" },
  { label: "检查项", value: "F01–F05", note: "F05 专门检查「这句话该不该说」，不只是「说得好不好」" },
];

export const EXPERT_FIXES = {
  fixed: [
    "风险分级和转介话术会打架：现在由风险分级自己给出安全处置和转介说法，禁令收窄为「不生成教育处置类内容」。",
    "安全这一关从来没人检查过：新增 F05，用「看起来很专业、其实该停」的样本，看系统会不会在该停的时候停下来。",
  ],
  open: [
    "可以转给谁、打哪个电话，这份名单还是空的：各地热线会变，系统现在只写「当地心理危机干预热线」，不凭记忆写死号码。",
    "最后一道质量检查不完整：本来规定「输出前必须过」的规则少了第四部分，而且有些要求会和「安全」这一关打架。",
  ],
};

export const LRDF_LAYERS = [
  { title: "体系正文", en: "framework", body: "理论正文只有这一份底本；其他文件都引用它，不另说一套。" },
  { title: "原创概念", en: "concepts", body: "把核心词的定义、边界，和容易混淆的相近说法分清。" },
  { title: "命题总账", en: "propositions", body: "一条条记下判断、现在有多少依据、还不能推出什么；遇到反例就改。" },
  { title: "方法", en: "methods", body: "从判断到行动怎么走、什么情况下适用、什么时候该停。" },
  { title: "现实研究", en: "reality-research", body: "真实的材料、反例、失败的做法和现实反馈；现实可以推翻理论。" },
  { title: "治理", en: "governance", body: "规定依据怎么分级、对外怎么说、哪些不能公开、版本怎么记。" },
];

export const LRDF_SOURCES = [
  { title: "科学证据", body: "帮我们判断什么更可能是真的、依据有多强、对谁适用；也提醒我们别把猜测说成事实。" },
  { title: "人类智慧", body: "来自哲学、伦理和人文传统，帮我们继续想「什么叫人」；它是理解人的一副眼镜，不假装自己是实验科学。" },
  { title: "月明现实经验", body: "真实家庭里到底发生了什么：原话、动作、反馈，还有失败的时候。现实可以否决理论，不能让理论硬套在人身上。" },
];

export const LRDF_LADDER = [
  { system: "生命承接", parent: "先接住", body: "先别让生命继续被耗；先看安全、身体和生活有没有乱掉。" },
  { system: "能动恢复", parent: "再动起来", body: "孩子不动，不是一个「原因」，而是一个信号；先弄清卡在哪，再找到他愿意迈出的下一步。" },
  { system: "生命成熟", parent: "学会长大", body: "恢复不是重新听话，而是把生活一点点交回他自己手里。" },
];

export const BOOK_ITEMS = [
  { title: "为什么写", body: "父母在真实生活里遇到的，往往不是懂得太少，而是看不清当下发生了什么、不知道这时该不该伸手。" },
  { title: "面向谁", body: "家长、同行与研究者。家长拿到「今天可以试的一件事」，同行看到判断怎么走，研究者看到依据与反例。" },
  { title: "核心问题", body: "先看清：把事实、解释、猜测和还不知道的分开；再伸手：在边界内做一步能看见结果、也能改的事。" },
  { title: "在体系里的位置", body: "把 LRDF 带到普通家长手里的读本，不是第二套理论；第一代九层的样子照原样保留，两代理论分开讲。" },
];

export const LAB_STEPS = [
  { title: "真实问题", body: "从家长的原话和真实生活里的事开始，不先加工成「案例」。" },
  { title: "可研究的问题", body: "把一句模糊的苦恼，变成一个能观察、也能被推翻的问题。" },
  { title: "可验证的假设", body: "写清楚我们以为什么、凭什么、什么情况算我们错了。" },
  { title: "可观察的证据", body: "保留原话、做过的事和后来发生的变化，分清事实、解释和评论。" },
  { title: "可修正的方法", body: "把现实反馈带回 Family Space 和专业方法里，下一次允许改。" },
];

export const AGENT_CAPABILITIES = [
  { name: "需求理解", state: "practice", note: "先把真实目标、限制和不做什么写清楚，再开始动手。" },
  { name: "能力发现", state: "practice", note: "先查清世界上已经有哪些现成的东西，能用的不自己重做。" },
  { name: "现有资源借用", state: "practice", note: "能借就借，能换就换，不把「自己造」当成默认答案。" },
  { name: "多 Agent 协作", state: "practice", note: "写作、动手做、独立检查和最后拍板分开给不同角色，尽量不让自己证明自己。" },
  { name: "执行与验证", state: "practice", note: "真的跑起来、真的用一遍，而不是停在纸面上。" },
  { name: "结果交付", state: "practice", note: "交付看的是能打开的入口、能看到的页面和能复查的记录，不是一句「已完成」。" },
  { name: "经验沉淀", state: "partial", note: "经验会写回仓库和交接文档，但还没有变成能重复使用的产品功能。" },
  { name: "根据现实变化调整", state: "partial", note: "改错了会退回上一版，但每次调整还是看具体项目，没有统一的做法。" },
];

export const AGENT_CASES = [
  {
    index: "01",
    title: "Family Space：把真实使用带回发布",
    problem: "真正有家庭在用之后，才看出记录保存多久、隐私边界和前后连不上的问题；只看演示页面发现不了。",
    borrowed: "沿用现有的运行系统、发布清单和独立检查流程，不另起一套。",
    executed: "在发布分支上把问题收完，2026-11-02 正式上线。",
    tested: "用部署账号、公开入口和独立检查确认上的是这一版；测试通过，不等于家庭现场没问题。",
    found: "真实使用里冒出来的问题，要按每条记录从产生到删除逐项处理，不能只修看得见的页面。",
    fixed: "修正和回滚的依据都留在发布记录里；线上跑的是哪一版，以发布清单为准。",
    delivered: "ymai.love 继续作为公开入口；登录后的功能和真实家庭数据不对外展示。",
  },
  {
    index: "02",
    title: "World Space：从「工具大全」改成「你想做什么」",
    problem: "普通人面对大量 AI 工具，不知道从哪开始；列一张工具清单，并没有让人真正开始。",
    borrowed: "借用世界上已有的、免费、中文、手机上就能用的工具，不重新搭一套基础系统。",
    executed: "把首页改成 7 个目标入口；每个入口给一个默认工具、第一步、限制和现实里会出现的结果。",
    tested: "逐个入口去分「打开了工具」和「现实里真的做成了」。",
    found: "打开一个工具，不等于事情做成；需要把「做到什么算开始」写清楚。",
    fixed: "加了「行动之后现实里发生了什么」这一环、失败时怎么办，以及推荐资源每 90 天复查一次。",
    delivered: "ymai.fun 作为公开入口；第三方工具能不能用，不由本站保证。",
  },
  {
    index: "03",
    title: "Expert OS：第一次真跑，发现「什么时候该停」没人测过",
    problem: "系统看着结构很全，但从来没有拿一个像真实情况的复杂案例，从头到尾跑一遍。",
    borrowed: "用现成的场景库、Skill 和规则引擎，不先扩一个新平台。",
    executed: "2026-09-29 拿一个编的复杂案例，一步一步走完整条判断路线，记下哪里断了。",
    tested: "发现风险分级和转介说法互相打架，而且「什么时候该停」这一关，从来没有被任何检查测过。",
    found: "「说得好不好」的检查全绿，也不能证明系统在该停的时候会停。",
    fixed: "修了上面两处，并新增 F05 检查；转介资源和最后一道质量检查这两项，仍未关闭。",
    delivered: "系统停在验证中，没有对外说它可以商用。",
  },
  {
    index: "04",
    title: "MingOS：把「跨空间」缩回到能核对的范围",
    problem: "跨空间的协议很容易越写越大，变成一套平台故事；但没有证据说明三个空间真的需要同一套运行系统。",
    borrowed: "只留下核对过的共同说法，用现有的仓库和文档，不新建一个大平台。",
    executed: "v0.1 只做七样：空间、参与者、上下文账本、意图、任务与授权、证据与交接、连续性包。",
    tested: "用一个命令行工具检查交接包是不是完整、能不能恢复。",
    found: "没有反复出现的真实失败，能说明跨空间的运行系统是必要的。",
    fixed: "从 2026-09-25 起默认停下，不再加新的平台概念。",
    delivered: "公开站继续解释这三种关系；v0.1 只作为原型留着，不说它是别的系统最底下的一层。",
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
    headline: "一起检验专业判断能不能被别人接着用",
    body: "把一个真实的判断过程摊开，分清哪些是事实、哪些是推测、哪些还不知道；先用几个小案例试，看别人能不能重复，不把个人经验直接包装成产品。",
    offer: "专业判断过程梳理 / 案例复盘 / 请同行试用",
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
    body: "儿童发展、家庭关系和教育实践的研究，要从真实问题出发，认真对待别的解释，证据要能推翻自己，而不是只找支持结论的材料。",
    offer: "把问题变成研究题目 / 研究设计 / 证据与边界审查",
  },
  {
    id: "resource",
    label: "资源与投资伙伴",
    headline: "看见资产、关系与仍在验证的部分",
    body: "比起先讲一个宏大的结果，我们更愿意先把做出来的产品、真实的入口和还没解决的风险摆出来，再谈长期建设。",
    offer: "看产品和证据 / 对现状 / 谈长期建设",
  },
];

export const EVIDENCE_RULES = [
  "测试通过不等同于真实用户验证。",
  "代码接受不等同于部署上线。",
  "原型不等同于正式产品。",
  "研究假设不等同于已证实结论。",
  "证据要分层标注：公开能核对的、内部留档的、还缺的；内部记录不公开原文、链接或文件名。",
  "私有仓库、密钥、家庭隐私和安全上的实现细节，都不对公众公开。",
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
    description: "代码验收、部署和研究记录，以及没有公开链接的核对记录；只说存在、结论是什么，不公开链接、原文或文件名。",
  },
  {
    id: "pending",
    title: "待补",
    description: "现在没法如实拿出来、要等修好或以后再核对的证据；不用别的图或猜测顶上。",
  },
] as const;

export const MAP_AGGREGATION_NOTE =
  "体系图按区域展示 10 个节点；证据页按项目列出 14 条记录，有些项目在图上合并成了一个节点。";
