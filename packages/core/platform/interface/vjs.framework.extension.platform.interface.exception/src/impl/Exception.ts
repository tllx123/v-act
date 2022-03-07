import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

import * as exceptionFactory from '../api/ExceptionFactory'

let exceptionManager

/**
 * @namespace Exception
 * @class Exception
 * @desc 异常基础定义
 * @param {Object} message 异常信息
 * @param {Object} e 异常实例
 */
function Exception(message, e) {
  this.constructor.prototype.__proto__ = Error.prototype
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor)
  }
  this.name = this.constructor.name
  this.message = message
  this.error = e
  this.stacks = []
  this.isTiped = false
  if (exceptionFactory.isException(e)) {
    this.handle = e.handle
  }
  this.stacks.push(message)
}

export function initModule(sandbox) {}

Exception.prototype = {
  _putManager: function (manager) {
    exceptionManager = manager
  },

  _beforeHandlers: [],

  _fireBeforeHandlers: function () {
    for (let i = 0, len = this._beforeHandlers.length; i < len; i++) {
      let handler = this._beforeHandlers[i]
      handler.apply(this, [])
    }
  },

  initModule: function (sandbox) {},
  /**
   * 添加堆栈信息
   * @param {String}  stack 堆栈信息
   */
  addStack: function (stack) {
    this.stacks.push(stack)
  },
  /**
   * 注册异常处理前回调
   * ＠param {Function} handler  回调
   */
  onBeforeHandler: function (handler) {
    this._beforeHandlers.push(handler)
  },
  /**
   * 打印异常堆栈信息
   */
  printStackTrace: function () {
    let stackTrace = this.getStackTrace()
    if (window.console && console.log) {
      console.log(stackTrace)
    } else {
      throw Error(stackTrace)
    }
  },

  /**
   * 获取异常堆栈信息
   * @return String
   */
  getStackTrace: function () {
    let stackTrace = []
    let error = this.error ? this.error : this
    let stack = error.stack
    if (typeof stack != 'string') {
      while (stack) {
        stackTrace.push(error.name)
        stackTrace.push(': ')
        stackTrace.push(error.message)
        for (let i = 0; i < stack.length; i++) {
          let frame = stack[i]
          let funcName = frame.getFunctionName()
            ? frame.getFunctionName()
            : '(anonymous function)'
          stackTrace.push('\n    at ')
          stackTrace.push(funcName)
          stackTrace.push(' ')
          stackTrace.push(frame.getScriptNameOrSourceURL())
          stackTrace.push(':')
          stackTrace.push(frame.getLineNumber())
          stackTrace.push(':')
          stackTrace.push(frame.getColumnNumber())
        }
        if (error) {
          let preError = error.error
          stack = preError ? preError.stack : null
        } else {
          stack = null
        }
        error = preError
      }
    } else {
      stackTrace.push(stack)
    }
    stackTrace.concat(this.stacks)
    return stackTrace.join('')
  },

  getClassName: function () {
    return 'Exception'
  },

  _getHandler: function () {
    return exceptionManager._getHandler(this.getClassName())
  },

  markTiped: function () {
    this.isTiped = true
  },

  /**
   * 异常处理
   */
  handle: function () {
    if (!this.isTiped) {
      //一个异常实例只能被处理一次
      this.markTiped()
      this._fireBeforeHandlers()
      let handler = this._getHandler()
      if (handler) {
        handler.apply(this, arguments)
      } else {
        this.handling.apply(this, arguments)
      }
    }
  },

  handling: function () {
    throw this.error
  },

  /**
   * 获取异常信息
   * @return String
   */
  getMessage: function () {
    return this.message
  },

  genExceptionHtml: function () {
    let html =
      '<html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> ' +
      '<title>' +
      i18n.get('错误提示', '异常标题') +
      '</title> <style>  .ebody { font-family: Arial, 宋体, helvertica, sans-serif; font-size: 12px; font-weight: normal; text-align: center; }  ' +
      '.tips_frame { margin: 100px auto; position: absolute; top: 0px; bottom: 0px; left: 0px; right: 0px; } ' +
      '.tips_text { FONT-WEIGHT: bold; FONT-SIZE: 15px; COLOR: #FB7E04; background:url(/itop/exception/images/tips_ico.gif) no-repeat left center; padding-left: 27px; height: 30px; line-height: 30px; display: inline-block; }  ' +
      '.tips_font { FONT-WEIGHT: bold; FONT-SIZE: 13px; COLOR: #FB7E04; margin: 30px 0px 0px 0px; text-align: center; }  ' +
      '.tips_Error { COLOR: #000; margin: 0px; line-height: 30px; } </style> </head> ' +
      '<body class="ebody"> <div class="tips_frame">' +
      ' <div style="width: 400px; margin: 0 auto 10px; text-align: left; padding: 15px; border: 1px solid #aeabd3;"> ' +
      '<span class="tips_text">' +
      i18n.get('错误提示', '异常提示文字') +
      '</span> <div class="tips_font"> </div> ' +
      '<div class="tips_Error"> </div> <textarea rows="5" cols="54" readonly="readonly" style="width:370px;"> ' +
      this.getMessage() +
      ' </textarea> </div> </div> </body> </html>'
    return html
  },

  isInApp: function () {
    return !!window.GlobalVariables
  }
}

Error.prepareStackTrace = function (error, stack) {
  return stack
}

return Exception
export {
  _getHandler,
  create,
  getExceptionHtml,
  handle,
  isException,
  onBeforeHandler,
  onHandleFunction
}
