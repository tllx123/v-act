import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import {
  RouteContext,
  RuleContext
} from '@v-act/vjs.framework.extension.platform.interface.route'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { cookieUtil } from '@v-act/vjs.framework.extension.platform.services.domain.cookie'

import * as dataManager from './DataManager'
import TimePoint from './TimePoint'

let splitChar = '$_$',
  startFlag = false
let OpenMonitor = 'OpenConsumingTimeMonitor'

let isEnable = function () {
  return startFlag
}

/**
 * 获取路由上下文的时间点
 * */
let _getRouteTimePoint = function (routeContext: RouteContext, type: number) {
  let info: Record<string, any> = {}
  let scopeId: string = routeContext.getScopeId() || ''
  if (!scopeId) scopeId = scopeManager.getCurrentScopeId() || ''
  info.scopeId = scopeId
  info.parentScopeId = scopeManager.getParentScopeId(scopeId)
  let scope = scopeManager.getScope(scopeId)
  info.componentCode = scope.getComponentCode()
  if (scopeManager.isWindowScope(scopeId)) {
    info.windowCode = scope.getWindowCode()
  }
  let routeCfg = routeContext.getRouteConfig()
  let funCode
  if (routeCfg) {
    funCode = routeCfg && routeCfg.getCode()
  }
  info.funCode = funCode
  let monitorSign = routeContext._monitorSign
  info.key = monitorSign
  info.type = type
  info.series = TimePoint.Series.Route
  let parentRule = routeContext.getParentRuleContext()
  if (
    parentRule &&
    !parentRule.getRouteContext().isVirtual &&
    parentRule._monitorSign
  ) {
    info.parentKey = parentRule._monitorSign
  }
  return new TimePoint(info)
}

let _getRuleTimePoint = function (ruleContext: RuleContext, type: number) {
  let rr = ruleContext.getRouteContext()
  if (rr.isVirtual) {
    //虚拟路由里面的规则不作显示
    return null
  }
  let info: Record<string, any> = {}
  info.key = ruleContext._monitorSign
  let monitorSign = rr._monitorSign
  if (monitorSign) info.parentKey = monitorSign
  let scopeId = scopeManager.getCurrentScopeId() || ''
  info.scopeId = scopeId
  let scope = scopeManager.getScope()
  info.componentCode = scope.getComponentCode()
  if (scopeManager.isWindowScope(scopeId)) {
    info.winCode = scope.getWindowCode()
  }
  let routeCfg = rr.getRouteConfig()
  info.funCode = routeCfg.getCode()
  let ruleCfg = ruleContext.getRuleCfg()
  info.ruleCode = ruleCfg.ruleCode
  info.ruleName = ruleCfg.instanceName
  info.ruleInstanceCode = ruleCfg.instanceCode
  info.type = type
  info.series = TimePoint.Series.Rule
  return new TimePoint(info)
}
/**
 * 获取窗体相关的时间点
 * */
let _getWindowTimePoint = function (
  scopeId: string,
  type: number,
  uuid: string
) {
  let scope = scopeManager.getScope(scopeId)
  let componentCode = scope.getComponentCode()
  let winCode = scope.getWindowCode()
  return new TimePoint({
    componentCode: componentCode,
    windowCode: winCode,
    key: uuid,
    type: type,
    series: TimePoint.Series.Window
  })
}
/**
 * 获取构件相关的时间点
 * */
let _getComponentTimePoint = function (
  scopeId: string,
  type: number,
  uuid: string
) {
  let scope = scopeManager.getScope(scopeId)
  let componentCode = scope.getComponentCode()
  return new TimePoint({
    componentCode: componentCode,
    key: uuid,
    type: type,
    series: TimePoint.Series.Component
  })
}

/**
 * 获取rpc相关的时间点
 * */
let _getRPCTimePoint = function (request: any, type: number, uuid: string) {
  let operations = request.getOperations()
  let operationList = []
  let componentCode = null
  let winCode = null
  let rpcCode = null
  if (operations && operations.length > 0) {
    for (let i = 0, l = operations.length; i < l; i++) {
      let operation = operations[i]
      componentCode = operation.getComponentCode()
      winCode = operation.getWindowCode()
      let operationCode
      let params = operation.getParams()
      if (params.hasOwnProperty('ruleSetCode')) {
        operationCode = params['ruleSetCode']
      } else if (params.hasOwnProperty('transaction_action')) {
        operationCode = params['transaction_action']
      } else {
        operationCode = operation.getOperation()
      }
      if (operationCode && operationList.indexOf(operationCode) == -1) {
        operationList.push(operationCode)
      }
    }
    rpcCode = operationList.join(',')
  }
  return new TimePoint({
    componentCode: componentCode,
    windowCode: winCode,
    rpcCode: rpcCode,
    key: uuid,
    type: type,
    series: TimePoint.Series.Network
  })
}

/**
 * 监控状态是否开启
 * */
let isOpenMonitor = function () {
  let isOpen = cookieUtil.vcookie({
    name: OpenMonitor
  })
  return isOpen == 'open' ? true : false
}

/**
 * 方法执行前
 */
let beforeRouteExe = function (rr: RouteContext) {
  if (isOpenMonitor()) {
    let time = _getRouteTimePoint(rr, TimePoint.Types.BeforeRouteExe)
    dataManager.add(time)
  }
}

/**
 * 方法执行后
 */
let afterRouteExe = function (rr: RouteContext) {
  if (isOpenMonitor()) {
    let monitorSign = rr._monitorSign
    if (monitorSign) {
      if (rr._isInnerRoute) {
        //删除对应的方法执行前时间点
        dataManager.remove(monitorSign)
      } else {
        if (!rr.isVirtual && rr._monitorSign) {
          let time = _getRouteTimePoint(rr, TimePoint.Types.AfterRouteExe)
          dataManager.add(time)
        }
      }
    }
  }
}

let _isBusinessRule = function (ruleContext: RuleContext) {
  let ruleInstance = ruleContext.getRuleCfg()
  return ruleInstance.hasOwnProperty('transactionType')
}

let beforeRuleExe = function (ruleContext: RuleContext) {
  if (isOpenMonitor()) {
    if (_isBusinessRule(ruleContext)) {
      let time = _getRuleTimePoint(ruleContext, TimePoint.Types.BeforeRuleExe)
      if (time) dataManager.add(time)
    } else {
      let routeContext = ruleContext.getRouteContext()
      routeContext._isInnerRoute = true
    }
  }
}

let afterRuleExe = function (ruleContext: RuleContext) {
  if (isOpenMonitor()) {
    if (_isBusinessRule(ruleContext)) {
      let time = _getRuleTimePoint(ruleContext, TimePoint.Types.AfterRuleExe)
      if (time) dataManager.add(time)
    }
  }
}

let beforeWindowLoad = function (scopeId: string, uuid: string) {
  if (isOpenMonitor()) {
    let time = _getWindowTimePoint(
      scopeId,
      TimePoint.Types.BeforeWindowLoad,
      uuid
    )
    dataManager.add(time)
  }
}

let afterWindowLoad = function (scopeId: string, uuid: string) {
  if (isOpenMonitor()) {
    let time = _getWindowTimePoint(
      scopeId,
      TimePoint.Types.AfterWindowLoad,
      uuid
    )
    dataManager.add(time)
  }
}

let beforeWindowRender = function (scopeId: string, uuid: string) {
  if (isOpenMonitor()) {
    let time = _getWindowTimePoint(
      scopeId,
      TimePoint.Types.BeforeWindowRender,
      uuid
    )
    dataManager.add(time)
  }
}

let afterWindowRender = function (scopeId: string, uuid: string) {
  if (isOpenMonitor()) {
    let time = _getWindowTimePoint(
      scopeId,
      TimePoint.Types.AfterWindowRender,
      uuid
    )
    dataManager.add(time)
  }
}

let beforeWindowInit = function (scopeId: string, uuid: string) {
  if (isOpenMonitor()) {
    let time = _getWindowTimePoint(
      scopeId,
      TimePoint.Types.BeforeWindowInit,
      uuid
    )
    dataManager.add(time)
  }
}

let afterWindowInit = function (scopeId: string, uuid: string) {
  if (isOpenMonitor()) {
    let time = _getWindowTimePoint(
      scopeId,
      TimePoint.Types.AfterWindowInit,
      uuid
    )
    dataManager.add(time)
  }
}

let beforeComponentInit = function (scopeId: string, uuid: string) {
  if (isOpenMonitor()) {
    let time = _getComponentTimePoint(
      scopeId,
      TimePoint.Types.BeforeComponentInit,
      uuid
    )
    dataManager.add(time)
  }
}

let afterComponentInit = function (scopeId: string, uuid: string) {
  if (isOpenMonitor()) {
    let time = _getComponentTimePoint(
      scopeId,
      TimePoint.Types.AfterComponentInit,
      uuid
    )
    dataManager.add(time)
  }
}

let beforeRPC = function (request: any, uuid: string) {
  if (isOpenMonitor()) {
    let time = _getRPCTimePoint(request, TimePoint.Types.BeforeRPC, uuid)
    dataManager.add(time)
  }
}

let afterRPC = function (request: any, uuid: string) {
  if (isOpenMonitor()) {
    let time = _getRPCTimePoint(request, TimePoint.Types.AfterRPC, uuid)
    dataManager.add(time)
  }
}

/**
 * 开启监控
 * */
let openMonitor = function () {
  cookieUtil.vcookie({
    name: OpenMonitor,
    value: 'open'
  })
}

/**
 * 关闭监控
 * */
let closeMonitor = function () {
  cookieUtil.vcookie({
    name: OpenMonitor,
    value: 'close'
  })
}

const doStart = function () {
  //删除已组装的数据
  dataManager.clearTreeData()
  openMonitor()
}

const doStop = function () {
  //删除已组装的数据
  dataManager.clearTreeData()
  closeMonitor()
}

const doClear = function () {
  closeMonitor()
  dataManager.clear()
}

const register = function () {
  eventManager.register({
    event: eventManager.Events.BeforeRouteExe,
    handler: beforeRouteExe
  })
  eventManager.register({
    event: eventManager.Events.AfterRouteExe,
    handler: afterRouteExe
  })
  eventManager.register({
    event: eventManager.Events.BeforeRuleExe,
    handler: beforeRuleExe
  })
  eventManager.register({
    event: eventManager.Events.AfterRuleExe,
    handler: afterRuleExe
  })
  eventManager.register({
    event: eventManager.Events.BeforeWindowLoad,
    handler: beforeWindowLoad
  })
  eventManager.register({
    event: eventManager.Events.AfterWindowLoad,
    handler: afterWindowLoad
  })

  eventManager.register({
    event: eventManager.Events.BeforeWindowRender,
    handler: beforeWindowRender
  })
  eventManager.register({
    event: eventManager.Events.AfterWindowRender,
    handler: afterWindowRender
  })

  eventManager.register({
    event: eventManager.Events.BeforeWindowInit,
    handler: beforeWindowInit
  })
  eventManager.register({
    event: eventManager.Events.AfterWindowInit,
    handler: afterWindowInit
  })

  eventManager.register({
    event: eventManager.Events.BeforeComponentInit,
    handler: beforeComponentInit
  })
  eventManager.register({
    event: eventManager.Events.AfterComponentInit,
    handler: afterComponentInit
  })

  eventManager.register({
    event: eventManager.Events.BeforeRPC,
    handler: beforeRPC
  })
  eventManager.register({
    event: eventManager.Events.AfterRPC,
    handler: afterRPC
  })
}

export { doClear, doStart, doStop, isOpenMonitor, register }
