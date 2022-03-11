import * as FileopenService from '@v-act/vjs.framework.extension.platform.services.native.mobile.Fileopen'
import * as dialogUtil from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog.DialogUtil'

export function initModule(sb: any) {
  FileopenService.putInstance(exports)
}

/**
 * 初始化文件转换，注为全局对象
 *@param {Object}  cordova.plugins.fileOpener2 全局调用对象
 *
 */
//@ts-ignore
if (window.VJSBridge) {
  //@ts-ignore
  window.VJSBridge.plugins.vplatform.Fileopen = cordova.plugins.fileOpener2
}

const fileopen = function (filePath: string, mime: any) {
  //@ts-ignore
  cordova.plugins.fileOpener2.open(filePath, mime, {
    error: function (e: any) {
      dialogUtil.propmtDialog(e.message, null, false)
    },
    success: function (success: any) {}
  })
}

export { fileopen }
