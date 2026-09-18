// src/github/mapper.js
export function mapGitHubRepository(repo) {
  return {
    type: "web4:Repository",
    identity: {
      provider: "github",
      owner: repo.owner.login,
      name: repo.name,
      canonical: `github:${repo.full_name}`
    },
    source: {
      url: repo.html_url,
      api: repo.url,
      clone: repo.clone_url,
      ssh: repo.ssh_url
    },
    content: {
      description: repo.description ?? null,
      language: repo.language ?? null,
      default_branch: repo.default_branch
    },
    status: {
      visibility: repo.visibility,
      fork: repo.fork,
      archived: repo.archived,
      disabled: repo.disabled
    },
    metrics: {
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      open_issues: repo.open_issues_count
    },
    provenance: {
      provider: "github",
      repository_id: repo.id,
      node_id: repo.node_id,
      created_at: repo.created_at,
      updated_at: repo.updated_at,
      pushed_at: repo.pushed_at
    }
  };
}
