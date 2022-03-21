let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const saveimagetogallery = function (
  successCallback: any,
  failCallback: any,
  options: any
) {
  instance.saveimagetogallery(successCallback, failCallback, options)
}

export { putInstance, saveimagetogallery }
