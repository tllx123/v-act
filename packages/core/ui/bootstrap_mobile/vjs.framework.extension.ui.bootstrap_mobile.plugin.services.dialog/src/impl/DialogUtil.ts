let sandbox, dialogService

exports.initModule = function (sb) {
  if (sb) {
    sandbox = sb
    dialogService = sandbox.getService(
      'vjs.framework.extension.platform.services.native.mobile.Dialogs'
    )
  }
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let confirmDialog = function (content, responseCallBackFunc, isUseDefault) {
  return dialogService.confirmDialog(content, responseCallBackFunc)
}
/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let propmtDialog = function (content, responseCallBackFunc, isUseDefault) {
  dialogService.propmtDialog(content, responseCallBackFunc)
}
/**
 * 显示错误提示框
 *
 * @content 确认信息的内容
 */
let errorDialog = function (content, responseCallBackFunc, isUseDefault) {
  dialogService.errorDialog(content, responseCallBackFunc)
}
/**
 * 显示警告提示框
 *
 * @content 确认信息的内容
 */
let warnDialog = function (content, responseCallBackFunc, isUseDefault) {
  dialogService.warnDialog(content, responseCallBackFunc)
}
/**
 * 显示信息提示框
 *
 * @content 确认信息的内容
 */
let infoDialog = function (content, responseCallBackFunc, isUseDefault) {
  dialogService.infoDialog(content, responseCallBackFunc)
}

export { confirmDialog, propmtDialog, errorDialog, warnDialog, infoDialog }
