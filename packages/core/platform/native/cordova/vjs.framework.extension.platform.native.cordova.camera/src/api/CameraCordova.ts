export function initModule(sb) {
  let CameraService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.Camera'
  )
  CameraService.putInstance(exports)
}

/**
 * 初始化cordova的拍照插件，注为全局对象
 * @param {Object} navigator.camera 全局调用对象
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Camera = navigator.camera
}

const getPicture = function (successCallback, errorCallback, options) {
  if (!options) {
    let options = {}
    options.quality = 50
    options.destinationType = Camera.DestinationType.FILE_URI
    options.sourceType = Camera.PictureSourceType.CAMERA
    options.targetWidth = 0
    options.targetHeight = 0
    options.encodingType = Camera.EncodingType.JPEG
    options.mediaType = Camera.MediaType.PICTURE
    options.allowEdit = false
    options.correctOrientation = true
    options.saveToPhotoAlbum = false
  }
  navigator.camera.getPicture(onSuccess, onFail, options)

  function onSuccess(imageURI) {
    if (isFunction(successCallback)) {
      successCallback(imageURI)
    }
  }

  function onFail(message) {
    if (isFunction(errorCallback)) {
      errorCallback(message)
    }
  }
}

function isFunction(arg) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}
export { getPicture }
