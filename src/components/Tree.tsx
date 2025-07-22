"use client";

import { HierarchyNode, linkHorizontal, select, tree } from "d3";
import { useEffect, useRef } from "react";

export default function Tree({ commits }: { commits: HierarchyNode<unknown> }) {
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!treeRef.current || !commits) return;
    select(treeRef.current).selectAll("*").remove();

    const containerWidth = treeRef.current.clientWidth || 800;
    const containerHeight = treeRef.current.clientHeight || 600;
    const margin = { top: 40, right: 40, bottom: 40, left: 40 };

    const nodeCount = commits.descendants ? commits.descendants().length : 1;

    const width = Math.max(
      containerWidth - margin.left - margin.right,
      nodeCount * 150,
    );
    const height = Math.max(
      containerHeight - margin.top - margin.bottom,
      nodeCount * 80,
    );

    const treeLayout = tree<unknown>().size([width, height]);

    const svg = select(treeRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const root = treeLayout(commits);
    const links = root.links();
    const nodes = root.descendants();

    const pathGenerator = linkHorizontal<any, any>()
      .x((d: any) => d.x)
      .y((d: any) => d.y);

    // Draw links
    g.selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("stroke", "#999")
      .attr("stroke-width", 2)
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
      .attr("r", 5)
      .attr("fill", "#333")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add text labels
    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", 0)
      .attr("y", (d: any) => (d.children ? -15 : 15))
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("font-family", "sans-serif")
      .style("fill", "#333")
      .text((d: any) => d.data.info.message || "Node");
  }, [commits]);

  return (
    <>
      {treeRef && (
        <div ref={treeRef} className="h-full w-full overflow-auto"></div>
      )}
    </>
  );
}
