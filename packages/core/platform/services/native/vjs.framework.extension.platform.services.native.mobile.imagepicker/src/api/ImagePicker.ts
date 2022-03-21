let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const getPicture = function (
  successCallback: any,
  failCallback: any,
  options: any
) {
  instance.getPicture(successCallback, failCallback, options)
}

export { getPicture, putInstance }
