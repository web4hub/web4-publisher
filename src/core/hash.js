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
