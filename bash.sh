# !/usr/bin/env bash
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
-m
npm install
npm run validate
npm test
npm run build
npm i -g vercel
vercel login
vercel

# Create an API key and export the key it prints
vercel ai-gateway api-keys create
export AI_GATEWAY_API_KEY="your-ai-gateway-api-key"
 
# Call any model through one endpoint
curl https://ai-gateway.vercel.sh/v1/chat/completions \
  -H "Authorization: Bearer $AI_GATEWAY_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-opus-5",
    "messages": [{ "role": "user", "content": "Why is the sky blue?" }]
  }'
# Plugin for Claude Code, Codex, Grok Build, Cursor, Copilot, Kimi Code
npx plugins add vercel/vercel-plugin
 
# Plugin for OpenCode
opencode plugin add github:vercel/vercel-plugin
 
# Skills for any other agent
npx skills add vercel-labs/agent-skills
 
# Let your agent manage projects, deployments, and logs
npx -y add-mcp https://mcp.vercel.com -g
 
# Route your agent's model calls through AI Gateway
npx vercel ai-gateway setup
#install
npm i -g vercel
# yarn install
yarn add @vercel/analytics
# add lmlm agent plugins
npx plugins add vercel/vercel-plugin
