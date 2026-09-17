import fs from "node:fs";
import path from "node:path";

const postsDirectory = path.resolve("posts");

const required = [
  "title",
  "slug",
  "description",
  "author",
  "date",
  "category",
  "tags",
  "theme",
  "draft"
];

function files(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const target = path.join(directory, entry.name);

      if (entry.isDirectory()) {
        return files(target);
      }

      return target.endsWith(".md") ? [target] : [];
    });
}

function parseFrontMatter(source) {
  const match = source.match(
    /^---\s*([\s\S]*?)\s*---/m
  );

  if (!match) {
    throw new Error("Missing front matter");
  }

  const data = {};

  for (const line of match[1].split("\n")) {
    const index = line.indexOf(":");

    if (index === -1) continue;

    const key = line.slice(0, index).trim();
    let value = line.slice(index + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }

    if (value === "true") value = true;
    if (value === "false") value = false;

    value = value.replace(/^["']|["']$/g, "");

    data[key] = value;
  }

  return data;
}

const postFiles = files(postsDirectory);

let failed = false;

for (const file of postFiles) {
  try {
    const source = fs.readFileSync(file, "utf8");
    const metadata = parseFrontMatter(source);

    for (const field of required) {
      if (
        metadata[field] === undefined ||
        metadata[field] === ""
      ) {
        throw new Error(
          `Missing required field: ${field}`
        );
      }
    }

    if (
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
        metadata.slug
      )
    ) {
      throw new Error(
        `Invalid slug: ${metadata.slug}`
      );
    }

    if (
      !["default", "glitch", "win95"].includes(
        metadata.theme
      )
    ) {
      throw new Error(
        `Invalid theme: ${metadata.theme}`
      );
    }

    console.log(`✓ ${file}`);
  } catch (error) {
    failed = true;
    console.error(`✗ ${file}`);
    console.error(`  ${error.message}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log(
  `\nValidated ${postFiles.length} publication(s).`
);
