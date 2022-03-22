import { Platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { jsonUtil as jsonUtils } from '@v-act/vjs.framework.extension.util.jsonutil'

import BusinessException from '../impl/BusinessException'
import ConfigException from '../impl/ConfigException'
import DevException from '../impl/DevException'
import ExpectedException from '../impl/ExpectedException'
import SystemException from '../impl/SystemException'
import UnLoginException from '../impl/UnLoginException'

let constructors = {
  BusinessException,
  ConfigException,
  DevException,
  ExpectedException,
  SystemException,
  UnLoginException
}

/**
 * 异常类型
 * @enum {String}
 */
const TYPES = {
  Business: 'BusinessException',
  Unlogin: 'UnloginException',
  Expected: 'Expected',
  Config: 'ConfigException',
  Dev: 'DevException',
  System: 'SystemException',
  //以下异常类型全部废弃，废弃的类型统一在create接口转成System，只是为了兼容才不删
  Dialog: 'DialogException',
  UnExpected: 'UnExpectedException',
  Expression: 'Expression',
  ModuleScriptException: 'ModuleScriptException',
  Network: 'NetworkException'
}

const create = function (params: {
  error?: any
  message?: string
  msg?: string
  type?: string
  exceptionDatas: Array<any>
}) {
  let e = params.error
  let message = params.message ? params.message : params.msg
  let exceptionDatas = params.exceptionDatas || []
  let info = params.info
  //是否是前端错误
  if (isException(e)) {
    e.addStack(message)
    let pre = (e.getDetailInfo && e.getDetailInfo()) || []
    let map = {}
    for (let i = 0, len = pre.length; i < len; i++) {
      let ed = pre[i]
      map[ed.code] = ed
    }
    for (let i = 0, len = exceptionDatas.length; i < len; i++) {
      let ed = exceptionDatas[i]
      if (!map.hasOwnProperty(ed.code)) {
        pre.push(ed)
      }
    }
    e.errInfo = {
      causedby: {
        errorMsg: message
      },
      exceptionDatas: pre
    }
    return e
  } else {
    let type
    if (params.exceptionType == 'LoginException') {
      /* 服务端未登录异常转前台未登录类型 */
      type = TYPES.Unlogin
    } else if (
      params.data &&
      params.data.errorDetail &&
      params.data.errorDetail.errorCategory
    ) {
      /* 优先从详情信息获取异常类型 */
      type = params.data.errorDetail.errorCategory
    } else {
      /* 一般属于前台创建的异常，入参第一层直接传递异常类型， 以前没定规范，有的传type，有的传exceptionType，此处作兼容 */
      type = params.type || params.exceptionType
    }
    //            var type = params.data && params.data.errorDetail && params.data.errorDetail.errorCategory ? params.data.errorDetail.errorCategory : (params.type || params.exceptionType);
    if (!isAcceptType(type)) {
      //未识别异常统一处理成系统异常Task20210201012
      type = 'SystemException'
    }
    if (message == null)
      message = i18n.get('系统错误', '无异常错误信息时的统一的错误描述信息')
    if (e == null || typeof e == 'boolean') {
      try {
        throw new Error(message, undefined, undefined, type)
      } catch (er) {
        e = er
      }
    }
    let constructor = constructors[type] || constructors['SystemException']
    //            if (type == "UnExpectedException" && params.from == "service") {
    //                constructor = constructors["ServiceException"];
    //            }
    if (!params) {
      params = {
        data: {
          causedby: getCausedby(params)
        }
      }
    } else if (!params.data) {
      params.data = {
        causedby: getCausedby(params)
      }
    } else if (!params.data.causedby) {
      params.data.causedby = getCausedby(params)
    }
    params.data.exceptionDatas = exceptionDatas
    return new constructor(message, e, params.data)
  }
}

let getCausedby = function (params) {
  return {
    errorMsg: params.detail || params.message || params.error,
    errorTime: new Date().toLocaleString()
  }
}

const isException = function (e) {
  if (e && e.handle && typeof e.handle == 'function') {
    return true
  }
  return false
}

const isAcceptType = function (type) {
  if (
    type &&
    (type == TYPES.Business ||
      type == TYPES.Unlogin ||
      type == TYPES.Config ||
      type == TYPES.Dev ||
      type == TYPES.System)
  ) {
    return true
  }
  return false
}

const genError = function (msg, type) {
  let error = new Error(msg)
  error.__ExceptionType__ = type
  return error
}

const getExceptionTypeByError = function (error, defaultType) {
  if (error && error.__ExceptionType__) {
    return error.__ExceptionType__
  }
  return defaultType || undefined
}

const unSerialize = function (json) {
  if (!json) {
    return null
  }
  json = jsonUtils.json2obj(json)
  let message = json.message
  let type = json.name
  let error = new Error(message, undefined, undefined, type)
  let constructor = constructors[type] || constructors['SystemException']
  return new constructor(message, error, json.errInfo, json)
}

export {
  create,
  genError,
  getExceptionTypeByError,
  isAcceptType,
  isException,
  TYPES,
  unSerialize
}
