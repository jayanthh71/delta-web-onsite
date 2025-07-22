import parseCommits from "./parseCommits";

export default async function getRepoCommits(repo: string) {
  const owner = repo.split("/")[3];
  const repoName = repo.split("/")[4].replace(".git", "");

  const apiUrl = `https://api.github.com/repos/${owner}/${repoName}/commits`;
  const headers = {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_GITHUB_TOKEN}`,
    "X-GitHub-Api-Version": "2022-11-28",
  };

  const commitData = await fetch(apiUrl, {
    method: "GET",
    headers: headers,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error("Error fetching commit data:", error);
    });

  return parseCommits(commitData);
}
