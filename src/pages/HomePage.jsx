import PostCard from "../components/PostCard.jsx";

export default function HomePage({ posts }) {
  const featuredPosts = posts.slice(0, 3);

  return (
    <>
      <section className="hero">
        <span className="eyebrow">WEB4 PUBLISHER / v1.0.0</span>
        <h1>
          Publish knowledge.
          <br />
          Validate meaning.
        </h1>
        <p>
          A static-first semantic publishing engine for Markdown, MDX, Web4
          and Q-lang content.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#/blog">
            Explore the blog →
          </a>
          <a className="button" href="#/about">
            Learn about the project
          </a>
        </div>
        <div className="directive"><code>^↑D</code><span>detect → analyze → infer → classify → register → learn</span></div>
        <div className="directive"><code>^D</code><span>create → validate</span></div>
        <div className="directive"><code>^|D</code><span>execute</span></div>
      </section>

      <section className="publication-section" id="publications">
        <div className="section-heading">
          <div><span className="eyebrow">FEATURED</span><h2>Latest knowledge</h2></div>
          <a className="text-link" href="#/blog">View all →</a>
        </div>
        <div className="post-grid">
          {featuredPosts.length ? featuredPosts.map((post) => <PostCard key={post.slug} post={post} />) : <p className="empty-state">No publications yet.</p>}
        </div>
      </section>
    </>
  );
}
