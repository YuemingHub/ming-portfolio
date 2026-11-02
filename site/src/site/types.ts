export type Status =
  | "LIVE_VERIFIED"
  | "CODE_ACCEPTED"
  | "PROTOTYPE"
  | "VALIDATION"
  | "RESEARCH"
  | "HOLD"
  | "PLANNED";

export type StatusMeta = {
  label: Status;
  zh: string;
  description: string;
  tone: "live" | "code" | "prototype" | "validation" | "research" | "hold" | "planned";
};

export type EvidenceKind = "public" | "screenshot" | "private-doc" | "measurement" | "pending";

export type EvidenceLink = {
  label: string;
  kind: EvidenceKind;
  href?: string;
  note?: string;
};

export type Project = {
  id: string;
  name: string;
  en?: string;
  audience: string;
  capability: string;
  status: Status;
  evidence: EvidenceLink[];
  verified: string;
  limits: string;
  publicUrl?: string;
  route?: string;
};

export type MapZone = {
  id: string;
  index: string;
  title: string;
  en: string;
};

export type MapNode = {
  id: string;
  name: string;
  en: string;
  zone: string;
  audience: string;
  problem: string;
  statuses: Status[];
  capabilities: string[];
  limits: string;
  links: { label: string; href?: string; internal?: string }[];
};
