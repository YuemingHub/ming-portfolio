import { Link } from "@/site/router";
import { MAP_ZONES, MAP_NODES, STATUS_META } from "@/site/content";
import type { MapNode } from "@/site/types";

const SHORT: Record<string, string[]> = {
  life: ["Family Space", "Self Space", "World Space"],
  service: ["Family Service OS", "Yueming Expert OS"],
  knowledge: ["LRDF", "Family Reality Lab", "《先看清，再伸手》"],
  execution: ["Agent Space"],
  technology: ["MingOS"],
};

function zoneLabel(nodes: MapNode[]) {
  const statuses = [...new Set(nodes.flatMap((node) => node.statuses))];
  return `${nodes.length} 个节点 · ${statuses.map((status) => STATUS_META[status].label).join(" + ")}`;
}

export function Atlas() {
  return (
    <div className="atlas">
      <div className="atlas-head">
        <span>THE WHOLE SYSTEM</span>
        <span>{MAP_ZONES.length} ZONES · {MAP_NODES.length} NODES</span>
      </div>
      <div className="atlas-body">
        <div className="atlas-spine" aria-hidden="true" />
        {MAP_ZONES.map((zone) => {
          const nodes = MAP_NODES.filter((node) => node.zone === zone.id);
          return (
            <div className="atlas-row" key={zone.id}>
              <span className="atlas-index">{zone.index}</span>
              <div className="atlas-content">
                <h3>{zone.title}</h3>
                <p>{SHORT[zone.id].join(" · ")}</p>
              </div>
              <span className="atlas-dots">
                {nodes.map((node) => (
                  <i
                    key={node.id}
                    className={`dot dot-${node.statuses[0].toLowerCase()}`}
                    title={`${node.name}：${node.statuses.join(" / ")}`}
                  />
                ))}
                <small>{zoneLabel(nodes)}</small>
              </span>
            </div>
          );
        })}
      </div>
      <div className="atlas-foot">
        <span>每个点代表 1 个节点；同一节点可有多种状态</span>
        <Link to="/ecosystem">打开可交互关系图 →</Link>
      </div>
    </div>
  );
}
