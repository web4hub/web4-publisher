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
