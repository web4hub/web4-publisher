On this page

# Getting started with Vercel

Install the Vercel CLI and deploy your app. If you use an AI coding agent, add agent support and connect Vercel MCP so it can work with your Vercel account.

Agent Prompt

Help me get set up with Vercel. Based on my project, do the following: 1. Install the Vercel CLI globally (\`npm i -g vercel\`) and log in with \`vercel login\`. 2. If you are Claude Code, OpenAI Codex, Grok Build, Cursor, GitHub Copilot, or Kimi Code, install the Vercel Plugin with \`npx plugins add vercel/vercel-plugin\`. If you are OpenCode, install it with \`opencode plugin add github:vercel/vercel-plugin\`. Otherwise, install Vercel Skills with \`npx skills add vercel-labs/agent-skills\`. 3. Connect the Vercel MCP server with \`npx -y add-mcp https://mcp.vercel.com -g\`. 4. Deploy with \`vercel\` and share the preview URL. 5. Suggest next steps based on my project, such as adding a custom domain, setting environment variables, or configuring Vercel Functions.

Show more

## Prerequisites

- A [Vercel account](/signup)
- [Node.js 18+](https://nodejs.org/)

## Install the Vercel CLI

Every Vercel workflow starts with the CLI. Install it whether or not you use an AI coding agent. Agents that can run terminal commands use the CLI to deploy, pull environment variables, and manage projects.

1. ### Install Vercel CLI
   
   pnpmyarnnpmbun
   
   Terminal
   
   ```
   pnpm i -g vercel
   ```
   
   Terminal
   
   ```
   yarn global add vercel
   ```
   
   Terminal
   
   ```
   npm i -g vercel
   ```
   
   Terminal
   
   ```
   bun add -g vercel
   ```
   
2. ### Log in to Vercel
   
   ```
   vercel login
   ```
   
   Follow the prompts to authenticate with your Vercel account.
   
3. ### Deploy your project
   
   Navigate to your project directory and run:
   
   ```
   vercel
   ```
   
   The CLI detects your framework, builds your project, and deploys it. To deploy to production:
   
   ```
   vercel --prod
   ```
   

See the [CLI documentation](/docs/cli) for the full command reference.

## Install the Vercel Plugin

If you use [Claude Code](https://docs.anthropic.com/en/docs/claude-code), [OpenAI Codex](https://openai.com/codex), [Grok Build](https://x.ai/news/grok-build-cli), [Cursor](https://www.cursor.com), [GitHub Copilot](https://github.com/features/copilot), or [Kimi Code](https://kimi.com), install the [Vercel Plugin](https://github.com/vercel/vercel-plugin). It gives your agent deployment skills, framework best practices, and slash commands like `/vercel-plugin:deploy prod` and `/vercel-plugin:env`.

```
npx plugins add vercel/vercel-plugin
```

In [OpenCode](https://opencode.ai), install it with OpenCode's plugin command instead:

```
opencode plugin add github:vercel/vercel-plugin
```

The plugin activates automatically. No configuration needed.

See the [Vercel Plugin documentation](/docs/agent-resources/vercel-plugin) for the full list of skills, specialist agents, and slash commands.

## Install Vercel Skills for other agents

If your agent is not in the plugin list above, install Vercel Skills instead. Skills give your agent deployment and framework guidance in a format compatible with [Skills.sh](https://skills.sh).

```
npx skills add vercel-labs/agent-skills
```

To install a specific skill:

```
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices
```

See [Agent Skills](/docs/agent-resources/skills) for the full list.

## Connect the Vercel MCP server

Connect the Vercel MCP server so your agent can search the docs, manage projects and deployments, and query Web Analytics.

```
npx -y add-mcp https://mcp.vercel.com -g
```

See [Vercel MCP](/docs/agent-resources/vercel-mcp) for client-specific setup.

## Add a database or other storage

If your project needs a database, blob storage, or another backing service, you can provision one from the CLI and have Vercel wire the credentials into your project automatically.

Run [`vercel install`](/docs/cli/install) (alias for [`vercel integration add`](/docs/cli/integration#vercel-integration-add)) to install a Marketplace integration, provision a resource, connect it to the currently linked project, and sync environment variables into `.env.local`:

```
vercel install neon
vercel install upstash
vercel install supabase
```

Add `--help` to any command to see integration-specific products, metadata options, and billing plans. For non-interactive flows, pass options as flags:

```
vercel install neon --name my-database --plan free -e production -e preview
```

See [Storage on Vercel Marketplace](/docs/marketplace-storage) for the full list of storage integrations.

## Deploy from the dashboard

You can also deploy without the CLI. Go to the [New Project](/new) page, connect your [GitHub](/docs/git/vercel-for-github), [GitLab](/docs/git/vercel-for-gitlab), or [Bitbucket](/docs/git/vercel-for-bitbucket) account, select a repo, and click Deploy. Every push to your connected branch triggers a new deployment automatically.

## Next steps

- [Fundamental concepts](/docs/fundamentals) – How requests, builds, and compute work on Vercel
- [Explore Vercel products](/docs/products) – Browse the full catalog of Vercel products and capabilities
- [Set up environment variables](/docs/environment-variables)
- [Add a custom domain](/docs/domains/set-up-custom-domain)
- [Explore supported frameworks](/docs/frameworks)
- [Vercel Functions](/docs/functions) – Run server-side code on demand
- [Storage on Vercel Marketplace](/docs/marketplace-storage) – Provision Postgres, Redis, NoSQL, and more with `vercel install`
- [Agent resources](/docs/agent-resources) – Documentation access, skills, and CLI workflows for AI agents

Related Vercel documentation

## Cross-link map: Getting started with Vercel (/docs/getting-started-with-vercel)

> From the Vercel docs graph (built 2026-10-08T05:38:39.548Z), spanning vercel.com docs + KB, nextjs.org, ai-sdk.dev, and other Vercel documentation sites. Full graph as JSON: [https://vercel.com/docs/graph.json](https://vercel.com/docs/graph.json)

### Semantically closest pages

- [Agent Resources](https://vercel.com/docs/agent-resources?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=semantic&surface=html) — Set up AI coding tools with Vercel documentation, reusable skills, and secure access to projects, deployments, and logs.
- [Deploying a project from the CLI](https://vercel.com/docs/projects/deploy-from-cli?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=semantic&surface=html) — Set up and deploy a Vercel project using the CLI, from linking to production.
- [Using coding agents to procure Vercel Marketplace integrations](https://vercel.com/kb/guide/using-coding-agents-to-procure-vercel-marketplace-integrations?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=semantic&surface=html) — Coding agents can now discover, provision, and manage third-party services from the Vercel Marketplace using the Vercel
- [Vercel CLI Overview](https://vercel.com/docs/cli?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=semantic&surface=html) — Learn how to use the Vercel command-line interface \\(CLI\\) to manage and configure your Vercel Projects from the command
- [Deploying to Vercel](https://vercel.com/docs/deployments?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=semantic&surface=html) — Create, verify, and manage preview and production deployments on Vercel from Git, Vercel CLI, or the REST API.

### This page links to (17)

- [Agent Resources](https://vercel.com/docs/agent-resources?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Set up AI coding tools with Vercel documentation, reusable skills, and secure access to projects, deployments, and logs.
- [Agent Skills](https://vercel.com/docs/agent-resources/skills?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Install skills to enhance AI coding agents with specialized capabilities for React, Next.js, deployment, and more.
- [Use Vercel](https://vercel.com/docs/agent-resources/vercel-mcp?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Vercel MCP has tools available for searching docs, managing teams, projects, and deployments, and querying Web Analytics
- [Vercel Plugin for AI Coding Agents](https://vercel.com/docs/agent-resources/vercel-plugin?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Install the Vercel plugin to give supported AI coding tools Vercel context, skills, specialist agents, slash commands, a
- [Vercel CLI Overview](https://vercel.com/docs/cli?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how to use the Vercel command-line interface \\(CLI\\) to manage and configure your Vercel Projects from the command
- [vercel install](https://vercel.com/docs/cli/install?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how to install marketplace native integrations and provision resources with the vercel install CLI command.
- [vercel integration](https://vercel.com/docs/cli/integration?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how to manage marketplace native integrations, provision resources, manage individual resources, and discover avai
- [Setting up a custom domain](https://vercel.com/docs/domains/set-up-custom-domain?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Add and configure a custom domain for your Vercel project using the CLI.
- [Environment variables](https://vercel.com/docs/environment-variables?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Learn more about environment variables on Vercel.
- [Frameworks on Vercel](https://vercel.com/docs/frameworks?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Vercel supports a wide range of the most popular frameworks, optimizing how your application builds and runs no matter w
- [Vercel Functions](https://vercel.com/docs/functions?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Build API routes, webhooks, and agent request handlers with Vercel Functions, then test and debug them with Vercel CLI.
- [Vercel fundamental concepts](https://vercel.com/docs/fundamentals?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Learn about the core concepts of Vercel
- [Deploying Bitbucket Projects with Vercel](https://vercel.com/docs/git/vercel-for-bitbucket?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — ​Vercel for Bitbucket automatically deploys your Bitbucket projects with Vercel, providing Preview Deployment URLs, and
- [Deploying GitHub Projects with Vercel](https://vercel.com/docs/git/vercel-for-github?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Vercel for GitHub automatically deploys your GitHub projects with Vercel, providing Preview Deployment URLs, and automat
- [Deploying GitLab Projects with Vercel](https://vercel.com/docs/git/vercel-for-gitlab?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — ​Vercel for GitLab automatically deploys your GitLab projects with Vercel, providing Preview Deployment URLs, and automa
- [Storage on Vercel Marketplace](https://vercel.com/docs/marketplace-storage?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Connect Postgres, Redis, NoSQL, and other storage solutions through the Vercel Marketplace. Run SQL queries, edit data,
- [Products](https://vercel.com/docs/products?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=outbound&surface=html) — Browse Vercel products for building, deploying, securing, observing, and scaling web applications.

### Pages that link here (7)

By site: vercel-kb (1) · vercel-docs (6)

#### From vercel-kb

- [Using Vercel as a Standalone CDN](https://vercel.com/kb/guide/using_vercel_as_a_cdn?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=inbound&surface=html) — Use Vercel's external rewrites to proxy and cache content from external websites or APIs through Vercel's global edge ne

#### From vercel-docs

- [Working with domains](https://vercel.com/docs/domains/working-with-domains?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how domains work and the options Vercel provides for managing them.
- [Frameworks on Vercel](https://vercel.com/docs/frameworks?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=inbound&surface=html) — Vercel supports a wide range of the most popular frameworks, optimizing how your application builds and runs no matter w
- [Incremental Migration to Vercel](https://vercel.com/docs/incremental-migration?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to migrate your app or website to Vercel with minimal risk and high impact.
- [Deploying Nx to Vercel](https://vercel.com/docs/monorepos/nx?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=inbound&surface=html) — Nx is an extensible build system with support for monorepos, integrations, and Remote Caching on Vercel. Learn how to de
- [Deploying Turborepo to Vercel](https://vercel.com/docs/monorepos/turborepo?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=inbound&surface=html) — Learn about Turborepo, a build system for monorepos that allows you to have faster incremental builds, content-aware has
- [Managing projects](https://vercel.com/docs/projects/managing-projects?from=graph&source_path=%2Fdocs%2Fgetting-started-with-vercel&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to manage your projects through the Vercel Dashboard.
