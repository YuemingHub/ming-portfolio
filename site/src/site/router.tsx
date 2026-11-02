import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from "react";
import { normalizeRoute, toHref } from "@/site/base";

const NAVIGATE_EVENT = "ym:navigate";

type LocationState = { path: string; hash: string };

function readLocation(): LocationState {
  return { path: normalizeRoute(window.location.pathname), hash: window.location.hash };
}

export function useLocation(): LocationState {
  const [location, setLocation] = useState<LocationState>(readLocation);
  useEffect(() => {
    const update = () => setLocation(readLocation());
    window.addEventListener("popstate", update);
    window.addEventListener("hashchange", update);
    window.addEventListener(NAVIGATE_EVENT, update);
    return () => {
      window.removeEventListener("popstate", update);
      window.removeEventListener("hashchange", update);
      window.removeEventListener(NAVIGATE_EVENT, update);
    };
  }, []);
  return location;
}

export function navigate(to: string) {
  const href = toHref(to);
  const url = new URL(href, window.location.origin);
  const samePath = normalizeRoute(url.pathname) === normalizeRoute(window.location.pathname);
  window.history.pushState({}, "", `${url.pathname}${url.search}${url.hash}`);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
  window.setTimeout(() => {
    if (url.hash) {
      const target = document.getElementById(url.hash.slice(1));
      if (target) target.scrollIntoView({ block: "start" });
    } else if (!samePath) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, 0);
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { to: string };

export function Link({ to, onClick, children, ...rest }: LinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(to)) return;
    event.preventDefault();
    navigate(to);
  }
  return (
    <a href={toHref(to)} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
