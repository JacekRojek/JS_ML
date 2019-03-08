import * as React from 'react';
import { Input } from '../components/input';

const Perceptron = () => {
  const [noise, setNoise] = React.useState(0.01);
  return (
    <div>
      <Input value={noise} label="Training data noise" onChange={setNoise} />
    </ div>
  );
}

export { Perceptron }
