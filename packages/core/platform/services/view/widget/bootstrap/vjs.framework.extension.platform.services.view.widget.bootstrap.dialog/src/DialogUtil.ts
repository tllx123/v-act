import { AlertMessage as alertMessage } from '@v-act/vjs.framework.extension.platform.services.view.ui'

let sandbox

exports.initModule = function (sb) {
  sandbox = sb
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let confirmDialog = function (content, responseCallBackFunc, isUseDefault) {
  alertMessage.confirmDialog('', _toString(content), responseCallBackFunc)
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
  alertMessage.propmtDialog(
    '',
    _toString(content),
    responseCallBackFunc,
    secDistance
  )
}
/**
 * 显示错误提示框
 *
 * @content 确认信息的内容
 */
let errorDialog = function (content, responseCallBackFunc, isUseDefault) {
  alertMessage.confirmDialog('', _toString(content), responseCallBackFunc)
}
/**
 * 显示警告提示框
 *
 * @content 确认信息的内容
 */
let warnDialog = function (content, responseCallBackFunc, isUseDefault) {
  alertMessage.propmtDialog('', _toString(content), responseCallBackFunc)
}
/**
 * 显示信息提示框
 *
 * @content 确认信息的内容
 */
let infoDialog = function (content, responseCallBackFunc, isUseDefault) {
  alertMessage.propmtDialog('', _toString(content), responseCallBackFunc)
}

let _toString = function (content) {
  return typeof content == 'string' ? content : '' + content
}

export { confirmDialog, propmtDialog, errorDialog, warnDialog, infoDialog }
