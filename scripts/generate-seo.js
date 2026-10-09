import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse } from "yaml";

const root = process.cwd();
const registryPath = path.join(root, "www/pages/index.yaml");
const postsDirectory = path.join(root, "posts");
const publicDirectory = path.join(root, "public");
const registry = parse(fs.readFileSync(registryPath, "utf8"));
const configuredBase = registry.seo?.canonical_base_url;

if (!configuredBase) {
  throw new Error("www/pages/index.yaml must define seo.canonical_base_url.");
}

const baseUrl = new URL(configuredBase);
if (!["http:", "https:"].includes(baseUrl.protocol)) {
  throw new Error("seo.canonical_base_url must use HTTP or HTTPS.");
}
baseUrl.hash = "";
baseUrl.search = "";
if (!baseUrl.pathname.endsWith("/")) baseUrl.pathname += "/";

function files(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return files(target);
    return target.endsWith(".md") ? [target] : [];
  });
}

function absoluteUrl(route) {
  const normalized = String(route || "/").replace(/^\/+/, "");
  return new URL(normalized, baseUrl).href;
}

function xmlEscape(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;"
  })[character]);
}

const pages = (registry.pages || [])
  .filter((page) => page.indexable === true && page.id !== "publication")
  .map((page) => ({
    loc: absoluteUrl(page.route || page.path),
    changefreq: page.id === "home" ? "weekly" : "monthly"
  }));

const posts = files(postsDirectory)
  .map((file) => {
    const { data } = matter(fs.readFileSync(file, "utf8"));
    if (data.draft === true || !data.slug) return null;
    const date = data.date ? new Date(data.date) : null;
    return {
      loc: absoluteUrl(`blog/${encodeURIComponent(String(data.slug))}`),
      lastmod: date && !Number.isNaN(date.valueOf()) ? date.toISOString().slice(0, 10) : null,
      changefreq: "monthly"
    };
  })
  .filter(Boolean);

const unique = new Map([...pages, ...posts].map((entry) => [entry.loc, entry]));
const sitemapEntries = [...unique.values()].map((entry) => `  <url>
    <loc>${xmlEscape(entry.loc)}</loc>${entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ""}
    <changefreq>${entry.changefreq}</changefreq>
  </url>`).join("\n");

fs.mkdirSync(publicDirectory, { recursive: true });
fs.writeFileSync(path.join(publicDirectory, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries}
</urlset>
`);

const sitemapUrl = absoluteUrl("sitemap.xml");
const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /404",
  `Sitemap: ${sitemapUrl}`,
  ""
].join("\n");
fs.writeFileSync(path.join(publicDirectory, "robots.txt"), robots);

console.log(`Generated public/sitemap.xml (${unique.size} URLs)`);
console.log("Generated public/robots.txt");
