let instance

const putInstance = function (ins) {
  instance = ins
}

const startGather = function (entityName, successCallback, errorCallback) {
  instance.startGather(entityName, successCallback, errorCallback)
}

const stopGather = function (entityName, successCallback, errorCallback) {
  instance.stopGather(entityName, successCallback, errorCallback)
}

const getGatherState = function () {
  return instance.getGatherState()
}

export { putInstance, startGather, stopGather, getGatherState }
