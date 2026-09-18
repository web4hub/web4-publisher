import { renderMarkdown } from "../renderer/markdown.js";

export default function PostView({ post }) {
  return (
    <article className="post-view">
      <a className="back-button" href="#/blog">← Back to blog</a>
      <header className="post-header"><div className="post-meta"><span>{post.category}</span><time dateTime={post.date}>{post.date}</time></div><h1>{post.title}</h1><p className="post-description">{post.description}</p><div className="tag-list">{(post.tags || []).map((tag) => <span key={tag}>#{tag}</span>)}</div></header>
      <div className="markdown" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
    </article>
  );
}
