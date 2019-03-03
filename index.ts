// const R = require('ramda');
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

// const testTrain = () => {
//   const point = { x: 200, y: 400 }; // -1
//   return train(randomWeights, point, team(point));
// };

const generatePoints = (num:number):Point[] => Array.from(Array(num)).map(() => ({
  x: rand(0, X_MAX),
  y: rand(0, Y_MAX),
}));

const randomPoints = generatePoints(200);

const draw = (weights:Weights) => {
  window.document.getElementById('canvas').innerHTML = `
  <svg width="${X_MAX}" height="${Y_MAX}">
    ${randomPoints.map(point => `
      <circle 
          cx="${point.x}"
          cy="${point.y}"
          r="3"
          fill="${guess(weights, point) === -1 ? 'blue' : 'red' }"/>`)}
    <line x1="0" x2="${X_MAX}" y1="0" y2="${Y_MAX/2}" stroke="purple" />
  </svg>
  `;
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