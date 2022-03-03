exports.initModule = function (sb) {
  let FileopenService = sb.getService(
    'vjs.framework.extension.platform.services.native.mobile.Fileopen'
  )
  let dialogUtil = sb.getService(
    'vjs.framework.extension.platform.services.view.widget.common.dialog.DialogUtil'
  )
  FileopenService.putInstance(exports)
}

/**
 * 初始化文件转换，注为全局对象
 *@param {Object}  cordova.plugins.fileOpener2 全局调用对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Fileopen = cordova.plugins.fileOpener2
}

const fileopen = function (filePath, mime) {
  cordova.plugins.fileOpener2.open(filePath, mime, {
    error: function (e) {
      dialogUtil.propmtDialog(e.message, null, false)
    },
    success: function (success) {}
  })
}

export { fileopen }
