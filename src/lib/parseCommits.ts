import { stratify } from "d3";

export default function parseCommits(commits: any[]) {
  const relationships = commits.map((commit) => ({
    name: commit.sha,
    parent: commit.parents.length > 0 ? commit.parents[0].sha : null,
    info: {
      author: commit.commit.committer,
      message: commit.commit.message,
      url: commit.commit.url,
    },
  }));

  relationships.reverse()[0].parent = null;

  const root = stratify()
    .id((d: any) => d.name)
    .parentId((d: any) => d.parent)(relationships);

  return root;
}
