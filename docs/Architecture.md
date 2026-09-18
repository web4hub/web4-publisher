import os
import zipfile
from pathlib import Path
PROJECT_NAME = "vite-mastodon-theme-blog"
PROJECT_DIR = Path(PROJECT_NAME)
ZIP_FILE = Path(f"{PROJECT_NAME}.zip")
FILES = {
    "package.json": r"""
{
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
}
""",
    "vite.config.js": r"""
import { defineConfig } from "vite";
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
  },
  build: {
    rollupOptions: {
      input: resolve(__dirname, "index.html")
    }
  }
});
""",
    "index.html": r"""
<!DOCTYPE html>
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
""",
    "posts/web4-architecture.md": r"""
# Building Web4 Decentralized Platforms
Web4 architecture focuses on combining **decentralized web
protocols**, autonomous execution layers, artificial intelligence,
and local-first data integrity.
## Key Principles
### Zero Central Authority Dependencies
Applications should minimize unnecessary dependence on centralized
services.
Self-sovereign routing, identity, storage, and execution can allow
users and autonomous agents to maintain greater control over their
digital infrastructure.
### Custom Parser Pipelines
High-performance parser pipelines can transform source documents into
structured semantic representations.
A publishing platform can therefore treat Markdown as source material
rather than merely as formatted text.
### Local-First Synchronization
Local-first systems keep useful application state available locally
while synchronizing changes between participating nodes.
This approach is particularly useful for decentralized publishing.
## Architecture
A simplified Web4 publishing architecture can be represented as:
```text
Author
   │
   ▼
Markdown / Structured Content
   │
   ▼
Publisher
   │
   ├── Parser
   ├── Metadata
   ├── Renderer
   └── Validation
   │
   ▼
Publication Artifact
   │
   ├── Web
   ├── RSS / Atom
   ├── Mastodon
   └── Decentralized Network

Content Pipeline

The publisher should separate content from presentation:

Markdown
   ↓
Parser
   ↓
Document Model
   ↓
Metadata
   ↓
Renderer
   ↓
Theme
   ↓
Published Page

This separation makes it possible to change the visual design without
changing the underlying content.

Future Extensions

The platform can later support:

* Front matter
* RSS feeds
* Atom feeds
* Sitemap generation
* OpenGraph metadata
* JSON-LD
* Mastodon publishing
* Web4 metadata
* Content-addressed storage
* IPFS-compatible publication
* Digital signatures
* Author identity
* Automated validation
* AI-assisted publishing

Conclusion

A modern publisher should treat a blog as a content pipeline rather
than simply a collection of HTML pages.

The same Markdown source can therefore become a web page, social post,
feed entry, decentralized publication artifact, or signed content
object.
“””,

"src/main.js": r"""

import { marked } from “marked”;

import “./styles/theme.scss”;

const posts = import.meta.glob(
“../posts/*.md”,
{
query: “?raw”,
import: “default”,
eager: true
}
);

function getPostTitle(path) {
return path
.split(”/”)
.pop()
.replace(/.md$/i, “”)
.replace(/[-_]+/g, “ “)
.replace(/\b\w/g, character => character.toUpperCase());
}

function renderPost(path, markdown) {
const title = getPostTitle(path);

return `
  <header class="post-header">
    <h2>${title}</h2>
  </header>
  <div class="post-content">
    ${marked.parse(markdown)}
  </div>
</article>

`;
}

function renderBlog() {
const app = document.querySelector(”#app”);

if (!app) {
throw new Error(“Application root #app was not found.”);
}

const postsHtml = Object.entries(posts)
.map(([path, markdown]) => {
return renderPost(path, markdown);
})
.join(”\n”);

app.innerHTML = `
  <header class="site-header">
    <div class="window-title">
      <span>WEB4-PUBLISHER</span>
    </div>
    <div class="site-brand">
      <h1>Web4 Publisher</h1>
      <p>
        Markdown · Vite · SCSS · Decentralized Publishing
      </p>
    </div>
  </header>
  <nav class="site-nav">
    <a href="/">Home</a>
    <a href="#posts">Posts</a>
    <a href="#about">About</a>
  </nav>
  <section
    id="posts"
    class="posts"
  >
    ${postsHtml}
  </section>
  <section
    id="about"
    class="about"
  >
    <h2>About</h2>
    <p>
      Web4 Publisher is a lightweight Markdown publishing system
      designed around portable content, interchangeable themes,
      and extensible publication pipelines.
    </p>
  </section>
  <footer class="site-footer">
    Web4 Publisher · Built with Vite
  </footer>
</main>

`;
}

renderBlog();
“””,

"src/styles/theme.scss": r"""

@use “./reset.scss”;

// ————————————————————
// Theme variables
// ————————————————————

:root {
–desktop: #008080;
–window: #c0c0c0;
–window-light: #ffffff;
–window-dark: #808080;
–titlebar: #000080;

–text: #000000;
–link: #000080;

–content: #ffffff;
–border: #808080;

–font:
Arial,
Helvetica,
sans-serif;
}

// ————————————————————
// Base
// ————————————————————

html {
scroll-behavior: smooth;
}

body {
min-height: 100vh;

margin: 0;
padding: 2rem;

background: var(–desktop);

color: var(–text);

font-family: var(–font);
line-height: 1.6;
}

// ————————————————————
// Main application
// ————————————————————

.site {
width: min(100%, 960px);

margin: 0 auto;

background: var(–window);

border-top: 3px solid var(–window-light);
border-left: 3px solid var(–window-light);

border-right: 3px solid var(–window-dark);
border-bottom: 3px solid var(–window-dark);

padding: 4px;
}

// ————————————————————
// Header
// ————————————————————

.site-header {
background: var(–titlebar);
color: white;
}

.window-title {
padding: 0.25rem 0.5rem;

font-size: 0.8rem;
font-weight: bold;

border-bottom: 1px solid #000;
}

.site-brand {
padding: 1rem;
}

.site-brand h1 {
margin: 0;

font-size: 2rem;
line-height: 1.2;
}

.site-brand p {
margin: 0.4rem 0 0;

opacity: 0.9;
}

// ————————————————————
// Navigation
// ————————————————————

.site-nav {
display: flex;
flex-wrap: wrap;
gap: 0.5rem;

padding: 0.75rem;

background: var(–window);

border-bottom: 2px solid var(–window-dark);
}

.site-nav a {
display: inline-block;

padding: 0.3rem 0.7rem;

color: var(–text);
text-decoration: none;

background: var(–window);

border-top: 2px solid var(–window-light);
border-left: 2px solid var(–window-light);

border-right: 2px solid var(–window-dark);
border-bottom: 2px solid var(–window-dark);
}

.site-nav a:hover {
background: #d8d8d8;
}

.site-nav a:active {
border-top-color: var(–window-dark);
border-left-color: var(–window-dark);

border-right-color: var(–window-light);
border-bottom-color: var(–window-light);
}

// ————————————————————
// Content
// ————————————————————

.posts,
.about {
padding: 1rem;
}

.post {
margin-bottom: 2rem;

background: var(–content);

border-top: 2px solid var(–window-dark);
border-left: 2px solid var(–window-dark);

border-right: 2px solid var(–window-light);
border-bottom: 2px solid var(–window-light);

padding: 1.25rem;
}

.post-header {
margin-bottom: 1rem;

padding-bottom: 0.75rem;

border-bottom: 1px solid var(–border);
}

.post-header h2 {
margin: 0;

font-size: 1.5rem;
}

.post-content {
overflow-wrap: break-word;
}

.post-content h1,
.post-content h2,
.post-content h3 {
line-height: 1.3;
}

.post-content a {
color: var(–link);
}

.post-content img {
max-width: 100%;
}

.post-content code {
padding: 0.15rem 0.3rem;

background: #eeeeee;

font-family:
“Courier New”,
monospace;
}

.post-content pre {
overflow-x: auto;

padding: 1rem;

background: #111111;
color: #ffffff;
}

.post-content pre code {
padding: 0;

background: transparent;
color: inherit;
}

.post-content blockquote {
margin-left: 0;

padding-left: 1rem;

border-left: 4px solid var(–titlebar);
}

// ————————————————————
// About
// ————————————————————

.about {
background: var(–content);

margin: 0 1rem 1rem;

border: 2px inset var(–window);

padding: 1rem;
}

// ————————————————————
// Footer
// ————————————————————

.site-footer {
padding: 1rem;

text-align: center;

font-size: 0.85rem;
}
“””,

"src/styles/reset.scss": r"""

*,
*::before,
*::after {
box-sizing: border-box;
}

html,
body {
margin: 0;
padding: 0;
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
max-width: 100%;
height: auto;
display: block;
}

a {
color: inherit;
}
“””,

"src/styles/flavours/glitch.scss": r"""

@use “../reset.scss”;

:root {
–desktop: #030303;
–window: #090909;
–window-light: #00ff9c;
–window-dark: #333333;

–titlebar: #050505;

–text: #00ff9c;
–link: #00ffff;

–content: #080808;
–border: #333333;

–font:
“Courier New”,
monospace;
}

body {
background: #030303;

color: var(–text);

font-family: var(–font);
}

.site {
background: #050505;

border: 1px solid var(–window-light);

box-shadow:
0 0 10px rgba(0, 255, 156, 0.7),
0 0 30px rgba(0, 255, 156, 0.25);
}

.site-header {
background: #050505;

color: var(–text);

border-bottom: 1px solid var(–window-light);
}

.window-title {
border-bottom: 1px solid var(–window-light);
}

.site-nav {
background: #050505;

border-bottom: 1px solid var(–window-light);
}

.site-nav a {
background: #050505;

color: var(–text);

border: 1px solid var(–window-light);
}

.site-nav a:hover {
background: #102019;
}

.post,
.about {
background: var(–content);

border: 1px solid var(–border);
}

.post-header {
border-bottom: 1px solid var(–border);
}

.post-header h2 {
text-shadow:
2px 0 #ff00ff,
-2px 0 #00ffff;
}

.post-content a {
color: var(–link);
}

.post-content pre {
background: #000000;

border: 1px solid #333333;
}

.site-footer {
border-top: 1px solid var(–window-light);
}
“””,

"README.md": r"""

Web4 Publisher

A lightweight Vite-powered Markdown publishing system with SCSS
themes.

Features

* Vite development server
* Markdown content
* marked Markdown parser
* SCSS
* Windows 95-inspired theme
* Glitch/cyberpunk theme
* Theme-independent content
* Static production builds
* Simple project structure

Requirements

* Node.js 18+
* npm

Installation

npm install

Development

npm run dev

Production Build

npm run build

Preview

npm run preview

Content

Markdown posts are stored in:

posts/

Add another Markdown file:

posts/my-new-post.md

The application automatically discovers Markdown files using Vite’s
import.meta.glob().

Themes

The primary theme is:

src/styles/theme.scss

The experimental glitch theme is:

src/styles/flavours/glitch.scss

The architecture intentionally keeps content separate from styling so
additional themes can be introduced without modifying the Markdown
documents.

Future Publisher Pipeline

Author
   ↓
Markdown
   ↓
Parser
   ↓
Document Model
   ↓
Metadata
   ↓
Validation
   ↓
Renderer
   ↓
Theme
   ↓
Publication
   ├── Web
   ├── RSS
   ├── Atom
   ├── Mastodon
   └── Decentralized Storage

“””
}

def write_files():
print(f”Creating project: {PROJECT_NAME}”)

for relative_path, content in FILES.items():
    file_path = PROJECT_DIR / relative_path
    file_path.parent.mkdir(
        parents=True,
        exist_ok=True
    )
    file_path.write_text(
        content.strip() + "\n",
        encoding="utf-8"
    )
    print(f"  created {file_path}")

def create_zip():
if ZIP_FILE.exists():
ZIP_FILE.unlink()

with zipfile.ZipFile(
    ZIP_FILE,
    "w",
    compression=zipfile.ZIP_DEFLATED
) as archive:
    for file_path in PROJECT_DIR.rglob("*"):
        if file_path.is_file():
            archive.write(
                file_path,
                file_path.relative_to(PROJECT_DIR)
            )
print(f"\nZIP created: {ZIP_FILE}")

def main():
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

This version fixes the broken `__dirname`/`resolve()` fragments, makes the SCSS structure coherent, automatically discovers Markdown posts, and generates both the project directory and `vite-mastodon-theme-blog.zip`.
One important distinction: despite the original name, this is currently a **Mastodon-compatible blog foundation**, not yet a Mastodon publisher. The next layer would be the actual publication pipeline: Markdown → rendered article → RSS/Atom → Mastodon API → optional Web4/decentralized artifact.
