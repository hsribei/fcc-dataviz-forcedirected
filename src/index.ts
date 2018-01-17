declare function require(string): string;
import "./style.css";
import "./flags.css";
import * as d3 from "d3";
const image = require("./blank.gif");

const url =
  "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

d3.json(url, function(error, graph) {
  if (error) throw error;

  d3
    .select(".content")
    .append("img")
    .attr("src", image)
    .attr("class", "flag flag-cz");

  // Give nodes ids
  graph.nodes.forEach((node, i) => (node.id = i));

  const boundingRadius = 480;
  const width = boundingRadius * 2,
    height = boundingRadius * 2;
  const nodeRadius = 5;

  const simulation = d3
    .forceSimulation()
    .force("link", d3.forceLink().id(d => d.id))
    .force("charge", d3.forceManyBody().strength(-150))
    .force("center", d3.forceCenter(boundingRadius, boundingRadius))
    .force(
      "radial",
      d3.forceRadial(0.0001, boundingRadius, boundingRadius).strength(0.1)
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

  const dragHandler = d3
    .drag()
    .on("start", dragStart)
    .on("drag", dragDrag)
    .on("end", dragEnd);

  dragHandler(node);

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

  function dragStart(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragDrag(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragEnd(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
});
