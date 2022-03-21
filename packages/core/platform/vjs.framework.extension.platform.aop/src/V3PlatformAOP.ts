import {
  ExpressionContext as expContext,
  ExpressionEngine as expEngine
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

import * as browserDebugger from './BrowserDebugger'
import * as DebugInfoManager from './DebugInfoManager'
import IteratorRequest from './IteratorRequest'
import * as requestManager from './IteratorRequestManager'
import * as paramGener from './ParamGener'
import * as rpcDebugger from './RPCDebugger'
import * as updater from './Updater'
import * as utils from './Utils'

let remoteHost: any,
  enable = true,
  currentRouteContext: any

class V3PlatformAOP {
  /**
   *是否处于debug模式
   */
  inDebug() {
    if (enable) {
      return browserDebugger.getHook()
        ? true
        : !!remoteHost || !!environment.getDebugPort()
    }
    return false
  }

  /**
   * 获取开发系统注入逻辑
   */
  getDevHook() {
    let hook = browserDebugger.getHook()
    //优先使用本地
    return hook ? hook : rpcDebugger.getHook()
  }

  beforeRuleExecute(ruleSetCode: string, ruleCode: string, routeContext: any) {
    if (this.inDebug()) {
      //这里判断初始化，获取初始化的调试信息，如果没有，向服务器请求调试信息
      if (!DebugInfoManager.isInited()) {
        let devId = this.getDevId()
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
        let hook = this.getDevHook(),
          params = this.getBusinessData()
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

  _getCurrentRouteContext() {
    return currentRouteContext
  }

  getBusinessData() {
    let routeContext = this._getCurrentRouteContext()
    return paramGener.genParams(routeContext)
  }

  ruleExecuted(ruleSetCode: string, ruleCode: string, routeContext: any) {
    if (this.inDebug()) {
      currentRouteContext = routeContext
      let hook = this.getDevHook(),
        params = this.getBusinessData()
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

  startServerRuleDebugger(data: any) {
    if (this.inDebug()) {
      let rq = new IteratorRequest(data)
      //拿到唯一的uuid，作为标识符
      return requestManager.addRequest(rq)
    }
    return null
  }

  stopServerRuleDebugger(debuggerId: string) {
    if (this.inDebug()) {
      requestManager.remove(debuggerId)
    }
  }

  update(
    componentCode: string,
    windowCode: string,
    ruleSetCode: string,
    ruleCode: string,
    json: string
  ) {
    let data = jsonUtil.json2obj(json)
    let routeContext = this._getCurrentRouteContext()
    updater.update(data, routeContext)
  }

  exeExp(expression: any) {
    let expCtx = new expContext()
    expCtx.setRouteContext(this._getCurrentRouteContext())
    return !!expEngine.execute({ expression: expression, context: expCtx })
  }
  setRemoteDebugHost(host: any, callback: any) {
    let hook = rpcDebugger.getHook()
    let cb = function (rs: any) {
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
  // if (typeof window != 'undefined') {
  //   let V3PlatformDebugger:{[code:string]:any} = {}
  //   V3PlatformDebugger.setRemoteDebugHost = setRemoteDebugHost
  // }

  isEnable() {
    return enable
  }

  markDebugDisable() {
    enable = false
  }

  markDebugEnable() {
    enable = true
  }

  getRemoteDebugHost = function () {
    if (!!remoteHost) {
      return remoteHost
    } else {
      remoteHost = 'http://127.0.0.1:' + environment.getDebugPort()
      return remoteHost
    }
  }
  getCurrentRouteContext() {
    return currentRouteContext
  }

  getDevId() {
    return environment.getDevId()
  }
}
browserDebugger._putAop(V3PlatformAOP)
rpcDebugger._putAop(V3PlatformAOP)
IteratorRequest.prototype._putAop(V3PlatformAOP)
export default V3PlatformAOP
