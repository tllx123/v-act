let instance

const putInstance = function (ins) {
  instance = ins
}

const getPicture = function (successCallback, failCallback, options) {
  instance.getPicture(successCallback, failCallback, options)
}

export { putInstance, getPicture }
