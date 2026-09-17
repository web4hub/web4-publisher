# Web4 Publisher

Web4 Publisher is a static-first semantic publishing engine for
Markdown/MDX content.

It provides:

- Markdown publication
- Front-matter metadata
- Content validation
- Vite static builds
- Multiple publication themes
- GitHub Pages deployment
- Vercel-compatible deployment
- Semantic Web4 directives

## Architecture

```text
Markdown / MDX
      ↓
Parse
      ↓
Validate
      ↓
Content Model
      ↓
Theme
      ↓
Render
      ↓
Vite
      ↓
Static Publication
