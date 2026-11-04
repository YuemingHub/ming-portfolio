import { EcosystemMap } from "@/components/EcosystemMap";
import { ArrowLink, PageHeader, SectionHeading, StatusPill } from "@/components/Chrome";
import { MAP_NODES, MAP_ZONES } from "@/site/content";

const ROLE: Record<string, string> = {
  life: "人每天真实生活的三个入口：家庭、自己、世界。它们各自独立，不是同一个登录下的三个标签页。",
  service: "把专业经验组织成可运行的服务与判断辅助；一个面向机构，一个面向专业工作者。",
  knowledge: "提供研究假设、方法、家长读本与真实问题素材，持续接受证据检验。",
  execution: "连接人的目标与 AI、工具、知识、现实资源；它是工作方法，不是运行时平台。",
  technology: "公开站解释体系方向；v0.1 协议骨架保留为可验证原型，不宣称是其他系统的底层基础设施。",
};

const NOT_CLAIMED = [
  "三个空间已经统一登录或共享数据。",
  "Family Service OS 已经在机构生产环境运行。",
  "Yueming Expert OS 已经达到独立对外商用标准。",
  "MingOS v0.1 是三个空间的底层运行时。",
  "Agent Space 已经产品化，或与各项目完成运行时集成。",
  "研究假设已经被验证为科学共识。",
];

export function EcosystemPage() {
  return (
    <>
      <PageHeader
        kicker="ECOSYSTEM · 体系总览"
        title={<>这些项目不是孤立的，<br />它们共同构成一套体系。</>}
        lede="从人的生活空间，到专业服务、研究与知识、连接与执行、技术探索，五个区域回答不同的问题。点击任一节点，查看它面向谁、解决什么、当前做到哪里、还缺什么。"
        meta={["10 个节点", "5 个区域", "3 类连接线", "项目状态核验日期 2026-11-02"]}
      />

      <section className="section section-map">
        <div className="shell">
          <EcosystemMap />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <SectionHeading
            index="01"
            kicker="HOW TO READ THE SYSTEM"
            title={<>每个系统为什么需要存在。</>}
            lede="这不是一张组织架构图，也不是一张已经打通的数据流图。它先把“谁在什么位置、承担什么”讲清楚，再标注哪些连接已经核实、哪些只是设计。"
          />
          <div className="zone-roles">
            {MAP_ZONES.map((zone) => (
              <article className="zone-role" key={zone.id}>
                <div className="zone-role-head">
                  <span className="zone-role-index">{zone.index}</span>
                  <div>
                    <h3>{zone.title}</h3>
                    <p>{zone.en}</p>
                  </div>
                </div>
                <p className="zone-role-text">{ROLE[zone.id]}</p>
                <ul>
                  {MAP_NODES.filter((node) => node.zone === zone.id).map((node) => (
                    <li key={node.id}>
                      <span>{node.name}</span>
                      <span className="zone-role-status">
                        {node.statuses.map((status) => <StatusPill key={status} status={status} compact />)}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-boundary">
        <div className="shell boundary-grid">
          <div>
            <SectionHeading
              index="02"
              kicker="WHAT WE DO NOT CLAIM"
              title={<>不把概念关系，画成已经实现的数据流。</>}
              lede="体系图里的实线只用于已核实的公开产品或数据连接；虚线与点线代表设计关系或未来方向。下面这些句子，当前都不成立。"
            />
          </div>
          <ul className="not-claimed">
            {NOT_CLAIMED.map((item) => (
              <li key={item}><span aria-hidden="true">×</span>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="next-grid">
            <ArrowLink to="/spaces">继续看三个空间</ArrowLink>
            <ArrowLink to="/institution">看机构服务系统</ArrowLink>
            <ArrowLink to="/expert-and-research">看专业判断与研究</ArrowLink>
            <ArrowLink to="/agent-space">看 Agent Space</ArrowLink>
            <ArrowLink to="/evidence">看每个节点的证据</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
