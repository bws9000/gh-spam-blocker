export async function githubRequest(path, token) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status}: ${text}`);
  }

  return res.json();
}

export async function blockUser(username, token) {
  await fetch(`https://api.github.com/user/blocks/${username}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  await new Promise(resolve => setTimeout(resolve, 1000)); //be gentle...
}
