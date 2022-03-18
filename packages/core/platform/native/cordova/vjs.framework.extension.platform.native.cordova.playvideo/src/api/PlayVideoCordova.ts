import { PlayVideo as PlayVideoService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.playvideo'

export function initModule(sb: any) {
  PlayVideoService.putInstance(exports)
}

const openVideoPlayer = function (
  videoPath: string,
  fileName: string,
  successCallback: Function,
  failCallback: Function
) {
  if (!fileName) {
    fileName = ''
  }
  let options = {
    VIDEO_URL: videoPath,
    VIDEO_TITLE: fileName
  }
  //@ts-ignore
  window.toone.GSYPlayer.open(options, successCallback, failCallback)
}

const openVideoPlayerByFileId = function (
  fileID: string,
  fileName: string,
  successCallback: Function,
  failCallback: Function
) {
  if (!fileName) {
    fileName = ''
  }
  let videoPath = ''
  //@ts-ignore
  if (window.GlobalVariables) {
    //@ts-ignore
    if (cordova.platformId == 'android') {
      videoPath =
        //@ts-ignore
        cordova.file.externalRootDirectory +
        'path/to/downloads/' +
        fileID +
        fileName.substring(fileName.lastIndexOf('.'), fileName.length) //Android版本地存放地址
    } else {
      videoPath =
        //@ts-ignore
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
  //@ts-ignore
  window.toone.GSYPlayer.open(options, successCallback, failCallback)
}

const getMediaObj = function () {
  //@ts-ignore
  if (window.cordova && window.Media) {
    //@ts-ignore
    return window.Media
  }
  return null
}

export { getMediaObj, openVideoPlayer, openVideoPlayerByFileId }
