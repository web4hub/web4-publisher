# Managing rulesets for repositories in your organization

Organization rulesets let you define and enforce repository policies across multiple repositories in your organization. They help you maintain consistent standards for code review, branch protection, merge restrictions, and repository-level controls without having to configure each repository individually.

## About organization rulesets

Rulesets are a centralized way to apply repository policies at the organization level. You can use them to enforce standards such as:

- requiring pull request reviews before merge
- preventing force pushes
- blocking direct pushes to protected branches
- requiring status checks to pass
- restricting which users or teams can merge changes
- applying rules to selected repositories or all repositories in the organization

## Before you start

To manage organization rulesets, you must have permission to manage organization settings. Typically, this requires:

- organization owner permissions, or
- a role with sufficient administrative rights for ruleset management

## Creating an organization ruleset

1. In GitHub, open your organization.
2. Click Settings.
3. In the left sidebar, click Rules, then Rulesets.
4. Click New ruleset.
5. Choose Organization as the ruleset type.
6. Give the ruleset a clear name and description.
7. Choose the repositories the ruleset should apply to:
   - all repositories in the organization
   - selected repositories only
   - excluded repositories if needed
8. Add the rules you want to enforce.
9. Review the ruleset and click Create.

## Configuring rules

Common rules you may want to add include:

- Require pull request reviews
- Require status checks
- Restrict who can push to protected branches
- Block force pushes
- Restrict branch creation
- Require signed commits
- Enforce merge queue policies when supported

Choose rules that match your organization’s security and development standards. Start with a minimal baseline and expand only when needed.

## Editing an existing ruleset

1. Open your organization settings.
2. Go to Rules, then Rulesets.
3. Select the ruleset you want to update.
4. Edit the configuration, rules, or repository targets.
5. Save your changes.

## Disabling or deleting a ruleset

If a ruleset is no longer needed:

- disable it temporarily to pause enforcement
- delete it permanently when it is no longer relevant

Use caution when removing rulesets that are protecting critical repositories or enforcing required compliance controls.

## Best practices

- Keep rules consistent with your organization’s policies.
- Start with a small set of essential rules.
- Use naming conventions that make the purpose of each ruleset obvious.
- Apply rulesets to the smallest necessary repository set.
- Review ruleset changes with repository admins before rollout.
- Test on a low-risk repository before applying broadly.

## Troubleshooting

If a ruleset does not appear to be enforced:

- confirm the ruleset is active
- verify the target repository is included
- check whether another ruleset is overriding or conflicting with it
- confirm the branch or repository matches the rule conditions
- review repository permissions for the users or teams involved

## Related articles

- Managing repository rulesets
- About rulesets
- Branch protection for repositories
- Repository management in organizations

## Summary

Organization rulesets provide a structured and scalable way to standardize repository policies across your organization. By defining clear rules and applying them consistently, you can improve security, reduce drift, and keep repository governance aligned with team practices.

