import { parse } from "yaml";
import source from "../../www/pages/index.yaml?raw";

export const pageRegistry = parse(source);

if (!pageRegistry || !Array.isArray(pageRegistry.pages)) {
  throw new Error("Invalid publisher page registry: pages must be an array.");
}

export function findPageByRoute(route) {
  const normalized = normalizeRoute(route);
  return pageRegistry.pages.find((page) => {
    if (page.id === "publication") {
      return /^\/blog\/[^/]+$/.test(normalized);
    }
    return normalizeRoute(page.route || page.path) === normalized;
  }) || null;
}

export function normalizeRoute(route) {
  if (!route || route === "/") return "/";
  const normalized = route.split("/").filter(Boolean).join("/");
  return normalized ? `/${normalized}` : "/";
}

export function getPublicationSlug(route) {
  const match = normalizeRoute(route).match(/^\/blog\/([^/]+)$/);
  if (!match) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}
