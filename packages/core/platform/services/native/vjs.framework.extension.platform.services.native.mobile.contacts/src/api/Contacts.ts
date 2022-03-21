let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const getInfo = function (successCallback: any, errorCallback: any) {
  instance.getInfo(successCallback, errorCallback)
}

export { getInfo, putInstance }
