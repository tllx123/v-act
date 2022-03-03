let instance

const putInstance = function (ins) {
  instance = ins
}

const getInfo = function (successCallback, errorCallback) {
  instance.getInfo(successCallback, errorCallback)
}

export { putInstance, getInfo }
