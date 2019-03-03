import * as d3 from 'd3';
import { onRefresh, onTrain } from './ui';

const Y_MAX = 400;
const X_MAX = 400;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const rand = (high, low) => Math.random() * (high - low) + low;

type Team = 1 | -1;
type Weights = {
  x: number;
  y: number;
};
type Point = {
  x: number;
  y: number;
};

const guess = (weights:Weights, point:Point):Team => {
  const sum = point.x * weights.x
            + point.y * weights.y;
  const team = sum >= 0 ? 1 : -1;
  return team;
};

function train(weights:Weights, point:Point, team:Team):Weights {
  const guessResult = guess(weights, point);
  const error = team - guessResult;
  const learningRate = 0.5;
  return {
    x: weights.x + point.x * error * learningRate,
    y: weights.y + point.y * error * learningRate,
  };
}

const randomWeights = ():Weights => ({
  x: rand(-1, 1),
  y: rand(-1, 1),
});

const team = (point:Point):Team => (point.x > 2 * point.y ? 1 : -1);

const generatePoints = (num:number):Point[] => Array.from(Array(num)).map(() => ({
  x: rand(0, X_MAX),
  y: rand(0, Y_MAX),
}));

const randomPoints = generatePoints(200);

const draw = (weights:Weights) => {
  const canvas = d3.select("#canvas");
  canvas.select("svg").remove()
  const svg = canvas
  .append("svg")
  .attr("width", X_MAX)
  .attr("height", Y_MAX);
  const padding = 20;
  const points = svg.selectAll("circle")
    .data(randomPoints)
    .enter()
    .append("circle")
    .attr("cx", d => d.x)
    .attr("cy", d => d.y)
    .attr("r", 2)
    .style("fill", (d) => d.x > 2 * d.y ? 'red' : 'blue');

    var line = svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", X_MAX)
      .attr("y2", Y_MAX/2)
      .attr("stroke-width", 0.5)
      .attr("stroke", "green")

      var y_axis = d3.axisLeft(
        d3.scaleLinear().range([Y_MAX, 0]))
      var x_axis = d3.axisBottom(
        d3.scaleLinear().range([0, X_MAX]))

      svg.append("g")
        .attr("transform", "translate(0, 0)")
        .call(y_axis);
      svg.append("g")
        .attr("transform", `translate(0, ${Y_MAX})`)
        .call(x_axis);
};

let currentWeights = randomWeights();
const updateWeights = (trainingSetSize: number, initialWeights: Weights) => {
  const examples = generatePoints(trainingSetSize).map(point => ({
    point,
    team: team(point),
  }));
  currentWeights = initialWeights;
  examples.forEach((example) => {
    currentWeights = train(currentWeights, example.point, example.team);
    return currentWeights;
  });
  console.log('currentWeights::', currentWeights)
  draw(currentWeights);
};

updateWeights(100, randomWeights());

// UI binding

onRefresh((setSize) => updateWeights(setSize, randomWeights()))
onTrain((setSize) => updateWeights(setSize, currentWeights))