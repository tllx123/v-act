exports.initModule = function (sb) {
  let ImagePickerService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.ImagePicker'
  )
  ImagePickerService.putInstance(exports)
}

/**
 * 初始化cordova的图片选择插件，注为全局对象
 * @param {Object} window.imagePicker 图片选择全局调用
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.ImagePicker = window.imagePicker
}

const getPicture = function (successCallback, failCallback, options) {
  window.imagePicker.getPictures(successCallback, failCallback, options)
}

export { getPicture }
