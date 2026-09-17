import { describe, expect, it } from "vitest";

describe("Web4 Publisher", () => {
  it("has a valid publication identity", () => {
    const publication = {
      name: "@web4hub/web4-publisher",
      version: "1.0.0"
    };

    expect(publication.name).toBe(
      "@web4hub/web4-publisher"
    );

    expect(publication.version).toBe("1.0.0");
  });
});
