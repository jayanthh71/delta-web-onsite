"use client";

import Tree from "@/components/Tree";
import getRepoCommits from "@/lib/getRepoCommits";
import { HierarchyNode } from "d3";
import { useState } from "react";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [commits, setCommits] = useState<HierarchyNode<unknown> | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const repo = repoUrl.trim();
    if (repo) {
      const response = await getRepoCommits(repo);
      setCommits(response);
    } else {
      console.error("Please enter a valid repository URL.");
    }
  };

  return (
    <div className="mt-10 flex min-h-screen flex-col items-center">
      <h1 className="font-sans text-4xl font-bold">Git log Visualizer</h1>
      <form className="flex flex-col items-center" onSubmit={handleSubmit}>
        <input
          className="mt-16 w-3xl rounded border border-gray-300 p-2 text-center"
          type="text"
          placeholder="Enter Git repository URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          required
          autoFocus
        />
        <button
          type="submit"
          className="mt-10 w-lg cursor-pointer rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700 active:bg-blue-800"
        >
          Visualize
        </button>
      </form>

      {commits && (
        <div className="mt-16 w-5xl bg-white">
          <Tree commits={commits} />
        </div>
      )}
    </div>
  );
}
