import { Matrix } from "./matrix";

const sigmoid = (x:number):number => 1 / (1 + Math.exp(-x));

const dsigmoid = (y:number):number => y * (1 - y);

export class NeuralNetwork {
  constructor(input_nodes:number, hidden_nodes: number[], output_nodes:number) {
    this.input_nodes = input_nodes;
    this.hidden_nodes = hidden_nodes;
    this.output_nodes = output_nodes;

    this.weights_ih1 = new Matrix(this.hidden_nodes[0], this.input_nodes);
    this.weights_h1h2 = new Matrix(this.hidden_nodes[1], this.hidden_nodes[0]);
    this.weights_ho = new Matrix(this.output_nodes, this.hidden_nodes[1]);
    this.weights_ih1.randomize();
    this.weights_h1h2.randomize();
    this.weights_ho.randomize();

    this.bias_h1 = new Matrix(this.hidden_nodes[0], 1);
    this.bias_h2 = new Matrix(this.hidden_nodes[1], 1);
    this.bias_o = new Matrix(this.output_nodes, 1);
    this.bias_h1.randomize();
    this.bias_h2.randomize();
    this.bias_o.randomize();
    this.learning_rate = 0.1;
  }

  input_nodes: number;
  hidden_nodes: number[];
  output_nodes: number;

  weights_ih1: Matrix;
  weights_h1h2: Matrix;
  weights_ho: Matrix;

  bias_h1: Matrix;
  bias_h2: Matrix;
  bias_o: Matrix;
  learning_rate: number;

  feedForward(input_array:number[]):number[] {
    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden1 = Matrix.multiply(this.weights_ih1, inputs);
    hidden1.add(this.bias_h1);
    // activation function!
    hidden1.map(sigmoid);

    // Generating the output's output!
    let h2 = Matrix.multiply(this.weights_h1h2, hidden1);
    h2.add(this.bias_h2);
    h2.map(sigmoid);


    // Generating the output's output!
    let output = Matrix.multiply(this.weights_ho, h2);
    output.add(this.bias_o);
    output.map(sigmoid);

    // Sending back to the caller!
    return output.toArray();
  }

  train(input_array:number[], target_array:number[]):NeuralNetwork {
    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(input_array);
    let hidden1 = Matrix.multiply(this.weights_ih1, inputs);
    hidden1.add(this.bias_h1);
    // activation function!
    hidden1.map(sigmoid);

    // Generating the output's output!
    let hidden2 = Matrix.multiply(this.weights_h1h2, hidden1);
    hidden2.add(this.bias_h2);
    hidden2.map(sigmoid);

    // Generating the output's output!
    let outputs = Matrix.multiply(this.weights_ho, hidden2);
    outputs.add(this.bias_o);
    outputs.map(sigmoid);


    //  -------------------------------
    //  -------------------------------
    //  -------------------------------
    //  -------------------------------
  
    // Convert array to matrix object
    let targets = Matrix.fromArray(target_array);
    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let output_errors = Matrix.subtract(targets, outputs);

    // let gradient = outputs * (1 - outputs);
    // Calculate gradient
    let gradients = Matrix.map(outputs, dsigmoid);
    gradients.multiply(output_errors);
    gradients.multiply(this.learning_rate);

    // Calculate deltas
    let hidden2_T = Matrix.transpose(hidden2);
    let weight_ho_deltas = Matrix.multiply(gradients, hidden2_T);

    // Adjust the weights by deltas
    this.weights_ho.add(weight_ho_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_o.add(gradients);

   // -------------------------------------------------- 
   
    // Calculate the hidden layer errors
    let who_t = Matrix.transpose(this.weights_ho);
    let hidden2_errors = Matrix.multiply(who_t, output_errors);

    // Calculate hidden gradient
    let hidden2_gradient = Matrix.map(hidden2, dsigmoid);
    hidden2_gradient.multiply(hidden2_errors);
    hidden2_gradient.multiply(this.learning_rate);

    // Calcuate input->hidden deltas
    let weight1_T = Matrix.transpose(hidden1);
    let weight_h1_h2_deltas = Matrix.multiply(hidden2_gradient, weight1_T);

    this.weights_h1h2.add(weight_h1_h2_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_h2.add(hidden2_gradient);

    // --------------------------------------------------

    // Calculate the hidden layer errors
    let wh1_h2_t = Matrix.transpose(this.weights_h1h2);
    let hidden_errors = Matrix.multiply(wh1_h2_t, hidden2_errors);
    // Calculate hidden gradient
    let hidden_gradient = Matrix.map(hidden1, dsigmoid);
    hidden_gradient.multiply(hidden_errors);
    hidden_gradient.multiply(this.learning_rate);
    // Calcuate input->hidden deltas
    let inputs_T = Matrix.transpose(inputs);
    let weight_ih_deltas = Matrix.multiply(hidden_gradient, inputs_T);

    this.weights_ih1.add(weight_ih_deltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.bias_h1.add(hidden_gradient);
    return this;
  }
}