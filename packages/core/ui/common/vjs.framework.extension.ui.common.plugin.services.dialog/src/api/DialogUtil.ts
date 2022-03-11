let sandbox:any

export function initModule(sb:any) {
  sandbox = sb
}

/**
 * 获取运行时对应体系的提示服务
 */
let _getDialogService = function () {
  let service = sandbox.getService(
    'vjs.framework.extension.ui.common.plugin.services.series.Services'
  )
  let dialog = service.getService(
    'vjs.framework.extension.ui.common.plugin.services.dialog.DialogUtilImpl'
  )
  return dialog
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let confirmDialog = function (content:string, responseCallBackFunc:any, isUseDefault:boolean) {
  let dialog = _getDialogService()
  let result = dialog.confirmDialog(content, responseCallBackFunc, isUseDefault)
  return result
}
/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let propmtDialog = function (content:string, responseCallBackFunc:any, isUseDefault:boolean) {
  let dialog = _getDialogService()
  dialog.propmtDialog(content, responseCallBackFunc, isUseDefault)
}
/**
 * 显示错误提示框
 *
 * @content 确认信息的内容
 */
let errorDialog = function (content:string, responseCallBackFunc:any, isUseDefault:boolean) {
  let dialog = _getDialogService()
  dialog.errorDialog(content, responseCallBackFunc, isUseDefault)
}
/**
 * 显示警告提示框
 *
 * @content 确认信息的内容
 */
let warnDialog = function (content:string, responseCallBackFunc:any, isUseDefault:boolean) {
  let dialog = _getDialogService()
  dialog.warnDialog(content, responseCallBackFunc, isUseDefault)
}
/**
 * 显示信息提示框
 *
 * @content 确认信息的内容
 */
let infoDialog = function (content:string, responseCallBackFunc:any, isUseDefault:boolean) {
  let dialog = _getDialogService()
  dialog.infoDialog(content, responseCallBackFunc, isUseDefault)
}

export { confirmDialog, propmtDialog, errorDialog, warnDialog, infoDialog }
