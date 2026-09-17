const modules = import.meta.glob(
  "../../posts/**/*.md",
  {
    query: "?raw",
    import: "default",
    eager: true
  }
);

function parseFrontMatter(source) {
  const match = source.match(
    /^---\s*([\s\S]*?)\s*---\s*([\s\S]*)$/m
  );

  if (!match) {
    return {
      data: {},
      content: source
    };
  }

  const data = {};

  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");

    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (value.startsWith("[") && value.endsWith("]")) {
      value = value
        .slice(1, -1)
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    if (value === "true") value = true;
    if (value === "false") value = false;

    value = value.replace(/^["']|["']$/g, "");

    data[key] = value;
  }

  return {
    data,
    content: match[2]
  };
}

export function loadPosts() {
  const posts = Object.entries(modules)
    .map(([path, source]) => {
      const { data, content } = parseFrontMatter(source);

      return {
        ...data,
        content,
        sourcePath: path
      };
    })
    .filter((post) => post.draft !== true)
    .sort(
      (a, b) =>
        new Date(b.date || 0) -
        new Date(a.date || 0)
    );

  return Promise.resolve(posts);
}
