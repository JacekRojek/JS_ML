import * as d3 from 'd3';
import { onRefresh, onTrain, onTest, onNoiseChange, onSlopeChange } from './ui';

const Y_MAX = 400;
const X_MAX = 400;
let noiseLevel = 1;
let slope = 1;

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

const team = (point:Point):Team => (
  point.x + rand(-noiseLevel, noiseLevel) >
  slope * point.y + rand(-noiseLevel, noiseLevel)
  ? 1
  : -1
);

const generatePoints = (num:number):Point[] => Array.from(Array(num)).map(() => ({
  x: rand(0, X_MAX),
  y: rand(0, Y_MAX),
}));

const randomPoints = generatePoints(200);

const draw = (weights:Weights, pointsDataset: Point[]) => {
  const canvas = d3.select("#canvas");
  canvas.select("svg").remove()
  const svg = canvas
  .append("svg")
  .attr("width", X_MAX)
  .attr("height", Y_MAX)
  const padding = 20;
  const points = svg.selectAll("circle")
    .data(pointsDataset)
    .enter()
    .append("circle")
    .attr("cx", p => p.x)
    .attr("cy", p => Y_MAX - p.y)
    .attr("r", 2)
    .style("fill", (p) => guess(weights, p) === -1  ? 'red' : 'blue');

    var line = svg
      .append("line")
      .attr("x1", 0)
      .attr("y1", Y_MAX)
      .attr("x2", X_MAX * slope)
      .attr("y2", 0)
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
  draw(currentWeights, randomPoints);
  // drawing test data
  // draw(currentWeights, examples.map(e => e.point));
};

updateWeights(100, randomWeights());

// UI binding

onRefresh((setSize) => updateWeights(setSize, randomWeights()))
onTrain((setSize) => updateWeights(setSize, currentWeights))
onTest((points) => draw(currentWeights, generatePoints(points)))
onNoiseChange((newValue) => { noiseLevel = newValue})
onSlopeChange((newValue) => { slope = newValue})