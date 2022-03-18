import { AlertMessage as alertMessage } from '@v-act/vjs.framework.extension.platform.services.view.ui'

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
  let result
  // 兼容处理
  let useDefault = _parseParam(responseCallBackFunc)
  if (useDefault) {
    alertMessage.confirmDialog('', _toString(content), responseCallBackFunc)
  } else {
    let callback = function (val) {
      if (typeof responseCallBackFunc == 'function') {
        val = !!val
        responseCallBackFunc(val)
      }
    }
    result = isc.confirm(_toString(content), callback)
  }
  return result
}

/**
 * 显示确认提示框
 *
 * @content 确认信息的内容
 * @secDistance 倒计时
 */
let propmtDialog = function (
  content: string,
  responseCallBackFunc: any,
  isUseDefault: boolean,
  secDistance: any
) {
  // 兼容处理
  let useDefault = _parseParam(responseCallBackFunc)
  if (useDefault) {
    alertMessage.propmtDialog(
      '',
      _toString(content),
      responseCallBackFunc,
      secDistance
    )
  } else {
    isc.say(_toString(content), responseCallBackFunc)
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
  // 兼容处理
  let useDefault = _parseParam(responseCallBackFunc)
  if (useDefault) {
    alertMessage.confirmDialog('', _toString(content), responseCallBackFunc)
  } else {
    isc.warn(_toString(content), responseCallBackFunc)
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
  // 兼容处理
  let useDefault = _parseParam(responseCallBackFunc)
  if (useDefault) {
    alertMessage.propmtDialog('', _toString(content), responseCallBackFunc)
  } else {
    isc.warn(_toString(content), responseCallBackFunc)
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
  // 兼容处理
  let useDefault = _parseParam(responseCallBackFunc)
  if (useDefault) {
    useDefault = _parseParam(isUseDefault)
  }
  if (useDefault) {
    alert(content)
    if (typeof responseCallBackFunc == 'function') {
      responseCallBackFunc()
    }
  } else {
    isc.say(_toString(content), responseCallBackFunc)
  }
}

let _toString = function (content: string) {
  return typeof content == 'string' ? content : '' + content
}

let _parseParam = function (param: any) {
  return true
}

export { confirmDialog, propmtDialog, errorDialog, warnDialog, infoDialog }
