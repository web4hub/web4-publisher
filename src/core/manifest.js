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
