export function initModule(sb) {
  let MediacaptureService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.Mediacapture'
  )
  MediacaptureService.putInstance(exports)
}

/**
 * 初始化cordova的媒体捕获插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Mediacapture = navigator.device.capture
}

const captureVideo = function (successCallback, errorCallback) {
  let captureSuccess = function (mediaFiles) {
    if (typeof successCallback == 'function') {
      successCallback(mediaFiles)
    }
  }

  let captureError = function (error) {
    if (typeof errorCallback == 'function') {
      errorCallback(error)
    }
  }
  navigator.device.capture.captureVideo(captureSuccess, captureError, {
    limit: 1
  })
}

const captureAudio = function (successCallback, errorCallback) {
  let captureSuccess = function (mediaFiles) {
    if (typeof successCallback == 'function') {
      successCallback(mediaFiles)
    }
  }

  let captureError = function (error) {
    if (typeof errorCallback == 'function') {
      errorCallback(error)
    }
  }
  navigator.device.capture.captureAudio(captureSuccess, captureError, {
    limit: 1
  })
}

export { captureVideo, captureAudio }
