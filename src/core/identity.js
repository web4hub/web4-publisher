// src/core/identity.js
export function createIdentity(resource, hash) {
  return {
    resource_id: resource.identity.canonical,
    content_hash: `sha256:${hash}`
  };
}
