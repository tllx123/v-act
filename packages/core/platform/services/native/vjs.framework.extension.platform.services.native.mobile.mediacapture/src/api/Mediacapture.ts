let instance

const putInstance = function (ins) {
  instance = ins
}

const captureVideo = function (successCallback, errorCallback) {
  instance.captureVideo(successCallback, errorCallback)
}

const captureAudio = function (successCallback, errorCallback) {
  instance.captureAudio(successCallback, errorCallback)
}

export { putInstance, captureVideo, captureAudio }
