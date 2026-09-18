export default function PostCard({ post }) {
  return (
    <article className="post-card">
      <div className="post-meta"><span>{post.category}</span><time dateTime={post.date}>{post.date}</time></div>
      <h3><a href={`#/blog/${encodeURIComponent(post.slug)}`}>{post.title}</a></h3>
      <p>{post.description}</p>
      <div className="tag-list">{(post.tags || []).map((tag) => <a key={tag} href={`#/blog?tag=${encodeURIComponent(tag)}`}>#{tag}</a>)}</div>
      <a className="read-link" href={`#/blog/${encodeURIComponent(post.slug)}`}>Read publication →</a>
    </article>
  );
}
