
------

## Managing deploys

### Handling overlapping deploys

Only one deploy can run at a time per service. Sometimes, a deploy will trigger while _another_ deploy is still in progress. When this occurs, your service can do one of the following:

------

###### Policy

**Wait**

###### Description

Allow the in-progress deploy to finish, then proceed directly to the most recently triggered deploy:

[image: A deploy waiting for an in-progress deploy to complete]

- In this case, Render skips any "intermediate" deploys, such as Deploy B in the timeline above.
- We recommend this option for most workspaces, because it helps maintain a regular cadence of deploys during periods of high change volume.
- This is the default policy for workspaces created *on or after 2025-07-14*.

---

###### Policy

**Override**

###### Description

Immediately cancel the in-progress deploy and start the new one.

- This is the default policy for workspaces created *before 2025-07-14*.

------

You can set which of these policies to use for your workspace:

1. In the [Render Dashboard](https://dashboard.render.com), open your workspace's *Settings* page.
2. Scroll down to the *Overlapping Deploy Policy* section and click *Edit*:

   [image: The Overlapping Deploy Policy setting in the Render Dashboard]

3. Select an option and click *Save changes*.

### Canceling a deploy

You can cancel an in-progress deploy in the [Render Dashboard](https://dashboard.render.com) by going to your service's *Deploys* page and clicking *Cancel deploy*:

   [image: Canceling a deploy in the Render Dashboard]

If you cancel an in-progress deploy while another deploy is [waiting](#handling-overlapping-deploys), Render immediately kicks off the waiting deploy.

### Restarting a service

If your service is misbehaving, you can restart it from your service's *Deploys* page in the [Render Dashboard](https://dashboard.render.com). Click *Manual Deploy > Restart service*:

[image: Restarting a service in the Render Dashboard]

On Render, a service restart is actually a special form of [manual deploy](#manual-deploys):

- Like any other deploy, Render creates a completely new instance of your service and swaps over to it when it's ready.
  - This makes restarting a [zero-downtime action](#zero-downtime-deploys).
  - If your service is [scaled](scaling) to multiple instances, a restart applies to all instances.
- _Unlike_ other deploys, the new instance always uses the exact same Git commit and configuration as the running instance at the time of the restart.
  - This means that if you've recently updated your service's environment variables but haven't redeployed since then, restarting does _not_ incorporate those changes.

### Rolling back a deploy

See [Rollbacks](rollbacks).

## Deployment concepts

### Ephemeral filesystem

By default, Render services have an *ephemeral filesystem*. This means that any changes a running service makes to its filesystem are _lost_ with each deploy.

To persist data across deploys, do one of the following:

- Create and connect to a Render-managed datastore (Render [Postgres](postgresql) or [Key Value](key-value)).
- Create and connect to a custom datastore, such as [MySQL](/deploy-mysql) or [MongoDB](/deploy-mongodb).
- Attach a [persistent disk](disks) to your service.
  - Note the [limitations of persistent disks](disks#disk-limitations-and-considerations).

### Zero-downtime deploys

Whenever you deploy a new version of your service, Render performs a sequence of steps to make sure the service stays up and available throughout the deploy process, even if the deploy fails.

This *zero-downtime deploy* sequence applies to web services, private services, background workers, and cron jobs. Static sites _also_ update with zero downtime, but they're backed by a CDN and don't involve service instances. [Learn more about service types](service-types#summary-of-service-types).

> Adding a persistent disk to your service _disables_ zero-downtime deploys for it. [See details](disks#disk-limitations-and-considerations).

#### Sequence of events

1. When you push up a new version of your code, Render attempts to build it.

   - If the build fails, Render cancels the deploy, and your original service instance continues running without interruption.

2. If the build succeeds, Render attempts to spin up a _new_ instance of your service running the new version of your code.

   - *For web services and private services,* your _original_ instance continues to receive all incoming traffic while the new instance is spinning up:

   ```mermaid
   flowchart LR
     lb{{"Render<br/>load balancer"}};
     subgraph " ";
       direction LR;
       instance1("Original instance<br/>(v1)");
       instance2("<strong>New instance<br/>(v2)</strong>");
       class instance2 success;
     end;
     lb edge1@--> instance1;
     edge1@{animation: slow}
     lb ~~~ instance2;
