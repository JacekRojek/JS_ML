const refresh = document.getElementById('refresh');
const train = document.getElementById('train');
const test = document.getElementById('test');
const trainSetSize = document.getElementById('training-set-size') as HTMLInputElement;
const testSize = document.getElementById('test-size') as HTMLInputElement;
const noise = document.getElementById('noise-level') as HTMLInputElement;
const slope = document.getElementById('slope') as HTMLInputElement;

export const onRefresh = (callback) => refresh.onclick = () => {
  callback(Number(trainSetSize.value));
}

export const onSlopeChange = (callback) => slope.onchange = () => {
  callback(parseFloat(slope.value));
}

export const onNoiseChange = (callback) => noise.onchange = () => {
  callback(Number(noise.value));
}

export const onTest = (callback) => test.onclick = () => {
  callback(Number(testSize.value));
}

export const onTrain = (callback) => train.onclick = () => {
  callback(Number(trainSetSize.value));
}
