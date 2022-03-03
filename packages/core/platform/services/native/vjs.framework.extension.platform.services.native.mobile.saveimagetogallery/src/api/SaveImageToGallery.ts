let instance

const putInstance = function (ins) {
  instance = ins
}

const saveimagetogallery = function (successCallback, failCallback, options) {
  instance.saveimagetogallery(successCallback, failCallback, options)
}

export { putInstance, saveimagetogallery }
