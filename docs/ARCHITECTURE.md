# Web4 Publisher Architecture

## 1. Purpose

Web4 Publisher is a source-aware publication engine for external digital resources. It fetches provider metadata, normalizes it into a canonical Web4 resource model, validates it, canonicalizes it, computes a deterministic content hash, and emits a publication manifest.

The system is designed to answer four questions:

- What source did we observe?
- What normalized representation did we derive?
- What content identity does that representation have?
- What publication artifact did the publisher generate?

This design intentionally separates:

- source data
- resource identity
- normalized content
- content identity
- publication output

## 2. Core invariant

The central invariant of Web4 Publisher is:

SOURCE != IDENTITY != CONTENT != PUBLICATION

More precisely:

- Source: the raw response from an upstream provider, such as GitHub
- Identity: a stable source identifier such as `github:Codertocat/hello-world-npm`
- Normalized content: a canonical Web4 Repository representation
- Content identity: `sha256:<digest>` derived from the normalized representation
- Publication: the Web4 manifest emitted by the publisher

This separation is the foundation of the system.

## 3. Goals

The initial v1.0 implementation must:

1. Query public GitHub user repositories
2. Query an individual GitHub repository
3. Map GitHub metadata into the Web4 Repository schema
4. Validate the normalized resource
5. Produce deterministic canonical JSON
6. Produce a stable SHA-256 content hash
7. Generate a Web4 manifest
8. Persist the manifest locally
9. Retrieve the manifest
10. Verify the manifest
11. Expose the pipeline through an HTTP API
12. Operate without blockchain infrastructure
13. Keep provider-specific logic isolated from the Web4 core
14. Never execute repository code or untrusted content during ingestion

## 4. Non-goals

v1.0 does not include:

- automatic repository cloning
- execution of repository code
- execution of README files or metadata as instructions
- trusting arbitrary URLs as executable content
- storing access tokens in manifests
- blockchain registration as part of the core publication pipeline
- mixing provider-specific logic into the Web4 core

These are either future capabilities or separate concerns.

## 5. High-level architecture

The pipeline is intentionally simple and linear:

Provider Adapter
  ↓
Raw Resource
  ↓
Normalize
  ↓
Validate
  ↓
Canonicalize
  ↓
SHA-256
  ↓
Identity
  ↓
Manifest
  ↓
Publish

The Web4 core is responsible for validation, canonicalization, hashing, identity definition, and manifest creation. Provider adapters are responsible for fetching and mapping upstream data into a normalized form.

## 6. Layered design

### 6.1 Source layer

The source layer contains upstream providers. The first implementation supports GitHub.

Responsibilities:

- fetch raw metadata from external providers
- return provider-specific objects
- isolate upstream APIs from the core system

### 6.2 Adapter layer

Each provider implements a minimal adapter interface. The adapter converts raw provider output into the resource model expected by the core.

```js
export class SourceAdapter {
  async discover() {
    throw new Error("Not implemented");
  }

  async getResource() {
    throw new Error("Not implemented");
  }

  normalize(resource) {
    throw new Error("Not implemented");
  }
}
```

This keeps the Web4 core independent of the provider implementation.

### 6.3 Core layer

The core layer defines the deterministic and trust-preserving rules for publication.

Responsibilities:

- normalize provider output into canonical resource structures
- validate schema conformance
- canonicalize values in a deterministic order
- compute stable SHA-256 hashes
- create publication manifests
- verify published content against stored expectations

### 6.4 Publication layer

The publication layer stores or serves the final output from the core.

Supported in v1.0:

- local filesystem publication

Future support can include:

- HTTP publication
- IPFS
- registry publication
- Web4Asset registration
- blockchain registration

## 7. GitHub as the first provider

The initial implementation targets the GitHub REST API because it provides rich repository metadata and a stable public source model.

Base API:

```text
https://api.github.com
```

Primary endpoints:

```text
GET /users/{username}/repos
GET /repos/{owner}/{repo}
```

The implementation must treat upstream GitHub responses as untrusted input. It must not execute repository code, render repository content as instructions, or trust arbitrary metadata as commands.

## 8. Adapter contract

GitHub-specific logic is implemented in the adapter package and kept separate from the Web4 core.

```js
// src/github/client.js
const API = "https://api.github.com";

export async function githubRequest(path) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "web4-publisher"
    }
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function getUserRepositories(username) {
  return githubRequest(`/users/${encodeURIComponent(username)}/repos?per_page=100`);
}

export async function getRepository(owner, repo) {
  return githubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
}
```

## 9. Normalized resource model

The raw GitHub payload is reduced to a compact canonical structure. The normalized resource includes five principal domains:

- identity
- source
- content
- status
- provenance

Example:

```json
{
  "type": "web4:Repository",
  "identity": {
    "provider": "github",
    "owner": "Codertocat",
    "name": "hello-world-npm",
    "canonical": "github:Codertocat/hello-world-npm"
  },
  "source": {
    "url": "https://github.com/Codertocat/hello-world-npm",
    "api": "https://api.github.com/repos/Codertocat/hello-world-npm",
    "clone": "https://github.com/Codertocat/hello-world-npm.git",
    "ssh": "git@github.com:Codertocat/hello-world-npm.git"
  },
  "content": {
    "description": "This is a simple npm package that demonstrates the Github Package Registry",
    "language": "JavaScript",
    "default_branch": "master"
  },
  "status": {
    "visibility": "public",
    "fork": false,
    "archived": false,
    "disabled": false
  },
  "metrics": {
    "stars": 158,
    "forks": 156,
    "watchers": 158,
    "open_issues": 13
  },
  "provenance": {
    "provider": "github",
    "repository_id": 185882436,
    "node_id": "MDEwOlJlcG9zaXRvcnkxODU4ODI0MzY=",
    "created_at": "2019-05-09T22:53:26Z",
    "updated_at": "2026-06-04T22:28:22Z",
    "pushed_at": "2024-07-31T23:55:02Z"
  }
}
```

## 10. GitHub field mapping

The GitHub object is mapped into the canonical Web4 model as follows:

- `id` → `provenance.repository_id`
- `node_id` → `provenance.node_id`
- `owner.login` → `identity.owner`
- `name` → `identity.name`
- `full_name` → `identity.canonical`
- `html_url` → `source.url`
- `url` → `source.api`
- `clone_url` → `source.clone`
- `ssh_url` → `source.ssh`
- `description` → `content.description`
- `language` → `content.language`
- `default_branch` → `content.default_branch`
- `visibility` → `status.visibility`
- `fork` → `status.fork`
- `archived` → `status.archived`
- `disabled` → `status.disabled`
- `stargazers_count` → `metrics.stars`
- `forks_count` → `metrics.forks`
- `watchers_count` → `metrics.watchers`
- `open_issues_count` → `metrics.open_issues`
- `created_at` → `provenance.created_at`
- `updated_at` → `provenance.updated_at`
- `pushed_at` → `provenance.pushed_at`

Only the fields that matter to the canonical publication model are promoted into the normalized resource. The rest remain available from the upstream API for future use.

## 11. GitHub mapper

```js
// src/github/mapper.js
export function mapGitHubRepository(repo) {
  return {
    type: "web4:Repository",
    identity: {
      provider: "github",
      owner: repo.owner.login,
      name: repo.name,
      canonical: `github:${repo.full_name}`
    },
    source: {
      url: repo.html_url,
      api: repo.url,
      clone: repo.clone_url,
      ssh: repo.ssh_url
    },
    content: {
      description: repo.description ?? null,
      language: repo.language ?? null,
      default_branch: repo.default_branch
    },
    status: {
      visibility: repo.visibility,
      fork: repo.fork,
      archived: repo.archived,
      disabled: repo.disabled
    },
    metrics: {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      open_issues: repo.open_issues_count
    },
    provenance: {
      provider: "github",
      repository_id: repo.id,
      node_id: repo.node_id,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at
    }
  };
}
```

## 12. Validation

Every normalized resource must validate against a JSON Schema before it is hashed or published.

Validation rules include:

- `type` is `web4:Repository`
- `identity` contains `provider`, `owner`, `name`, and `canonical`
- `source.url` and `source.api` are present
- `status` contains `visibility`, `fork`, `archived`, and `disabled`
- `provenance` contains `provider` and `repository_id`
- no unexpected top-level properties are allowed

This keeps the normalized model stable and reduces schema drift.

## 13. Canonicalization

GitHub payloads are not canonicalized by hashing the raw JSON because upstream metadata can be reordered, augmented, or modified over time. The publisher canonicalizes the normalized representation instead.

```js
// src/core/canonicalize.js
export function canonicalize(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }

  const keys = Object.keys(value).sort();

  return `{${keys
    .map(key => `${JSON.stringify(key)}:${canonicalize(value[key])}`)
    .join(",")}}`;
}
```

This ensures equivalent objects produce the same canonical form.

## 14. Content hashing

```js
// src/core/hash.js
import crypto from "node:crypto";
import { canonicalize } from "./canonicalize.js";

export function hashResource(resource) {
  const canonical = canonicalize(resource);
  return crypto
    .createHash("sha256")
    .update(canonical, "utf8")
    .digest("hex");
}
```

The resulting content identity takes the form:

```text
sha256:<digest>
```

## 15. Resource identity and content identity

The system distinguishes between source identity and content identity:

- Resource identity: `github:Codertocat/hello-world-npm`
- Content identity: `sha256:<normalized-resource-hash>`

This distinction is important because the source can remain constant while the normalized representation changes or the canonicalization strategy evolves.

```js
// src/core/identity.js
export function createIdentity(resource, hash) {
  return {
    resource_id: resource.identity.canonical,
    content_hash: `sha256:${hash}`
  };
}
```

## 16. Manifest model

The manifest is the publication artifact. It contains the resource identity, normalized content, provenance, and content hash.

```js
// src/core/manifest.js
export function createManifest(resource, hash) {
  return {
    web4: "1.0",
    type: "web4:Manifest",
    resource: resource.identity.canonical,
    resource_type: resource.type,
    identity: {
      provider: resource.identity.provider,
      canonical: resource.identity.canonical,
      content_hash: `sha256:${hash}`
    },
    source: resource.source,
    content: resource.content,
    status: resource.status,
    metrics: resource.metrics,
    provenance: resource.provenance,
    publication: {
      publisher: "web4-publisher",
      version: "1.0.0",
      hash_algorithm: "sha256"
    }
  };
}
```

Example:

```json
{
  "web4": "1.0",
  "type": "web4:Manifest",
  "resource": "github:Codertocat/hello-world-npm",
  "resource_type": "web4:Repository",
  "identity": {
    "provider": "github",
    "canonical": "github:Codertocat/hello-world-npm",
    "content_hash": "sha256:..."
  },
  "source": {
    "url": "https://github.com/Codertocat/hello-world-npm",
    "api": "https://api.github.com/repos/Codertocat/hello-world-npm",
    "clone": "https://github.com/Codertocat/hello-world-npm.git",
    "ssh": "git@github.com:Codertocat/hello-world-npm.git"
  },
  "content": {
    "description": "This is a simple npm package that demonstrates the Github Package Registry",
    "language": "JavaScript",
    "default_branch": "master"
  },
  "publication": {
    "publisher": "web4-publisher",
    "version": "1.0.0",
    "hash_algorithm": "sha256"
  }
}
```

## 17. Publication pipeline

```js
// src/publisher/publisher.js
import { mapGitHubRepository } from "../github/mapper.js";
import { canonicalize } from "../core/canonicalize.js";
import { hashResource } from "../core/hash.js";
import { createManifest } from "../core/manifest.js";

export function publishGitHubRepository(repo) {
  const normalized = mapGitHubRepository(repo);
  const canonical = canonicalize(normalized);
  const hash = hashResource(normalized);
  const manifest = createManifest(normalized, hash);

  return {
    resource: normalized,
    canonical,
    hash: `sha256:${hash}`,
    manifest
  };
}
```

The publish flow is:

1. fetch raw GitHub repository payload
2. map it to the normalized resource model
3. validate the normalized resource
4. canonicalize it
5. compute the SHA-256 digest
6. create a manifest
7. persist or serve the manifest

## 18. Filesystem publication

The initial publication target is the local filesystem. This keeps publishing useful without requiring blockchain infrastructure.

```text
publications/
└── github/
    └── Codertocat/
        └── hello-world-npm/
            ├── resource.json
            ├── manifest.json
            └── canonical.json
```

This is intentional: Web4 Publisher is not a blockchain client. It is a provenance and publication layer.

Future publication targets can include:

- HTTP
- IPFS
- registry storage
- Web4Asset registration
- Ethereum or other decentralized infrastructure

## 19. REST API

The v1.0 API exposes the core publication pipeline.

### Endpoints

- `GET /health`
- `GET /discover/github/:username`
- `GET /repository/github/:owner/:repo`
- `POST /normalize`
- `POST /validate`
- `POST /hash`
- `POST /publish/github/:owner/:repo`
- `GET /manifest/:id`

Example flow:

```text
GET /publish/github/Codertocat/hello-world-npm
  → GitHub API
  → normalize
  → validate
  → canonicalize
  → SHA-256
  → create manifest
  → persist
```

### CLI

```bash
web4-publisher discover github Codertocat
web4-publisher repository github Codertocat hello-world-npm
web4-publisher normalize github Codertocat hello-world-npm
web4-publisher publish github Codertocat hello-world-npm
web4-publisher verify publications/github/Codertocat/hello-world-npm/manifest.json
```

Example output:

```text
Web4 Publisher
Provider:       github
Repository:     Codertocat/hello-world-npm
Type:           web4:Repository
Language:       JavaScript
Branch:         master
Normalizing ........ OK
Validating .......... OK
Canonicalizing ...... OK
SHA-256 ............. OK
Manifest ............ OK
Publishing .......... OK
Resource:
github:Codertocat/hello-world-npm
Content:
sha256:<digest>
Status:
published
```

## 20. Security model

The publisher treats upstream provider data as untrusted input. Every step of ingestion must be defensive.

Required controls:

- input validation
- schema validation
- URL validation
- canonicalization
- hashing
- publication

The system must not:

- execute repository code during metadata ingestion
- execute README files or arbitrary text as instructions
- trust repository descriptions as commands
- trust arbitrary URLs as executable resources
- expose GitHub credentials
- store access tokens in manifests
- clone repositories automatically during metadata publication
- execute GitHub Actions as part of publication

Repository cloning should be a separate, explicitly gated capability.

## 21. Provenance model

Every publication should answer:

- Where did the resource originate?
- Who owns the source?
- What source identifier was observed?
- When was it observed?
- What normalized representation was produced?
- What hash identifies that representation?
- Which publisher generated the manifest?

Example:

```json
{
  "provenance": {
    "provider": "github",
    "repository_id": 185882436,
    "source": "github:Codertocat/hello-world-npm",
    "observed_at": "2026-09-17T00:00:00Z",
    "publisher": "web4-publisher@1.0.0"
  }
}
```

`observed_at` is generated by the publisher at ingestion time and is distinct from GitHub’s `updated_at` or other upstream timestamps.

## 22. Verification model

A manifest can later be verified by extracting the resource, normalizing it again, canonicalizing it, hashing it, and comparing it with the stored content hash.

Example verification result:

```json
{
  "valid": true,
  "resource": "github:Codertocat/hello-world-npm",
  "algorithm": "sha256",
  "expected": "sha256:...",
  "actual": "sha256:..."
}
```

If the hashes differ:

```json
{
  "valid": false,
  "reason": "CONTENT_HASH_MISMATCH"
}
```

## 23. Versioning model

The architecture keeps three distinct version categories separate:

- Publisher version: `1.0.0`
- Manifest version: `1.0`
- Source API version: `GitHub REST API 2022-11-28`

These must not be conflated.

## 24. Initial fixture set

The initial integration fixtures should cover four repository states:

- `Codertocat/Hello-World`
- `Codertocat/hello-world-npm`
- `Codertocat/Space`
- `Codertocat/unallowed-contributions`

These fixtures test:

- nullable `language` and `description`
- varying default branch names
- different repository states
- valid normalization across multiple examples

`hello-world-npm` is the reference fixture because it demonstrates:

- description
- JavaScript language
- public visibility
- default branch
- stars
- forks
- issue counts
- GitHub provenance

## 25. Future provider architecture

The GitHub adapter is only the first implementation. The core is designed to support additional providers without changing the Web4 publication model.

Future adapters include:

- GitHub
- GitLab
- npm
- PyPI
- Docker Hub
- IPFS
- HTTP/HTTPS
- Web4 Registry
- Ethereum
- Arweave

The pipeline remains:

Provider Adapter
  ↓
Normalized Resource
  ↓
Web4 Core

## 26. Relationship to Web4Asset

Web4 Publisher does not become the smart contract itself. It is a publication and provenance layer.

The intended separation is:

```text
web4-publisher
  → creates Web4 Manifest
  → optionally registers a Web4Asset
  → optionally records on blockchain
```

This keeps publication independent from blockchain infrastructure.

## 27. v1.0 acceptance criteria

Version 1.0.0 is complete when it can:

1. Query a public GitHub user’s repositories
2. Query an individual repository
3. Transform the GitHub payload into the Web4 Repository schema
4. Validate the normalized object
5. Produce deterministic canonical JSON
6. Produce a SHA-256 content hash
7. Generate a Web4 manifest
8. Persist the manifest
9. Retrieve the manifest
10. Verify the manifest
11. Expose the process through an HTTP API
12. Run without requiring blockchain infrastructure
13. Keep provider-specific logic isolated from the Web4 core
14. Never execute arbitrary repository code during ingestion

## 28. Repository structure

```text
web4-publisher/
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
├── api.json
├── web4.config.json
├── schemas/
│   ├── repository.json
│   ├── manifest.json
│   └── publication.json
├── examples/
│   ├── github-codertocat.json
│   ├── web4-hello-world.json
│   └── web4-hello-world-npm.json
├── src/
│   ├── index.js
│   ├── github/
│   │   ├── client.js
│   │   ├── mapper.js
│   │   └── adapter.js
│   ├── core/
│   │   ├── normalize.js
│   │   ├── validate.js
│   │   ├── canonicalize.js
│   │   ├── hash.js
│   │   ├── identity.js
│   │   └── manifest.js
│   ├── publisher/
│   │   ├── publisher.js
│   │   ├── filesystem.js
│   │   └── index.js
│   └── server/
│       ├── server.js
│       └── routes.js
├── test/
│   ├── github.test.js
│   ├── normalize.test.js
│   ├── canonicalize.test.js
│   ├── hash.test.js
│   ├── manifest.test.js
│   └── integration.test.js
├── publications/
│   └── .gitkeep
└── docs/
    ├── ARCHITECTURE.md
    ├── DATA_MODEL.md
    ├── PROVENANCE.md
    ├── SECURITY.md
    └── API.md
```

## 29. Design summary

Web4 Publisher is not a GitHub mirror. It is a provenance and publication layer.

GitHub supplies the source facts. The publisher normalizes those facts into a canonical representation, validates them, computes a deterministic content hash, and emits a manifest. The manifest becomes the publication artifact.

This keeps the project aligned with the Web4 model while preserving a clean separation between source facts, identity, content, and publication.

---

## 30. Version

- Project: web4-publisher
- Version: 1.0.0
- Provider: GitHub
- API version: GitHub REST API 2022-11-28
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
