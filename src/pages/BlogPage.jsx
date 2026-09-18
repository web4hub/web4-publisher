import { useMemo, useState } from "react";
import PostCard from "../components/PostCard.jsx";

export default function BlogPage({ posts }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const categories = [...new Set(posts.map((post) => post.category).filter(Boolean))];
  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return posts.filter((post) => {
      const searchable = [post.title, post.description, post.category, ...(post.tags || [])].join(" ").toLowerCase();
      return (!normalizedQuery || searchable.includes(normalizedQuery)) && (category === "all" || post.category === category);
    });
  }, [category, posts, query]);

  return (
    <section className="blog-page publication-section">
      <div className="page-intro"><span className="eyebrow">THE WEB4 BLOG</span><h1>Ideas in motion.</h1><p>Notes on semantic publishing, open knowledge, identity and the tools that connect them.</p></div>
      <div className="blog-toolbar" role="search">
        <label className="visually-hidden" htmlFor="post-search">Search publications</label>
        <input id="post-search" type="search" placeholder="Search publications..." value={query} onChange={(event) => setQuery(event.target.value)} />
        <label className="visually-hidden" htmlFor="category-filter">Filter by category</label>
        <select id="category-filter" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="all">All categories</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </div>
      <div className="section-heading"><h2>{filteredPosts.length} publication{filteredPosts.length === 1 ? "" : "s"}</h2></div>
      <div className="post-grid">{filteredPosts.map((post) => <PostCard key={post.slug} post={post} />)}</div>
      {!filteredPosts.length && <p className="empty-state">No publications match your search.</p>}
    </section>
  );
}
