import "./style.css";
import * as d3 from "d3";

const url = "https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json";

d3.json(url, function(error, graph) {
  if (error) throw error;

  graph.nodes.forEach((node, i) => node.id = i);

  console.log(graph);
});
