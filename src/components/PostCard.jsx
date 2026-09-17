export default function PostCard({ post, onOpen }) {
  return (
    <article className="post-card">
      <div className="post-meta">
        <span>{post.category}</span>
        <span>{post.date}</span>
      </div>

      <h3>{post.title}</h3>

      <p>{post.description}</p>

      <div className="tag-list">
        {(post.tags || []).map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </div>

      <button onClick={onOpen}>
        Read publication →
      </button>
    </article>
  );
}
