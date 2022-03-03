let instance

const putInstance = function (ins) {
  instance = ins
}

const getPicture = function (successCallback, errorCallback, options) {
  instance.getPicture(successCallback, errorCallback, options)
}

export { putInstance, getPicture }
