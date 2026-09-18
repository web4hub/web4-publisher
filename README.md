# Web4 Publisher

Semantic-first static publishing for Markdown and MDX.

Web4 Publisher turns structured Markdown content into a validated, themeable
static publication that can be deployed to GitHub Pages, Vercel, or any static
hosting provider.

## Features

- Markdown and MDX publication
- YAML front-matter metadata
- Content validation
- Vite-powered static builds
- Multiple publication themes
- Generated publication indexes
- Semantic Web4 directives
- GitHub Pages deployment
- Vercel-compatible deployment

## Quick start

### Requirements

- Node.js
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite.

### Validate content

```bash
npm run validate
```

### Run tests

```bash
npm test
```

### Build for production

```bash
npm run build
```

The production build is written to `dist/`.

### Preview the production build

```bash
npm run preview
```

## Creating content

Add Markdown publications to the `posts/` directory. A publication should
include YAML front matter followed by its Markdown body:

```markdown
---
title: "Web4 Publisher"
slug: "web4-publisher"
description: "A semantic-first publishing engine for Web4."
author: "Web4Hub"
date: "2026-09-18"
tags:
  - web4
  - publishing
draft: false
---

# Web4 Publisher

The publication body goes here.
```

The exact fields and validation rules are defined by the schemas in the
[`schemas/`](schemas/) directory.

## Semantic directives
[changelog](https://github.blog/changelog/feed/)
Web4 Publisher supports directive-style semantic stages:

```text
^↑D

detect → analyze → infer → classify → register → learn

^D

create → validate

^|D

execute
```

These stages represent a conceptual flow from detection and analysis through
creation, validation, and execution.

## Build pipeline

```text
Markdown / MDX
      │
      ▼
Parse
      │
      ▼
Validate
      │
      ▼
Content model
      │
      ▼
Theme
      │
      ▼
Render with Vite
      │
      ▼
Static publication
```

The production build validates content before running Vite. Invalid content
causes the build to fail rather than producing an incomplete publication.

## Project structure

```text
.
├── .github/workflows/   # CI and deployment workflows
├── posts/               # Markdown publications
├── schemas/             # Content schemas
├── scripts/             # Validation and generation scripts
├── src/                 # Application and theme source
├── tests/               # Automated tests
├── Architecture.md      # Detailed architecture notes
├── package.json         # Commands and dependencies
└── vite.config.js       # Vite configuration
```

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run validate` | Validate publication content |
| `npm run generate:index` | Generate the publication index |
| `npm test` | Run the test suite |
| `npm run build` | Validate and create a production build |
| `npm run preview` | Preview the production build |

## Deployment

The generated `dist/` directory contains the static site and can be published
by any static hosting provider.

### GitHub Pages

The repository includes GitHub Actions workflows for Pages deployment. Enable
GitHub Pages for the repository and select **GitHub Actions** as the source.

### Vercel

Use the following Vercel settings:

```text
Build command: npm run build
Output directory: dist
Install command: npm ci
```

## Documentation

- [Architecture](Architecture.md)
- [Content schemas](schemas/)
- [CI and deployment workflows](.github/workflows/)

## License

See [`LICENSE`](LICENSE) for licensing information.
