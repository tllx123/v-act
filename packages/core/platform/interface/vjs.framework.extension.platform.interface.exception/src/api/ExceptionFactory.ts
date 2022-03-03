import * as undefined from './impl/BusinessException'
import * as undefined from './impl/DialogException'
import * as undefined from './impl/UnLoginException'
import * as undefined from './impl/ExpectedException'
import * as undefined from './impl/UnExpectedException'
import * as undefined from './impl/ExpressionException'
import * as undefined from './impl/ModuleScriptException'
import * as undefined from './impl/NetworkException'
import * as undefined from './impl/ServiceException'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'

let constructors = {}
let undefined

exports.initModule = function (sandbox) {}

/**
 * 异常类型
 * @enum {String}
 */
exports.TYPES = {
  Business: 'BusinessException',
  Dialog: 'DialogException',
  Unlogin: 'UnloginException',
  Expected: 'Expected',
  UnExpected: 'UnExpectedException',
  Expression: 'Expression',
  ModuleScriptException: 'ModuleScriptException',
  Network: 'NetworkException'
}

const create = function (params) {
  let e = params.error
  let message = params.message ? params.message : params.msg
  if (this.isException(e)) {
    e.addStack(message)
    return e
  } else {
    let type = params.type ? params.type : params.exceptionType
    if (message == null)
      message = i18n.get('系统错误', '无异常错误信息时的统一的错误描述信息')
    if (e == null || typeof e == 'boolean') {
      try {
        throw new Error(message)
      } catch (er) {
        e = er
      }
    }
    let constructor = constructors[type] || constructors['UnExpectedException']
    if (type == 'UnExpectedException' && params.from == 'service') {
      constructor = constructors['ServiceException']
    }
    return new constructor(message, e, params)
  }
}

const isException = function (e) {
  if (e && e.handle && typeof e.handle == 'function') {
    return true
  }
  return false
}

export { create, isException }
