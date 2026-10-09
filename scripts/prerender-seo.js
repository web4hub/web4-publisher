import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { parse } from "yaml";

const root = process.cwd();
const dist = path.join(root, "dist");
const registry = parse(fs.readFileSync(path.join(root, "www/pages/index.yaml"), "utf8"));
const base = new URL(registry.seo.canonical_base_url);
const htmlPath = path.join(dist, "index.html");
if (!fs.existsSync(htmlPath)) throw new Error("Production index.html is missing; run the Vite build first.");

const template = fs.readFileSync(htmlPath, "utf8");
const postsDirectory = path.join(root, "posts");

function postFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return postFiles(target);
    return target.endsWith(".md") ? [target] : [];
  });
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}
function absoluteUrl(route) {
  return new URL(String(route || "/").replace(/^\/+/, ""), base).href;
}
function buildHtml(options) {
  const route = options.route || "";
  const title = options.title || registry.site.name;
  const description = options.description || registry.site.description;
  const post = options.post || null;
  const url = absoluteUrl(route);
  const image = registry.seo.default_image ? absoluteUrl(registry.seo.default_image) : null;
  const structuredData = post ? {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url + "#article",
    headline: title,
    description,
    url,
    datePublished: post.date || undefined,
    author: post.author ? { "@type": "Person", name: post.author } : undefined,
    articleSection: post.category || undefined,
    keywords: Array.isArray(post.tags) ? post.tags.join(", ") : undefined,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    isPartOf: { "@type": "WebSite", name: registry.site.name, url: registry.seo.canonical_base_url },
    inLanguage: registry.site.language || "en"
  } : {
    "@context": "https://schema.org",
    "@type": route === "blog" ? "CollectionPage" : "WebPage",
    name: title,
    description,
    url,
    isPartOf: { "@type": "WebSite", name: registry.site.name, url: registry.seo.canonical_base_url },
    inLanguage: registry.site.language || "en"
  };

  let html = template;
  function setMeta(selector, replacement) {
    const expression = new RegExp("<meta\\s+[^>]*" + selector + "[^>]*>", "i");
    if (expression.test(html)) html = html.replace(expression, replacement);
    else html = html.replace("</head>", "    " + replacement + "\n  </head>");
  }
  function meta(attribute, key, value) {
    return '<meta ' + attribute + '="' + key + '" content="' + escapeHtml(value) + '" />';
  }

  setMeta('name="description"', meta("name", "description", description));
  setMeta('name="robots"', meta("name", "robots", options.noindex ? "noindex,follow" : (registry.defaults?.robots || "index,follow")));
  setMeta('property="og:type"', meta("property", "og:type", post ? "article" : "website"));
  setMeta('property="og:site_name"', meta("property", "og:site_name", registry.site.name));
  setMeta('property="og:title"', meta("property", "og:title", title));
  setMeta('property="og:description"', meta("property", "og:description", description));
  setMeta('property="og:url"', meta("property", "og:url", url));
  if (image) setMeta('property="og:image"', meta("property", "og:image", image));
  setMeta('name="twitter:card"', meta("name", "twitter:card", image ? "summary_large_image" : "summary"));
  setMeta('name="twitter:title"', meta("name", "twitter:title", title));
  setMeta('name="twitter:description"', meta("name", "twitter:description", description));

  const canonical = '<link rel="canonical" href="' + escapeHtml(url) + '" />';
  if (/<link\s+rel="canonical"[^>]*>/i.test(html)) html = html.replace(/<link\s+rel="canonical"[^>]*>/i, canonical);
  else html = html.replace("</head>", "    " + canonical + "\n  </head>");

  const jsonld = '<script id="web4-jsonld" type="application/ld+json">' + JSON.stringify(structuredData).replace(/</g, "\\u003c") + "</script>";
  if (/<script\s+id="web4-jsonld"[^>]*>[\s\S]*?<\/script>/i.test(html)) {
    html = html.replace(/<script\s+id="web4-jsonld"[^>]*>[\s\S]*?<\/script>/i, jsonld);
  } else {
    html = html.replace("</head>", "    " + jsonld + "\n  </head>");
  }
  return html.replace(/<title>[\s\S]*?<\/title>/i, "<title>" + escapeHtml(title) + "</title>");
}

function writeRoute(route, options) {
  const normalized = String(route || "/").replace(/^\/+|\/+$/g, "");
  const output = normalized ? path.join(dist, normalized, "index.html") : htmlPath;
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, buildHtml({ route: normalized, ...options }));
}

for (const page of registry.pages || []) {
  if (page.id === "publication" || page.id === "not-found" || page.indexable !== true) continue;
  writeRoute(page.route || page.path, {
    title: page.title || registry.site.name,
    description: page.description || registry.site.description
  });
}

for (const file of postFiles(postsDirectory)) {
  const parsed = matter(fs.readFileSync(file, "utf8"));
  const data = parsed.data;
  if (data.draft === true || !data.slug) continue;
  const slug = String(data.slug);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue;
  const templateTitle = (registry.pages.find((page) => page.id === "publication")?.title_template || "{title} — Web4 Publisher");
  writeRoute("blog/" + slug, {
    title: templateTitle.replace("{title}", String(data.title || slug)),
    description: data.description || registry.site.description,
    post: data
  });
}

const notFound = registry.pages.find((page) => page.id === "not-found");
fs.writeFileSync(path.join(dist, "404.html"), buildHtml({
  route: "404",
  title: notFound?.title || "Page not found",
  description: notFound?.description || "The requested page could not be found.",
  noindex: true
}));
console.log("Prerendered route-specific Open Graph metadata and JSON-LD into dist/");
