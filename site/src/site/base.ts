const KNOWN_BASES = ["/ming/", "/ming-portfolio/"] as const;

function detectBase(pathname: string): string {
  for (const base of KNOWN_BASES) {
    if (pathname === base.slice(0, -1) || pathname.startsWith(base)) return base;
  }
  return "/";
}

export const BASE = detectBase(window.location.pathname);

export function normalizeRoute(pathname: string): string {
  let path = pathname;
  if (BASE !== "/") {
    const prefix = BASE.slice(0, -1);
    if (path === prefix) path = "/";
    else if (path.startsWith(BASE)) path = path.slice(prefix.length);
  }
  return path.replace(/\/+$/, "") || "/";
}

export function toHref(to: string): string {
  if (
    /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(to) ||
    to.startsWith("mailto:") ||
    to.startsWith("tel:") ||
    to.startsWith("#")
  ) {
    return to;
  }

  const hashIndex = to.indexOf("#");
  const hash = hashIndex >= 0 ? to.slice(hashIndex) : "";
  const withoutHash = hashIndex >= 0 ? to.slice(0, hashIndex) : to;
  const queryIndex = withoutHash.indexOf("?");
  const query = queryIndex >= 0 ? withoutHash.slice(queryIndex) : "";
  const rawPath = queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash;

  if (rawPath === "" || rawPath === "/") return `${BASE}${query}${hash}`;
  return `${BASE}${rawPath.replace(/^\/+/, "")}${query}${hash}`;
}

export function assetUrl(path: string): string {
  return toHref(path);
}

const CANONICAL_ORIGIN = "https://ymai.me";

export function canonicalFor(route: string): string {
  return route === "/" ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${route}`;
}
