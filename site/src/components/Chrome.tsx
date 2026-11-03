import { useEffect, useId, useState, type ReactNode } from "react";
import { Link, useLocation } from "@/site/router";
import { NAV_ITEMS } from "@/site/nav";
import { CONTACT, SITE, STATUS_META } from "@/site/content";
import { assetUrl } from "@/site/base";
import type { Status } from "@/site/types";

export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg className={`mark ${className}`} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="13.2" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <path d="M16 2.8v26.4M2.8 16c7.4-2.4 19-2.4 26.4 0" fill="none" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="16" cy="16" r="3.4" fill="currentColor" />
    </svg>
  );
}

export function SiteHeader() {
  const { path } = useLocation();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link to="/" className="brand" aria-label="YUE MING ECOSYSTEM 首页">
          <Mark />
          <span className="brand-type">
            <b>YUE MING</b>
            <small>ECOSYSTEM</small>
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="主导航">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={path === item.path ? "nav-link is-active" : "nav-link"}
              aria-current={path === item.path ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
          <a href={SITE.selfSpace} className="nav-link">
            Self Space <span aria-hidden="true">↗</span>
          </a>
        </nav>

        <div className="header-actions">
          <Link to="/cooperation" className="btn btn-primary btn-small header-cta">
            了解合作
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="menu-toggle-label">{open ? "合上" : "目录"}</span>
            <span className={open ? "menu-glyph is-open" : "menu-glyph"} aria-hidden="true">
              <i />
              <i />
            </span>
          </button>
        </div>
      </div>

      <div id={menuId} className={open ? "mobile-nav is-open" : "mobile-nav"} hidden={!open}>
        <nav aria-label="移动端主导航">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={path === item.path ? "mobile-nav-link is-active" : "mobile-nav-link"}
            >
              <span>{item.label}</span>
              <span className="mobile-nav-en">{item.en}</span>
            </Link>
          ))}
          <Link to="/cooperation" className="mobile-nav-link mobile-nav-cta">
            <span>了解合作</span>
            <span className="mobile-nav-en">COOPERATION</span>
          </Link>
          <a href={SITE.selfSpace} className="mobile-nav-link">
            <span>Self Space</span>
            <span className="mobile-nav-en">SELF SPACE ↗</span>
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Mark />
          <p className="footer-title">YUE MING ECOSYSTEM</p>
          <p className="footer-line">让生命与世界更好地连接。</p>
        </div>
        <nav className="footer-nav" aria-label="页脚导航">
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} to={item.path}>
              {item.label}
            </Link>
          ))}
          <Link to="/cooperation">联系与合作</Link>
        </nav>
        <div className="footer-meta">
          <p>
            <span>作品集 · {SITE.version}</span>
            <span>项目状态核验日期 {SITE.verifiedAt}</span>
          </p>
          <p>
            本站不使用分析脚本、不投放追踪代码、不加载外部字体；页面不收集、不上传你填写的内容。未标注 LIVE_VERIFIED 的能力不视为已上线；LIVE_VERIFIED 只表示公开页面已核验。
          </p>
          <p className="footer-links">
            <a href={SITE.canonical}>作品集正式入口 ymai.me</a>
            <a href={SITE.selfSpace}>Self Space 入口 ymai.me/gui</a>
            <a href={SITE.legacy}>旧入口 ymai.fun/ming（历史兼容）</a>
            <a href={`mailto:${CONTACT.email}`}>邮箱 {CONTACT.email}</a>
          </p>
          <p className="footer-small">© 2026 YUE MING ECOSYSTEM · 公开作品集</p>
        </div>
      </div>
    </footer>
  );
}

export function StatusPill({ status, compact = false }: { status: Status; compact?: boolean }) {
  const meta = STATUS_META[status];
  return (
    <span className={`status status-${meta.tone}${compact ? " is-compact" : ""}`} title={meta.description}>
      <i aria-hidden="true" />
      <span className="status-en">{meta.label}</span>
      {compact ? <span className="sr-only">{meta.zh}</span> : <span className="status-zh">{meta.zh}</span>}
    </span>
  );
}

export function Arrow({ external = false }: { external?: boolean }) {
  return <span className="arrow" aria-hidden="true">{external ? "↗" : "→"}</span>;
}

export function ArrowLink({
  to,
  children,
  external = false,
  className = "",
}: {
  to: string;
  children: ReactNode;
  external?: boolean;
  className?: string;
}) {
  if (external) {
    return (
      <a className={`text-link ${className}`} href={to} target="_blank" rel="noreferrer">
        {children}
        <Arrow external />
      </a>
    );
  }
  return (
    <Link to={to} className={`text-link ${className}`}>
      {children}
      <Arrow />
    </Link>
  );
}

export function PageHeader({
  kicker,
  title,
  lede,
  meta,
}: {
  kicker: string;
  title: ReactNode;
  lede?: ReactNode;
  meta?: string[];
}) {
  return (
    <header className="page-header shell">
      <p className="kicker">{kicker}</p>
      <h1 className="page-title">{title}</h1>
      {lede && <p className="page-lede">{lede}</p>}
      {meta && (
        <div className="page-meta">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      )}
    </header>
  );
}

export function SectionHeading({
  index,
  kicker,
  title,
  lede,
  id,
}: {
  index?: string;
  kicker?: string;
  title: ReactNode;
  lede?: ReactNode;
  id?: string;
}) {
  return (
    <div className="section-heading" id={id}>
      {(index || kicker) && (
        <p className="section-kicker">
          {index && <span className="section-index">{index}</span>}
          {kicker}
        </p>
      )}
      <h2 className="section-title">{title}</h2>
      {lede && <p className="section-lede">{lede}</p>}
    </div>
  );
}

export function BrowserFrame({
  src,
  alt,
  url,
  caption,
}: {
  src: string;
  alt: string;
  url: string;
  caption?: string;
}) {
  return (
    <figure className="browser-frame">
      <div className="browser-chrome" aria-hidden="true">
        <span className="browser-dots"><i /><i /><i /></span>
        <span className="browser-url">{url}</span>
      </div>
      <div className="browser-viewport">
        <img src={assetUrl(src)} alt={alt} loading="lazy" decoding="async" />
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
