import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ExpressionEngine as expEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionContext as expContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import * as utils from './Utils'
import * as paramGener from './ParamGener'
import * as updater from './Updater'
import * as browserDebugger from './BrowserDebugger'
import * as rpcDebugger from './RPCDebugger'
import * as IteratorRequest from './IteratorRequest'
import * as requestManager from './IteratorRequestManager'
import * as DebugInfoManager from './DebugInfoManager'

let undefined
let undefined
let undefined
let undefined
exports.initModule = function (sb) {
  browserDebugger._putAop(exports)
  rpcDebugger._putAop(exports)
  IteratorRequest.prototype._putAop(exports)
}

let remoteHost,
  enable = true,
  currentRouteContext

/**
 *是否处于debug模式
 */
let inDebug = function () {
  if (enable) {
    return browserDebugger.getHook()
      ? true
      : !!remoteHost || !!environment.getDebugPort()
  }
  return false
}

/**
 * 获取开发系统调试标识id
 * */
let getDevId = function () {
  return environment.getDevId()
}

/**
 * 获取开发系统注入逻辑
 */
let getDevHook = function () {
  let hook = browserDebugger.getHook()
  //优先使用本地
  return hook ? hook : rpcDebugger.getHook()
}

const beforeRuleExecute = function (ruleSetCode, ruleCode, routeContext) {
  if (inDebug()) {
    //这里判断初始化，获取初始化的调试信息，如果没有，向服务器请求调试信息
    if (!DebugInfoManager.isInited()) {
      let devId = getDevId()
      DebugInfoManager.init(devId)
    }
    currentRouteContext = routeContext
    let componentCode = utils.getComponentCode()
    let windowCode = utils.isWindowScope() ? utils.getWindowCode() : null
    //判断该规则需不需要调试
    if (
      DebugInfoManager.isDebugger(
        componentCode,
        windowCode,
        ruleSetCode,
        ruleCode
      )
    ) {
      let hook = getDevHook(),
        params = exports.getBusinessData()
      //该规则需要调试，进入调试
      hook.beforeRuleExecute(
        componentCode,
        windowCode,
        ruleSetCode,
        ruleCode,
        jsonUtil.obj2json(params)
      )
      currentRouteContext = null
    } else {
      // 该规则不用调试，什么也不做
    }
  }
}

const getBusinessData = function () {
  let routeContext = exports._getCurrentRouteContext()
  return paramGener.genParams(routeContext)
}

const ruleExecuted = function (ruleSetCode, ruleCode, routeContext) {
  if (inDebug()) {
    currentRouteContext = routeContext
    let hook = getDevHook(),
      params = exports.getBusinessData()
    let componentCode = utils.getComponentCode()
    let windowCode = utils.isWindowScope() ? utils.getWindowCode() : null

    if (
      DebugInfoManager.isDebugger(
        componentCode,
        windowCode,
        ruleSetCode,
        ruleCode
      )
    ) {
      //该规则需要调试
      hook.ruleExecuted(
        componentCode,
        windowCode,
        ruleSetCode,
        ruleCode,
        jsonUtil.obj2json(params)
      )
      currentRouteContext = null
    } else {
      // 该规则不用调试，什么也不做
    }
  }
}

const startServerRuleDebugger = function (data) {
  if (inDebug()) {
    let rq = new IteratorRequest(data)
    //拿到唯一的uuid，作为标识符
    return requestManager.addRequest(rq)
  }
  return null
}

const stopServerRuleDebugger = function (debuggerId) {
  if (inDebug()) {
    requestManager.remove(debuggerId)
  }
}

const update = function (
  componentCode,
  windowCode,
  ruleSetCode,
  ruleCode,
  json
) {
  let data = jsonUtil.json2obj(json)
  let routeContext = exports._getCurrentRouteContext()
  updater.update(data, routeContext)
}

const exeExp = function (expression) {
  let expCtx = new expContext()
  expCtx.setRouteContext(exports._getCurrentRouteContext())
  return !!expEngine.execute({ expression: expression, context: expCtx })
}

const setRemoteDebugHost = function (host, callback) {
  let hook = rpcDebugger.getHook()
  let cb = function (rs) {
    if (rs) {
      remoteHost = host
    }
    if (callback) {
      callback(rs)
    }
  }
  hook.testRemote(host, cb)
}

//TODO
window.V3PlatformDebugger = {}
V3PlatformDebugger.setRemoteDebugHost = exports.setRemoteDebugHost

const isEnable = function () {
  return enable
}

const markDebugDisable = function () {
  enable = false
}

const markDebugEnable = function () {
  enable = true
}

const _getRemoteDebugHost = function () {
  if (!!remoteHost) {
    return remoteHost
  } else {
    remoteHost = 'http://127.0.0.1:' + environment.getDebugPort()
    return remoteHost
  }
}

const _getCurrentRouteContext = function () {
  return currentRouteContext
}

const getDevId = function () {
  return environment.getDevId()
}

export {
  _putAop,
  getHook,
  isInited,
  init,
  isDebugger,
  update,
  clear,
  addRequest,
  remove,
  genParams,
  _putAop,
  getHook,
  update,
  getComponentCode,
  getWindowCode,
  isWindowScope,
  getDevHook,
  beforeRuleExecute,
  getBusinessData,
  ruleExecuted,
  startServerRuleDebugger,
  stopServerRuleDebugger,
  update,
  exeExp,
  setRemoteDebugHost,
  isEnable,
  markDebugDisable,
  markDebugEnable,
  _getRemoteDebugHost,
  _getCurrentRouteContext,
  getDevId
}
