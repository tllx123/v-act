let instance

const putInstance = function (ins) {
  instance = ins
}

const chooseImage = function (params) {
  instance.chooseImage(params)
}

const previewImage = function (params) {
  instance.previewImage(params)
}

const uploadImage = function (params) {
  instance.uploadImage(params)
}

export { putInstance, chooseImage, previewImage, uploadImage }
