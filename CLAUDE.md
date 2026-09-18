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


------

## Managing deploys

### Handling overlapping deploys

Only one deploy can run at a time per service. Sometimes, a deploy will trigger while _another_ deploy is still in progress. When this occurs, your service can do one of the following:

------

###### Policy

**Wait**

###### Description

Allow the in-progress deploy to finish, then proceed directly to the most recently triggered deploy:

[image: A deploy waiting for an in-progress deploy to complete]

- In this case, Render skips any "intermediate" deploys, such as Deploy B in the timeline above.
- We recommend this option for most workspaces, because it helps maintain a regular cadence of deploys during periods of high change volume.
- This is the default policy for workspaces created *on or after 2025-07-14*.

---

###### Policy

**Override**

###### Description

Immediately cancel the in-progress deploy and start the new one.

- This is the default policy for workspaces created *before 2025-07-14*.

------

You can set which of these policies to use for your workspace:

1. In the [Render Dashboard](https://dashboard.render.com), open your workspace's *Settings* page.
2. Scroll down to the *Overlapping Deploy Policy* section and click *Edit*:

   [image: The Overlapping Deploy Policy setting in the Render Dashboard]

3. Select an option and click *Save changes*.

### Canceling a deploy

You can cancel an in-progress deploy in the [Render Dashboard](https://dashboard.render.com) by going to your service's *Deploys* page and clicking *Cancel deploy*:

   [image: Canceling a deploy in the Render Dashboard]

If you cancel an in-progress deploy while another deploy is [waiting](#handling-overlapping-deploys), Render immediately kicks off the waiting deploy.

### Restarting a service

If your service is misbehaving, you can restart it from your service's *Deploys* page in the [Render Dashboard](https://dashboard.render.com). Click *Manual Deploy > Restart service*:

[image: Restarting a service in the Render Dashboard]

On Render, a service restart is actually a special form of [manual deploy](#manual-deploys):

- Like any other deploy, Render creates a completely new instance of your service and swaps over to it when it's ready.
  - This makes restarting a [zero-downtime action](#zero-downtime-deploys).
  - If your service is [scaled](scaling) to multiple instances, a restart applies to all instances.
- _Unlike_ other deploys, the new instance always uses the exact same Git commit and configuration as the running instance at the time of the restart.
  - This means that if you've recently updated your service's environment variables but haven't redeployed since then, restarting does _not_ incorporate those changes.

### Rolling back a deploy

See [Rollbacks](rollbacks).

## Deployment concepts

### Ephemeral filesystem

By default, Render services have an *ephemeral filesystem*. This means that any changes a running service makes to its filesystem are _lost_ with each deploy.

To persist data across deploys, do one of the following:

- Create and connect to a Render-managed datastore (Render [Postgres](postgresql) or [Key Value](key-value)).
- Create and connect to a custom datastore, such as [MySQL](/deploy-mysql) or [MongoDB](/deploy-mongodb).
- Attach a [persistent disk](disks) to your service.
  - Note the [limitations of persistent disks](disks#disk-limitations-and-considerations).

### Zero-downtime deploys

Whenever you deploy a new version of your service, Render performs a sequence of steps to make sure the service stays up and available throughout the deploy process, even if the deploy fails.

This *zero-downtime deploy* sequence applies to web services, private services, background workers, and cron jobs. Static sites _also_ update with zero downtime, but they're backed by a CDN and don't involve service instances. [Learn more about service types](service-types#summary-of-service-types).

> Adding a persistent disk to your service _disables_ zero-downtime deploys for it. [See details](disks#disk-limitations-and-considerations).

#### Sequence of events

1. When you push up a new version of your code, Render attempts to build it.

   - If the build fails, Render cancels the deploy, and your original service instance continues running without interruption.

2. If the build succeeds, Render attempts to spin up a _new_ instance of your service running the new version of your code.

   - *For web services and private services,* your _original_ instance continues to receive all incoming traffic while the new instance is spinning up:

   ```mermaid
   flowchart LR
     lb{{"Render<br/>load balancer"}};
     subgraph " ";
       direction LR;
       instance1("Original instance<br/>(v1)");
       instance2("<strong>New instance<br/>(v2)</strong>");
       class instance2 success;
     end;
     lb edge1@--> instance1;
     edge1@{animation: slow}
     lb ~~~ instance2;
