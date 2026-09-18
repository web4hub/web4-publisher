# Creating rulesets for a repository

Rulesets let you define and enforce repository-level policies for branches, code review, merge requirements, and repository access. They provide a more flexible and centralized way to manage protections than traditional branch protection rules.

You can use rulesets to apply consistent standards across repositories and help prevent accidental or unauthorized changes.

## About repository rulesets

A repository ruleset is a collection of conditions and rules that apply to a specific repository. Rules can enforce things like:

- requiring pull request reviews before merge
- preventing force pushes
- restricting direct pushes to protected branches
- requiring status checks to pass
- limiting who can push or merge changes
- controlling branch creation or deletion
- enforcing commit signing or other security policies

Repository rulesets are especially useful when you want to standardize protections for a single repo or align multiple repos with the same policy model.

## Before you start

To create a repository ruleset, you must have permission to manage repository settings. Typically, this means you need repository admin access or another role with sufficient permissions to configure branch protections and rules.

If you are creating a ruleset for a shared or production repository, review the existing branch strategy and permissions before enforcing new rules.

## Creating a repository ruleset

1. In GitHub, open the repository where you want to create the ruleset.
2. Click Settings.
3. In the left sidebar, click Rules, then Rulesets.
4. Click New ruleset.
5. Select Repository as the ruleset type.
6. Enter a name for the ruleset.
7. Optionally add a description to explain the purpose of the ruleset.
8. Choose the target branches this ruleset should apply to:
   - all branches
   - specific branches
   - excluded branches, if needed
9. Add the rules you want to enforce.
10. Review the configuration and click Create.

## Choosing rules

When you create a ruleset, you can add one or more rules based on your repository needs. Common choices include:

- Require pull request reviews
- Require status checks to pass
- Restrict who can push to matching branches
- Block force pushes
- Restrict who can create or delete branches
- Require signed commits
- Limit merges to approved changes only

Choose the rules that match your team's workflow and security requirements. A good starting point is to enable only the policies that are critical for your repository, then expand from there.

## Editing a ruleset

After a ruleset is created, you can update it at any time.

1. Open the repository.
2. Click Settings.
3. In the left sidebar, click Rules, then Rulesets.
4. Select the ruleset you want to edit.
5. Change the name, description, targets, or rules.
6. Save your changes.

You can also disable a ruleset temporarily if you need to pause enforcement without removing the policy entirely.

## Deleting or disabling a ruleset

If a ruleset is no longer needed:

- disable it to pause enforcement temporarily
- delete it when the policy is no longer relevant

Use caution when removing rulesets that protect critical branches or enforce required compliance controls.

## Best practices

- Start with a minimal set of essential rules.
- Apply protections to the branches that need them most.
- Use clear names and descriptions so other contributors understand the purpose of each ruleset.
- Review ruleset changes with repository maintainers before rolling them out.
- Test new rules on a lower-risk branch before enforcing them broadly.
- Keep rules consistent with your team's merge and release process.

## Troubleshooting

If a ruleset is not behaving as expected:

- confirm the ruleset is enabled
- verify the branch target matches the repository branch you expect
- check whether another ruleset is conflicting with it
- ensure the users or teams involved have the correct permissions
- confirm the required status checks are actually running and passing

## Related articles

- About rulesets
- Available rules for rulesets
- Configuring branch protections for repositories
- Managing rulesets for repositories in your organization

## Summary

Repository rulesets help you enforce secure, consistent branch and merge policies for a single repository. By defining clear rules and applying them only where needed, you can protect important branches while keeping your development workflow efficient and predictable.
