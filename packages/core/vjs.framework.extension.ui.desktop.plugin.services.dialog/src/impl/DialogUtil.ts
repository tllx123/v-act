let sandbox

export function initModule(sb) {
  sandbox = sb
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let confirmDialog = function (content, responseCallBackFunc, isUseDefault) {
  let result

  let callback = function (val) {
    if (typeof responseCallBackFunc == 'function') {
      val = !!val
      responseCallBackFunc(val)
    }
  }
  result = isc.confirm(_toString(content), callback)

  return result
}
/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 */
let propmtDialog = function (content, responseCallBackFunc, isUseDefault) {
  //直接使用sc的
  isc.say(_toString(content), responseCallBackFunc)
}
/**
 * 显示错误提示框
 *
 * @content 确认信息的内容
 */
let errorDialog = function (content, responseCallBackFunc, isUseDefault) {
  isc.warn(_toString(content), responseCallBackFunc)
}
/**
 * 显示警告提示框
 *
 * @content 确认信息的内容
 */
let warnDialog = function (content, responseCallBackFunc, isUseDefault) {
  isc.warn(_toString(content), responseCallBackFunc)
}
/**
 * 显示信息提示框
 *
 * @content 确认信息的内容
 */
let infoDialog = function (content, responseCallBackFunc, isUseDefault) {
  isc.say(_toString(content), responseCallBackFunc)
}
let _toString = function (content) {
  if (isc.isA.String(content)) {
    return content
  } else {
    return content == null || typeof content == 'undefined' ? '' : '' + content
  }
}

export { confirmDialog, propmtDialog, errorDialog, warnDialog, infoDialog }
