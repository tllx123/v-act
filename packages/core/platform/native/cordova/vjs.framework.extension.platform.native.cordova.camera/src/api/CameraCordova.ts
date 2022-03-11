import { Camera as CameraService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.camera'

export function initModule(sb: any) {
  CameraService.putInstance(exports)
}

/**
 * 初始化cordova的拍照插件，注为全局对象
 * @param {Object} navigator.camera 全局调用对象
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.Camera = navigator.camera
}

const getPicture = function (
  successCallback: Function,
  errorCallback: Function,
  options: Record<string, any>
) {
  options = options
    ? options
    : {
        quality: 50,
        //@ts-ignore
        destinationType: Camera.DestinationType.FILE_URI,
        //@ts-ignore
        sourceType: Camera.PictureSourceType.CAMERA,
        targetWidth: 0,
        targetHeight: 0,
        //@ts-ignore
        encodingType: Camera.EncodingType.JPEG,
        //@ts-ignore
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true,
        saveToPhotoAlbum: false
      }

  /* if (!options) {
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
  } */
  //@ts-ignore
  navigator.camera.getPicture(onSuccess, onFail, options)

  function onSuccess(imageURI: string) {
    if (isFunction(successCallback)) {
      successCallback(imageURI)
    }
  }

  function onFail(message: string) {
    if (isFunction(errorCallback)) {
      errorCallback(message)
    }
  }
}

function isFunction(arg: any) {
  if (typeof arg == 'function') {
    return true
  }
  return false
}
export { getPicture }
