import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PostView from "./components/PostView.jsx";
import { loadPosts } from "./content/loader.js";
import { findPageByRoute, getPublicationSlug, pageRegistry } from "./config/pageRegistry.js";

function getRoute() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  let pathname;
  try {
    pathname = hash === "/" ? "/" : "/" + hash.split("/").filter(Boolean).map(decodeURIComponent).join("/");
  } catch {
    pathname = "/404";
  }
  const config = findPageByRoute(pathname);
  return { id: config?.id || "not-found", config, slug: config?.id === "publication" ? getPublicationSlug(pathname) : null };
}

export default function App() {
  const [posts, setPosts] = useState([]);
  const [route, setRoute] = useState(getRoute);

  useEffect(() => {
    loadPosts().then(setPosts);
    const handleRouteChange = () => setRoute(getRoute());
    window.addEventListener("hashchange", handleRouteChange);
    return () => window.removeEventListener("hashchange", handleRouteChange);
  }, []);

  const selectedPost = useMemo(() => posts.find((post) => post.slug === route.slug), [posts, route.slug]);

  useEffect(() => {
    const title = selectedPost
      ? (route.config?.title_template || "{title} — Web4 Publisher").replace("{title}", selectedPost.title)
      : route.config?.title || pageRegistry.site.name;
    document.title = title;
    const description = selectedPost?.description || route.config?.description || pageRegistry.site.description;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
    document.documentElement.lang = pageRegistry.site.language || "en";
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
  </div>;
}
