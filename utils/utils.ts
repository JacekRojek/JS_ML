import { Team, Point, Weights } from '../types';
import { CONFIG } from '../config';

export const rand = (high:number, low:number):number => Math.random() * (high - low) + low;
export const f = (x) => (CONFIG.slope * x) + CONFIG.offset;

export const activationFunction = (sum:number):Team => sum >= 0 ? 1 : -1;

export const guess = (weights:Weights, point:Point):Team => {
  const sum = point.x * weights.x
            + point.y * weights.y
            + point.bias * weights.bias;

  const team = activationFunction(sum);
  return team;
};
