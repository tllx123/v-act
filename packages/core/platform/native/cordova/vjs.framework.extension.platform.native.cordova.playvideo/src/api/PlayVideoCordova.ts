exports.initModule = function (sb) {
  let PlayVideoService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.PlayVideo'
  )
  PlayVideoService.putInstance(exports)
}

const openVideoPlayer = function (
  videoPath,
  fileName,
  successCallback,
  failCallback
) {
  if (!fileName) {
    fileName = ''
  }
  let options = {
    VIDEO_URL: videoPath,
    VIDEO_TITLE: fileName
  }
  window.toone.GSYPlayer.open(options, successCallback, failCallback)
}

const openVideoPlayerByFileId = function (
  fileID,
  fileName,
  successCallback,
  failCallback
) {
  if (!fileName) {
    fileName = ''
  }
  let videoPath = ''
  if (window.GlobalVariables) {
    if (cordova.platformId == 'android') {
      videoPath =
        cordova.file.externalRootDirectory +
        'path/to/downloads/' +
        fileID +
        fileName.substring(fileName.lastIndexOf('.'), fileName.length) //Android版本地存放地址
    } else {
      videoPath =
        cordova.file.documentsDirectory +
        '/path/to/downloads/' +
        fileID +
        fileName.substring(fileName.lastIndexOf('.'), fileName.length)
    }
  }

  let options = {
    VIDEO_URL: videoPath,
    VIDEO_TITLE: fileName
  }
  window.toone.GSYPlayer.open(options, successCallback, failCallback)
}

const getMediaObj = function () {
  if (window.cordova && window.Media) {
    return window.Media
  }
  return null
}

export { openVideoPlayer, openVideoPlayerByFileId, getMediaObj }
