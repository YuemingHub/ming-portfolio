import { useEffect, useRef, useState, type ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/Chrome";
import { AgentSpacePage } from "@/pages/AgentSpacePage";
import { CooperationPage } from "@/pages/CooperationPage";
import { EcosystemPage } from "@/pages/EcosystemPage";
import { EvidencePage } from "@/pages/EvidencePage";
import { ExpertResearchPage } from "@/pages/ExpertResearchPage";
import { HomePage } from "@/pages/HomePage";
import { InstitutionPage } from "@/pages/InstitutionPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { SpacesPage } from "@/pages/SpacesPage";
import { canonicalFor } from "@/site/base";
import { useLocation } from "@/site/router";

const ROUTES: Record<string, { title: string; description: string; element: () => ReactNode }> = {
  "/": {
    title: "让生命与世界更好地连接",
    description: "YUE MING ECOSYSTEM 作品集：家庭、自己、世界三个生活空间，以及机构服务、专业判断、研究与 Agent Space 的真实状态、证据与限制。",
    element: () => <HomePage />,
  },
  "/ecosystem": {
    title: "体系总览",
    description: "用五个区域和十个节点的关系图，分清哪些公开入口已经核对过、哪些关系还在设计、哪些只是未来的方向；不把概念上的关系画成已经打通的数据流。",
    element: () => <EcosystemPage />,
  },
  "/spaces": {
    title: "三个空间",
    description: "Family Space、Self Space、World Space 分别面向家庭、个人与世界；三个入口目前各自独立，没有统一登录、共享数据或共享记忆。",
    element: () => <SpacesPage />,
  },
  "/institution": {
    title: "机构服务",
    description: "Family Service OS 的机构服务设计：代码评审已经通过，但还没合进主线、还没上线，也没有接真实机构数据。",
    element: () => <InstitutionPage />,
  },
  "/expert-and-research": {
    title: "专业与研究",
    description: "Yueming Expert OS 处于验证中；LRDF、家长读本与 Family Reality Lab 属于研究资产，不是已证实结论或已发布产品。",
    element: () => <ExpertResearchPage />,
  },
  "/agent-space": {
    title: "Agent Space",
    description: "Agent Space 是一套连接人、AI、工具、知识与现实资源的工作方法，是在真实项目里用出来的，不是独立产品，也不是运行平台。",
    element: () => <AgentSpacePage />,
  },
  "/evidence": {
    title: "证据与进展",
    description: "14 条项目记录、7 种状态；证据分成公开能核对、内部留档、还缺的三层，哪天核对、哪些话不能说，都一起列出来。",
    element: () => <EvidencePage />,
  },
  "/cooperation": {
    title: "联系与合作",
    description: "五类合作对象与三条合作原则；合作简报只在浏览器本地生成；公开联系与交流通道为抖音、公众号与邮箱，合作议题也可走 GitHub Issues。",
    element: () => <CooperationPage />,
  },
};

const TITLE_SUFFIX = "YUE MING ECOSYSTEM";
const FALLBACK_DESCRIPTION = "YUE MING ECOSYSTEM 作品集：真实状态、证据与限制。";

function setMeta(selector: string, attribute: string, value: string) {
  const element = document.head.querySelector(selector);
  if (element) element.setAttribute(attribute, value);
}

export default function App() {
  const { path, hash } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const [announcement, setAnnouncement] = useState("");
  const route = ROUTES[path];

  useEffect(() => {
    const title = route ? `${route.title} · ${TITLE_SUFFIX}` : `页面未找到 · ${TITLE_SUFFIX}`;
    const description = route?.description ?? FALLBACK_DESCRIPTION;
    const canonical = canonicalFor(path);
    document.title = title;
    const canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonicalLink) canonicalLink.href = canonical;
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
  }, [path, route]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setAnnouncement(document.title);
    const frame = window.requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(hash.slice(1));
        if (target) {
          target.scrollIntoView({ block: "start" });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: "auto" });
      mainRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [path, hash]);

  return (
    <>
      <a className="skip-link" href="#main">跳到正文</a>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      <SiteHeader />
      <main id="main" ref={mainRef} tabIndex={-1}>
        {route ? route.element() : <NotFoundPage />}
      </main>
      <SiteFooter />
    </>
  );
}
