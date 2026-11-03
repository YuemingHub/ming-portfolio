import { ArrowLink, PageHeader, SectionHeading, StatusPill } from "@/components/Chrome";
import {
  BOOK_ITEMS,
  EXPERT_EVIDENCE,
  EXPERT_FIXES,
  LAB_STEPS,
  LRDF_ITEMS,
} from "@/site/content";

const EXPERT_LAYERS = [
  { layer: "1", name: "SKILL 库", body: "15 类场景样本、话术体系、分阶段干预与孩子状态库。" },
  { layer: "2", name: "AGENT 层", body: "识别场景 → 按序调用 Skill → 组装输出；6 个启用，1 个部分，2 个刻意不建。" },
  { layer: "3", name: "规则引擎", body: "路由、输出、安全、隐私与结构化推理；先过安全门，再进入教育处置。" },
  { layer: "4", name: "输出层", body: "咨询回复、干预方案、话术、课程、文章与视频脚本；哪些真能出、哪些缺原料，逐项标注。" },
  { layer: "+", name: "evals 判据", body: "没有判据，前三层做得再漂亮也无从知道对错；F05 专门测「该不该说」。" },
];

const JUDGMENT_PATH = [
  { step: "01", title: "事实", body: "先记录发生了什么、谁说的、什么时候；不急着解释。" },
  { step: "02", title: "推测", body: "把专业假设降级为假设，写明依据、把握与反例。" },
  { step: "03", title: "安全门", body: "先判断该不该说、要不要转介；橙 / 红档不生成教育处置类内容。" },
  { step: "04", title: "建议", body: "在边界内给出可执行的一步，不替家庭决定，也不替专业责任。" },
  { step: "05", title: "复核 / 修正", body: "新信息到来后允许旧理解作废；修正比维持一致更重要。" },
];

export function ExpertResearchPage() {
  return (
    <>
      <PageHeader
        kicker="EXPERTISE & RESEARCH · 专业与研究"
        title={<>专业判断需要依据，<br />也需要允许修正。</>}
        lede="专业经验、研究假设与书稿属于三种不同的证据状态。本页把它们分开呈现：正在验证的能力、仍在研究的方法、尚未出版的书稿，不互相冒充。"
        meta={["Yueming Expert OS · VALIDATION", "LRDF · RESEARCH", "《先看清，再伸手》· RESEARCH", "Family Reality Lab · RESEARCH"]}
      />

      <nav className="anchor-nav shell" aria-label="本页章节">
        <a href="#expert-os">Expert OS</a>
        <a href="#expert-open">未关闭问题</a>
        <a href="#lrdf">LRDF</a>
        <a href="#book">书稿</a>
        <a href="#lab">Family Reality Lab</a>
      </nav>

      <section className="section" id="expert-os">
        <div className="shell">
          <div className="detail-head">
            <div>
              <p className="kicker"><span>01 / YUEMING EXPERT OS</span><StatusPill status="VALIDATION" /></p>
              <h2>让专家经验成为<br />可检验、可修正的能力。</h2>
            </div>
            <div className="detail-head-side">
              <p>目标不是替代专业工作者，而是把专业知识、经验与判断方法变成可检查、可修正的辅助能力。它辅助专业判断，不替代专业责任。</p>
              <p className="micro-note">当前仍有安全、可复现性与同行可用性方面的验证任务；未达到独立对外商用标准。</p>
            </div>
          </div>

          <div className="issue-alert" id="expert-open" role="note" aria-label="未关闭问题">
            <p className="issue-alert-kicker">OPEN ISSUES · 未关闭</p>
            <p><b>Expert OS 当前不对外宣称可用。</b>转介资源库与总质检闸仍有未关闭问题；同行可用性、跨案例可复现性与真实风险场景验证未完成。下面的结构与判据只说明已经做到哪一步。</p>
            <ul>
              {EXPERT_FIXES.open.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <ArrowLink to="/evidence">在证据页查看 VALIDATION 记录与限制</ArrowLink>
          </div>

          <div className="expert-layout">
            <div className="expert-layers">
              {EXPERT_LAYERS.map((layer) => (
                <article key={layer.name}>
                  <span>{layer.layer}</span>
                  <div>
                    <h3>{layer.name}</h3>
                    <p>{layer.body}</p>
                  </div>
                </article>
              ))}
            </div>
            <div className="expert-stats">
              <h3 className="subhead">当前可核验的结构</h3>
              {EXPERT_EVIDENCE.map((item) => (
                <div className="expert-stat" key={item.label}>
                  <b>{item.value}</b>
                  <div>
                    <span>{item.label}</span>
                    <p>{item.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h3 className="subhead subhead-spaced">专业判断路径（方法，不是已验证产品）</h3>
          <div className="judgment-path">
            {JUDGMENT_PATH.map((item, index) => (
              <div className="judgment-step" key={item.step}>
                <span>{item.step}</span>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
                {index < JUDGMENT_PATH.length - 1 && <i aria-hidden="true">→</i>}
              </div>
            ))}
          </div>

          <div className="issue-grid">
            <div className="issue-box issue-fixed">
              <h3>已修：第一次真跑发现的两件事</h3>
              <ul>
                {EXPERT_FIXES.fixed.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="issue-box issue-open">
              <h3>未关闭：当前不应对外宣称可用</h3>
              <ul>
                {EXPERT_FIXES.open.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className="callout-row">
            <p className="callout"><span>2026-09-29 的真实形态复合案例。</span>第一次跑完整判断链路，发现风险分诊与转介话术冲突，且安全门没有判据；这份问题清单比「结构看起来完整」更有价值。</p>
            <p className="callout"><span>测试通过不等于专业可用。</span>F01–F05 通过只能说明已知判据通过；同行可用性、跨案例可复现性与真实风险场景仍未完成。</p>
            <p className="callout"><span>不替代专业责任。</span>系统必须区分事实、用户解释、假设与未知；安全处置与转介仍由人承担最终责任。</p>
          </div>
        </div>
      </section>

      <section className="section section-research" id="lrdf">
        <div className="shell">
          <div className="detail-head">
            <div>
              <p className="kicker"><span>02 / LRDF</span><StatusPill status="RESEARCH" /></p>
              <h2>从真实生活出发，<br />建立可检验的判断方法。</h2>
            </div>
            <div className="detail-head-side">
              <p>LRDF 不是一套要求人先符合标准的发展模型。它从真实家庭实践里生长，同时接受心理学、发展科学、教育学、行为科学、精神医学、社会学、哲学与伦理学的持续审查。</p>
              <p className="micro-note">理论假设不是科学共识；不替代医疗与心理治疗。</p>
            </div>
          </div>

          <div className="lrdf-core">
            <div className="lrdf-core-title">
              <span>核心架构</span>
              <p>生命承接 <i>→</i> 能动恢复 <i>→</i> 生命成熟</p>
              <small>不是固定阶段，也不是三道必经关口。人可以回退，也可以重新需要承接。</small>
            </div>
            <div className="lrdf-items">
              {LRDF_ITEMS.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="callout-row">
            <p className="callout"><span>不是诊断系统。</span>不做精神医学诊断，不做风险分级预测，不替代医疗与心理治疗；专业边界之外及时转介。</p>
            <p className="callout"><span>不是固定人生模板。</span>提供生长条件，不提供人生答案；不规定「好孩子应该长成什么样」。</p>
            <p className="callout"><span>数据边界。</span>原始家庭咨询资料不进入公开仓库；只保留脱敏后的研究产物、命题、协议、反例与研究结论。</p>
          </div>
        </div>
      </section>

      <section className="section" id="book">
        <div className="shell">
          <div className="detail-head">
            <div>
              <p className="kicker"><span>03 / 《先看清，再伸手》</span><StatusPill status="RESEARCH" /></p>
              <h2>帮助父母在不确定中，<br />作出可修正的下一步选择。</h2>
            </div>
            <div className="detail-head-side">
              <p>它不是一本单纯教父母知识的书，而是帮助父母判断当下发生了什么、该如何行动、如何观察结果并调整。</p>
              <p className="micro-note">当前为作者审阅稿；未出版，作者终审与独立专业审查未完成。</p>
            </div>
          </div>

          <div className="book-layout">
            <div className="book-cover" aria-label="书稿信息卡">
              <span className="book-cover-kicker">A BOOK IN PROGRESS</span>
              <p className="book-cover-title">先看清，<br />再伸手</p>
              <p className="book-cover-sub">在真实生活的凹凸不平里，<br />学习判断、行动与修正。</p>
              <span className="book-cover-status">RESEARCH · 未出版</span>
            </div>
            <div className="book-items">
              {BOOK_ITEMS.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
              <div className="book-progress">
                <p><span>书稿结构</span><b>四部 · 十一章 · 结语</b></p>
                <p><span>最近记录</span><b>2026-10-27 完整书稿</b></p>
                <p><span>当前阶段</span><b>作者审阅 / 专业审查未完成</b></p>
                <p><span>不能宣称</span><b>已出版 · 已获真人理解验证</b></p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-lab" id="lab">
        <div className="shell">
          <div className="detail-head">
            <div>
              <p className="kicker"><span>04 / FAMILY REALITY LAB</span><StatusPill status="RESEARCH" /></p>
              <h2>真实家庭问题如何转化为<br />可研究、可验证、可观察、可修正的素材。</h2>
            </div>
            <div className="detail-head-side">
              <p>每天从现实中拿一个真实家庭问题，不加工地交给 AI，保留真实表现；只说自己真正看见的地方，再把现实反馈带回 Family Space。</p>
              <p className="micro-note">研究项目、真实样本与模拟案例必须分开；原始家庭资料不上网。</p>
            </div>
          </div>

          <div className="lab-flow">
            {LAB_STEPS.map((step, index) => (
              <article key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <div className="lab-meta">
            <p><b>13</b> 份期数记录（001–007、009–014）</p>
            <p><b>7</b> 条 V0.1 首周目标（#001–#007）</p>
            <p><b>0</b> 份原始家庭资料进入公开站点</p>
            <p><b>未核验</b> 公开发布状态与传播效果</p>
          </div>

          <div className="callout-row">
            <p className="callout"><span>原话优先。</span>口语、重复、犹豫、矛盾与情绪本身就是现实的一部分；不为了「专业」「好看」重新加工。</p>
            <p className="callout"><span>区分三种材料。</span>家长原话、研究提炼、公开评论必须分开标注；不能把评论当成原话。</p>
            <p className="callout"><span>不构成效果证明。</span>真实问题记录与公开表达不是对照组研究，不能用来宣称方法有效。</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="next-grid">
            <ArrowLink to="/institution">回到机构服务</ArrowLink>
            <ArrowLink to="/agent-space">看 Agent Space 如何做验证</ArrowLink>
            <ArrowLink to="/evidence">查看专业与研究的证据记录</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
