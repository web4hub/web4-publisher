import os
import zipfile
PROJECT_NAME = "vite-mastodon-theme-blog"
files = {
    "package.json": r'''{
  "name": "vite-mastodon-theme-blog",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "marked": "^12.0.0"
  },
  "devDependencies": {
    "sass": "^1.72.0",
    "vite": "^5.1.0"
  }
}''',
    "vite.config.js": r'''import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default defineConfig({
  resolve: {
    alias: {
      "@styles": resolve(__dirname, "src/styles"),
      "@posts": resolve(__dirname, "posts")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler"
      }
    }
  }
});
''',
    "index.html": r'''<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <meta
      name="description"
      content="A multi-theme Markdown technology blog powered by Vite."
    />
    <meta
      name="theme-color"
      content="#000000"
    />
    <title>Web4 Publisher</title>
  </head>
  <body>
    <div id="app"></div>
    <script
      type="module"
      src="/src/main.js"
    ></script>
  </body>
</html>
''',
    "src/main.js": r'''import { marked } from "marked";
import "./styles/reset.scss";
import "./styles/theme.scss";
const markdownPosts = import.meta.glob(
  "../posts/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true
  }
);
function getPostTitle(path) {
  const filename = path
    .split("/")
    .pop()
    .replace(/\.md$/i, "");
  return filename
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (character) =>
      character.toUpperCase()
    );
}
function renderPosts() {
  const posts = Object.entries(markdownPosts);
  if (posts.length === 0) {
    document.querySelector("#app").innerHTML = `
      <main class="site">
        <header class="site-header">
          <h1>Web4 Publisher</h1>
          <p>No posts have been published yet.</p>
        </header>
      </main>
    `;
    return;
  }
  const postMarkup = posts
    .map(([path, markdown]) => {
      const title = getPostTitle(path);
      return `
        <article class="post">
          <header class="post-header">
            <h2>${title}</h2>
          </header>
          <div class="post-content">
            ${marked.parse(markdown)}
          </div>
        </article>
      `;
    })
    .join("");
  document.querySelector("#app").innerHTML = `
    <main class="site">
      <header class="site-header">
        <div>
          <span class="brand">WEB4</span>
          <span class="publisher">PUBLISHER</span>
        </div>
        <h1>Decentralized Technology Journal</h1>
        <p>
          Markdown publishing · Vite · SCSS · Web4
        </p>
      </header>
      <section class="posts">
        ${postMarkup}
      </section>
      <footer class="site-footer">
        <p>
          Published with Web4 Publisher.
        </p>
      </footer>
    </main>
  `;
}
renderPosts();
''',
    "src/styles/reset.scss": r'''*,
*::before,
*::after {
  box-sizing: border-box;
}
html,
body {
  margin: 0;
  padding: 0;
}
html {
  min-height: 100%;
}
body {
  min-height: 100vh;
}
button,
input,
textarea,
select {
  font: inherit;
}
img {
  display: block;
  max-width: 100%;
}
a {
  color: inherit;
}
h1,
h2,
h3,
h4,
p {
  margin-top: 0;
}
''',
    "src/styles/theme.scss": r'''@use "./reset.scss";
:root {
  --background: #080808;
  --surface: #101010;
  --surface-alt: #151515;
  --border: #2a2a2a;
  --text: #f2f2f2;
  --muted: #9a9a9a;
  --accent: #00ff9c;
  --accent-secondary: #00d9ff;
  --max-width: 960px;
  color-scheme: dark;
}
body {
  background:
    radial-gradient(
      circle at top,
      rgba(0, 255, 156, 0.08),
      transparent 35%
    ),
    var(--background);
  color: var(--text);
  font-family:
    Inter,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
  line-height: 1.7;
}
.site {
  width: min(
    calc(100% - 2rem),
    var(--max-width)
  );
  margin: 2rem auto;
}
.site-header {
  position: relative;
  padding: 2rem;
  background:
    linear-gradient(
      135deg,
      rgba(0, 255, 156, 0.08),
      rgba(0, 217, 255, 0.03)
    );
  border: 1px solid var(--border);
  box-shadow:
    0 0 40px rgba(0, 255, 156, 0.05);
  overflow: hidden;
}
.site-header::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(255, 255, 255, 0.015) 4px
    );
}
.brand {
  color: var(--accent);
  font-family: monospace;
  font-weight: 800;
  letter-spacing: 0.2em;
}
.publisher {
  margin-left: 0.75rem;
  color: var(--muted);
  font-family: monospace;
  letter-spacing: 0.12em;
}
.site-header h1 {
  position: relative;
  margin:
    1rem 0
    0.25rem;
  font-size: clamp(
    1.8rem,
    5vw,
    3rem
  );
  line-height: 1.1;
}
.site-header p {
  position: relative;
  margin: 0;
  color: var(--muted);
}
.posts {
  display: grid;
  gap: 1.5rem;
  margin-top: 1.5rem;
}
.post {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: clamp(
    1.25rem,
    4vw,
    2rem
  );
  transition:
    border-color 180ms ease,
    transform 180ms ease,
    box-shadow 180ms ease;
}
.post:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
  box-shadow:
    0 0 30px
    rgba(0, 255, 156, 0.06);
}
.post-header {
  border-bottom:
    1px solid var(--border);
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
}
.post-header h2 {
  margin: 0;
  color: var(--accent);
  font-size: 1.7rem;
  line-height: 1.2;
}
.post-content {
  color: var(--text);
}
.post-content h1,
.post-content h2,
.post-content h3 {
  color: var(--accent-secondary);
  line-height: 1.25;
}
.post-content a {
  color: var(--accent);
  text-decoration-thickness: 1px;
}
.post-content strong {
  color: #ffffff;
}
.post-content blockquote {
  margin:
    1.5rem 0;
  padding:
    0.75rem 1rem;
  border-left:
    3px solid var(--accent);
  background:
    var(--surface-alt);
  color: var(--muted);
}
.post-content code {
  padding:
    0.15rem
    0.35rem;
  background: #000;
  border:
    1px solid var(--border);
  font-family: monospace;
  color: var(--accent);
}
.post-content pre {
  overflow-x: auto;
  padding: 1rem;
  background: #000;
  border:
    1px solid var(--border);
}
.post-content pre code {
  padding: 0;
  border: 0;
  color: #eaeaea;
}
.post-content ul,
.post-content ol {
  padding-left: 1.5rem;
}
.site-footer {
  margin-top: 2rem;
  padding: 1rem;
  border-top:
    1px solid var(--border);
  color: var(--muted);
  font-family: monospace;
  font-size: 0.85rem;
  text-align: center;
}
@media (max-width: 600px) {
  .site {
    width: min(
      calc(100% - 1rem),
      var(--max-width)
    );
    margin: 0.5rem auto;
  }
  .site-header {
    padding: 1.25rem;
  }
  .publisher {
    display: block;
    margin:
      0.35rem 0
      0;
  }
  .post {
    padding: 1rem;
  }
}
''',
    "src/styles/themes/win95.scss": r'''@use "../reset.scss";
body {
  background: #008080;
  color: #000;
  font-family:
    "MS Sans Serif",
    Arial,
    sans-serif;
}
.site {
  max-width: 900px;
  margin: 2rem auto;
  background: #c0c0c0;
  border:
    3px outset #c0c0c0;
  padding: 4px;
}
.site-header {
  background: #000080;
  color: #fff;
  border: 2px outset #c0c0c0;
  padding: 0.75rem;
  box-shadow: none;
}
.site-header::after {
  display: none;
}
.brand,
.site-header h1 {
  color: #fff;
  font-family:
    "MS Sans Serif",
    Arial,
    sans-serif;
}
.site-header p {
  color: #fff;
}
.post {
  background: #fff;
  color: #000;
  border:
    2px inset #c0c0c0;
  box-shadow: none;
  border-radius: 0;
}
.post:hover {
  transform: none;
  border:
    2px inset #c0c0c0;
  box-shadow: none;
}
.post-header {
  border-bottom:
    2px groove #c0c0c0;
}
.post-header h2,
.post-content h1,
.post-content h2,
.post-content h3 {
  color: #000080;
}
.post-content code {
  background: #eee;
  color: #000;
  border: 1px solid #808080;
}
.post-content pre {
  background: #000;
  color: #fff;
}
.site-footer {
  color: #000;
  border-top:
    2px groove #c0c0c0;
}
''',
    "src/styles/themes/glitch.scss": r'''@use "../reset.scss";
body {
  background: #030303;
  color: #00ff9c;
  font-family:
    "Courier New",
    monospace;
}
.site {
  position: relative;
}
.site-header {
  background: #030303;
  border:
    1px solid #00ff9c;
  box-shadow:
    0 0 15px
    rgba(0, 255, 156, 0.35);
}
.site-header h1 {
  text-shadow:
    2px 0 #ff00ff,
    -2px 0 #00ffff;
}
.site-header::after {
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 255, 156, 0.04) 3px
    );
}
.post {
  background: #050505;
  border:
    1px solid #242424;
}
.post:hover {
  border-color: #ff00ff;
  box-shadow:
    0 0 20px
    rgba(255, 0, 255, 0.2);
}
.post-header h2 {
  color: #00ffff;
  text-shadow:
    2px 0 #ff00ff;
}
.post-content h1,
.post-content h2,
.post-content h3 {
  color: #ff00ff;
}
.post-content code {
  color: #00ffff;
}
.site-footer {
  color: #00ff9c;
}
''',
    "posts/web4-architecture.md": r'''# Building Web4 Decentralized Platforms
Web4 architecture focuses on combining **decentralized web protocols**,
autonomous execution layers, semantic systems, and local-first data
integrity.
## Key Principles
### 1. Zero Central Authority Dependencies
A Web4 application should minimize dependence on a single centralized
service.
Identity, data, routing, computation, and authorization can be
distributed across independently operated infrastructure.
### 2. Custom Semantic Pipelines
A semantic execution system can transform information through a
pipeline such as:
```text
Detect
  ↓
Analyze
  ↓
Infer
  ↓
Classify
  ↓
Register
  ↓
Learn

The resulting semantic representation can then be passed to an
execution layer.

3. Local-First Synchronization

Applications should remain functional locally while synchronizing
state with other trusted peers or services.

Local State
    │
    ├──> Cache
    │
    ├──> Semantic State
    │
    └──> Network Sync
             │
             ▼
       Distributed Peers

4. Autonomous Execution

A Web4 system can separate intent from execution.

For example:

User Intent
    ↓
Semantic Interpretation
    ↓
Policy / Permission Check
    ↓
Execution Plan
    ↓
Protocol Execution
    ↓
Verification
    ↓
Result

This architecture makes it possible to integrate AI agents,
blockchains, decentralized storage, identity systems, and autonomous
services without forcing all of them into a single application.

Publisher Architecture

The publishing stack can remain deliberately simple:

Markdown
    ↓
Content Parser
    ↓
Post Metadata
    ↓
Renderer
    ↓
Theme
    ↓
Static Site
    ↓
Web / IPFS / Web4 Network

The content remains portable because Markdown is independent of the
presentation layer.

Future Extensions

The publisher can later support:

* YAML front matter
* Categories
* Tags
* Authors
* Canonical URLs
* RSS and Atom feeds
* Sitemap generation
* OpenGraph metadata
* Mastodon federation
* ActivityPub publishing
* IPFS deployment
* Web4 identity metadata
* Cryptographic content signatures
* Content-addressed publishing
* AI-assisted article generation
* Semantic indexing
* Decentralized content verification

Conclusion

A useful Web4 publisher should not attempt to make the publishing
engine unnecessarily complicated.

The core should remain:

Content
  +
Metadata
  +
Rendering
  +
Verification
  +
Publishing

Everything else can be implemented as an adapter around that core.
‘’’,

"README.md": r'''# Web4 Publisher

A Vite-based Markdown publishing system with SCSS themes.

Features

* Vite development server
* Markdown rendering
* marked Markdown parser
* SCSS
* Default futuristic theme
* Windows 95 theme
* Glitch theme
* Responsive layout
* Static build support
* Simple content directory

Requirements

* Node.js 18+
* npm

Install

npm install

Development

npm run dev

Production Build

npm run build

Preview

npm run preview

Project Structure

vite-mastodon-theme-blog/
├── index.html
├── package.json
├── vite.config.js
├── README.md
│
├── posts/
│   └── web4-architecture.md
│
└── src/
    ├── main.js
    │
    └── styles/
        ├── reset.scss
        ├── theme.scss
        │
        └── themes/
            ├── glitch.scss
            └── win95.scss

Adding a Post

Create a Markdown file inside:

posts/

For example:

posts/
├── web4-architecture.md
├── decentralized-ai.md
└── semantic-web.md

Vite imports the Markdown files automatically during the build.

Architecture

              ┌──────────────────┐
              │    Markdown      │
              │      Posts       │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │      marked      │
              │ Markdown Parser  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │   Blog Renderer  │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │    SCSS Theme    │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │       Vite       │
              └────────┬─────────┘
                       │
                       ▼
              ┌──────────────────┐
              │   Static Site    │
              └──────────────────┘

Future Publishing Layer

The project can evolve into a full Web4 publishing pipeline:

Write
  ↓
Parse
  ↓
Validate
  ↓
Render
  ↓
Hash
  ↓
Sign
  ↓
Publish
  ↓
Federate
  ↓
Verify

This allows the frontend publishing system to remain independent from
the eventual decentralized publishing protocol.
‘’’
}

def write_files():
“”“Create the complete project tree.”””
for relative_path, content in files.items():
full_path = os.path.join(
PROJECT_NAME,
relative_path
)

    directory = os.path.dirname(full_path)
    if directory:
        os.makedirs(
            directory,
            exist_ok=True
        )
    with open(
        full_path,
        "w",
        encoding="utf-8"
    ) as file:
        file.write(content)
    print(f"[created] {full_path}")

def create_zip():
“”“Create a ZIP archive of the project.”””
archive_name = f”{PROJECT_NAME}.zip”

with zipfile.ZipFile(
    archive_name,
    "w",
    compression=zipfile.ZIP_DEFLATED
) as archive:
    for root, _, filenames in os.walk(PROJECT_NAME):
        for filename in filenames:
            full_path = os.path.join(
                root,
                filename
            )
            archive_path = os.path.relpath(
                full_path,
                PROJECT_NAME
            )
            archive.write(
                full_path,
                archive_path
            )
print(f"[created] {archive_name}")

def main():
print(
f”Creating project: {PROJECT_NAME}”
)

write_files()
create_zip()
print()
print("Project generation complete.")
print()
print("Next steps:")
print(f"  cd {PROJECT_NAME}")
print("  npm install")
print("  npm run dev")

if name == “main”:
main()

This version is deliberately structured as a real project generator rather than just fixing the broken fragments. It also separates the themes properly:
```text
src/styles/
├── reset.scss
├── theme.scss          ← active/default theme
└── themes/
    ├── win95.scss
    └── glitch.scss

The next architectural step for web4-publisher would be to turn the Markdown pipeline into:

Markdown → front matter → validation → rendering → content hash → signature → static output → Mastodon/Web4 publishing.

That would move this from a themed Vite blog into an actual publishing engine.
