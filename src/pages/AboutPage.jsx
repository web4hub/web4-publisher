export default function AboutPage() {
  return (
    <section className="content-page">
      <span className="eyebrow">ABOUT THE PROJECT</span>
      <h1>Publishing with meaning.</h1>
      <p className="lead">Web4 Publisher turns structured Markdown into a readable, searchable and extensible publication experience.</p>
      <div className="prose-grid">
        <article><h2>Static first</h2><p>Content stays in the repository, remains versioned, and can be deployed anywhere static files are supported.</p></article>
        <article><h2>Semantic by default</h2><p>Front matter captures authorship, dates, categories, tags, themes and future identity metadata.</p></article>
        <article><h2>Built to extend</h2><p>The content loader and renderer provide a foundation for RSS, JSON-LD, federation and additional publication formats.</p></article>
      </div>
      <p><a className="button button-primary" href="https://github.com/web4hub/web4-publisher">View the source on GitHub →</a></p>
    </section>
  );
}
