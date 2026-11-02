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
        lede="机构不缺课程、导师和经验，真正困难的是如何把这些资源组织起来，形成连续、可复核、能够不断改进的家庭服务。"
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
            title={<>一条能被复核的服务闭环。</>}
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
            <p className="loop-detail-note">每一步都应留下可复核的事实、责任人与下一步；具体表单与权限仍属于 Family Service OS 的产品范围。</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            index="03"
            kicker="BEFORE / AFTER"
            title={<>改造前后，变化的是服务的可运行性。</>}
            lede="以下对照表达设计目标，不是已验证的提升比例。我们没有可对外披露的效果数据。"
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
                <li>过程可复核</li>
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
              <p>V0 不做大而全的 CRM，也不做自动高风险外发。它先把咨询师、主管、经营者各自真正需要看见的东西放回一个可运行的工作面。</p>
            </div>
            <div className="product-status-box">
              <p><span>代码验收</span><b>ACCEPTED</b></p>
              <p><span>主分支合并</span><b>NOT MERGED</b></p>
              <p><span>部署</span><b>NOT DEPLOYED</b></p>
              <p><span>真实机构数据</span><b>BLOCKED</b></p>
            </div>
          </div>
          <p className="status-asof">四个维度分别记录，核验日期 2026-11-02。代码验收使用合成数据；任何一项通过都不能替代另外三项。</p>

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
              <p>经营与服务健康度。看见服务过程里的断点、风险与可复用经验，而不只是结果数字。</p>
            </article>
          </div>

          <div className="callout-row">
            <p className="callout"><span>测试通过不等于机构现场验证。</span>代码验收使用合成数据；真实数据与生产启用仍被政策门禁阻断。</p>
            <p className="callout"><span>代码接受不等于上线。</span>代码评审已于 2026-11-02 接受，但尚未合入主线、尚未部署；本站不把机构端写成已可用产品。</p>
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
            lede="以下为试销中的服务形式，不是已验证的标准产品。价格与交付范围按机构规模、服务小组与实际问题单独核定，本站不公开报价。"
          />
          <div className="offer-grid">
            {SERVICE_OFFERS.map((offer, index) => (
              <article className="offer" key={offer.name}>
                <div className="offer-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <em>试销假设</em>
                </div>
                <h3>{offer.name}</h3>
                <p>{offer.body}</p>
                <small>{offer.form}</small>
              </article>
            ))}
          </div>
          <div className="offer-note">
            <p><b>价格说明：</b>本站不展示价格。任何价格都属于试销假设或双方实际签约价格，不能混用；机构试点前先对齐交付范围、数据边界与验收方式。</p>
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
