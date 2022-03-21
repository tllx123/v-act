import { AlertMessage as alertMessage } from '@v-act/vjs.framework.extension.platform.services.view.ui'

let sandbox

export function initModule(sb) {
  sandbox = sb
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let confirmDialog = function (
  content: any,
  responseCallBackFunc: any,
  isUseDefault: boolean
) {
  alertMessage.confirmDialog('', _toString(content), responseCallBackFunc)
}
/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 * @secDistance 倒计时
 */
let propmtDialog = function (
  content: any,
  responseCallBackFunc: any,
  isUseDefault: boolean,
  secDistance: any
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
let errorDialog = function (
  content: any,
  responseCallBackFunc: any,
  isUseDefault: boolean
) {
  alertMessage.confirmDialog('', _toString(content), responseCallBackFunc)
}
/**
 * 显示警告提示框
 *
 * @content 确认信息的内容
 */
let warnDialog = function (
  content: any,
  responseCallBackFunc: any,
  isUseDefault: boolean
) {
  alertMessage.propmtDialog('', _toString(content), responseCallBackFunc)
}
/**
 * 显示信息提示框
 *
 * @content 确认信息的内容
 */
let infoDialog = function (
  content: any,
  responseCallBackFunc: any,
  isUseDefault: boolean
) {
  alertMessage.propmtDialog('', _toString(content), responseCallBackFunc)
}

let _toString = function (content: any) {
  return typeof content == 'string' ? content : '' + content
}

export { confirmDialog, propmtDialog, errorDialog, warnDialog, infoDialog }
