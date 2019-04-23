import { NeuralNetwork } from "./neuralNetwork";
import { rand } from "../utils/utils";
import { Matrix } from "./matrix";
import { onRefresh, onLearningRateChange } from "./ui";
import { drawNN } from "../drawing";

let learningRate = 0.1;

function drawMatrix(tableData:Matrix, name:string, id:string) {
  var table = document.getElementById(id) || document.createElement('table');
  table.id = id;
  table.innerHTML = ''
  var tableBody = document.createElement('tbody');
  table.appendChild(document.createTextNode(name));
  tableData.data.forEach((rowData) => {
    var row = document.createElement('tr');
    rowData.forEach((cellData) => {
      var cell = document.createElement('td');
      cell.appendChild(document.createTextNode(cellData.toString()));
      row.appendChild(cell);
    });
    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  document.body.appendChild(table);
}

const training_data = [{
  inputs: [0, 0],
  targets: [0]
}, {
  inputs: [1, 0],
  targets: [1]
}, {
  inputs: [0, 1],
  targets: [1]
}, {
  inputs: [1, 1],
  targets: [0]
}];

const train = (setSize) => {
  const nn = new NeuralNetwork(2, [3,3], 1);
  nn.learning_rate = learningRate;
  
  for (let i = 0; i < setSize; i++) {
    const randomIndex = Math.round(rand(0, training_data.length - 1));
    let data = training_data[randomIndex];
    const newNN = nn.train(data.inputs, data.targets);
    // drawMatrix(newNN.weights_ih, 'newNN.weights_ih');
  }
  drawMatrix(Matrix.fromArray(
    [
      nn.feedForward(training_data[0].inputs)[0],
      nn.feedForward(training_data[1].inputs)[0],
      nn.feedForward(training_data[2].inputs)[0],
      nn.feedForward(training_data[3].inputs)[0],
    ])
    , 'Prediction',
    'weights-matrix')
  drawMatrix(nn.weights_ho, 'Weights HO', 'ho');
  drawMatrix(nn.weights_ih1, 'Weights IH1', 'hi-1');
  drawMatrix(nn.bias_h1, 'Bias H1', 'bhs1');
  drawMatrix(nn.weights_h1h2, 'Weights H1H2', 'h1h2');
  drawMatrix(nn.bias_h2, 'Bias H2', 'bhs2');
  drawMatrix(nn.bias_o, 'Bias O', 'bo');
  drawNN(nn)
}

train(1000)
    
    // UI binding

onRefresh((setSize) => train(setSize))
onLearningRateChange((newValue) => {  learningRate = newValue})
