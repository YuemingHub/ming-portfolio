import { useMemo, useState } from "react";
import { MAP_AGGREGATION_NOTE, MAP_NODES, MAP_ZONES } from "@/site/content";
import type { MapNode } from "@/site/types";
import { ArrowLink, StatusPill } from "@/components/Chrome";

type Box = { x: number; y: number; w: number; h: number };

const BOXES: Record<string, Box> = {
  family: { x: 54, y: 100, w: 318, h: 58 },
  self: { x: 54, y: 168, w: 318, h: 58 },
  world: { x: 54, y: 236, w: 318, h: 58 },
  fso: { x: 54, y: 458, w: 318, h: 66 },
  expert: { x: 54, y: 550, w: 318, h: 66 },
  lrdf: { x: 460, y: 100, w: 310, h: 58 },
  lab: { x: 460, y: 188, w: 310, h: 58 },
  book: { x: 460, y: 276, w: 310, h: 58 },
  agent: { x: 860, y: 294, w: 270, h: 118 },
  mingos: { x: 460, y: 575, w: 310, h: 120 },
};

const ZONE_BOXES: Record<string, Box> = {
  life: { x: 32, y: 44, w: 360, h: 280 },
  service: { x: 32, y: 400, w: 360, h: 270 },
  knowledge: { x: 440, y: 44, w: 350, h: 326 },
  execution: { x: 840, y: 230, w: 310, h: 220 },
  technology: { x: 440, y: 520, w: 350, h: 210 },
};

const NODE_FOR_ZONE = (zone: string) => MAP_NODES.filter((node) => node.zone === zone);

const EDGES = [
  {
    number: "01",
    kind: "solid",
    d: "M460 620 C402 600 390 430 392 300",
    label: "mingos.cn 公开导航到三个入口（已核实的公开链接，不是数据互通）",
  },
  {
    number: "02",
    kind: "dashed",
    d: "M790 210 C756 160 560 150 392 140",
    label: "Family Reality Lab → Family Space：现实问题怎么带回来（设计中的关系，还没有技术上的连接）",
  },
  {
    number: "03",
    kind: "dashed",
    d: "M392 490 C420 430 420 240 392 158",
    label: "Family Service OS ↔ Family Space：家长端怎么关联（设计中的关系，两边还没有真正连起来）",
  },
  {
    number: "04",
    kind: "dashed",
    d: "M560 158 C560 330 430 470 392 560",
    label: "LRDF → Yueming Expert OS：方法来源（只到文字和规则这一层，不是系统之间的调用）",
  },
  {
    number: "05",
    kind: "dashed",
    d: "M860 330 C820 300 806 250 790 220",
    label: "Agent Space → 研究与知识：协作发生在仓库和项目现场，系统之间并没有连起来",
  },
  {
    number: "06",
    kind: "dashed",
    d: "M860 390 C700 500 520 552 392 568",
    label: "Agent Space → 专业服务系统：合作的工作方法，不是产品上的集成",
  },
  {
    number: "07",
    kind: "dotted",
    d: "M860 300 C760 70 520 60 392 100",
    label: "Agent Space → 人与生活空间：合作的工作方法（项目现场的关系，系统之间还没连）",
  },
  {
    number: "08",
    kind: "dotted",
    d: "M600 520 C600 470 565 450 560 430",
    label: "MingOS v0.1 → Agent Space：未来可能的连接方向（未实现）",
  },
];

function nodeLabel(node: MapNode) {
  return `${node.name}，${node.en}`;
}

export function EcosystemMap() {
  const [selectedId, setSelectedId] = useState("family");
  const selected = useMemo(
    () => MAP_NODES.find((node) => node.id === selectedId) ?? MAP_NODES[0],
    [selectedId],
  );

  function select(id: string) {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 960px)").matches) {
      window.setTimeout(() => {
        document.getElementById("map-panel")?.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 30);
    }
  }

  const selectedZone = MAP_ZONES.find((zone) => zone.id === selected.zone);

  return (
    <div className="map-wrap">
      <div className="map-legend" aria-label="连接线图例">
        <span><i className="line-sample is-solid" />实线：核对过的公开页面链接（只是页面跳转，不是数据流）</span>
        <span><i className="line-sample is-dashed" />虚线：设计中的关系（还没有技术上的连接）</span>
        <span><i className="line-sample is-dotted" />点线：工作方法或未来方向（未实现）</span>
        <span className="map-legend-note">公开导航链接不等于数据互通。</span>
      </div>
      <p className="map-aggregation-note">{MAP_AGGREGATION_NOTE}</p>

      <div className="map-layout">
        <div className="map-canvas" role="group" aria-label="体系关系图。点击任一系统查看说明。">
          <svg className="map-svg" viewBox="0 0 1180 780" aria-hidden="true" focusable="false">
            {MAP_ZONES.map((zone) => {
              const box = ZONE_BOXES[zone.id];
              return (
                <g key={zone.id} className="map-zone-shape">
                  <rect x={box.x} y={box.y} width={box.w} height={box.h} rx="2" />
                  <text x={box.x + 18} y={box.y + 30} className="zone-index">
                    {zone.index}
                  </text>
                  <text x={box.x + 44} y={box.y + 30} className="zone-title">
                    {zone.title}
                  </text>
                  <text x={box.x + 44} y={box.y + 47} className="zone-en">
                    {zone.en}
                  </text>
                </g>
              );
            })}

            <rect x="42" y="90" width="344" height="214" rx="2" className="edge edge-dotted life-bracket" />
            <text x="54" y="350" className="map-note">
              未实现：统一登录 / 共享数据 / 共享记忆
            </text>

            {EDGES.map((edge) => (
              <g key={edge.number} className={`edge-group edge-${edge.kind}`}>
                <path d={edge.d} className="edge-line" />
                <circle className="edge-anchor" cx="0" cy="0" r="1" />
                <title>{edge.label}</title>
              </g>
            ))}

            <g className="map-edge-index">
              {[
                [676, 600, "01"],
                [724, 166, "02"],
                [420, 330, "03"],
                [470, 452, "04"],
                [822, 262, "05"],
                [708, 490, "06"],
                [700, 88, "07"],
                [600, 475, "08"],
              ].map(([x, y, label]) => (
                <g key={label as string}>
                  <circle cx={x as number} cy={y as number} r="9" />
                  <text x={x as number} y={(y as number) + 3} textAnchor="middle">
                    {label}
                  </text>
                </g>
              ))}
            </g>
          </svg>

          {MAP_NODES.map((node) => {
            const box = BOXES[node.id];
            const zone = MAP_ZONES.find((item) => item.id === node.zone);
            return (
              <button
                key={node.id}
                type="button"
                className={`map-node status-border-${node.statuses.includes("LIVE_VERIFIED") ? "live" : node.statuses[0].toLowerCase()}${selectedId === node.id ? " is-selected" : ""}`}
                style={{
                  left: `${(box.x / 1180) * 100}%`,
                  top: `${(box.y / 780) * 100}%`,
                  width: `${(box.w / 1180) * 100}%`,
                  height: `${(box.h / 780) * 100}%`,
                }}
                onClick={() => select(node.id)}
                aria-pressed={selectedId === node.id}
                aria-label={`${nodeLabel(node)}，${zone?.title}。查看说明`}
              >
                <span className="map-node-name">{node.name}</span>
                <span className="map-node-en">{node.en}</span>
                <span className="map-node-dot" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        <div className="map-mobile" aria-label="体系关系图（移动端索引）">
          {MAP_ZONES.map((zone) => (
            <section key={zone.id} className="map-mobile-zone">
              <h3>
                <span>{zone.index}</span>
                {zone.title}
              </h3>
              <div className="map-mobile-nodes">
                {NODE_FOR_ZONE(zone.id).map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    className={selectedId === node.id ? "map-mobile-node is-selected" : "map-mobile-node"}
                    onClick={() => select(node.id)}
                    aria-pressed={selectedId === node.id}
                  >
                    <span>{node.name}</span>
                    <small>{node.en}</small>
                  </button>
                ))}
              </div>
            </section>
          ))}
          <p className="map-mobile-note">
            手机上不画连线。每条关系和限制都在下面的说明里逐条写清；连线图例也保留在上面。
          </p>
        </div>

        <aside className="map-panel" id="map-panel" aria-live="polite">
          <p className="panel-kicker">
            SELECTED · {selectedZone?.index} / {selectedZone?.en}
          </p>
          <h3 className="panel-title">{selected.name}</h3>
          <p className="panel-en">{selected.en}</p>

          <div className="panel-statuses">
            {selected.statuses.map((status) => (
              <StatusPill key={status} status={status} compact />
            ))}
          </div>

          <dl className="panel-list">
            <div>
              <dt>面向谁</dt>
              <dd>{selected.audience}</dd>
            </div>
            <div>
              <dt>解决什么问题</dt>
              <dd>{selected.problem}</dd>
            </div>
            <div>
              <dt>当前能力</dt>
              <dd>
                <ul>
                  {selected.capabilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt>当前限制</dt>
              <dd>{selected.limits}</dd>
            </div>
          </dl>

          <div className="panel-links">
            {selected.links.map((link) =>
              link.internal ? (
                <ArrowLink key={link.label} to={link.internal}>
                  {link.label}
                </ArrowLink>
              ) : (
                <ArrowLink key={link.label} to={link.href ?? "#"} external>
                  {link.label}
                </ArrowLink>
              ),
            )}
          </div>
        </aside>
      </div>

      <div className="map-edge-list" aria-label="连接线说明">
        {EDGES.map((edge) => (
          <p key={edge.number}>
            <span className={`edge-list-line is-${edge.kind}`} aria-hidden="true" />
            <b>{edge.number}</b>
            {edge.label}
          </p>
        ))}
      </div>
    </div>
  );
}
