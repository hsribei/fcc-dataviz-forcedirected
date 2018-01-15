import "./style.css";
import * as d3 from "d3";

const url =
  "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

d3.json(url, function(error, graph) {
  if (error) throw error;

  // Give nodes ids
  graph.nodes.forEach((node, i) => (node.id = i));

  const boundingRadius = 400;
  const width = boundingRadius * 2,
    height = boundingRadius * 2;
  const nodeRadius = 5;

  const simulation = d3
    .forceSimulation()
    .force("link", d3.forceLink().id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-15))
    .force("center", d3.forceCenter(boundingRadius, boundingRadius))
    .force(
      "radial",
      d3.forceRadial(0.0001, boundingRadius, boundingRadius).strength(0.02)
    );

  const svg = d3
    .select("svg#d3")
    .attr("width", boundingRadius * 2)
    .attr("height", boundingRadius * 2);
  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line");

  const node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("r", nodeRadius);

  simulation.nodes(graph.nodes).on("tick", ticked);

  simulation.force("link").links(graph.links);

  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node
      .attr(
        "cx",
        d => (d.x = Math.max(nodeRadius, Math.min(width - nodeRadius, d.x)))
      )
      .attr(
        "cy",
        d => (d.y = Math.max(nodeRadius, Math.min(height - nodeRadius, d.y)))
      );
  }
});
