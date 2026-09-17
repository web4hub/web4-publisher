import fs from "node:fs";
import path from "node:path";

const output = path.resolve("public/publications.json");

const posts = [];

function scan(directory) {
  for (const entry of fs.readdirSync(directory, {
    withFileTypes: true
  })) {
    const target = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      scan(target);
      continue;
    }

    if (!target.endsWith(".md")) continue;

    const source = fs.readFileSync(target, "utf8");

    const match = source.match(
      /^---\s*([\s\S]*?)\s*---/m
    );

    if (!match) continue;

    const metadata = {};

    for (const line of match[1].split("\n")) {
      const index = line.indexOf(":");

      if (index === -1) continue;

      const key = line.slice(0, index).trim();
      let value = line.slice(index + 1).trim();

      value = value.replace(/^["']|["']$/g, "");

      metadata[key] = value;
    }

    if (metadata.draft !== "true") {
      posts.push(metadata);
    }
  }
}

scan(path.resolve("posts"));

fs.mkdirSync(path.dirname(output), {
  recursive: true
});

fs.writeFileSync(
  output,
  JSON.stringify(posts, null, 2)
);

console.log(`Generated ${output}`);
