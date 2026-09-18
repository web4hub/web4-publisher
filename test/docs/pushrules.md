# Push Rules

## Before pushing changes

Run the following commands from the repository root:

```bash
npm install
npm run generate:index
npm run validate
npm test
npm run build
```

## Requirements

- All publication files must contain valid front matter.
- Every post must define:
  - `title`
  - `slug`
  - `description`
  - `author`
  - `date`
  - `category`
  - `tags`
  - `theme`
  - `draft`
- Slugs must use lowercase letters, numbers, and hyphens.
- Supported themes are `default`, `glitch`, and `win95`.

## Push checklist

1. Validate content.
2. Run tests.
3. Build the site.
4. Commit the changes.
5. Push the branch.
6. Open a pull request.
