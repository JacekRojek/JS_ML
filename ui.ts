const refresh = document.getElementById('refresh');
const train = document.getElementById('train');
const test = document.getElementById('test');
const trainSetSize = document.getElementById('training-set-size') as HTMLInputElement;
const testSize = document.getElementById('test-size') as HTMLInputElement;

export const onRefresh = (callback) => refresh.onclick = () => {
  callback(Number(trainSetSize.value));
}

export const onTest = (callback) => test.onclick = () => {
  callback(Number(testSize.value));
}

export const onTrain = (callback) => train.onclick = () => {
  callback(Number(trainSetSize.value));
}
