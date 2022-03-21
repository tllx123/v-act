let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const getPicture = function (
  successCallback: any,
  errorCallback: any,
  options: unknown
) {
  instance.getPicture(successCallback, errorCallback, options)
}

export { getPicture, putInstance }
