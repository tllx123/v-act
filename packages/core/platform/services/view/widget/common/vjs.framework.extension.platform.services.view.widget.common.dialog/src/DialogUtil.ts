import { DialogUtil as dialog } from '@v-act/vjs.framework.extension.platform.services.view.widget.smartclient.dialog'

let sb

export function initModule(sandbox) {
  sb = sandbox
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let confirmDialog = function (content, responseCallBackFunc, isUseDefault) {
  let result = dialog.confirmDialog(content, responseCallBackFunc, isUseDefault)
  return result
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 * @secDistance 倒计时
 */
let propmtDialog = function (
  content,
  responseCallBackFunc,
  isUseDefault,
  secDistance
) {
  dialog.propmtDialog(content, responseCallBackFunc, isUseDefault, secDistance)
}

/**
 * 显示错误提示框
 *
 * @content 确认信息的内容
 */
let errorDialog = function (content, responseCallBackFunc, isUseDefault) {
  dialog.errorDialog(content, responseCallBackFunc, isUseDefault)
}

/**
 * 显示警告提示框
 *
 * @content 确认信息的内容
 */
let warnDialog = function (content, responseCallBackFunc, isUseDefault) {
  dialog.warnDialog(content, responseCallBackFunc, isUseDefault)
}

/**
 * 显示信息提示框
 *
 * @content 确认信息的内容
 */
let infoDialog = function (content, responseCallBackFunc, isUseDefault) {
  dialog.infoDialog(content, responseCallBackFunc, isUseDefault)
}

export { confirmDialog, errorDialog, infoDialog, propmtDialog, warnDialog }
