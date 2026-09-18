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
