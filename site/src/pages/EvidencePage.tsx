import { useState } from "react";
import { ArrowLink, PageHeader, SectionHeading, StatusPill } from "@/components/Chrome";
import { EVIDENCE_LAYERS, EVIDENCE_RULES, PROJECTS, SITE, STATUS_COUNTS, STATUS_META, STATUS_ORDER } from "@/site/content";
import { assetUrl } from "@/site/base";
import type { Status } from "@/site/types";

const KIND_LABEL = {
  public: "公开页",
  screenshot: "截图",
  "private-doc": "内部留档",
  measurement: "核对记录",
  pending: "待补",
} as const;

const LAYER_COUNTS = PROJECTS.reduce(
  (counts, project) => {
    for (const item of project.evidence) {
      if (item.kind === "pending") counts.pending += 1;
      else if (item.kind === "public" || item.kind === "screenshot") counts.public += 1;
      else counts.internal += 1;
    }
    return counts;
  },
  { public: 0, internal: 0, pending: 0 },
);

type Filter = "ALL" | Status;

function evidenceHref(href: string): string {
  return href.startsWith("/") ? assetUrl(href) : href;
}

export function EvidencePage() {
  const [filter, setFilter] = useState<Filter>("ALL");
  const visible = filter === "ALL" ? PROJECTS : PROJECTS.filter((project) => project.status === filter);

  return (
    <>
      <PageHeader
        kicker="EVIDENCE & PROGRESS · 证据与进展"
        title={<>做到哪里，<br />就写到哪里。</>}
        lede="这一页把每个项目放回同一把尺子上：面向谁、已经有什么、现在到哪一步、证据在哪里、哪天核对、还有什么不能说。状态不是排名，而是说明限制。"
        meta={[`${PROJECTS.length} 条项目记录`, "7 种状态", `项目状态核对日期 ${SITE.verifiedAt}`, "公开版本不含私有链接"]}
      />

      <section className="section section-status">
        <div className="shell">
          <SectionHeading
            index="01"
            kicker="SEVEN STATUSES"
            title={<>七种状态，彼此不能替代。</>}
            lede="测试通过、代码接受、原型可运行、公开页可访问、研究有假设，都不是同一件事。"
          />
          <div className="status-legend">
            {STATUS_ORDER.map((status) => {
              const meta = STATUS_META[status];
              return (
                <article className={`status-card tone-${meta.tone}`} key={status}>
                  <div className="status-card-head">
                    <StatusPill status={status} compact />
                    <b>{STATUS_COUNTS[status]}</b>
                  </div>
                  <h3>{meta.zh}</h3>
                  <p>{meta.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            index="02"
            kicker="EVIDENCE LAYERS"
            title={<>证据分三层：公开可核、内部留档、待补。</>}
            lede="三层不能互相替代。内部记录只说明「有这件事、结论是什么」；拿不出正常证据时，就标成「待补」，不拿别的东西顶上。"
          />
          <div className="evidence-layers">
            {EVIDENCE_LAYERS.map((layer) => (
              <article className="evidence-layer" key={layer.id}>
                <p className="evidence-layer-kicker">{layer.id.toUpperCase()}</p>
                <h3>{layer.title}</h3>
                <p>{layer.description}</p>
                <b>{LAYER_COUNTS[layer.id]}</b>
                <small>条证据条目</small>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="projects">
        <div className="shell">
          <SectionHeading
            index="03"
            kicker="PROJECT STATUS TABLE"
            title={<>项目状态表。</>}
            lede="筛选只改变看到哪些，不改变状态。每条记录都写清限制；公开页能打开，不等于登录后的功能也验证过。"
          />

          <div className="filter-bar" role="group" aria-label="按状态筛选项目">
            <button
              type="button"
              className={filter === "ALL" ? "filter-chip is-active" : "filter-chip"}
              aria-pressed={filter === "ALL"}
              onClick={() => setFilter("ALL")}
            >
              全部 <span>{PROJECTS.length}</span>
            </button>
            {STATUS_ORDER.map((status) => (
              <button
                key={status}
                type="button"
                className={filter === status ? "filter-chip is-active" : "filter-chip"}
                aria-pressed={filter === status}
                onClick={() => setFilter(status)}
              >
                {status} <span>{STATUS_COUNTS[status]}</span>
              </button>
            ))}
          </div>
          <p className="filter-note">七个状态都会列出来；显示 0 的也保留，说明这一类现在确实没有记录。</p>

          <p className="filter-result" aria-live="polite">
            显示 {visible.length} / {PROJECTS.length} 条记录
          </p>

          <div className="evidence-table-wrap">
            <table className="evidence-table">
              <caption className="sr-only">YUE MING ECOSYSTEM 项目状态与证据表</caption>
              <thead>
                <tr>
                  <th scope="col">项目</th>
                  <th scope="col">面向对象</th>
                  <th scope="col">已有能力</th>
                  <th scope="col">当前状态</th>
                  <th scope="col">证据</th>
                  <th scope="col">核对日期</th>
                  <th scope="col">限制 / 不能宣称</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((project) => (
                  <tr key={project.id}>
                    <th scope="row">
                      <span className="evidence-name">{project.name}</span>
                      {project.en && <small>{project.en}</small>}
                    </th>
                    <td>{project.audience}</td>
                    <td>{project.capability}</td>
                    <td><StatusPill status={project.status} /></td>
                    <td>
                      <ul className="evidence-links">
                        {project.evidence.map((item) => (
                          <li key={item.label}>
                            {item.href ? (
                              <a href={evidenceHref(item.href)} target="_blank" rel="noreferrer">
                                {item.label} <span aria-hidden="true">↗</span>
                              </a>
                            ) : (
                              <span>{item.label}</span>
                            )}
                            <em className={`kind-${item.kind}`}>{KIND_LABEL[item.kind]}</em>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="evidence-date">{project.verified}</td>
                    <td>{project.limits}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="evidence-cards">
            {visible.map((project) => (
              <article className="evidence-card" key={project.id}>
                <div className="evidence-card-head">
                  <div>
                    <h3>{project.name}</h3>
                    {project.en && <p>{project.en}</p>}
                  </div>
                  <StatusPill status={project.status} compact />
                </div>
                <dl>
                  <div><dt>面向对象</dt><dd>{project.audience}</dd></div>
                  <div><dt>已有能力</dt><dd>{project.capability}</dd></div>
                  <div>
                    <dt>证据</dt>
                    <dd>
                      <ul className="evidence-links">
                        {project.evidence.map((item) => (
                          <li key={item.label}>
                            {item.href ? (
                              <a href={evidenceHref(item.href)} target="_blank" rel="noreferrer">
                                {item.label} <span aria-hidden="true">↗</span>
                              </a>
                            ) : (
                              <span>{item.label}</span>
                            )}
                            <em className={`kind-${item.kind}`}>{KIND_LABEL[item.kind]}</em>
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div><dt>核对日期</dt><dd>{project.verified}</dd></div>
                  <div><dt>限制 / 不能宣称</dt><dd>{project.limits}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-boundary">
        <div className="shell boundary-grid">
          <div>
            <SectionHeading
              index="04"
              kicker="SIX EVIDENCE RULES"
              title={<>六条证据规则。</>}
              lede="六条规则，说明每个说法可以被核对到什么程度。"
            />
          </div>
          <ol className="rule-list">
            {EVIDENCE_RULES.map((rule, index) => (
              <li key={rule}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {rule}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="next-grid">
            <ArrowLink to="/ecosystem">回到体系图</ArrowLink>
            <ArrowLink to="/institution">看机构服务系统</ArrowLink>
            <ArrowLink to="/cooperation">带着问题来谈合作</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
