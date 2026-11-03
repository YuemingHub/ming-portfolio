import { useMemo, useRef, useState } from "react";
import { ArrowLink, PageHeader, SectionHeading } from "@/components/Chrome";
import { navigate } from "@/site/router";
import { CONTACT, PARTNER_TYPES } from "@/site/content";

const PRINCIPLES = [
  { title: "从具体问题开始", body: "先看一次真实服务断点、一条专业判断链或一个可验证的小任务，不从「全面合作」开始。" },
  { title: "先看资产与限制", body: "公开入口、项目状态、证据与未完成风险都可以先看；不把还在验证的能力包装成成熟产品。" },
  { title: "小样本先跑通", body: "先做 7 天、30 天或一个小样本试点，用现实反馈决定是否扩大，而不是先承诺长期结果。" },
];

export function CooperationPage() {
  const [activeId, setActiveId] = useState(PARTNER_TYPES[0].id);
  const [problem, setProblem] = useState("");
  const [next, setNext] = useState("");
  const [copied, setCopied] = useState("");
  const briefRef = useRef<HTMLTextAreaElement>(null);
  const active = PARTNER_TYPES.find((item) => item.id === activeId) ?? PARTNER_TYPES[0];

  const brief = useMemo(() => {
    const lines = [
      "YUE MING ECOSYSTEM · 合作简报",
      "生成日期：2026-11-02",
      "",
      `合作对象类型：${active.label}`,
      `合作方向：${active.headline}`,
      "",
      "想先解决的一个具体问题：",
      problem.trim() || "（尚未填写）",
      "",
      "期望的下一步：",
      next.trim() || "（尚未填写）",
      "",
      "我希望先看到：产品入口 / 当前状态 / 证据与限制 / 合作边界。",
      "",
      "说明：本简报由本站本地生成，未发送、未保存；请通过已确认的公开通道（GitHub Issues）发送。",
    ];
    return lines.join("\n");
  }, [active, problem, next]);

  async function copyBrief() {
    try {
      await navigator.clipboard.writeText(brief);
      setCopied("已复制到剪贴板。本站没有发送或保存这份内容。");
    } catch {
      briefRef.current?.focus();
      briefRef.current?.select();
      setCopied("无法自动复制，请使用已选中的文本手动复制。本站没有发送或保存这份内容。");
    }
  }

  return (
    <>
      <PageHeader
        kicker="COOPERATION · 联系与交流"
        title={<>先看真实资产，<br />再谈一起做什么。</>}
        lede="我们愿意和家庭教育机构、专业工作者、技术伙伴、研究伙伴、资源与投资伙伴一起，把真实问题做成可验证的事情。合作入口不是一个宏大的招商页，而是一份可以当面核对现状的简报。"
        meta={["5 类合作对象", "从具体断点开始", "本站不收集联系信息"]}
      />

      <section className="section section-contact">
        <div className="shell">
          <div className="contact-panel">
            <div>
              <p className="section-kicker"><span className="section-index">00</span>PUBLIC CHANNEL</p>
              <h2>一个已确认的公开联系通道。</h2>
              <p>{CONTACT.note}</p>
            </div>
            <div className="contact-actions">
              <a className="btn btn-primary" href={CONTACT.url} target="_blank" rel="noreferrer noopener">
                {CONTACT.channel} <span aria-hidden="true">↗</span>
              </a>
              <span>不公布未核实的邮箱、微信或社交账号。</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            index="01"
            kicker="WHO WE WORK WITH"
            title={<>五类合作对象，<br />五种不同的起点。</>}
            lede="选择最接近你的一类，查看我们建议从哪里开始。每一类都不是完整解决方案，而是一个可以共同验证的方向。"
          />

          <div className="partner-layout">
            <div className="partner-tabs" role="tablist" aria-label="合作对象类型">
              {PARTNER_TYPES.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`partner-tab-${item.id}`}
                  aria-selected={activeId === item.id}
                  aria-controls="partner-panel"
                  className={activeId === item.id ? "partner-tab is-active" : "partner-tab"}
                  onClick={() => setActiveId(item.id)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </button>
              ))}
            </div>

            <div className="partner-panel" id="partner-panel" role="tabpanel" aria-labelledby={`partner-tab-${active.id}`}>
              <p className="panel-kicker">STARTING POINT</p>
              <h3>{active.headline}</h3>
              <p className="partner-body">{active.body}</p>
              <div className="partner-offer">
                <span>建议的第一步</span>
                <p>{active.offer}</p>
              </div>
              <div className="partner-actions">
                <ArrowLink to="/evidence">先看项目状态与证据</ArrowLink>
                <button type="button" className="text-link" onClick={() => navigate("/cooperation#brief")}>
                  用这一类生成合作简报 ↓
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-cooperation-principles">
        <div className="shell">
          <SectionHeading
            index="02"
            kicker="HOW WE START"
            title={<>三条合作原则。</>}
            lede="它们不是流程装饰，而是用来避免把一次交流变成无法兑现的承诺。"
          />
          <div className="principle-grid">
            {PRINCIPLES.map((item, index) => (
              <article className="principle" key={item.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="brief">
        <div className="shell">
          <SectionHeading
            index="03"
            kicker="LOCAL BRIEF BUILDER"
            title={<>先写一页合作简报。</>}
            lede="不要求先留下联系方式。你可以在这里把问题与期望写成一页文字，复制后通过本页上方已确认的 GitHub Issues 通道发送。本站不收集、不上传、不保存。"
          />

          <div className="brief-layout">
            <div className="brief-form">
              <label className="field">
                <span>合作对象类型</span>
                <select value={activeId} onChange={(event) => setActiveId(event.target.value)}>
                  {PARTNER_TYPES.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>想先解决的一个具体问题</span>
                <textarea
                  rows={4}
                  value={problem}
                  onChange={(event) => setProblem(event.target.value)}
                  placeholder="例如：首咨之后，家长在 7 天内流失；导师交接时总要重新讲一遍。"
                />
              </label>
              <label className="field">
                <span>期望的下一步</span>
                <textarea
                  rows={3}
                  value={next}
                  onChange={(event) => setNext(event.target.value)}
                  placeholder="例如：先用一次真实服务断点做 30 天小样本试点。"
                />
              </label>
              <p className="field-note">输入只停留在这个浏览器页面里；刷新即消失。</p>
            </div>

            <div className="brief-output">
              <p className="panel-kicker">GENERATED LOCALLY</p>
              <label className="field">
                <span>合作简报预览（可编辑）</span>
                <textarea ref={briefRef} rows={17} value={brief} readOnly />
              </label>
              <div className="brief-actions">
                <button type="button" className="btn btn-primary" onClick={copyBrief}>复制这份简报</button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => { setProblem(""); setNext(""); setCopied(""); }}
                >
                  清空重写
                </button>
              </div>
              <p className="brief-status" role="status" aria-live="polite">{copied}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-boundary">
        <div className="shell boundary-grid">
          <SectionHeading
            index="04"
            kicker="WHAT WE WILL NOT DO"
            title={<>合作开始前，<br />先说清不做什么。</>}
          />
          <ul className="not-claimed">
            <li><span aria-hidden="true">×</span>不把未发布页面或原型包装成已上线产品。</li>
            <li><span aria-hidden="true">×</span>不把 Expert OS 的验证中能力宣传为成熟商用能力。</li>
            <li><span aria-hidden="true">×</span>不把概念关系说成已完成的技术集成。</li>
            <li><span aria-hidden="true">×</span>不接入或对外展示真实家庭敏感数据。</li>
            <li><span aria-hidden="true">×</span>不在未对齐范围、数据边界与验收方式前承诺效果数字。</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="closing-panel">
            <div>
              <h2>如果你也在解决一个真实问题，<br />我们可以从一次具体的核对开始。</h2>
              <p>带着问题来，不必先接受整套叙事。先看已经做出来的产品、公开入口、状态与限制，再决定是否值得一起做下一步。</p>
            </div>
            <div className="closing-actions">
              <ArrowLink to="/evidence">查看完整证据索引</ArrowLink>
              <ArrowLink to="/ecosystem">回到体系总览</ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
