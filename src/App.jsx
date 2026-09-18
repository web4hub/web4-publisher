import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import BlogPage from "./pages/BlogPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import PostView from "./components/PostView.jsx";
import { loadPosts } from "./content/loader.js";

function getRoute() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  const parts = hash.split("/").filter(Boolean).map(decodeURIComponent);
  return {
    page: parts[0] || "home",
    slug: parts[0] === "blog" && parts[1] ? parts[1] : null,
  };
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

  const selectedPost = useMemo(
    () => posts.find((post) => post.slug === route.slug),
    [posts, route.slug]
  );

  useEffect(() => {
    const title = selectedPost
      ? `${selectedPost.title} — Web4 Publisher`
      : route.page === "blog"
        ? "Blog — Web4 Publisher"
        : route.page === "about"
          ? "About — Web4 Publisher"
          : "Web4 Publisher";
    document.title = title;
  }, [route, selectedPost]);

  let page;
  if (route.page === "home") {
    page = <HomePage posts={posts} />;
  } else if (route.page === "blog" && selectedPost) {
    page = <PostView post={selectedPost} />;
  } else if (route.page === "blog") {
    page = <BlogPage posts={posts} />;
  } else if (route.page === "about") {
    page = <AboutPage />;
  } else {
    page = <NotFoundPage />;
  }

  return (
    <div className={`site theme-${selectedPost?.theme || "default"}`}>
      <Header />
      <main className="container">{page}</main>
      <Footer />
    </div>
  );
}
