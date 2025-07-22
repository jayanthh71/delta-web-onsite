"use client";

import { HierarchyNode, linkVertical, select, tree } from "d3";
import { useEffect, useRef } from "react";

export default function Tree({ commits }: { commits: HierarchyNode<unknown> }) {
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!treeRef.current || !commits) return;
    select(treeRef.current).selectAll("*").remove();

    const containerWidth = treeRef.current.clientWidth || 800;
    const containerHeight = treeRef.current.clientHeight || 600;

    const nodeCount = commits.descendants ? commits.descendants().length : 1;

    const width = Math.max(containerWidth - 400, nodeCount * 10);
    const height = Math.max(containerHeight - 400, nodeCount * 80);

    const treeLayout = tree<unknown>().size([width, height]);

    const svg = select(treeRef.current)
      .append("svg")
      .attr("width", width + 400)
      .attr("height", height + 400);

    const g = svg.append("g").attr("transform", `translate(${40},${40})`);

    const root = treeLayout(commits);
    const links = root.links();
    const nodes = root.descendants();

    const pathGenerator = linkVertical<any, any>()
      .x((d: any) => d.x)
      .y((d: any) => d.y);

    // Draw links
    g.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("stroke", "#f00")
      .attr("stroke-width", 4)
      .attr("fill", "none")
      .attr("d", pathGenerator);

    // Draw nodes
    const node = g
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d: any) => `translate(${d.x},${d.y})`);

    // Add circles for nodes
    node
      .append("circle")
      .attr("r", 15)
      .attr("fill", "#f00")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add text labels
    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", 25)
      .attr("y", 0)
      .style("text-anchor", "start")
      .style("font-size", "14px")
      .style("font-family", "Helvetica, Arial, sans-serif")
      .style("font-weight", "bold")
      .style("fill", "#333")
      .text(
        (d: any) =>
          `${d.data.info.message || "Message"} (${d.data.info.author?.login || "unkown"})`,
      );
  }, [commits]);

  return (
    <>
      {treeRef && (
        <div ref={treeRef} className="h-full w-full overflow-auto"></div>
      )}
    </>
  );
}
