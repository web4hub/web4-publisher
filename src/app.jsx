import { useEffect, useState } from "react";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import PostCard from "./components/PostCard.jsx";
import PostView from "./components/PostView.jsx";

import { loadPosts } from "./content/loader.js";

export default function App() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    loadPosts().then(setPosts);
  }, []);

  if (selectedPost) {
    return (
      <div className={`site theme-${selectedPost.theme || "default"}`}>
        <Header />

        <main className="container">
          <button
            className="back-button"
            onClick={() => setSelectedPost(null)}
          >
            ← Back to publications
          </button>

          <PostView post={selectedPost} />
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="site theme-default">
      <Header />

      <main className="container">
        <section className="hero">
          <span className="eyebrow">WEB4 PUBLISHER / v1.0.0</span>

          <h1>
            Publish knowledge.
            <br />
            Validate meaning.
          </h1>

          <p>
            A static-first semantic publishing engine for Markdown,
            MDX, Web4 and Q-lang content.
          </p>

          <div className="directive">
            <code>^↑D</code>
            <span>detect → analyze → infer → classify → register → learn</span>
          </div>

          <div className="directive">
            <code>^D</code>
            <span>create → validate</span>
          </div>

          <div className="directive">
            <code>^|D</code>
            <span>execute</span>
          </div>
        </section>

        <section className="publication-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">PUBLICATIONS</span>
              <h2>Latest knowledge</h2>
            </div>

            <span className="count">
              {posts.length} publication{posts.length === 1 ? "" : "s"}
            </span>
          </div>

          <div className="post-grid">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                onOpen={() => setSelectedPost(post)}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
