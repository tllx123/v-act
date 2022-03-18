let sandbox

export function initModule(sb: any) {
  sandbox = sb
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let confirmDialog = function (
  content: string,
  responseCallBackFunc: any,
  isUseDefault: boolean
) {
  let result = confirm(content)
  if (typeof responseCallBackFunc == 'function') {
    responseCallBackFunc(result)
  }
  return result
}
/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let propmtDialog = function (
  content: string,
  responseCallBackFunc: any,
  isUseDefault: boolean
) {
  alert(content)
  if (typeof responseCallBackFunc == 'function') {
    responseCallBackFunc()
  }
}
/**
 * 显示错误提示框
 *
 * @content 确认信息的内容
 */
let errorDialog = function (
  content: string,
  responseCallBackFunc: any,
  isUseDefault: boolean
) {
  alert(content)
  if (typeof responseCallBackFunc == 'function') {
    responseCallBackFunc()
  }
}
/**
 * 显示警告提示框
 *
 * @content 确认信息的内容
 */
let warnDialog = function (
  content: string,
  responseCallBackFunc: any,
  isUseDefault: boolean
) {
  alert(content)
  if (typeof responseCallBackFunc == 'function') {
    responseCallBackFunc()
  }
}
/**
 * 显示信息提示框
 *
 * @content 确认信息的内容
 */
let infoDialog = function (
  content: string,
  responseCallBackFunc: any,
  isUseDefault: boolean
) {
  alert(content)
  if (typeof responseCallBackFunc == 'function') {
    responseCallBackFunc()
  }
}

export { confirmDialog, propmtDialog, errorDialog, warnDialog, infoDialog }
