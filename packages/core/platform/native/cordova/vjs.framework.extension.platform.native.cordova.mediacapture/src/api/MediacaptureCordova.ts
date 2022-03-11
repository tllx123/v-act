import * as MediacaptureService from '@v-act/vjs.framework.extension.platform.services.native.mobile.Mediacapture'

export function initModule(sb: any) {
  MediacaptureService.putInstance(exports)
}

/**
 * 初始化cordova的媒体捕获插件，注为全局对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.Mediacapture = navigator.device.capture
}

const captureVideo = function (
  successCallback: Function,
  errorCallback: Function
) {
  let captureSuccess = function (mediaFiles: any) {
    if (typeof successCallback == 'function') {
      successCallback(mediaFiles)
    }
  }

  let captureError = function (error: any) {
    if (typeof errorCallback == 'function') {
      errorCallback(error)
    }
  }
  //@ts-ignore
  navigator.device.capture.captureVideo(captureSuccess, captureError, {
    limit: 1
  })
}

const captureAudio = function (
  successCallback: Function,
  errorCallback: Function
) {
  let captureSuccess = function (mediaFiles: any) {
    if (typeof successCallback == 'function') {
      successCallback(mediaFiles)
    }
  }

  let captureError = function (error: any) {
    if (typeof errorCallback == 'function') {
      errorCallback(error)
    }
  }
  //@ts-ignore
  navigator.device.capture.captureAudio(captureSuccess, captureError, {
    limit: 1
  })
}

export { captureAudio, captureVideo }
