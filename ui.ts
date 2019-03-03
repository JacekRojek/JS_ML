const refresh = document.getElementById('refresh');
const train = document.getElementById('train');
const trainSetSize = document.getElementById('training-set-size') as HTMLInputElement;

export const onRefresh = (callback) => refresh.onclick = () => {
  callback(trainSetSize.value);
}

export const onTrain = (callback) => train.onclick = () => {
  callback(trainSetSize.value);
}
