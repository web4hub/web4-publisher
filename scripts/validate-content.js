import fs from "node:fs";
import path from "node:path";
import { parse } from "yaml";

const postsDirectory = path.resolve("posts");
const registryPath = path.resolve("www/pages/index.yaml");
const required = ["title", "slug", "description", "author", "date", "category", "tags", "theme", "draft"];
const validThemes = ["default", "glitch", "win95"];

function files(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return files(target);
    // Underscore-prefixed Markdown files are publisher support files (for
    // example _template.md and _pages.md), not publishable articles.
    // CODEX.md is project/workflow documentation rather than a post.
    const supportFile = entry.name.startsWith("_") || entry.name.toLowerCase() === "codex.md";
    return target.endsWith(".md") && !supportFile ? [target] : [];
  });
}

function validateRegistry() {
  const registry = parse(fs.readFileSync(registryPath, "utf8"));
  const errors = [];
  if (!registry || !Number.isInteger(registry.version) || registry.version < 1) errors.push("version must be a positive integer");
  if (!registry.site?.name || !registry.site?.default_route) errors.push("site.name and site.default_route are required");
  if (!Array.isArray(registry.pages) || registry.pages.length === 0) errors.push("pages must be a non-empty array");
  try {
    const canonical = new URL(registry.seo?.canonical_base_url);
    if (!["http:", "https:"].includes(canonical.protocol)) errors.push("seo.canonical_base_url must use HTTP or HTTPS");
    if (!canonical.pathname.endsWith("/")) errors.push("seo.canonical_base_url must end with a slash");
  } catch {
    errors.push("seo.canonical_base_url must be a valid absolute URL");
  }
  for (const feature of ["sitemap", "robots_txt", "open_graph", "json_ld"]) {
    if (typeof registry.seo?.[feature] !== "boolean") errors.push("seo." + feature + " must be a boolean");
  }
  if (registry.seo?.sitemap !== true) errors.push("seo.sitemap must be enabled for the build generator");
  if (registry.seo?.robots_txt !== true) errors.push("seo.robots_txt must be enabled for the build generator");

  const ids = new Set();
  const routes = new Set();
  for (const page of registry.pages || []) {
    if (!page.id || !page.route || !page.path) { errors.push("every page needs id, path, and route"); continue; }
    if (ids.has(page.id)) errors.push("duplicate page id: " + page.id);
    ids.add(page.id);
    if (page.id !== "publication" && routes.has(page.route)) errors.push("duplicate route: " + page.route);
    if (page.id !== "publication") routes.add(page.route);
    if (page.indexable === true && !page.title && !page.title_template) errors.push('indexable page "' + page.id + '" needs title or title_template');
  }
  for (const item of [...(registry.navigation?.primary || []), ...(registry.navigation?.footer || [])]) {
    if (item.page && !ids.has(item.page)) errors.push("navigation references unknown page: " + item.page);
    if (!item.page && !item.url) errors.push("navigation items need either page or url");
  }
  if (!ids.has("home")) errors.push('pages must include id "home"');
  if (!ids.has("not-found")) errors.push('pages must include id "not-found"');
  if (registry.routing?.strategy !== "hash") errors.push('routing.strategy must be "hash" for the current runtime');
  if (errors.length) throw new Error(errors.join("\n - "));
  console.log("✓ " + registryPath + " (" + registry.pages.length + " pages; SEO configuration valid)");
}

function parseFrontMatter(source) {
  const match = source.match(/^---\s*([\s\S]*?)\s*---/m);
  if (!match) throw new Error("Missing front matter");
  return parse(match[1]) || {};
}

validateRegistry();
const postFiles = files(postsDirectory);
const seenSlugs = new Set();
let failed = false;
for (const file of postFiles) {
  try {
    const metadata = parseFrontMatter(fs.readFileSync(file, "utf8"));
    for (const field of required) {
      if (metadata[field] === undefined || metadata[field] === null || metadata[field] === "") throw new Error("Missing required field: " + field);
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(metadata.slug)) throw new Error("Invalid slug: " + metadata.slug);
    if (seenSlugs.has(metadata.slug)) throw new Error("Duplicate slug: " + metadata.slug);
    seenSlugs.add(metadata.slug);
    if (!validThemes.includes(metadata.theme)) throw new Error("Invalid theme: " + metadata.theme);
    if (!Array.isArray(metadata.tags)) throw new Error("tags must be a YAML array");
    if (typeof metadata.draft !== "boolean") throw new Error("draft must be a boolean");
    if (Number.isNaN(Date.parse(metadata.date))) throw new Error("Invalid date: " + metadata.date);
    console.log("✓ " + file);
  } catch (error) {
    failed = true;
    console.error("✗ " + file + "\n  " + error.message);
  }
}
if (failed) process.exit(1);
console.log("\nValidated " + postFiles.length + " publication(s) and the page registry.");
