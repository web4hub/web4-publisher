export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="/">
          <span className="brand-mark">W4</span>
          <span>Web4 Publisher</span>
        </a>

        <nav>
          <a href="#publications">Publications</a>
          <a href="https://github.com/web4hub/web4-publisher">
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
