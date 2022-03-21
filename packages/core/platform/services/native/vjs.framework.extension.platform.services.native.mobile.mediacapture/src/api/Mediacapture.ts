let instance: any

const putInstance = function (ins: unknown) {
  instance = ins
}

const captureVideo = function (successCallback: any, errorCallback: any) {
  instance.captureVideo(successCallback, errorCallback)
}

const captureAudio = function (successCallback: any, errorCallback: any) {
  instance.captureAudio(successCallback, errorCallback)
}

export { captureAudio, captureVideo, putInstance }
