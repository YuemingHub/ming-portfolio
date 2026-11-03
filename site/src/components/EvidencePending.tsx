export function EvidencePending({
  title = "Self Space 真实线上截图待补",
  body,
  meta,
  compact = false,
}: {
  title?: string;
  body: string;
  meta: string;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "evidence-pending is-compact" : "evidence-pending"} role="note" aria-label="证据缺口">
      <p className="evidence-pending-kicker">EVIDENCE_PENDING</p>
      <p className="evidence-pending-title">{title}</p>
      <p className="evidence-pending-body">{body}</p>
      <p className="evidence-pending-meta">{meta}</p>
    </div>
  );
}
