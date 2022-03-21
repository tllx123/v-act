let instance: any

const putInstance = function (ins: any) {
  instance = ins
}

const startGather = function (
  entityName: string,
  successCallback: any,
  errorCallback: any
) {
  instance.startGather(entityName, successCallback, errorCallback)
}

const stopGather = function (
  entityName: string,
  successCallback: any,
  errorCallback: any
) {
  instance.stopGather(entityName, successCallback, errorCallback)
}

const getGatherState = function () {
  return instance.getGatherState()
}

export { getGatherState, putInstance, startGather, stopGather }
