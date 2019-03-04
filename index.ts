import * as d3 from 'd3';
import { onRefresh, onTrain, onTest, onNoiseChange, onSlopeChange, onLearningRateChange, onOffsetChange } from './ui';

const Y_MAX = 400;
const X_MAX = 400;
let noiseLevel = 1;
let slope = 2;
let learningRate = 0.2;
let offset = 0;

const rand = (high, low) => Math.random() * (high - low) + low;

type Team = 1 | -1;
type Weights = {
  x: number;
  y: number;
  bias: number;
};
type Point = {
  x: number;
  y: number;
  bias: number;
};

const f = (x) => (slope * x) + offset;

const activationFunction = (sum:number):Team => sum >= 0 ? 1 : -1;

const guess = (weights:Weights, point:Point):Team => {
  const sum = point.x * weights.x
            + point.y * weights.y
            + point.bias * weights.bias;

  const team = activationFunction(sum);
  return team;
};

function train(weights:Weights, point:Point, team:Team):Weights {
  const guessResult = guess(weights, point);
  const error = team - guessResult;
  return {
    x: weights.x + point.x * error * learningRate,
    y: weights.y + point.y * error * learningRate,
    bias: weights.bias + point.bias * error * learningRate,
  };
}

const randomWeights = ():Weights => ({
  x: rand(-1, 1),
  y: rand(-1, 1),
  bias: rand(-1, 1),
});

const label = (point:Point):Team => {
  return f(point.x) > point.y ? 1 : -1
};

const generatePoints = (num:number):Point[] => Array
.from(Array(num)).map(() => ({
  x: rand(-X_MAX/2, X_MAX/2),
  y: rand(-Y_MAX/2, Y_MAX/2),
  bias: 1,
}));

const randomPoints = generatePoints(200);

const draw = (weights:Weights, pointsDataset: Point[]) => {
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
        d3.scaleLinear().range([Y_MAX/2, -Y_MAX/2]))
      var x_axis = d3.axisBottom(
        d3.scaleLinear().range([-X_MAX/2, X_MAX/2]))

        svg.append("g")
        .attr("transform", `translate(${X_MAX/2}, ${Y_MAX})`)
        .call(x_axis);
        svg.append("g")
          .attr("transform", `translate(0, ${X_MAX/2})`)
          .call(y_axis);
};

let currentWeights = randomWeights();
const updateWeights = (trainingSetSize: number, initialWeights: Weights) => {
  const examples = generatePoints(trainingSetSize).map(point => ({
    point,
    label: label(point),
  }));
  
  currentWeights = initialWeights;
  examples.forEach((example) => {
    currentWeights = train(currentWeights, example.point, example.label);
    return currentWeights;
  });
  draw(currentWeights, randomPoints);
  // drawing test data
  // draw(currentWeights, examples.map(e => e.point));
};

updateWeights(100000, randomWeights());

// UI binding

onRefresh((setSize) => updateWeights(setSize, randomWeights()))
onTrain((setSize) => updateWeights(setSize, currentWeights))
onTest((points) => draw(currentWeights, generatePoints(points)))
onNoiseChange((newValue) => { noiseLevel = newValue})
onSlopeChange((newValue) => { slope = newValue})
onLearningRateChange((newValue) => { learningRate = newValue})
onOffsetChange((newValue) => { offset = newValue})