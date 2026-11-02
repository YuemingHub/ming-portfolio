import { ArrowLink, PageHeader, SectionHeading } from "@/components/Chrome";
import { AGENT_CAPABILITIES, AGENT_CASES } from "@/site/content";

const CHANNEL = [
  { label: "人", note: "真实目标与限制" },
  { label: "理解", note: "先说清要做什么" },
  { label: "AI / Agent", note: "拆分、执行、核验" },
  { label: "工具 · 知识 · 技术", note: "优先借用已有能力" },
  { label: "现实", note: "在生活与业务里发生" },
  { label: "反馈", note: "结果回来，再修改" },
];

const PREMISES = [
  {
    index: "01",
    title: "不是开发者专属",
    body: "不要求每个人写代码，也不要求先理解模型、接口或工作流。Agent Space 要解决的是：一个普通人怎样把自己的目标说清楚，并让已有能力真正为自己工作。",
  },
  {
    index: "02",
    title: "不是能力缺陷工具",
    body: "它不以「你不够好」为前提。人不需要先补齐一套技术知识，才有资格使用 AI；需要被补上的是连接方式、判断依据与现实反馈。",
  },
  {
    index: "03",
    title: "目前还不是产品",
    body: "Agent Space 现在是一套经过真实项目使用的工作方法。它有流程、案例与验证记录，但没有独立产品界面，也没有和各系统完成运行时集成。",
  },
];

const CRITERIA = [
  { title: "真实问题", body: "起点必须是实际发生的目标或困难，而不是为了展示能力而设计的演示任务。" },
  { title: "借用优先", body: "先找世界上已经存在的工具、知识与资源；能借就借，能换就换，不把自建当默认答案。" },
  { title: "结果发生", body: "以公开入口、可访问页面、可复核记录或现场变化作为完成标准，不以「已生成」代替「已发生」。" },
  { title: "可被移交", body: "过程要留下判断链、证据与限制，使另一个人能够复核、复用或推翻，而不是只依赖某次对话。" },
];

export function AgentSpacePage() {
  return (
    <>
      <PageHeader
        kicker="AGENT SPACE · 连接与执行"
        title={<>让 AI 与人的真实目标，<br />持续发生作用。</>}
        lede="Agent Space 不是另一个聊天窗口，也不是只有工程师才能进入的工作台。它是一套连接人、AI、工具、知识、技术与现实资源的工作方法，目前以真实项目验证。"
        meta={["当前状态 · VALIDATION", "8 项目标能力", "4 个真实工程案例", "不是独立产品"]}
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            index="01"
            kicker="WHAT IT IS NOT"
            title={<>先把三个误解拿掉。</>}
            lede="一个概念如果只能靠宏大叙事成立，就很难被检验。以下三句话，是这个项目明确不主张的。"
          />
          <div className="premise-grid">
            {PREMISES.map((item) => (
              <article className="premise" key={item.index}>
                <span>{item.index}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-agent-channel">
        <div className="shell">
          <SectionHeading
            index="02"
            kicker="THE CONNECTION CHANNEL"
            title={<>连接不是把东西放在一起，<br />而是让一件事真的向前走。</>}
            lede="每一次协作都从人的真实目标出发，经过理解、能力发现、执行与验证，最后回到现实。反馈不是结尾，而是下一轮的起点。"
          />
          <div className="channel" role="img" aria-label="连接通道：人、理解、AI/Agent、工具知识技术、现实、反馈，逐段相连并回到人。">
            {CHANNEL.map((item, index) => (
              <div className="channel-step" key={item.label}>
                <span className="channel-index">{String(index + 1).padStart(2, "0")}</span>
                <b>{item.label}</b>
                <small>{item.note}</small>
                {index < CHANNEL.length - 1 && <i aria-hidden="true">→</i>}
              </div>
            ))}
            <p className="channel-return" aria-hidden="true">反馈回到人，重新判断目标与下一步。</p>
          </div>
          <div className="callout-row">
            <p className="callout"><span>连接不等于集成。</span>Agent Space 在项目现场组织协作，不代表各系统之间已经存在统一运行时或数据接口。</p>
            <p className="callout"><span>借用不等于依赖。</span>优先使用已有能力，同时记录它的限制、价格与失效条件，避免把第三方工具当成永久基础设施。</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            index="03"
            kicker="TARGET CAPABILITIES"
            title={<>八项能力，逐项标出做到哪里。</>}
            lede="“已实践”表示在至少一个真实项目里跑过；“部分实践”表示有做法与局部经验，但还没有形成可复用机制。两者都不等于产品能力已经完成。"
          />
          <div className="capability-table">
            <div className="capability-head" aria-hidden="true">
              <span>能力</span>
              <span>状态</span>
              <span>实际做到哪里</span>
            </div>
            {AGENT_CAPABILITIES.map((item, index) => (
              <div className="capability-row" key={item.name}>
                <p className="capability-name">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.name}
                </p>
                <span className={`capability-state is-${item.state}`}>
                  {item.state === "practice" ? "已实践" : "部分实践"}
                </span>
                <p className="capability-note">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-cases">
        <div className="shell">
          <SectionHeading
            index="04"
            kicker="REAL ENGINEERING CASES"
            title={<>四个真实案例，<br />每个都从一次失败或断点开始。</>}
            lede="以下案例来自已经发生的工程过程。它们记录问题、借用了什么、在哪里失败、如何修正，以及最后交付了什么；不把「参与了」写成「做成了」。"
          />
          <div className="case-list">
            {AGENT_CASES.map((item, index) => (
              <details className="case" key={item.index} open={index === 0}>
                <summary>
                  <span className="case-index">{item.index}</span>
                  <span className="case-title">{item.title}</span>
                  <span className="case-toggle" aria-hidden="true">＋</span>
                </summary>
                <dl className="case-body">
                  <div><dt>问题</dt><dd>{item.problem}</dd></div>
                  <div><dt>借用</dt><dd>{item.borrowed}</dd></div>
                  <div><dt>执行</dt><dd>{item.executed}</dd></div>
                  <div><dt>验证</dt><dd>{item.tested}</dd></div>
                  <div><dt>发现</dt><dd>{item.found}</dd></div>
                  <div><dt>修正</dt><dd>{item.fixed}</dd></div>
                  <div className="case-delivery"><dt>交付</dt><dd>{item.delivered}</dd></div>
                </dl>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-goal">
        <div className="shell">
          <div className="goal-panel">
            <div>
              <p className="section-kicker"><span className="section-index">05</span>LONG-TERM GOAL</p>
              <h2>让一个人不必成为技术专家，<br />也能把世界上的能力变成自己的下一步。</h2>
              <p>这不是一个关于「AI 多强」的目标，而是一个关于连接是否真的发生、结果是否真的出现、经验是否真的能被别人接过去的目标。</p>
            </div>
            <div className="goal-criteria">
              {CRITERIA.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
          <div className="next-grid">
            <ArrowLink to="/evidence">查看 Agent Space 的状态与证据</ArrowLink>
            <ArrowLink to="/expert-and-research">看专业判断如何被验证</ArrowLink>
            <ArrowLink to="/cooperation">讨论技术或项目合作</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
