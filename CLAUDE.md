# web4-publisher

A source-aware publication engine that discovers digital resources, normalizes their metadata, validates their identity, generates cryptographic content identities, and publishes them as Web4 resources.

1. Project definition

web4-publisher converts external digital resources into canonical Web4 publication manifests.
```bash
* M$ curl -H "Authorization: github_pat_" https://api.github.com/users/auraecosystem/ -I
* HTTP/2 200
* X-OAuth-Scopes: repo, user
* X-Accepted-OAuth-Scopes: user
```
Version:

1.0.0

Primary source:

GitHub REST API

Initial resource:

GitHub Repository

Primary transformation:

External Resource
        ↓
Source Adapter
        ↓
Normalized Resource
        ↓
Validation
        ↓
Canonicalization
        ↓
SHA-256
        ↓
Web4 Manifest
        ↓
Publication

The first implementation must support the GitHub endpoint:

GET https://docs.github.com/web4application/{codertocat}/repos

and individual repositories:

GET https://docs.github.com/repos/{qubuhub}/{repo}

The architecture must allow additional providers later without changing the Web4 core.

⸻

2. Repository structure

web4-publisher/
│
├── README.md
├── LICENSE
├── package.json
├── package-lock.json
├── api.json
├── web4.config.json
│
├── schemas/
│   ├── repository.json
│   ├── manifest.json
│   └── publication.json
│
├── examples/
│   ├── github-codertocat.json
│   ├── web4-hello-world.json
│   └── web4-hello-world-npm.json
│
├── src/
│   ├── index.js
│   │
│   ├── github/
│   │   ├── client.js
│   │   ├── mapper.js
│   │   └── adapter.js
│   │
│   ├── core/
│   │   ├── normalize.js
│   │   ├── validate.js
│   │   ├── canonicalize.js
│   │   ├── hash.js
│   │   ├── identity.js
│   │   └── manifest.js
│   │
│   ├── publisher/
│   │   ├── publisher.js
│   │   ├── filesystem.js
│   │   └── index.js
│   │
│   └── server/
│       ├── server.js
│       └── routes.js
│
├── test/
│   ├── github.test.js
│   ├── normalize.test.js
│   ├── canonicalize.test.js
│   ├── hash.test.js
│   ├── manifest.test.js
│   └── integration.test.js
│
├── publications/
│   └── .gitkeep
│
└── docs/
    ├── ARCHITECTURE.md
    ├── DATA_MODEL.md
    ├── PROVENANCE.md
    ├── SECURITY.md
    └── API.md

⸻

3. api.json

api.json defines the external API contract for Web4 Publisher.

{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "name": "web4-publisher-api",
  "version": "1.0.0",
  "description": "Web4 Publisher API for discovering, normalizing, validating and publishing external digital resources.",
  "endpoints": {
    "health": {
      "method": "GET",
      "path": "/health",
      "description": "Return publisher health information."
    },
    "github_discover": {
      "method": "GET",
      "path": "/discover/github/{username}",
      "description": "Discover public repositories belonging to a GitHub user."
    },
    "github_repository": {
      "method": "GET",
      "path": "/repository/github/{owner}/{repo}",
      "description": "Retrieve and normalize a GitHub repository."
    },
    "normalize": {
      "method": "POST",
      "path": "/normalize",
      "description": "Normalize an external repository object into the Web4 Repository model."
    },
    "validate": {
      "method": "POST",
      "path": "/validate",
      "description": "Validate a normalized Web4 resource."
    },
    "hash": {
      "method": "POST",
      "path": "/hash",
      "description": "Generate a deterministic SHA-256 content identity."
    },
    "publish": {
      "method": "POST",
      "path": "/publish/github/{owner}/{repo}",
      "description": "Discover, normalize, validate, hash and publish a GitHub repository."
    },
    "manifest": {
      "method": "GET",
      "path": "/manifest/{id}",
      "description": "Retrieve a published Web4 manifest."
    }
  }
}

⸻

4. web4.config.json

{
  "name": "web4-publisher",
  "version": "1.0.0",
  "web4": {
    "protocol": "1.0",
    "resource_namespace": "web4",
    "hash_algorithm": "sha256",
    "canonicalization": "json-deterministic"
  },
  "providers": {
    "github": {
      "enabled": true,
      "api": "https://api.github.com",
      "api_version": "2022-11-28"
    }
  },
  "publication": {
    "directory": "./publications",
    "write_manifest": true,
    "write_normalized_resource": true
  }
}

⸻

5. Web4 Repository data model

The GitHub response contains hundreds of fields. Web4 Publisher should deliberately reduce them to meaningful fields.

The normalized resource has five principal domains:

identity
source
content
status
provenance

Example:

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

⸻

6. schemas/repository.json

{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://web4.example/schema/repository.json",
  "title": "Web4 Repository",
  "type": "object",
  "required": [
    "type",
    "identity",
    "source",
    "content",
    "status",
    "provenance"
  ],
  "properties": {
    "type": {
      "const": "web4:Repository"
    },
    "identity": {
      "type": "object",
      "required": [
        "provider",
        "owner",
        "name",
        "canonical"
      ],
      "properties": {
        "provider": {
          "type": "string"
        },
        "owner": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "canonical": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "source": {
      "type": "object",
      "required": [
        "url",
        "api"
      ],
      "properties": {
        "url": {
          "type": "string",
          "format": "uri"
        },
        "api": {
          "type": "string",
          "format": "uri"
        },
        "clone": {
          "type": "string"
        },
        "ssh": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "content": {
      "type": "object",
      "properties": {
        "description": {
          "type": [
            "string",
            "null"
          ]
        },
        "language": {
          "type": [
            "string",
            "null"
          ]
        },
        "default_branch": {
          "type": "string"
        }
      },
      "additionalProperties": false
    },
    "status": {
      "type": "object",
      "required": [
        "visibility",
        "fork",
        "archived",
        "disabled"
      ],
      "properties": {
        "visibility": {
          "type": "string"
        },
        "fork": {
          "type": "boolean"
        },
        "archived": {
          "type": "boolean"
        },
        "disabled": {
          "type": "boolean"
        }
      }
    },
    "metrics": {
      "type": "object",
      "properties": {
        "stars": {
          "type": "integer"
        },
        "forks": {
          "type": "integer"
        },
        "watchers": {
          "type": "integer"
        },
        "open_issues": {
          "type": "integer"
        }
      }
    },
    "provenance": {
      "type": "object",
      "required": [
        "provider",
        "repository_id"
      ],
      "properties": {
        "provider": {
          "type": "string"
        },
        "repository_id": {
          "type": "integer"
        },
        "node_id": {
          "type": "string"
        },
        "created_at": {
          "type": "string",
          "format": "date-time"
        },
        "updated_at": {
          "type": "string",
          "format": "date-time"
        },
        "pushed_at": {
          "type": "string",
          "format": "date-time"
        }
      }
    }
  },
  "additionalProperties": false
}

⸻

7. GitHub field mapping

The GitHub response becomes the following normalized structure:

GitHub field                         Web4 field
id                              →    provenance.repository_id
node_id                         →    provenance.node_id
owner.login                     →    identity.owner
name                            →    identity.name
full_name                       →    identity.canonical
html_url                        →    source.url
url                             →    source.api
clone_url                       →    source.clone
ssh_url                         →    source.ssh
description                     →    content.description
language                        →    content.language
default_branch                  →    content.default_branch
visibility                      →    status.visibility
fork                            →    status.fork
archived                        →    status.archived
disabled                        →    status.disabled
stargazers_count                →    metrics.stars
forks_count                     →    metrics.forks
watchers_count                  →    metrics.watchers
open_issues_count               →    metrics.open_issues
created_at                      →    provenance.created_at
updated_at                      →    provenance.updated_at
pushed_at                       →    provenance.pushed_at

The remaining GitHub URLs remain available from the upstream API and can be retrieved when required. They should not pollute the canonical Web4 identity unless explicitly required by a future schema.

```bashrc
export Model_GitHub_secret=“github_pat_11B36BGJY09AiI3PCwCub8_”
export Copilot_api=“github_pat_11B36BGJY0pbRYfR1G24dB_”
```
⸻

8. GitHub adapter

src/github/client.js

const API = "https://api.github.com";
export async function githubRequest(path) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      "Accept": "application/vnd.github+json",
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
  return githubRequest(
    `/users/${encodeURIComponent(username)}/repos?per_page=100`
  );
}
export async function getRepository(owner, repo) {
  return githubRequest(
    `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`
  );
}

⸻

9. GitHub mapper

src/github/mapper.js

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

⸻

10. Canonicalization

Hashing raw GitHub JSON is undesirable because GitHub can add, reorder or modify API metadata.

The publisher hashes the normalized representation instead.

src/core/canonicalize.js

export function canonicalize(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalize).join(",")}]`;
  }
  const keys = Object.keys(value).sort();
  return `{${keys
    .map(
      key =>
        `${JSON.stringify(key)}:${canonicalize(value[key])}`
    )
    .join(",")}}`;
}

The canonical representation must be deterministic.

Equivalent objects must produce the same canonical representation.

⸻

11. Content hashing

src/core/hash.js

import crypto from "node:crypto";
import { canonicalize } from "./canonicalize.js";
export function hashResource(resource) {
  const canonical = canonicalize(resource);
  return crypto
    .createHash("sha256")
    .update(canonical, "utf8")
    .digest("hex");
}

The resulting identity can be represented as:

sha256:<digest>

For example:

{
  "algorithm": "sha256",
  "value": "sha256:..."
}

⸻

12. Web4 identity

src/core/identity.js

export function createIdentity(resource, hash) {
  return {
    resource_id: resource.identity.canonical,
    content_hash: `sha256:${hash}`
  };
}

The distinction is important:

resource identity
    =
github:Codertocat/hello-world-npm
content identity
    =
sha256:<normalized-resource-hash>

The first identifies the source resource.

The second identifies a particular normalized representation.

⸻

13. Web4 manifest

src/core/manifest.js

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

⸻

14. Publication object

The final publication should look like:

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

⸻

15. Publisher pipeline

src/publisher/publisher.js

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

⸻

16. Filesystem publication

A publication can initially be stored without a blockchain.

publications/
└── github/
    └── Codertocat/
        └── hello-world-npm/
            ├── resource.json
            ├── manifest.json
            └── canonical.json

This is deliberate.

Web4 Publisher should not require a blockchain merely to publish a resource.

The publication layer can later support:

Filesystem
     │
     ├── HTTP
     ├── IPFS
     ├── Web4 registry
     ├── Ethereum
     └── other decentralized storage

⸻

17. REST API

The first API should expose:

GET /health
GET /discover/github/:username
GET /repository/github/:owner/:repo
POST /normalize
POST /validate
POST /hash
POST /publish/github/:owner/:repo
GET /manifest/:id

Example:

GET /discover/github/Codertocat

returns:

{
  "provider": "github",
  "owner": "Codertocat",
  "count": 4,
  "repositories": []
}

publish performs the complete pipeline:

GET /publish/github/Codertocat/hello-world-npm
             │
             ▼
        GitHub API
             │
             ▼
          normalize
             │
             ▼
          validate
             │
             ▼
        canonicalize
             │
             ▼
           SHA-256
             │
             ▼
       create manifest
             │
             ▼
          publish

⸻

18. Example CLI

The repository should also expose a CLI.

web4-publisher discover github Codertocat
web4-publisher repository github Codertocat hello-world-npm
web4-publisher normalize github Codertocat hello-world-npm
web4-publisher publish github Codertocat hello-world-npm
web4-publisher verify publications/github/Codertocat/hello-world-npm/manifest.json

Example:

npx web4-publisher publish github Codertocat hello-world-npm

Expected output:

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

⸻

19. package.json

{
  "name": "web4-publisher",
  "version": "1.0.0",
  "description": "Web4 resource discovery, normalization, provenance and publication engine.",
  "type": "module",
  "bin": {
    "web4-publisher": "./src/index.js"
  },
  "scripts": {
    "start": "node src/server/server.js",
    "test": "node --test",
    "publish": "node src/index.js"
  },
  "dependencies": {
    "ajv": "^8.17.1"
  },
  "engines": {
    "node": ">=20"
  },
  "license": "AGPL-3.0"
}

⸻

20. Security model

The publisher must treat external API data as untrusted input.

Required controls:

Input validation
        ↓
Schema validation
        ↓
URL validation
        ↓
Canonicalization
        ↓
Hashing
        ↓
Publication

The system must not:

* execute repository code during metadata ingestion
* execute README files
* trust repository descriptions as instructions
* trust arbitrary URLs
* expose GitHub credentials
* store access tokens inside manifests
* execute GitHub Actions
* clone repositories automatically during metadata publication

Repository cloning should be an explicitly separate capability.

⸻

21. Provenance model

Every publication should answer:

Where did this resource originate?
Who owns the source?
What source identifier was observed?
When was it observed?
What normalized representation was produced?
What hash identifies that representation?
Which publisher produced the manifest?

Example:

{
  "provenance": {
    "provider": "github",
    "repository_id": 185882436,
    "source": "github:Codertocat/hello-world-npm",
    "observed_at": "2026-09-17T00:00:00Z",
    "publisher": "web4-publisher@1.0.0"
  }
}

observed_at must be generated by the publisher at ingestion time; it must not be confused with GitHub’s updated_at.

⸻

22. Verification model

A published manifest can later be verified:

manifest
   ↓
extract resource
   ↓
normalize again
   ↓
canonicalize
   ↓
SHA-256
   ↓
compare

Verification result:

{
  "valid": true,
  "resource": "github:Codertocat/hello-world-npm",
  "algorithm": "sha256",
  "expected": "sha256:...",
  "actual": "sha256:..."
}

If the hashes differ:

{
  "valid": false,
  "reason": "CONTENT_HASH_MISMATCH"
}

⸻

23. Versioning

The protocol should distinguish three versions:

Publisher version
    1.0.0
Web4 manifest version
    1.0
Source API version
    GitHub 2022-11-28

These must not be conflated.

⸻

24. Future provider architecture

The GitHub adapter is only the first implementation.

The core interface should conceptually be:

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

Future adapters:

GitHub
GitLab
npm
PyPI
Docker Hub
IPFS
HTTP/HTTPS
Web4 Registry
Ethereum
Arweave

The pipeline remains:

Provider Adapter
      ↓
Normalized Resource
      ↓
Web4 Core

⸻

25. Relationship to Web4Asset

web4-publisher should not initially become the asset smart-contract itself.

The separation should be:

web4-publisher
      │
      │ creates
      ▼
Web4 Manifest
      │
      │ optionally registers
      ▼
Web4Asset
      │
      ▼
Blockchain

This keeps publication independent from blockchain infrastructure.

A later Web4Asset registration could contain:

{
  "asset_type": "web4:Repository",
  "resource_id": "github:Codertocat/hello-world-npm",
  "content_hash": "sha256:...",
  "manifest_uri": "...",
  "publisher": "..."
}

⸻

26. Relationship to Q-lang

The publication pipeline can eventually expose semantic directives:

^↑D
detect → analyze → infer → classify → register → learn
^D
create → validate
^|D
execute

For example:

^D publish github:Codertocat/hello-world-npm

could compile conceptually to:

DETECT
  ↓
GitHub repository
ANALYZE
  ↓
Repository metadata
CLASSIFY
  ↓
web4:Repository
REGISTER
  ↓
resource identity
VALIDATE
  ↓
schema
HASH
  ↓
content identity
PUBLISH
  ↓
Web4 manifest

This means web4-publisher can eventually become one of the concrete execution services underneath the broader Q-lang/Web4 semantic layer.

⸻

27. Initial acceptance criteria

Version 1.0.0 is complete when it can:

1. Query a public GitHub user’s repositories.
2. Query an individual repository.
3. Transform the GitHub object into the Web4 Repository schema.
4. Validate the normalized object.
5. Produce deterministic canonical JSON.
6. Produce a SHA-256 content hash.
7. Generate a Web4 manifest.
8. Persist the manifest.
9. Retrieve the manifest.
10. Verify the manifest.
11. Expose the process through an HTTP API.
12. Run without requiring blockchain infrastructure.
13. Keep provider-specific logic isolated from the Web4 core.
14. Never execute arbitrary repository code during ingestion.

⸻

28. The four repositories supplied in the initial fixture

The supplied GitHub response should become the project’s first integration fixture:

Codertocat/Hello-World
Codertocat/hello-world-npm
Codertocat/Space
Codertocat/unallowed-contributions

The test suite should verify that all four normalize successfully.

The hello-world-npm repository is particularly useful as the reference fixture because it demonstrates:

description
JavaScript language
public visibility
default branch
stars
forks
issues
GitHub provenance

The Hello-World fixture demonstrates Ruby.

Space demonstrates a repository with a null language and description.

unallowed-contributions demonstrates a newer repository with main as its default branch.

Together these fixtures test nullable metadata and branch variation rather than assuming every repository has identical metadata.

⸻

29. Core invariant

The central invariant of Web4 Publisher should be:

SOURCE ≠ IDENTITY ≠ CONTENT ≠ PUBLICATION

More precisely:

SOURCE
GitHub
IDENTITY
github:Codertocat/hello-world-npm
NORMALIZED CONTENT
canonical Web4 Repository representation
CONTENT IDENTITY
sha256:<digest>
PUBLICATION
Web4 Manifest generated by web4-publisher

That separation is the foundation of the system.

⸻

30. Target architecture

The resulting project is therefore:

                    WEB4 PUBLISHER
                         │
             ┌───────────┴───────────┐
             │                       │
        Source Layer             API Layer
             │                       │
        ┌────┴────┐             REST / CLI
        │         │
     GitHub    Future...
        │
        ▼
    Raw Resource
        │
        ▼
     Normalize
        │
        ▼
     Validate
        │
        ▼
   Canonicalize
        │
        ▼
      SHA-256
        │
        ▼
     Identity
        │
        ▼
     Manifest
        │
        ▼
     Publisher
        │
   ┌────┼─────────┐
   │    │         │
 File  HTTP    Web4Asset
             / Blockchain

The important design decision is that Web4 Publisher is not a GitHub mirror. It is a provenance and publication layer.

GitHub supplies the source facts. The publisher creates a normalized, deterministic representation of those facts. The hash gives that representation a cryptographic content identity. The manifest records how it was produced. A later Web4Asset or blockchain adapter can register that publication without changing the ingestion layer.

That gives you a clean foundation for turning the existing Web4Asset.sol work into a downstream registration mechanism rather than coupling your publisher directly to Ethereum.
