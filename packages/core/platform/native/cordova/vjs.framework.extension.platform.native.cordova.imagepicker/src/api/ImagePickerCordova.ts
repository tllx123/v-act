import * as ImagePickerService from 'vjs.framework.extension.platform.services.native.mobile.ImagePicker'

export function initModule(sb: any) {
  ImagePickerService.putInstance(exports)
}

/**
 * 初始化cordova的图片选择插件，注为全局对象
 * @param {Object} window.imagePicker 图片选择全局调用
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.ImagePicker = window.imagePicker
}

const getPicture = function (
  successCallback: Function,
  failCallback: Function,
  options: Record<string, any>
) {
  //@ts-ignore
  window.imagePicker.getPictures(successCallback, failCallback, options)
}

export { getPicture }
