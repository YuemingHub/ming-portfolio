export const ROUTES = [
  {
    path: "/",
    title: "让生命与世界更好地连接 · YUE MING ECOSYSTEM",
    h1: "让生命与世界更好地连接。",
    canonical: "https://ymai.me/",
    images: 3,
  },
  {
    path: "/ecosystem",
    title: "体系总览 · YUE MING ECOSYSTEM",
    h1: "这些项目不是孤立的，它们共同构成一套体系。",
    canonical: "https://ymai.me/ecosystem",
    images: 0,
  },
  {
    path: "/spaces",
    title: "三个空间 · YUE MING ECOSYSTEM",
    h1: "人的生活，不是一个单独的问题。",
    canonical: "https://ymai.me/spaces",
    images: 3,
  },
  {
    path: "/institution",
    title: "机构服务 · YUE MING ECOSYSTEM",
    h1: "让家庭教育机构拥有真正持续运行的服务体系。",
    canonical: "https://ymai.me/institution",
    images: 0,
  },
  {
    path: "/expert-and-research",
    title: "专业与研究 · YUE MING ECOSYSTEM",
    h1: "专业判断需要依据，也需要允许修正。",
    canonical: "https://ymai.me/expert-and-research",
    images: 0,
  },
  {
    path: "/agent-space",
    title: "Agent Space · YUE MING ECOSYSTEM",
    h1: "让 AI 与人的真实目标，持续发生作用。",
    canonical: "https://ymai.me/agent-space",
    images: 0,
  },
  {
    path: "/evidence",
    title: "证据与进展 · YUE MING ECOSYSTEM",
    h1: "做到哪里，就写到哪里。",
    canonical: "https://ymai.me/evidence",
    images: 0,
  },
  {
    path: "/cooperation",
    title: "联系与合作 · YUE MING ECOSYSTEM",
    h1: "先看真实资产，再谈一起做什么。",
    canonical: "https://ymai.me/cooperation",
    images: 2,
  },
] as const;

export const URL_FOR = (route: string) => (route === "/" ? "/ming/" : `/ming${route}`);
