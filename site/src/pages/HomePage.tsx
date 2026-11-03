import { Atlas } from "@/components/Atlas";
import { Arrow, ArrowLink, BrowserFrame, SectionHeading, StatusPill } from "@/components/Chrome";
import { Link } from "@/site/router";
import { CONTACT, PROJECT_COUNT, PROJECTS, STATUS_COUNTS, STATUS_ORDER, STATUS_META } from "@/site/content";
import type { Status } from "@/site/types";

const SPACES = [
  {
    id: "family",
    index: "01",
    name: "Family Space",
    cn: "家庭空间",
    title: "家庭不只是被管理的对象，而是一个需要被理解、支持、共同成长的真实生活空间。",
    body: "一家人每天真的发生的事，开心的、普通的、难一点的，都可以放进来。重要的事会被记住，理解错了也可以随时纠正。",
    tags: ["今天", "我家", "回望", "我的"],
    url: "https://ymai.love",
    status: "LIVE_VERIFIED" as const,
    visual: (
      <BrowserFrame
        src="/media/ymai-love.png"
        alt="Family Space 公开首页实拍：深色暖调页面，标题为「这里，留给你们家。」"
        url="ymai.love"
        caption="公开首页实拍 · 2026-11-02 · 登录后页面不在本站展示"
      />
    ),
  },
  {
    id: "self",
    index: "02",
    name: "Self Space",
    cn: "自我空间",
    title: "每个人都需要一个能够整理自己、理解经历、保存经验、持续认识自己的空间。",
    body: "不是一个什么都能答的 AI，也不是心理咨询网站。你说，它回应；它把你说的话放回你面前，最后怎么解释，还是你说了算。",
    tags: ["说出来", "留下", "回来"],
    url: "https://ymai.me/gui/",
    status: "LIVE_VERIFIED" as const,
    visual: (
      <BrowserFrame
        src="/media/ymai-self.png"
        alt="Self Space 公开首页实拍：深色页面，标题为「这里，留给你自己。」"
        url="ymai.me/gui"
        caption="公开首页实拍 · 2026-11-03 · 登录后页面不在本站展示"
      />
    ),
  },
  {
    id: "world",
    index: "03",
    name: "World Space",
    cn: "世界空间",
    title: "让普通人和孩子有机会理解 AI，学习使用 AI，连接外部知识、工具与真实世界。",
    body: "不要求从零创造工具。选一件你真想做的事，马上开始；每件事都替你选好了工具和第一步，照着做就行。",
    tags: ["7 个目标", "三步上手", "现实结果"],
    url: "https://ymai.fun",
    status: "LIVE_VERIFIED" as const,
    visual: (
      <BrowserFrame
        src="/media/ymai-fun.png"
        alt="World Space 公开首页实拍：深色首屏，标题为「不懂技术，也能从 0 开始连接 AI 与世界」。"
        url="ymai.fun"
        caption="公开首页首屏实拍 · 2026-11-02 · 第三方工具可用性不由本站保证"
      />
    ),
  },
];

const HIGHLIGHTS = ["family-space", "self-space", "world-space", "family-service-os", "expert-os"];

const STATUS_NOTES: Record<Status, string> = {
  LIVE_VERIFIED: "公开入口可访问",
  CODE_ACCEPTED: "代码验收通过，不等于上线",
  PROTOTYPE: "可运行原型，不等于产品",
  VALIDATION: "正在验证，不等于商用",
  RESEARCH: "研究假设，不等于结论",
  HOLD: "有发布阻断，不宣称可用",
  PLANNED: "只有方向，尚未实现",
};

export function HomePage() {
  const counts = STATUS_COUNTS;
  const inBuild = counts.CODE_ACCEPTED + counts.PROTOTYPE + counts.VALIDATION + counts.PLANNED;

  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="kicker">
              <span>YUE MING ECOSYSTEM</span>
              <span>体系可视化 · 2026.11</span>
            </p>
            <h1 className="hero-title">
              让生命与世界
              <br />
              更好地连接<span className="title-dot">。</span>
            </h1>
            <p className="hero-lede">
              从家庭、个人到世界，从专业经验到人工智能，我们正在建设一套让知识、技术、专业服务与真实生活相互连接的体系。
            </p>
            <div className="hero-actions">
              <Link to="/ecosystem" className="btn btn-primary">
                看懂整个体系 <Arrow />
              </Link>
              <Link to="/evidence" className="btn btn-ghost">
                查看项目状态与证据 <Arrow />
              </Link>
            </div>
            <p className="hero-note">
              我们不希望再制造一个孤立的 AI 工具。我们希望把已经存在的知识、经验、技术、专业服务与真实需求连接起来，让它们在现实生活中发生作用，并根据真实反馈不断改进。
            </p>
          </div>
          <div className="hero-atlas">
            <Atlas />
          </div>
        </div>
        <div className="shell hero-facts">
          <span><b>{PROJECT_COUNT}</b> 条项目记录</span>
          <span><b>{counts.LIVE_VERIFIED}</b> 个公开入口已核验</span>
          <span><b>{inBuild}</b> 项在建设、验证或规划</span>
          <span><b>{counts.RESEARCH}</b> 项研究资产</span>
          <span className="hero-facts-note">项目状态核验日期 2026-11-02</span>
        </div>
      </section>

      <section className="section section-why">
        <div className="shell">
          <SectionHeading
            index="01"
            kicker="WHY THIS EXISTS"
            title={<>世界已经拥有很多知识和技术，<br className="wide-break" />但它们还没有真正进入每个人的生活。</>}
          />
          <div className="why-grid">
            <div className="why-copy">
              <p>家庭遇到问题时，往往不知道如何理解和行动。</p>
              <p>专业工作者拥有经验，却很难把经验稳定地传递给其他人。</p>
              <p>家庭教育机构积累了课程、导师和咨询经验，却不一定拥有能够持续运行的服务体系。</p>
              <p>普通人面对越来越多的 AI 工具，也不一定知道如何把它们转化为自己的能力。</p>
            </div>
            <div className="why-note">
              <p className="note-kicker">我们真正要解决的</p>
              <p className="note-large">不是单一工具问题，而是人与知识、技术、专业服务和现实资源之间的连接问题。</p>
              <div className="note-lines">
                <span>不是再造一个聊天窗口</span>
                <span>不是把所有产品合成一个 SaaS</span>
                <span>不是把概念关系画成已实现的数据流</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-spaces">
        <div className="shell">
          <SectionHeading
            index="02"
            kicker="THREE LIFE SPACES"
            title={<>从三个不同的生活空间出发。</>}
            lede="它们不是三个孤立的 AI 聊天窗口，而是面向不同生活场景的入口。三个空间目前各自独立，没有统一登录、共享数据或共享记忆。"
          />
          <div className="space-cards">
            {SPACES.map((space) => (
              <article className={`space-card space-card-${space.id}`} key={space.id}>
                <div className="space-card-head">
                  <span className="space-index">{space.index}</span>
                  <StatusPill status={space.status} compact />
                </div>
                <div className="space-visual">{space.visual}</div>
                <div className="space-body">
                  <p className="space-name">{space.name} <span>{space.cn}</span></p>
                  <h3>{space.title}</h3>
                  <p>{space.body}</p>
                  <ul className="tag-list" aria-label={`${space.name} 关键入口`}>
                    {space.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <div className="space-links">
                    <ArrowLink to={`/spaces#${space.id}`}>看它如何工作</ArrowLink>
                    <ArrowLink to={space.url} external>打开实时页面</ArrowLink>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-professional">
        <div className="shell">
          <SectionHeading
            index="03"
            kicker="PROFESSIONAL SYSTEMS"
            title={<>让专业经验，<br />不再只停留在某一个人的头脑里。</>}
            lede="一套面向机构，一套面向专业工作者。两者都还在建设或验证阶段，本站不把未上线能力写成已交付。"
          />
          <div className="system-rows">
            <article className="system-row">
              <div className="system-row-title">
                <span className="system-index">B / 01</span>
                <h3>Family Service OS</h3>
                <p>面向机构 · 服务经营系统</p>
              </div>
              <div className="system-row-body">
                <p>让机构的咨询、课程、导师协作、家庭跟进和服务复盘形成连续的工作体系。V0 只做三个工作面：咨询师个案工作台、主管介入视图、经营者服务健康度。</p>
                <ul className="inline-facts">
                  <li>合成数据跑通</li>
                  <li>未部署</li>
                  <li>真实数据被阻断</li>
                </ul>
              </div>
              <div className="system-row-aside">
                <StatusPill status="CODE_ACCEPTED" />
                <ArrowLink to="/institution">看机构服务</ArrowLink>
              </div>
            </article>

            <article className="system-row">
              <div className="system-row-title">
                <span className="system-index">B / 02</span>
                <h3>Yueming Expert OS</h3>
                <p>面向专业工作者 · 判断辅助系统</p>
              </div>
              <div className="system-row-body">
                <p>将专业知识、经验和判断方法转化为可检查、可修正的辅助能力。它辅助专业工作者，而不是替代专业责任；目前仍有安全、可复现性与同行可用性方面的验证任务。</p>
                <ul className="inline-facts">
                  <li>15 类场景库</li>
                  <li>F01–F05 判据</li>
                  <li>仍有未关闭问题</li>
                </ul>
              </div>
              <div className="system-row-aside">
                <StatusPill status="VALIDATION" />
                <ArrowLink to="/expert-and-research#expert-os">看专业与研究</ArrowLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section section-agent">
        <div className="shell agent-band">
          <div className="agent-band-copy">
            <p className="section-kicker"><span className="section-index">04</span>AGENT SPACE</p>
            <h2>不只是使用 AI，<br />而是让 AI 与人的真实目标持续发生作用。</h2>
            <p>不要求每个人成为技术专家，也不要求每个人从零创造工具。让人能够借用已有的 AI、技术、知识、工具与资源，围绕自己的真实目标进行连接、协作和创造。</p>
            <ArrowLink to="/agent-space" className="on-dark">了解 Agent Space</ArrowLink>
          </div>
          <div className="agent-chain" aria-label="Agent Space 连接通道">
            {["人", "AI", "工具", "知识", "技术", "现实资源", "世界变化"].map((word, index) => (
              <span key={word} className="agent-chain-item">
                {word}
                {index < 6 && <i aria-hidden="true">↔</i>}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-progress">
        <div className="shell">
          <SectionHeading
            index="05"
            kicker="REAL PROGRESS"
            title={<>已经做出的，和仍在验证的。</>}
            lede="每一项都对应证据页里的一条记录：面向谁、已经完成什么、当前状态、核验日期与限制。"
          />
          <div className="progress-grid">
            {STATUS_ORDER.map((status) => (
              <div className="progress-stat" key={status}>
                <span className={`stat-dot dot-${status.toLowerCase()}`} aria-hidden="true" />
                <b>{counts[status]}</b>
                <span>{status}</span>
                <small>{STATUS_NOTES[status]}</small>
              </div>
            ))}
          </div>
          <p className="progress-total">
            合计 {PROJECT_COUNT} 条项目记录，按七个状态单一计数；同一条记录只属于一个状态，不重复累加。
          </p>
          <div className="highlight-list">
            {HIGHLIGHTS.map((id) => {
              const project = PROJECTS.find((item) => item.id === id);
              if (!project) return null;
              return (
                <article className="highlight-row" key={project.id}>
                  <div>
                    <p className="highlight-name">{project.name}</p>
                    <p className="highlight-en">{project.en}</p>
                  </div>
                  <p className="highlight-capability">{project.capability}</p>
                  <StatusPill status={project.status} compact />
                  <ArrowLink to="/evidence">证据</ArrowLink>
                </article>
              );
            })}
          </div>
          <div className="section-foot">
            <ArrowLink to="/evidence">查看完整项目状态表与证据索引</ArrowLink>
            <span>{STATUS_META.LIVE_VERIFIED.label} 只表示公开页面已核验，不表示登录后能力已验收。</span>
          </div>
        </div>
      </section>

      <section className="section section-cooperation">
        <div className="shell">
          <div className="cooperation-panel">
            <div>
              <p className="section-kicker"><span className="section-index">06</span>COOPERATION</p>
              <h2>如果你也在解决真实问题，<br />我们可以一起把事情做出来。</h2>
              <p>家庭教育机构、专业工作者、技术伙伴、研究伙伴、资源与投资伙伴。合作从具体问题和可验证的小项目开始，而不是先承诺宏大的结果。</p>
            </div>
            <div className="cooperation-actions">
              <Link to="/cooperation" className="btn btn-primary">联系与合作 <Arrow /></Link>
              <span>公开联系通道：抖音、公众号与<a href={`mailto:${CONTACT.email}`}>邮箱 {CONTACT.email}</a></span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
