"use client";

import getRepoCommits from "@/lib/getRepoCommits";
import { useState } from "react";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const repo = repoUrl.trim();
    if (repo) {
      getRepoCommits(repo);
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
          Submit
        </button>
      </form>
    </div>
  );
}
