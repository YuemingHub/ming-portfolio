export function EvidencePending({
  title,
  body,
  meta,
  compact = false,
  resolved = false,
}: {
  title: string;
  body: string;
  meta: string;
  compact?: boolean;
  resolved?: boolean;
}) {
  return (
    <div className={compact ? "evidence-pending is-compact" : "evidence-pending"} role="note" aria-label={resolved ? "已解决事件" : "证据缺口"}>
      <p className="evidence-pending-kicker">{resolved ? "RESOLVED" : "EVIDENCE_PENDING"}</p>
      <p className="evidence-pending-title">{title}</p>
      <p className="evidence-pending-body">{body}</p>
      <p className="evidence-pending-meta">{meta}</p>
    </div>
  );
}
