import * as d3 from 'd3';
import { Point, Weights } from './types';
import { X_MAX, Y_MAX } from './config';
import { guess, f } from './utils/utils';

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
