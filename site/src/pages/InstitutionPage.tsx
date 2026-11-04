import { useEffect, useState } from "react";
import { ArrowLink, PageHeader, SectionHeading, StatusPill } from "@/components/Chrome";
import { FSO_SCENARIOS, SERVICE_LOOP, SERVICE_OFFERS } from "@/site/content";

export function InstitutionPage() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % SERVICE_LOOP.length);
    }, 2400);
    return () => window.clearInterval(timer);
  }, [playing]);

  const step = SERVICE_LOOP[active];

  return (
    <>
      <PageHeader
        kicker="INSTITUTION · 机构服务"
        title={<>让家庭教育机构拥有<br />真正持续运行的服务体系。</>}
        lede="机构不缺课程、导师和经验，真正难的是把它们串起来，变成一条连续、能回头看、也能不断改的家庭服务。"
        meta={["Family Service OS", "当前状态 CODE_ACCEPTED", "未部署 · 未接入真实机构数据"]}
      />

      <section className="section">
        <div className="shell">
          <SectionHeading
            index="01"
            kicker="THE REAL PROBLEM"
            title={<>服务不是没有发生，<br />而是很难连起来。</>}
            lede="下面四个场景来自机构服务的常见断点。它们描述的是设计要解决的问题，不是对某一家机构的诊断结论。"
          />
          <div className="scenario-grid">
            {FSO_SCENARIOS.map((scenario) => (
              <article className="scenario" key={scenario.index}>
                <span className="scenario-index">{scenario.index}</span>
                <h3>{scenario.title}</h3>
                <p>{scenario.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-loop">
        <div className="shell">
          <SectionHeading
            index="02"
            kicker="TARGET SERVICE LOOP"
            title={<>一条从咨询到复盘的完整服务。</>}
            lede="这是当前设计的目标服务流程，不是已经在所有机构实现的现状。点击任一步，查看它要留下什么。"
          />

          <div className="loop-toolbar">
            <button type="button" className="btn btn-ghost btn-small" onClick={() => setPlaying((value) => !value)} aria-pressed={playing}>
              {playing ? "暂停逐步播放" : "逐步播放流程"}
            </button>
            <span className="loop-hint">7 步 · 设计目标 · 未在所有机构验证</span>
            <span className="loop-swipe-hint" aria-hidden="true">左右滑动查看全部 7 步</span>
          </div>

          <div className="loop-rail" role="tablist" aria-label="目标服务流程">
            {SERVICE_LOOP.map((item, index) => (
              <button
                key={item.step}
                type="button"
                role="tab"
                aria-selected={active === index}
                className={active === index ? "loop-step is-active" : "loop-step"}
                onClick={() => { setActive(index); setPlaying(false); }}
              >
                <span>{item.step}</span>
                <b>{item.title}</b>
              </button>
            ))}
          </div>

          <div className="loop-detail" role="tabpanel" aria-live="polite">
            <div className="loop-detail-index">{step.step}</div>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
            <p className="loop-detail-note">每一步都该留下能回头查的事实、谁负责、下一步是什么；具体表单和权限，属于 Family Service OS 以后的产品范围。</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            index="03"
            kicker="BEFORE / AFTER"
            title={<>改造前后，变的是服务能不能一直走下去。</>}
            lede="这是设计目标，不是已验证的提升比例。"
          />
          <div className="before-after">
            <div className="ba-column ba-before">
              <h3>改造前 <span>常见状态</span></h3>
              <ul>
                <li>依赖导师个人经验</li>
                <li>信息分散在不同人的记忆与聊天里</li>
                <li>跟进容易中断</li>
                <li>交接困难</li>
                <li>复盘缺少统一依据</li>
              </ul>
            </div>
            <div className="ba-arrow" aria-hidden="true">→</div>
            <div className="ba-column ba-after">
              <h3>设计目标 <span>可运行的服务</span></h3>
              <ul>
                <li>事实有记录</li>
                <li>责任有归属</li>
                <li>行动有确认</li>
                <li>服务有连续性</li>
                <li>过程能回头查</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-product">
        <div className="shell">
          <div className="product-head">
            <div>
              <p className="kicker"><span>04 / FAMILY SERVICE OS</span><StatusPill status="CODE_ACCEPTED" /></p>
              <h2>机构端的三个工作面。</h2>
              <p>V0 不做大而全的客户管理系统，也不把高风险的建议自动发出去。它先把咨询师、主管、经营者各自真正需要看见的东西，放回同一个能用的工作面。</p>
            </div>
            <div className="product-status-box">
              <p><span>代码验收</span><b>已通过</b></p>
              <p><span>主分支合并</span><b>未合并</b></p>
              <p><span>部署</span><b>未部署</b></p>
              <p><span>真实机构数据</span><b>未接入</b></p>
            </div>
          </div>
          <p className="status-asof">核对日期 2026-11-02。代码验收用的是模拟数据；一项过了，不能替代另外三项。</p>

          <div className="surface-grid">
            <article>
              <span>01</span>
              <h3>咨询师</h3>
              <p>我的家庭 / 个案工作台。服务前准备、个案理解、服务后复盘与长期连续性。</p>
            </article>
            <article>
              <span>02</span>
              <h3>主管</h3>
              <p>今日需要我介入的人。让需要专业判断与风险处置的时刻被看见，而不是淹没在列表里。</p>
            </article>
            <article>
              <span>03</span>
              <h3>经营者</h3>
              <p>经营和服务的整体状况。看见服务过程里哪里断了、哪里有风险、什么经验可以再用，而不只是结果数字。</p>
            </article>
          </div>

          <div className="callout-row">
            <p className="callout"><span>还没上线，也没接真实数据。</span>代码验收用的是模拟数据；测试通过，不等于在机构现场也成立。</p>
            <p className="callout"><span>高风险不外发。</span>风险高的情形不自动给出教育建议，交给承担专业责任的人判断。</p>
            <p className="callout"><span>专业责任不外包。</span>系统区分事实、用户解释、假设与未知；新证据可以修正甚至推翻旧理解。</p>
          </div>
        </div>
      </section>

      <section className="section section-offers" id="offers">
        <div className="shell">
          <SectionHeading
            index="05"
            kicker="SERVICE OFFERS"
            title={<>从具体断点开始的小项目。</>}
            lede="以下为试销中的服务形式，不是已验证的标准产品。价格和交付范围按机构规模、服务小组和实际问题单独谈，本站不公开报价。"
          />
          <div className="offer-grid">
            {SERVICE_OFFERS.map((offer, index) => (
              <article className="offer" key={offer.name}>
                <div className="offer-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <em>试销中</em>
                </div>
                <h3>{offer.name}</h3>
                <p>{offer.body}</p>
                <small>{offer.form}</small>
              </article>
            ))}
          </div>
          <div className="offer-note">
            <p><b>价格说明：</b>本站不展示价格。这里说的价格都只是试销时的设想，和双方真正签约的价格不能混着讲；试点开始前，先把做什么、哪些数据能用、怎样算做完说清楚。</p>
            <ArrowLink to="/cooperation">讨论机构合作</ArrowLink>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="next-grid">
            <ArrowLink to="/expert-and-research">继续看专业判断系统</ArrowLink>
            <ArrowLink to="/evidence">查看 Family Service OS 证据</ArrowLink>
            <ArrowLink to="/cooperation">讨论机构合作</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
