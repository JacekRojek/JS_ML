import React from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Perceptron } from './pages/Perceptron';

function Home() {
  return <h2>Home</h2>;
}

function NeuralNetwork() {
  return <h2>NeuralNetwork</h2>;
}


function AppRouter() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">ML KIT</Link>
            </li>
            <li>
              <Link to="/nn">Neural Network</Link>
            </li>
            <li>
              <Link to="/perceptron">Simple Perceptron</Link>
            </li>
          </ul>
        </nav>

        <Route path="/" exact component={Home} />
        <Route path="/perceptron" component={Perceptron} />
        <Route path="/nn" component={NeuralNetwork} />
      </div>
    </Router>
  );
}

export default AppRouter;
