import { ArrowLink, PageHeader, SectionHeading, StatusPill } from "@/components/Chrome";
import {
  BOOK_ITEMS,
  CONTACT,
  EXPERT_EVIDENCE,
  EXPERT_FIXES,
  LAB_STEPS,
  LRDF_LADDER,
  LRDF_LAYERS,
  LRDF_SOURCES,
  SITE,
} from "@/site/content";

const EXPERT_LAYERS = [
  { layer: "1", name: "SKILL 库", body: "15 类常见场景、可以照着说的话、分阶段的应对，以及孩子状态怎么记。" },
  { layer: "2", name: "AGENT 层", body: "先认出是什么场景，再按顺序调用对应的做法，最后组成一段回复。6 个已启用，1 个做了一半，2 个想清楚后决定不做。" },
  { layer: "3", name: "规则引擎", body: "管分流、输出、安全、隐私和一步步怎么判断。先过安全这一关，再谈教育上的做法。" },
  { layer: "4", name: "输出层", body: "能出咨询回复、干预方案、话术、课程、文章和视频脚本；哪些真做得出来、哪些还缺材料，一项项标清楚。" },
  { layer: "+", name: "检查标准（evals）", body: "没有检查标准，前面做得再漂亮也不知道对不对。F05 专门检查「这句话该不该说」。" },
];

const JUDGMENT_PATH = [
  { step: "01", title: "事实", body: "先记录发生了什么、谁说的、什么时候；不急着解释。" },
  { step: "02", title: "推测", body: "先把专业上的猜测当成猜测，写清楚凭什么这么想、有多大把握、什么情况会推翻它。" },
  { step: "03", title: "安全这一关", body: "先判断这句话该不该说、要不要转介；风险到橙色或红色，就不生成教育建议。" },
  { step: "04", title: "建议", body: "在边界内给出能马上做的一步，不替家庭做决定，也不替专业人员担责任。" },
  { step: "05", title: "回头看，再改", body: "有了新情况，允许原来的理解作废；改对，比一直保持一致更重要。" },
];

export function ExpertResearchPage() {
  return (
    <>
      <PageHeader
        kicker="EXPERTISE & RESEARCH · 专业与研究"
        title={<>专业判断需要依据，<br />也需要允许修正。</>}
        lede="专家经验、研究中的想法、还没出版的家长读本，是三件不同的事，把握程度也不一样。这一页把它们分开说，不把还在验证的东西说成已经成立。"
        meta={["Yueming Expert OS · VALIDATION", "LRDF · RESEARCH", "《先看清，再伸手》· 家长读本 · RESEARCH", "Family Reality Lab · RESEARCH"]}
      />

      <nav className="anchor-nav shell" aria-label="本页章节">
        <a href="#expert-os">Expert OS</a>
        <a href="#expert-open">未关闭问题</a>
        <a href="#lrdf">LRDF</a>
        <a href="#book">家长读本</a>
        <a href="#lab">Family Reality Lab</a>
      </nav>

      <section className="section" id="expert-os">
        <div className="shell">
          <div className="detail-head">
            <div>
              <p className="kicker"><span>01 / YUEMING EXPERT OS</span><StatusPill status="VALIDATION" /></p>
              <h2>把专家的经验，<br />变成能检查、能改的方法。</h2>
            </div>
            <div className="detail-head-side">
              <p>它想做的不是替代专业工作者，而是把专业知识、经验和判断方法整理成可以检查、可以修正的辅助。最终判断和专业责任，仍然在人身上。</p>
              <p className="micro-note">现在还在验证几件事：会不会漏掉该停的地方、换个人用是否稳定、同行能不能用。还不能说它可以独立对外商用。</p>
            </div>
          </div>

          <div className="issue-alert" id="expert-open" role="note" aria-label="未关闭问题">
            <p className="issue-alert-kicker">OPEN ISSUES · 未关闭</p>
            <p><b>现在还不能对外说 Expert OS 已经可用。</b>可以转给谁、打哪个电话，这份名单还是空的；最后一道质量检查也不完整。同行能不能用、换个案例稳不稳、真实风险场景下会怎样，都还没验证完。下面写的是已经做到哪一步，不是已经做成。</p>
            <ul>
              {EXPERT_FIXES.open.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <ArrowLink to="/evidence">在证据页看到目前的验证记录和限制</ArrowLink>
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
              <h3 className="subhead">现在能核对的结构</h3>
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

          <h3 className="subhead subhead-spaced">专业判断怎么走（这是方法，还不是已验证的产品）</h3>
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
              <h3>已经改掉：第一次真跑发现的两件事</h3>
              <ul>
                {EXPERT_FIXES.fixed.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div className="issue-box issue-open">
              <h3>还没解决：所以现在还不能对外说可用</h3>
              <ul>
                {EXPERT_FIXES.open.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className="callout-row">
            <p className="callout"><span>2026-09-29 的真实形态复合案例。</span>第一次用真实案例跑完整条判断路径，发现风险分级和转介话术会打架，而且安全这一关没有检查标准。这份问题清单，比「结构看起来很完整」更有价值。</p>
            <p className="callout"><span>测试通过，不等于专业上就能用。</span>F01–F05 通过，只说明这几项已知的检查过了；同行能不能用、换案例稳不稳、真实风险场景下会怎样，都还没做完。</p>
            <p className="callout"><span>不替代专业责任。</span>系统要分清：哪些是事实、哪些是家长的理解、哪些是猜测、哪些还不知道。安全处置和转介，最后仍由人负责。</p>
          </div>
        </div>
      </section>

      <section className="section section-research" id="lrdf">
        <div className="shell">
          <div className="detail-head">
            <div>
              <p className="kicker"><span>02 / LRDF · 体系核心</span><StatusPill status="RESEARCH" /></p>
              <h2>从真实生活出发，<br />长出经得起检验的方法。</h2>
            </div>
            <div className="detail-head-side">
              <p>LRDF 是这套体系的主干，家长读本和具体方法都从它长出来。它来自真实的家庭实践，也一直交给心理学、发展科学、教育学、行为科学、精神医学、社会学、哲学和伦理学来对照、挑错。</p>
              <p className="micro-note">理论仍在验证，不是科学共识；不替代医疗与心理治疗。</p>
            </div>
          </div>

          <div className="lrdf-core">
            <div className="lrdf-core-title">
              <span>核心架构</span>
              <p>生命承接 <i>→</i> 能动恢复 <i>→</i> 生命成熟</p>
              <small>不是固定阶段，也不是三道必经关口。人可以回退，也可以重新需要承接。</small>
            </div>
            <div className="lrdf-layer-grid">
              {LRDF_LAYERS.map((layer) => (
                <article key={layer.title}>
                  <span>{layer.en}</span>
                  <h3>{layer.title}</h3>
                  <p>{layer.body}</p>
                </article>
              ))}
            </div>
            <p className="lrdf-layer-note">六层里，体系正文是唯一的底本；其他文件各自记录自己那部分，不能代替它。</p>
          </div>

          <div className="lrdf-split">
            <div className="lrdf-panel">
              <h3>三种知识，不互相顶替</h3>
              <p className="lrdf-panel-lede">科学、人类智慧、现实经验，回答的是不同问题，所以分开记。</p>
              {LRDF_SOURCES.map((source) => (
                <div className="lrdf-source" key={source.title}>
                  <b>{source.title}</b>
                  <p>{source.body}</p>
                </div>
              ))}
            </div>
            <div className="lrdf-panel">
              <h3>两种依据，不合并成一个分数</h3>
              <p className="lrdf-panel-lede">科学依据按强弱分级；月明在实践里发现的，单独记。</p>
              <div className="lrdf-levels" aria-label="科学证据等级">
                {[
                  ["A", "强依据"],
                  ["B", "有支持"],
                  ["C", "工作假设"],
                  ["D", "实践发现"],
                  ["X", "当前不支持"],
                ].map(([level, label]) => (
                  <span key={level}><b>{level}</b>{label}</span>
                ))}
              </div>
              <p className="lrdf-panel-note">D 不代表没价值，但也不能当成 A。原创的方法往往一开始只是 D；重要的是照实写。</p>
            </div>
          </div>

          <div className="lrdf-ladder-block">
            <h3>专业里的叫法，和家长听得懂的说法</h3>
            <p className="lrdf-panel-lede">同一套体系，说给专业者听，也说给家长听。</p>
            <div className="lrdf-ladder">
              {LRDF_LADDER.map((rung) => (
                <article key={rung.system}>
                  <span>体系里的说法</span>
                  <b>{rung.system}</b>
                  <i aria-hidden="true">↓</i>
                  <strong>{rung.parent}</strong>
                  <p>{rung.body}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="callout-row">
            <p className="callout"><span>不是诊断系统。</span>不做精神医学诊断，也不预测风险等级；不替代医疗和心理治疗，超出边界就及时转介。</p>
            <p className="callout"><span>不是固定人生模板。</span>提供生长条件，不提供人生答案；不规定「好孩子应该长成什么样」。</p>
            <p className="callout"><span>关于隐私。</span>真实的家庭咨询资料不会放进公开仓库；对外只保留去掉身份信息后的研究结果、方法、反例和结论。</p>
          </div>

          <div className="lrdf-split lrdf-rights">
            <div className="lrdf-panel">
              <h3>这套体系，我现在公开多少</h3>
              <p className="lrdf-panel-lede">下面这些，是我愿意先拿出来一起讨论的部分；更完整的内容还在整理和验证。</p>
              <div className="lrdf-boundary">
                <p><b>可以公开</b><span>它是做什么的、三段结构、六层的名字、怎么标注依据、用到哪里为止，以及说给家长听的版本。</span></p>
                <p><b>暂时不公开</b><span>体系正文、一条条判断的明细、具体方法步骤、真实家庭材料，还有完整书稿。</span></p>
                <p><b>为什么</b><span>因为理论还在验证。先公开能核对的结构和目前的进度，不把还没验证的东西说成结论。</span></p>
              </div>
            </div>
            <div className="lrdf-panel">
              <h3>欢迎引用，请注明出处</h3>
              <p className="lrdf-panel-lede">这里的文字和图表，都是我写的、我画的。</p>
              <p className="lrdf-rights-copy">欢迎引用，注明作者、标题和来源就好。整段照搬、改写后当成自己的、拿去做收费培训，或者批量抓取，请先征得我的书面同意。</p>
              <p className="lrdf-rights-citation">
                <span>可以这样写</span>
                月明：《LRDF 公开说明》，YUE MING ECOSYSTEM，{SITE.version}，{SITE.canonical}
              </p>
              <p className="lrdf-rights-contact">合作或授权，写信给我：<a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="book">
        <div className="shell">
          <div className="detail-head">
            <div>
              <p className="kicker"><span>03 / 家长读本 · 《先看清，再伸手》</span><StatusPill status="RESEARCH" /></p>
              <h2>把同一套体系，<br />写成家长能读的书。</h2>
            </div>
            <div className="detail-head-side">
              <p>它是 LRDF 面向家长的那本书，不是第二套理论：帮父母看清当下发生了什么、能做什么，再根据结果调整。</p>
              <p className="micro-note">完整作者审阅稿，作者还在审，尚未出版。作者终审和独立专业审查都还没完成。</p>
            </div>
          </div>

          <div className="book-layout">
            <div className="book-cover" aria-label="家长读本信息卡">
              <span className="book-cover-kicker">LRDF · PARENT EDITION</span>
              <p className="book-cover-title">先看清，<br />再伸手</p>
              <p className="book-cover-sub">在真实生活的凹凸不平里，<br />学习判断、行动与修正。</p>
              <span className="book-cover-status">家长读本 · 未出版</span>
            </div>
            <div className="book-items">
              {BOOK_ITEMS.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
              <div className="book-progress">
                <p><span>读本结构</span><b>四部 · 十一章 · 结语《再回到那顿饭》</b></p>
                <p><span>最近记录</span><b>2026-10-27 作者审阅稿</b></p>
                <p><span>当前状态</span><b>完整作者审阅稿 · 作者审阅中 · 未出版</b></p>
                <p><span>未完成</span><b>作者终审 · 独立专业审查</b></p>
                <p><span>还不能说</span><b>已定稿 · 已出版 · 已有人读过并验证</b></p>
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
              <h2>真实的家庭问题，<br />怎么变成可以研究的材料。</h2>
            </div>
            <div className="detail-head-side">
              <p>每天从现实里拿一个真实的家庭问题，不先加工就交给 AI，保留它本来的样子；只说自己真正看见的，再把现实反馈带回 Family Space。</p>
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
            <p><b>13</b> 期记录（001–007、009–014）</p>
            <p><b>7</b> 条首周目标（V0.1，#001–#007）</p>
            <p><b>0</b> 份原始家庭资料进入公开站点</p>
            <p><b>还没核对</b> 公开发布状态和传播效果</p>
          </div>

          <div className="callout-row">
            <p className="callout"><span>原话优先。</span>口语、重复、犹豫、矛盾、情绪，本来就是现实的一部分；不为了显得「专业」「好看」去重新加工。</p>
            <p className="callout"><span>三种材料分开。</span>家长原话、研究提炼、公开评论要分开标；不能把评论当成原话。</p>
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
