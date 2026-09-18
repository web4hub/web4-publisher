---
title: "Web4 Publisher"
description: "Semantic publishing for Web4."
author: "Web4Hub"
date: 2026-09-17
tags:
  - web4
  - publishing
  - semantic-web
category: web4
theme: default
draft: false
---

# Web4 Publisher

Content goes here.

^↑D

detect → analyze → infer → classify → register → learn

^D

create → validate

^|D

execute
Good. Let’s lock this down as Web4 Publisher v1.0 rather than continuing with another loose prototype.

I’d define the repository as a static-first, Markdown/MDX publishing engine with a clean path toward semantic/Web4 publication.

web4-publisher/
│
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── build.yml
│       ├── pages.yml
│       └── security.yml
│
├── public/
│   ├── assets/
│   └── favicon.svg
│
├── posts/
│   ├── web4/
│   ├── qlang/
│   └── research/
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── PostCard.jsx
│   │   └── PostView.jsx
│   │
│   ├── content/
│   │   ├── loader.js
│   │   ├── parser.js
│   │   └── validator.js
│   │
│   ├── renderer/
│   │   └── markdown.js
│   │
│   ├── themes/
│   │   ├── default/
│   │   ├── glitch/
│   │   └── win95/
│   │
│   ├── scripts/
│   │   └── router.js
│   │
│   ├── styles/
│   │   ├── base.scss
│   │   ├── components.scss
│   │   └── themes.scss
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── schemas/
│   └── post.schema.json
│
├── scripts/
│   ├── validate-content.js
│   ├── build-content.js
│   └── generate-index.js
│
├── tests/
│   ├── content.test.js
│   ├── parser.test.js
│   └── build.test.js
│
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── CONTRIBUTING.md
├── SECURITY.md
└── LICENSE
`docs/ARCHITECTURE.md` contains no function or variable definitions. It is an architecture document containing a repository directory tree.

File: [docs/ARCHITECTURE.md](https://github.com/web4hub/web4-publisher/blob/2cd86857d7fa816841f674eafa99464693297ab1/docs/ARCHITECTURE.md)

### Functions

None defined.

### Variables

None defined.

### Documented project components

The file lists these components:

- `src/index.js` — likely the package entry point.
- `src/github/client.js` — GitHub API client functionality.
- `src/github/mapper.js` — maps GitHub data into the project’s internal model.
- `src/github/adapter.js` — adapts GitHub integration to the publisher.
- `src/core/normalize.js` — normalization logic.
- `src/core/validate.js` — validation logic.
- `src/core/canonicalize.js` — canonical representation generation.
- `src/core/hash.js` — hashing functionality.
- `src/core/identity.js` — identity-related functionality.
- `src/core/manifest.js` — manifest creation or processing.
- `src/publisher/publisher.js` — primary publishing logic.
- `src/publisher/filesystem.js` — filesystem persistence or output.
- `src/publisher/index.js` — publisher module entry point.
- `src/server/server.js` — server setup.
- `src/server/routes.js` — server route definitions.
- `schemas/*.json` — JSON schema definitions.
- `test/*.test.js` — test files for the corresponding modules.
- `publications/` — storage location for generated or published content.
- `api.json` — likely API metadata or specification.
- `web4.config.json` — project configuration.

To list the actual functions and variables, the JavaScript files under `src/` would need to be inspected individually.
The central content contract should be front matter + Markdown:

---
title: "Web4 Publisher"
slug: "web4-publisher"
description: "A semantic-first publishing engine for Web4."
author: "Web4Hub"
date: "2026-09-17"
category: "web4"
tags:
  - web4
  - publishing
  - semantic-web
theme: "default"
draft: false
---
# Web4 Publisher
The publication body lives here.
^↑D
detect → analyze → infer → classify → register → learn
^D
create → validate
^|D
execute

The schema should enforce the contract:

{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Web4 Publication",
  "type": "object",
  "required": [
    "title",
    "slug",
    "description",
    "author",
    "date",
    "category",
    "tags",
    "theme",
    "draft"
  ],
  "properties": {
    "title": {
      "type": "string",
      "minLength": 1
    },
    "slug": {
      "type": "string",
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "description": {
      "type": "string"
    },
    "author": {
      "type": "string"
    },
    "date": {
      "type": "string",
      "format": "date"
    },
    "category": {
      "type": "string"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "theme": {
      "type": "string",
      "enum": [
        "default",
        "glitch",
        "win95"
      ]
    },
    "draft": {
      "type": "boolean"
    }
  },
  "additionalProperties": false
}

The package should stay deliberately small:

{
  "name": "@web4hub/web4-publisher",
  "version": "1.0.0",
  "private": false,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "npm run validate && vite build",
    "preview": "vite preview",
    "validate": "node scripts/validate-content.js",
    "generate:index": "node scripts/generate-index.js",
    "test": "vitest run"
  },
  "dependencies": {
    "gray-matter": "^4.0.3",
    "marked": "^15.0.0",
    "ajv": "^8.17.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "sass": "^1.83.4",
    "vite": "^6.0.0",
    "vitest": "^2.1.8"
  }
}

The build contract is:

npm install
     │
     ▼
npm run validate
     │
     ├── invalid → BUILD FAIL
     │
     └── valid
           │
           ▼
       Vite build
           │
           ▼
        dist/
           │
           ├── index.html
           ├── posts/
           ├── assets/
           └── generated metadata

The GitHub Pages workflow can then be extremely straightforward:

name: Deploy Web4 Publisher
on:
  push:
    branches:
      - main
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
    steps:
      - uses: actions/deploy-pages@v4

The architectural principle I would preserve is:

             WEB4 PUBLISHER
                    │
       ┌────────────┴────────────┐
       │                         │
   CONTENT                    PROTOCOL
       │                         │
 Markdown/MDX              ^↑D / ^D / ^|D
       │                         │
       └────────────┬────────────┘
                    ▼
             PARSE + VALIDATE
                    │
                    ▼
              CONTENT MODEL
                    │
                    ▼
              THEME ENGINE
                    │
                    ▼
                 RENDER
                    │
                    ▼
                 BUILD
                    │
                    ▼
               PUBLICATION

Then v1.1 can add an actual semantic layer:

Publication
    │
    ├── content hash
    ├── semantic entities
    ├── relationships
    ├── provenance
    └── publication manifest

And v2 can add cryptographic verification:

CONTENT
   ↓
HASH
   ↓
MANIFEST
   ↓
SIGN
   ↓
PUBLISH
   ↓
VERIFY

That sequencing matters. Web4 Publisher v1 should first be a genuinely usable publisher. The Web4 protocol layer should make it more verifiable and machine-readable rather than making the basic publishing system dependent on blockchain infrastructure.

The resulting repository has a clear identity:

Web4 Publisher — a static-first, semantic publishing engine for Markdown/MDX content, designed for Web4-native publication, validation, provenance, and verification.

The next implementation target is the actual repository files—not another specification. The first commit should establish the Vite application, content schema, Markdown loader, three themes, validation pipeline, tests, and GitHub Pages deployment.
