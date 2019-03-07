const refresh = document.getElementById('refresh');
const trainSetSize = document.getElementById('training-set-size') as HTMLInputElement;
const learningRate = document.getElementById('learning-rate') as HTMLInputElement;

export const onRefresh = (callback) => refresh.onclick = () => {
  callback(Number(trainSetSize.value));
}

export const onLearningRateChange = (callback) => learningRate.onclick = () => {
  callback(parseFloat(learningRate.value));
}

