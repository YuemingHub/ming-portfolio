import { ArrowLink, BrowserFrame, PageHeader, SectionHeading, StatusPill } from "@/components/Chrome";
import { Link } from "@/site/router";

const FAMILY_FEATURES = [
  { label: "今天", body: "正在发生的生活。" },
  { label: "我家", body: "这个家正在被看见的样子。" },
  { label: "回望", body: "以前发生过的事，带回今天再看一遍。" },
  { label: "我的", body: "只属于你的地方。" },
];

const SELF_ACTIONS = [
  { label: "说出来", body: "想到什么说什么。不用先组织好，不用先想明白。" },
  { label: "留下", body: "关掉窗口，不会丢掉。" },
  { label: "回来", body: "三个月后回来看今天这一条，还在。" },
];

const WORLD_GOALS = [
  "写点东西",
  "做一张海报",
  "做个网页",
  "整理手机照片",
  "查明一件事",
  "整理资料 / 处理 PDF",
  "提取图片文字",
];

const WORLD_STEPS = [
  { step: "1", title: "让 AI 帮你做一件小事", body: "用豆包写一段自己的话。", result: "手里有一段 AI 写出的初稿。" },
  { step: "2", title: "让它改成你满意的样子", body: "学会提要求，而不是重新开始。", result: "手里有一段能直接用的话。" },
  { step: "3", title: "查一件你真想知道的事", body: "用 DeepSeek 查，并核实来源。", result: "查到一个答案，并核实过来源。" },
];

export function SpacesPage() {
  return (
    <>
      <PageHeader
        kicker="THREE SPACES · 三个空间"
        title={<>人的生活，<br />不是一个单独的问题。</>}
        lede="家庭、自己、世界，是同一个人的三个生活方向。三个空间不是三个孤立的 AI 聊天窗口；它们目前也还没有统一登录、共享数据或共享记忆。"
        meta={["Family Space · ymai.love", "Self Space · ymai.me", "World Space · ymai.fun"]}
      />

      <section className="section space-detail space-detail-family" id="family">
        <div className="shell">
          <div className="detail-head">
            <div>
              <p className="kicker"><span>01 / FAMILY SPACE</span><StatusPill status="LIVE_VERIFIED" compact /></p>
              <h2>让家庭被理解，<br />让支持真正进入生活。</h2>
            </div>
            <div className="detail-head-side">
              <p>家庭每天都在发生大量真实事情。我们希望帮助家庭保存真实经历、理解家庭关系、看见变化，并在需要时获得适当的支持。</p>
              <ArrowLink to="https://ymai.love" external>打开 ymai.love</ArrowLink>
            </div>
          </div>

          <div className="detail-visual">
            <BrowserFrame
              src="/media/ymai-love.png"
              alt="Family Space 公开首页实拍：深色暖调页面，标题为「这里，留给你们家。」"
              url="ymai.love"
              caption="公开首页实拍 · 2026-11-02。登录后的家庭页面与真实家庭数据不在本站展示。"
            />
          </div>

          <div className="feature-grid">
            {FAMILY_FEATURES.map((feature) => (
              <article className="feature-card" key={feature.label}>
                <h3>{feature.label}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>

          <div className="callout-row">
            <p className="callout"><span>重要的事会被记住。</span>愿意留下的事，和后来发生的变化，会慢慢连在一起。以后再回来，不必每次都从头讲起。</p>
            <p className="callout"><span>理解错了，也可以纠正。</span>事实与理解尽量分开；家长明确纠正后的说法，可以推翻系统过去的理解。</p>
            <p className="callout"><span>当前边界。</span>这次只核对了公开入口；企业微信入口的线上服务群能不能用，这次没有核对。</p>
          </div>
        </div>
      </section>

      <section className="section space-detail space-detail-self" id="self">
        <div className="shell">
          <div className="detail-head">
            <div>
              <p className="kicker"><span>02 / SELF SPACE</span><StatusPill status="LIVE_VERIFIED" compact /></p>
              <h2>给自己一个<br />持续认识自己的空间。</h2>
            </div>
            <div className="detail-head-side">
              <p>人不仅需要处理外部问题，也需要理解自己的经历、想法、变化和选择。Self Space 想为个人提供一个能够持续整理和理解自身经历的空间。</p>
              <ArrowLink to="https://ymai.me/gui/" external>打开 Self Space</ArrowLink>
            </div>
          </div>

          <div className="detail-visual">
            <BrowserFrame
              src="/media/ymai-self.png"
              alt="Self Space 公开首页实拍：深色页面，标题为「这里，留给你自己。」"
              url="ymai.me/gui"
              caption="公开首页实拍 · 2026-11-03。"
            />
          </div>

          <div className="self-stage">
            <div className="self-stage-copy">
              <p className="self-stage-kicker">A ROOM OF YOUR OWN</p>
              <p className="self-stage-title">这里，留给你自己。</p>
              <p>你说，它回应；它把你说的话放回你面前，最后怎么解释，还是你说了算。</p>
            </div>
            <div className="self-actions">
              {SELF_ACTIONS.map((action) => (
                <article key={action.label}>
                  <h3>{action.label}</h3>
                  <p>{action.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="callout-row">
            <p className="callout"><span>它不定义你是谁。</span>不替你决定人生，也不把一次对话变成永久结论。</p>
            <p className="callout"><span>它不替代专业帮助。</span>需要医疗或心理治疗时，请找相应的人；这里只是给你一个整理自己的地方。</p>
            <p className="callout"><span>当前边界。</span>对话和长期记忆要登录之后才看得到；这次没有账号，所以不对登录后的体验下结论。</p>
          </div>
        </div>
      </section>

      <section className="section space-detail space-detail-world" id="world">
        <div className="shell">
          <div className="detail-head">
            <div>
              <p className="kicker"><span>03 / WORLD SPACE</span><StatusPill status="LIVE_VERIFIED" compact /></p>
              <h2>让普通人和孩子<br />真正进入 AI 世界。</h2>
            </div>
            <div className="detail-head-side">
              <p>AI 不应该只是少数专业人员才能使用的工具。我们希望帮助零基础成人和孩子理解 AI、学习如何与 AI 协作，并逐渐把能力连接到现实生活和学习任务中。</p>
              <ArrowLink to="https://ymai.fun" external>打开 ymai.fun</ArrowLink>
            </div>
          </div>

          <div className="detail-visual">
            <BrowserFrame
              src="/media/ymai-fun.png"
              alt="World Space 公开首页实拍：深色首屏，标题为「不懂技术，也能从 0 开始连接 AI 与世界」，右侧是预写样例演示。"
              url="ymai.fun"
              caption="公开首页首屏实拍 · 2026-11-02。7 个目标入口在下方。"
            />
          </div>

          <div className="world-layout">
            <div>
              <h3 className="subhead">7 个目标入口</h3>
              <ul className="goal-grid">
                {WORLD_GOALS.map((goal) => <li key={goal}>{goal}</li>)}
              </ul>
              <p className="micro-note">每个入口给一个默认工具、第一步、限制和「现实里应该看到什么」。打开工具只是第一步。</p>
            </div>
            <div>
              <h3 className="subhead">第一次用 AI：三步上手</h3>
              <ol className="step-list">
                {WORLD_STEPS.map((step) => (
                  <li key={step.step}>
                    <span className="step-number">{step.step}</span>
                    <div>
                      <b>{step.title}</b>
                      <p>{step.body}</p>
                      <small>{step.result}</small>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="callout-row">
            <p className="callout"><span>不是 AI 工具大全。</span>核心不是收藏，而是选一个当前最值得开始的入口，然后真的动手。</p>
            <p className="callout"><span>不是课程平台。</span>它借用世界上已有的免费、中文、手机可用的工具，不要求用户先学会一整套知识。</p>
            <p className="callout"><span>当前边界。</span>这里只是指路的公开页面；第三方工具每 90 天要重新看一次，失效或涨价不由本站控制。</p>
          </div>
        </div>
      </section>

      <section className="section section-boundary">
        <div className="shell boundary-grid">
          <SectionHeading
            index="04"
            kicker="SHARED BOUNDARY"
            title={<>三个入口，三种生活方向；<br />目前还不是一套互通系统。</>}
          />
          <div className="boundary-copy">
            <p>三个空间现在各自独立：没有统一登录，也不共享数据、记忆、上下文或运行系统。</p>
            <p>它们来自同一个关于人的想法，只是现在还各自独立。</p>
            <div className="boundary-actions">
              <Link to="/ecosystem" className="btn btn-ghost">回到体系图看连接线</Link>
              <Link to="/evidence" className="btn btn-primary">查看状态与证据</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
