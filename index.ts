import { onRefresh, onTrain, onTest, onNoiseChange, onSlopeChange, onLearningRateChange, onOffsetChange } from './ui';
import { Team, Point, Weights } from './types';
import { X_MAX, Y_MAX } from './config';
import { guess, rand, f } from './utils/utils';
import { CONFIG } from './config';
import { draw } from './drawing';

function train(weights:Weights, point:Point, team:Team):Weights {
  const guessResult = guess(weights, point);
  const error = team - guessResult;
  return {
    x: weights.x + point.x * error * CONFIG.learningRate,
    y: weights.y + point.y * error * CONFIG.learningRate,
    bias: weights.bias + point.bias * error * CONFIG.learningRate,
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
onNoiseChange((newValue) => { CONFIG.noiseLevel = newValue})
onSlopeChange((newValue) => {  CONFIG.slope = newValue})
onLearningRateChange((newValue) => {  CONFIG.learningRate = newValue})
onOffsetChange((newValue) => {  CONFIG.offset = newValue})