import * as d3 from 'd3';
import { Point, Weights } from './types';
import { X_MAX, Y_MAX } from './config';
import { guess, f } from './utils/utils';
import { NeuralNetwork } from './neuralNetwork/neuralNetwork';

export const draw = (weights:Weights, pointsDataset: Point[]) => {
  const canvas = d3.select("#canvas");
  canvas.select("svg").remove()
  const svg = canvas
  .append("svg")
  .attr("width", X_MAX)
  .attr("height", Y_MAX)
  const points = svg.selectAll("circle")
    .data(pointsDataset)
    .enter()
    .append("circle")
    .attr("cx", p => p.x + X_MAX/2)
    .attr("cy", p => Y_MAX/2 - p.y)
    .attr("r", 2)
    .style("fill", (p) => guess(weights, p) === -1  ? 'red' : 'blue');

    var line = svg
      .append("line")
      .attr("x1", X_MAX)
      .attr("y1", Y_MAX/2 - f(X_MAX/2))
      .attr("x2", 0)
      .attr("y2", Y_MAX/2 - f(-X_MAX/2))
      .attr("stroke-width", 0.5)
      .attr("stroke", "green")

      var y_axis = d3.axisLeft(
        d3.scaleLinear()
        .domain([-Y_MAX/2, Y_MAX/2])
        .range([Y_MAX/2, -Y_MAX/2]))
      var x_axis = d3.axisBottom(
        d3.scaleLinear()
        .domain([-X_MAX/2, X_MAX/2])
        .range([-X_MAX/2, X_MAX/2]))

        svg.append("g")
        .attr("transform", `translate(${X_MAX/2}, ${Y_MAX})`)
        .call(x_axis);

        svg.append("g")
          .attr("transform", `translate(0, ${X_MAX/2})`)
          .call(y_axis);
};

const colorMap = ['green','red','blue'];
const toArray = l => Array(l).fill(0)

export const drawNN  = (nn: NeuralNetwork) => {
  const l0 = toArray(nn.input_nodes).map((a,i) => ({ layer: 0, index: i})); 
  const l1 = toArray(nn.hidden_nodes).map((a,i) => ({ layer: 1, index: i})); 
  const l2 = toArray(nn.output_nodes).map((a,i) => ({ layer: 2, index: i})); 

  const canvas = d3.select("#canvas");
  canvas.select("svg").remove()
  const svg = canvas
  .append("svg")
  .attr("width", 3 * 200)
  .attr("height", 100 + Math.max(l0.length,l1.length,l2.length) * 50)
  const data = [...l0,...l1,...l2]

   const hiddenLayer = svg.selectAll("circle")
     .data(data)
     .enter()
     .append("circle")
     .attr("cx", p => 50 + p.layer * 200)
     .attr("cy", p => 50 + p.index * 50)
     .attr("r", 10)
     .style("fill", p => colorMap[p.layer]);

}
