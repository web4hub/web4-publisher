#!/usr/bin/env bash
set -euo pipefail

REPO_URL="https://github.com/web4hub/web4-publisher.git"
REPO_DIR="${REPO_DIR:-web4-publisher}"
BRANCH="${BRANCH:-web4hub-patch-1}"

echo "Ensuring repo is present..."
if [ ! -d "$REPO_DIR/.git" ]; then
  git clone "$REPO_URL" "$REPO_DIR"
fi

cd "$REPO_DIR"

echo "Fetching latest refs..."
git fetch origin --prune

echo "Switching to branch: $BRANCH"
if git rev-parse --verify "$BRANCH" >/dev/null 2>&1; then
  git switch "$BRANCH"
else
  git switch -c "$BRANCH"
fi

# Apply your code changes here before committing

echo "Staging the fix..."
git add .github/workflows/webpack.yml src/github/client.js

echo "Creating the fix commit..."
git commit -m "Fix CI build and GitHub client pagination" || echo "No changes to commit."

echo "Pushing the branch..."
git push -u origin HEAD

echo "Generating lockfile for CI..."
npm install --package-lock-only

echo "Staging lockfile..."
git add package-lock.json

echo "Committing lockfile..."
git commit -m "Add npm lockfile for CI" || echo "No lockfile changes to commit."

echo "Pushing lockfile changes..."
git push origin HEAD

# Install the Netlify CLI
npm install -g netlify-cli

# Create a new site in Netlify
ntl init

# Deploy to a unique preview URL
ntl deploy

# Deploy the site into production
ntl deploy --prod
npm i -g vercel
vercel init vite
Vercel CLI
Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare account from CLI
wrangler login

# Run your build command
npm run build

# Create new deployment
npx wrangler pages publish dist

