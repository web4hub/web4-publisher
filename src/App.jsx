import { useEffect, useMemo, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PostView from "./components/PostView.jsx";
import { loadPosts } from "./content/loader.js";
import { findPageByRoute, getPublicationSlug, normalizeRoute, pageRegistry } from "./config/pageRegistry.js";

function decodeRoute(value) {
  try {
    return normalizeRoute(value.split("/").filter(Boolean).map(decodeURIComponent).join("/"));
  } catch {
    return "/404";
  }
}

function getRoute() {
  const configuredBase = new URL(pageRegistry.seo.canonical_base_url).pathname.replace(/\/$/, "");
  const hashRoute = window.location.hash.replace(/^#/, "");
  let routeValue = hashRoute;

  if (!routeValue) {
    let pathname = window.location.pathname;
    if (configuredBase && (pathname === configuredBase || pathname.startsWith(`${configuredBase}/`))) {
      pathname = pathname.slice(configuredBase.length) || "/";
    }
    routeValue = pathname || "/";
  }

  const pathname = decodeRoute(routeValue || "/");
  const config = findPageByRoute(pathname);
  return {
    id: config?.id || "not-found",
    config,
    pathname,
    slug: config?.id === "publication" ? getPublicationSlug(pathname) : null
  };
}

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", String(content ?? ""));
}

function setLink(rel, href) {
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

function setStructuredData(data) {
  let element = document.getElementById("web4-jsonld");
  if (!element) {
    element = document.createElement("script");
    element.id = "web4-jsonld";
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(data).replace(/</g, "\\u003c");
}

function buildStructuredData({ title, description, url, route, post }) {
  const website = {
    "@type": "WebSite",
    "@id": new URL("#website", pageRegistry.seo.canonical_base_url).href,
    name: pageRegistry.site.name,
    url: pageRegistry.seo.canonical_base_url,
    inLanguage: pageRegistry.site.language || "en"
  };

  if (post) {
    return {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      headline: title,
      description,
      url,
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      datePublished: post.date || undefined,
      author: post.author ? { "@type": "Person", name: post.author } : undefined,
      articleSection: post.category || undefined,
      keywords: Array.isArray(post.tags) ? post.tags.join(", ") : undefined,
      isPartOf: website,
      inLanguage: pageRegistry.site.language || "en"
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [
      website,
      {
        "@type": route === "blog" ? "CollectionPage" : "WebPage",
        "@id": `${url}#webpage`,
        name: title,
        description,
        url,
        isPartOf: { "@id": website["@id"] },
        inLanguage: pageRegistry.site.language || "en"
      }
    ]
  };
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    loadPosts().then(setPosts);
    const handleRouteChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleRouteChange);
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("hashchange", handleRouteChange);
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const selectedPost = useMemo(() => posts.find((post) => post.slug === route.slug), [posts, route.slug]);

  useEffect(() => {
    const title = selectedPost
      ? (route.config?.title_template || "{title} — Web4 Publisher").replace("{title}", selectedPost.title)
      : route.config?.title || pageRegistry.site.name;
    const description = selectedPost?.description || route.config?.description || pageRegistry.site.description;
    const base = new URL(pageRegistry.seo.canonical_base_url);
    const canonicalPath = route.pathname === "/" ? "" : route.pathname.replace(/^\/+/, "");
    const canonicalUrl = new URL(canonicalPath, base).href;
    const isNotFound = route.id === "not-found";
    const image = pageRegistry.seo.default_image
      ? new URL(pageRegistry.seo.default_image, base).href
      : null;

    document.title = title;
    document.documentElement.lang = pageRegistry.site.language || "en";
    setMeta("name", "description", description);
    setMeta("name", "robots", isNotFound ? "noindex,follow" : (pageRegistry.defaults?.robots || "index,follow"));
    setLink("canonical", canonicalUrl);

    if (pageRegistry.seo.open_graph) {
      setMeta("property", "og:type", selectedPost ? "article" : "website");
      setMeta("property", "og:site_name", pageRegistry.site.name);
      setMeta("property", "og:title", title);
      setMeta("property", "og:description", description);
      setMeta("property", "og:url", canonicalUrl);
      setMeta("property", "og:locale", (pageRegistry.site.language || "en").replace("-", "_"));
      if (image) setMeta("property", "og:image", image);
      else document.head.querySelector('meta[property="og:image"]')?.remove();
      setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
      setMeta("name", "twitter:title", title);
      setMeta("name", "twitter:description", description);
      if (image) setMeta("name", "twitter:image", image);
      else document.head.querySelector('meta[name="twitter:image"]')?.remove();
      if (selectedPost?.date) setMeta("property", "article:published_time", selectedPost.date);
      else document.head.querySelector('meta[property="article:published_time"]')?.remove();
      if (selectedPost?.author) setMeta("property", "article:author", selectedPost.author);
      else document.head.querySelector('meta[property="article:author"]')?.remove();
    }

    if (pageRegistry.seo.json_ld) {
      setStructuredData(buildStructuredData({ title, description, url: canonicalUrl, route: route.id, post: selectedPost }));
    } else {
      document.getElementById("web4-jsonld")?.remove();
    }
  }, [route, selectedPost]);

  let page;
  if (route.id === "home") page = <HomePage posts={posts} />;
  else if (route.id === "publication" && selectedPost) page = <PostView post={selectedPost} />;
  else if (route.id === "blog") page = <BlogPage posts={posts} />;
  else if (route.id === "about") page = <AboutPage />;
  else page = <NotFoundPage />;

  return <div className={`site theme-${selectedPost?.theme || pageRegistry.defaults?.theme || "default"}`}>
    <Header />
    <main className="container">{page}</main>
    <Footer />
    <Analytics />
  </div>;
}
