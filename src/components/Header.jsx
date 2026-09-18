export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#/" aria-label="Web4 Publisher home"><span className="brand-mark">W4</span><span>Web4 Publisher</span></a>
        <nav aria-label="Primary navigation">
          <a href="#/blog">Blog</a>
          <a href="#/about">About</a>
          <a href="https://github.com/web4hub/web4-publisher">GitHub</a>
        </nav>
      </div>
    </header>
  );
}
