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
  let result
  // 兼容处理
  let useDefault = _parseParam(responseCallBackFunc)
  if (useDefault) {
    useDefault = _parseParam(isUseDefault)
  }
  // 由于SC的是异步触发，无法阻塞，暂时使用原生的
  if (useDefault) {
    result = confirm(content)
    if (typeof responseCallBackFunc == 'function') {
      responseCallBackFunc(result)
    }
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
 */
let propmtDialog = function (content, responseCallBackFunc, isUseDefault) {
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
/**
 * 显示错误提示框
 *
 * @content 确认信息的内容
 */
let errorDialog = function (content, responseCallBackFunc, isUseDefault) {
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
    isc.warn(_toString(content), responseCallBackFunc)
  }
}
/**
 * 显示警告提示框
 *
 * @content 确认信息的内容
 */
let warnDialog = function (content, responseCallBackFunc, isUseDefault) {
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
    isc.warn(_toString(content), responseCallBackFunc)
  }
}
/**
 * 显示信息提示框
 *
 * @content 确认信息的内容
 */
let infoDialog = function (content, responseCallBackFunc, isUseDefault) {
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
let _toString = function (content) {
  if (isc.isA.String(content)) {
    return content
  } else {
    return content == null || typeof content == 'undefined' ? '' : '' + content
  }
}
let _parseParam = function (param) {
  // 直接使用默认提示
  return true
  // return typeof(param)=="boolean" ? param:true;
}

export { confirmDialog, propmtDialog, errorDialog, warnDialog, infoDialog }
