// src/github/client.js
const API = "https://api.github.com";

export async function githubRequest(path) {
  const response = await fetch(`${API}${path}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "web4-publisher"
    }
  });

  if (!response.ok) {
    throw new Error(
      `GitHub API request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function getUserRepositories(username) {
  return githubRequest(`/users/${encodeURIComponent(username)}/repos?per_page=100`);
}

export async function getRepository(owner, repo) {
  return githubRequest(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`);
}
