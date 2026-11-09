import { Arrow, Mark } from "@/components/Chrome";
import { Link } from "@/site/router";
import { assetUrl } from "@/site/base";

export function HomePage() {
  return (
    <main className="facade">
      <section className="facade-hero">
        <div className="shell facade-hero-grid">
          <div className="facade-copy">
            <div className="facade-eyebrow">
              <span className="facade-mark"><Mark /></span>
              <span>YUE MING</span>
              <span className="facade-eyebrow-muted">个人门户</span>
            </div>

            <p className="facade-kicker">从真实生活出发</p>
            <h1 className="facade-title">
              把真实生活里的问题，
              <span className="facade-title-accent">做成可以继续的事。</span>
            </h1>
            <p className="facade-statement">
              我从家庭和人的真实问题出发，借助 AI 与工具，把想法做成能使用、能验证的产品。
            </p>

            <div className="facade-actions">
              <a className="btn facade-primary" href="https://ymai.love" target="_blank" rel="noreferrer">
                进入 Family Space <Arrow external />
              </a>
              <Link className="btn facade-secondary" to="/spaces">
                看我在做什么 <Arrow />
              </Link>
            </div>

            <p className="facade-signature">家庭 <i /> 自己 <i /> 世界</p>
          </div>

          <div className="facade-window-wrap">
            <div className="facade-window-note">现在，先从一个家开始。</div>
            <figure className="facade-window">
              <div className="facade-window-bar">
                <span className="facade-window-dots"><i /><i /><i /></span>
                <span>ymai.love</span>
                <span className="facade-window-type">FAMILY SPACE</span>
              </div>
              <div className="facade-window-image">
                <img
                  src={assetUrl("/media/ymai-love.png")}
                  alt="Family Space 公开首页：这里，留给你们家。"
                  loading="eager"
                  decoding="async"
                />
              </div>
              <figcaption>一个给家人留下真实生活的地方。</figcaption>
            </figure>
            <span className="facade-window-stamp">01 / 03</span>
          </div>
        </div>

        <div className="shell facade-hero-bottom">
          <span>YUE MING ECOSYSTEM</span>
          <span className="facade-hero-rule" />
          <span>向下了解更多 <span aria-hidden="true">↓</span></span>
        </div>
      </section>

      <section className="facade-bridge">
        <div className="shell facade-bridge-grid">
          <p className="facade-bridge-label">如果你想继续了解</p>
          <div className="facade-bridge-copy">
            <h2>这里不急着把一切都讲完。</h2>
            <p>先看三个入口，再决定要不要走得更深。</p>
          </div>
          <div className="facade-bridge-links">
            <Link to="/spaces">家庭 / 自己 / 世界 <Arrow /></Link>
            <a href="https://ymai.me/gui/" target="_blank" rel="noreferrer">进入 Self Space <Arrow external /></a>
            <Link to="/cooperation">联系与合作 <Arrow /></Link>
          </div>
        </div>
      </section>

      <section className="facade-note">
        <div className="shell">
          <p>我相信，好的工具应该让人更靠近自己的生活，而不是更远。</p>
        </div>
      </section>
    </main>
  );
}
