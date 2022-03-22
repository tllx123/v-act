let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const chooseImage = function (params: any) {
  instance.chooseImage(params)
}

const previewImage = function (params: any) {
  instance.previewImage(params)
}

const uploadImage = function (params: any) {
  instance.uploadImage(params)
}

export { chooseImage, previewImage, putInstance, uploadImage }
