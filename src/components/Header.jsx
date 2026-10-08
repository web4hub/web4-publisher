import { pageRegistry } from "../config/pageRegistry.js";

export default function Header() {
  const items = [...(pageRegistry.navigation?.primary || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  return <header className="site-header">
    <div className="header-inner">
      <a className="brand" href={`#${pageRegistry.site.default_route || "/"}`} aria-label={`${pageRegistry.site.name} home`}>
        <span className="brand-mark">W4</span><span>{pageRegistry.site.name}</span>
      </a>
      <nav aria-label="Primary navigation">
        {items.map((item) => {
          const target = pageRegistry.pages.find((page) => page.id === item.page);
          const href = item.url || (target ? `#${target.route || target.path}` : null);
          if (!href) return null;
          return <a key={item.page || item.url || item.label} href={href} target={item.external ? "_blank" : undefined} rel={item.external ? "noreferrer" : undefined}>{item.label}</a>;
        })}
        <a href="https://github.com/web4hub/web4-publisher">GitHub</a>
      </nav>
    </div>
  </header>;
}
