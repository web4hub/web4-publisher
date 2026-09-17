import { renderMarkdown } from "../renderer/markdown.js";

export default function PostView({ post }) {
  return (
    <article className="post-view">
      <header className="post-header">
        <div className="post-meta">
          <span>{post.category}</span>
          <span>{post.date}</span>
        </div>

        <h1>{post.title}</h1>

        <p className="post-description">
          {post.description}
        </p>

        <div className="tag-list">
          {(post.tags || []).map((tag) => (
            <span key={tag}>#{tag}</span>
          ))}
        </div>
      </header>

      <div
        className="markdown"
        dangerouslySetInnerHTML={{
          __html: renderMarkdown(post.content)
        }}
      />
    </article>
  );
}
