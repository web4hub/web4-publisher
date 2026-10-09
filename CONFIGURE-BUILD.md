On this page

# Configuring a Build

When you make a [deployment](/docs/deployments), Vercel builds your project. During this time, Vercel performs a "shallow clone" on your Git repository using the command `git clone --depth=10 (...)` and fetches ten levels of git commit history. This means that only the latest ten commits are pulled and not the entire repository history.

Vercel automatically configures the build settings for many front-end frameworks, but you can also customize the build according to your requirements.

To configure your Vercel build with customized settings, choose a project from the [dashboard](/dashboard) and go to its Settings section in the sidebar.

The Build and Deployment section of the Settings tab offers the following options to customize your build settings:

- [Framework Settings](#framework-settings)
- [Root Directory](#root-directory)
- [Node.js Version](/docs/functions/runtimes/node-js/node-js-versions#setting-the-node.js-version-in-project-settings)
- [Prioritizing Production Builds](/docs/builds/managing-builds#prioritize-production-builds)
- [On-Demand Concurrent Builds](/docs/builds/managing-builds#on-demand-concurrent-builds)

## Framework Settings

If you'd like to override the settings or specify a different framework, you can do so from the Build & Development Settings section.

![](https://7nyt0uhk7sse4zvn.public.blob.vercel-storage.com/docs-assets/static/docs/concepts/deployments/build-step/framework-settings-light.png)![](https://7nyt0uhk7sse4zvn.public.blob.vercel-storage.com/docs-assets/static/docs/concepts/deployments/build-step/framework-settings-dark.png)

Framework settings.

### Framework Preset

You have a wide range of frameworks to choose from, including Next.js, Svelte, and Nuxt. In several use cases, Vercel automatically detects your project's framework and sets the best settings for you.

Inside the Framework Preset settings, use the drop-down menu to select the framework of your choice. This selection will be used for all deployments within your Project. The available frameworks are listed below:

Show More

However, if no framework is detected, "Other" will be selected. In this case, the Override toggle for the Build Command will be enabled by default so that you can enter the build command manually. The remaining deployment process is that for default frameworks.

If you would like to override Framework Preset for a specific deployment, add [`framework`](/docs/project-configuration/vercel-json#framework) to your `vercel.json` configuration.

### Build Command

Vercel automatically configures the Build Command based on the framework. Depending on the framework, the Build Command can refer to the project’s `package.json` file.

For example, if [Next.js](https://nextjs.org) is your framework:

- Vercel checks for the `build` command in `scripts` and uses this to build the project
- If not, the `next build` will be triggered as the default Build Command

If you'd like to override the Build Command for all deployments in your Project, you can turn on the Override toggle and specify the custom command.

If you would like to override the Build Command for a specific deployment, add [`buildCommand`](/docs/project-configuration/vercel-json#buildcommand) to your `vercel.json` configuration.

If you update the **Override** setting, it will be applied on your next deployment.

### Output Directory

After building a project, most frameworks output the resulting build in a directory. Only the contents of this Output Directory will be served statically by Vercel.

If Vercel detects a framework, the output directory will automatically be configured.

If you update the **Override** setting, it will be applied on your next deployment.

For projects that [do not require building](#skip-build-step), you might want to serve the files in the root directory. In this case, do the following:

- Choose "Other" as the Framework Preset. This sets the output directory as `public` if it exists or `.` (root directory of the project) otherwise
- If your project doesn’t have a `public` directory, it will serve the files from the root directory
- Alternatively, you can turn on the Override toggle and leave the field empty (in which case, the build step will be skipped)

If you would like to override the Output Directory for a specific deployment, add [`outputDirectory`](/docs/project-configuration/vercel-json#outputdirectory) to your `vercel.json` configuration.

### Install Command

Vercel auto-detects the install command during the build step. It installs dependencies from `package.json`, including `devDependencies` ([which can be excluded](/docs/deployments/troubleshoot-a-build#excluding-development-dependencies)). The install path is set by the [root directory](#root-directory).

The install command can be managed in two ways: through a project override, or per-deployment. See [manually specifying a package manager](/docs/package-managers#manually-specifying-a-package-manager) for more details.

To learn what package managers are supported on Vercel, see the [package manager support](/docs/package-managers) documentation.

#### Corepack

Corepack is considered [experimental](https://nodejs.org/docs/latest-v16.x/api/documentation.html#stability-index) and therefore, breaking changes or removal may occur in any future release of Node.js.

[Corepack](https://nodejs.org/docs/latest-v16.x/api/corepack.html) is an experimental tool that allows a Node.js project to pin a specific version of a package manager.

You can enable Corepack by adding an [environment variable](/docs/environment-variables) with name `ENABLE_EXPERIMENTAL_COREPACK` and value `1` to your Project.

Then, set the [`packageManager`](https://nodejs.org/docs/latest-v16.x/api/packages.html#packagemanager) property in the `package.json` file in the root of your repository. For example:

package.json

```
{
  "packageManager": "pnpm@7.5.1"
}
```

A `package.json` file with [pnpm](https://pnpm.io) version 7.5.1

#### Custom Install Command for your API

The Install Command defined in the Project Settings will be used for front-end frameworks that support Vercel functions for APIs.

If you're using [Vercel functions](/docs/functions) defined in the natively supported `api` directory, a different Install Command will be used depending on the language of the Vercel Function. You cannot customize this Install Command.

### Development Command

This setting is relevant only if you’re using `vercel dev` locally to develop your project. Use `vercel dev` only if you need to use Vercel platform features like [Vercel functions](/docs/functions). Otherwise, it's recommended to use the development command your framework provides (such as `next dev` for Next.js).

The Development Command settings allow you to customize the behavior of `vercel dev`. If Vercel detects a framework, the development command will automatically be configured.

If you’d like to use a custom command for `vercel dev`, you can turn on the Override toggle. Please note the following:

- If you specify a custom command, your command must pass your framework's `$PORT` variable (which contains the port number). For example, in [Next.js](https://nextjs.org/) you should use: `next dev --port $PORT`
- If the development command is not specified, `vercel dev` will fail. If you've selected "Other" as the framework preset, the default development command will be empty
- You must create a deployment and have your local project linked to the project on Vercel (using `vercel`). Otherwise, `vercel dev` will not work correctly

If you would like to override the Development Command, add [`devCommand`](/docs/project-configuration/vercel-json#devcommand) to your `vercel.json` configuration.

### Skip Build Step

Some static projects do not require building. For example, a website with only HTML/CSS/JS source files can be served as-is.

In such cases, you should:

- Specify "Other" as the framework preset
- Enable the Override option for the Build Command
- Leave the Build Command empty

This prevents running the build, and your content is served directly.

## Root Directory

In some projects, the top-level directory of the repository may not be the root directory of the app you’d like to build. For example, your repository might have a front-end directory containing a stand-alone [Next.js](https://nextjs.org/) app.

For such cases, you can specify the project Root Directory. If you do so, please note the following:

- Your app will not be able to access files outside of that directory. You also cannot use `..` to move up a level
- This setting also applies to [Vercel CLI](/docs/cli). Instead of running `vercel <directory-name>` to deploy, specify `<directory-name>` here so you can just run `vercel`

To configure the Root Directory:

1. Navigate to the Build and Deployment page of your Project Settings
2. Scroll down to Root Directory
3. Enter the path to the root directory of your app
4. Click Save to apply the changes

If you update the root directory setting, it will be applied on your next deployment.

#### Skipping unaffected projects

In a monorepo, you can [skip deployments](/docs/monorepos#skipping-unaffected-projects) for projects that were not affected by a commit. To configure:

1. Navigate to the Build and Deployment page of your Project Settings
2. Scroll down to Root Directory
3. Enable the Skip deployment switch

Related Vercel documentation

## Cross-link map: Configuring a Build (/docs/builds/configure-a-build)

> From the Vercel docs graph (built 2026-10-08T05:38:39.548Z), spanning vercel.com docs + KB, nextjs.org, ai-sdk.dev, and other Vercel documentation sites. Full graph as JSON: [https://vercel.com/docs/graph.json](https://vercel.com/docs/graph.json)

### Semantically closest pages

- [Frameworks on Vercel](https://vercel.com/docs/frameworks?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=semantic&surface=html) — Vercel supports a wide range of the most popular frameworks, optimizing how your application builds and runs no matter w
- [Supported Frameworks on Vercel](https://vercel.com/docs/frameworks/more-frameworks?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=semantic&surface=html) — Learn about the frameworks that can be deployed to Vercel.
- [Conditional Build Commands: Environment, Branch, and Custom Workflows](https://vercel.com/kb/guide/dynamic-build-commands?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=semantic&surface=html) — Run a different Vercel build command for each environment or Git branch using a shell script, vercel.json, or vercel.ts,
- [How Vercel builds your application](https://vercel.com/docs/fundamentals/builds?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=semantic&surface=html) — Learn how Vercel transforms your source code into optimized assets ready to serve globally.
- [Announcing the Build Output API](https://vercel.com/blog/build-output-api?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=semantic&surface=html)

### Prerequisites

- [Builds](https://vercel.com/docs/builds?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=prerequisite&surface=html) — Understand how the build step works when creating a Vercel Deployment.

### This page links to (10)

- [Managing Builds](https://vercel.com/docs/builds/managing-builds?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=outbound&surface=html) — Vercel allows you to increase the speed of your builds when needed in specific situations and workflows.
- [Vercel CLI Overview](https://vercel.com/docs/cli?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how to use the Vercel command-line interface \\(CLI\\) to manage and configure your Vercel Projects from the command
- [Deploying to Vercel](https://vercel.com/docs/deployments?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=outbound&surface=html) — Create, verify, and manage preview and production deployments on Vercel from Git, Vercel CLI, or the REST API.
- [Troubleshooting Build Errors](https://vercel.com/docs/deployments/troubleshoot-a-build?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how to resolve common scenarios you may encounter during the Build step, including build errors that cancel a depl
- [Environment variables](https://vercel.com/docs/environment-variables?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=outbound&surface=html) — Learn more about environment variables on Vercel.
- [Vercel Functions](https://vercel.com/docs/functions?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=outbound&surface=html) — Build API routes, webhooks, and agent request handlers with Vercel Functions, then test and debug them with Vercel CLI.
- [Supported Node.js versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=outbound&surface=html) — Learn about the supported Node.js versions on Vercel.
- [Using Monorepos](https://vercel.com/docs/monorepos?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=outbound&surface=html) — Vercel provides support for monorepos. Learn how to deploy a monorepo here.
- [Package Managers](https://vercel.com/docs/package-managers?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=outbound&surface=html) — Discover the package managers supported by Vercel for dependency management. Learn how Vercel detects and uses npm, Yarn
- [Static Configuration with vercel.json](https://vercel.com/docs/project-configuration/vercel-json?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=outbound&surface=html) — Learn how to use vercel.json to configure and override the default behavior of Vercel from within your project.

### Pages that link here (40)

By site: vercel-changelog (2) · vercel-kb (7) · vercel-docs (31)

#### From vercel-changelog

- [Vercel now supports Build Commands for FastAPI and Flask](https://vercel.com/changelog/vercel-now-supports-build-commands-for-fastapi-and-flask?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html)
- [Yarn 2+ dependency caching now supported](https://vercel.com/changelog/yarn-2-dependency-caching-now-supported?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html)

#### From vercel-kb

- [Deploying React with Vercel](https://vercel.com/kb/guide/deploying-react-with-vercel?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Deploy React with Vercel to replace your build pipeline and shared staging. See how framework detection, previews, and F
- [Does Vercel support Yarn 2?](https://vercel.com/kb/guide/does-vercel-support-yarn-2?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Information on Vercel's support for Yarn 2.
- [Does Vercel support Yarn 3?](https://vercel.com/kb/guide/does-vercel-support-yarn-3?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Information on Vercel's support for Yarn 3.
- [Does Vercel Support Yarn? \\(Versions 2, 3, and 4\\)](https://vercel.com/kb/guide/does-vercel-support-yarn-4?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Vercel supports Yarn 1, 2, 3, and 4. Learn which version your build uses by default, and how to pin Yarn 4 with Corepack
- [Conditional Build Commands: Environment, Branch, and Custom Workflows](https://vercel.com/kb/guide/dynamic-build-commands?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Run a different Vercel build command for each environment or Git branch using a shell script, vercel.json, or vercel.ts,
- [How to pin a specific Bun version for Vercel builds?](https://vercel.com/kb/guide/how-to-pin-a-specific-bun-version-for-vercel-builds?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to use a specific Bun version for Vercel builds.
- [Migrate to Vercel from Cloudflare](https://vercel.com/kb/guide/migrate-to-vercel-from-cloudflare?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Migrate your website's configuration from Cloudflare Pages or Workers to Vercel

#### From vercel-docs

- [Builds](https://vercel.com/docs/builds?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Understand how the build step works when creating a Vercel Deployment.
- [Build Features for Customizing Deployments](https://vercel.com/docs/builds/build-features?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to customize your deployments using Vercel's build features.
- [Build image overview](https://vercel.com/docs/builds/build-image?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn about the container image used for Vercel builds.
- [vercel deploy](https://vercel.com/docs/cli/deploy?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to deploy your Vercel projects using the vercel deploy CLI command.
- [vercel dev](https://vercel.com/docs/cli/dev?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to replicate the Vercel deployment environment locally and test your Vercel Project before deploying using the
- [Creating & Triggering Deploy Hooks](https://vercel.com/docs/deploy-hooks?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to create and trigger deploy hooks to integrate Vercel deployments with other systems.
- [Optimize Deployment Storage](https://vercel.com/docs/deployment-storage/optimize?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Set retention periods, review remaining usage, and reduce deployment output size.
- [Accessing Build Logs](https://vercel.com/docs/deployments/logs?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to use Vercel's build logs to monitor the progress of building or running your deployment, and check for possi
- [Troubleshooting Build Errors](https://vercel.com/docs/deployments/troubleshoot-a-build?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to resolve common scenarios you may encounter during the Build step, including build errors that cancel a depl
- [Log Drains Reference](https://vercel.com/docs/drains/reference/logs?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn about Log Drains - data formats, sources, environments, and security configuration.
- [Environment variables](https://vercel.com/docs/environment-variables?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn more about environment variables on Vercel.
- [Framework environment variables](https://vercel.com/docs/environment-variables/framework-environment-variables?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Framework environment variables are automatically populated by the Vercel, based on your project's framework.
- [Supported Frameworks on Vercel](https://vercel.com/docs/frameworks/more-frameworks?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn about the frameworks that can be deployed to Vercel.
- [Configuring regions for Vercel Functions](https://vercel.com/docs/functions/configuring-functions/region?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to configure regions for Vercel Functions.
- [Using the Go Runtime with Vercel Functions](https://vercel.com/docs/functions/runtimes/go?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to use the Go runtime to run Go APIs on Vercel.
- [Using the Node.js Runtime with Vercel Functions](https://vercel.com/docs/functions/runtimes/node-js?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to use the Node.js runtime to create functions and deploy Node.js servers on Vercel.
- [How Vercel builds your application](https://vercel.com/docs/fundamentals/builds?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how Vercel transforms your source code into optimized assets ready to serve globally.
- [Deploying Git Repositories with Vercel](https://vercel.com/docs/git?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Vercel automatically deploys supported Git repositories on every branch push and when changes merge into the production
- [Limits](https://vercel.com/docs/limits?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Look up account limits, usage summaries, rate limits, and resource constraints for every Vercel plan.
- [Microfrontends Configuration](https://vercel.com/docs/microfrontends/configuration?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Configure your microfrontends.json.
- [Managing microfrontends](https://vercel.com/docs/microfrontends/managing-microfrontends?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to manage your microfrontends on Vercel.
- [Using Monorepos](https://vercel.com/docs/monorepos?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Vercel provides support for monorepos. Learn how to deploy a monorepo here.
- [Deploying Nx to Vercel](https://vercel.com/docs/monorepos/nx?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Nx is an extensible build system with support for monorepos, integrations, and Remote Caching on Vercel. Learn how to de
- [Remote Caching](https://vercel.com/docs/monorepos/remote-caching?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Vercel Remote Cache allows you to share build outputs and artifacts across distributed teams.
- [Deploying Turborepo to Vercel](https://vercel.com/docs/monorepos/turborepo?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn about Turborepo, a build system for monorepos that allows you to have faster incremental builds, content-aware has
- [Package Managers](https://vercel.com/docs/package-managers?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Discover the package managers supported by Vercel for dependency management. Learn how Vercel detects and uses npm, Yarn
- [General settings](https://vercel.com/docs/project-configuration/general-settings?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Configure basic settings for your Vercel project, including the project name, build and development settings, root direc
- [Project settings](https://vercel.com/docs/project-configuration/project-settings?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Use the project settings, to configure custom domains, environment variables, Git, integrations, deployment protection,
- [Static Configuration with vercel.json](https://vercel.com/docs/project-configuration/vercel-json?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to use vercel.json to configure and override the default behavior of Vercel from within your project.
- [Programmatic Configuration with vercel.ts](https://vercel.com/docs/project-configuration/vercel-ts?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Define your Vercel configuration in vercel.ts with @vercel/config for type-safe routing and build settings.
- [Managing projects](https://vercel.com/docs/projects/managing-projects?from=graph&source_path=%2Fdocs%2Fbuilds%2Fconfigure-a-build&source_site=vercel-docs&relationship=inbound&surface=html) — Learn how to manage your projects through the Vercel Dashboard.
