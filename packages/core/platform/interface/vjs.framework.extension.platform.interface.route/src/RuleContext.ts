import { snapshotManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.snapshot'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { ExceptionHandler as exceptionHandler } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { transactionManager } from '@v-act/vjs.framework.extension.platform.transaction'
import { log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

import RouteContext from './RouteContext'

/**
 * @namespace RuleContext
 * @class RuleContext
 * @desc 规则上下文<br/>
 * vjs名称：vjs.framework.extension.platform.interface.route<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.route.RuleContext<br/>
 */
class RuleContext {
  ruleCfg: any
  businessResult: {} | null = null
  routeContext: RouteContext
  handlers: { [eventName: string]: Array<(...args: any[]) => void> } = {}
  autoExecute = true
  __ruleCtx__ = { ruleResult: {} }
  __eventPool__ = {}
  __status = true
  //TODO 临时解决方案
  __fireRuleCallbackYet = false
  //规则回调
  ruleCallback: null | ((ctx: RouteContext) => void) = null
  //规则路由回调
  routeCallback: Array<(...args: any[]) => void> = []
  _SnapshotManager: null | snapshotManager = null
  /**
   * 事件名称枚举
   * @enum {String}
   */
  Events = {
    CALLBACK: 'CALLBACK',
    ROUTECALLBACK: 'ROUTECALLBACK'
  }
  constructor(ruleCfg: any, routeContext: RouteContext) {
    this.ruleCfg = ruleCfg
    this.businessResult = null
    this.routeContext = routeContext
    this.handlers = {}
    this.__eventPool__ = {}
    this.__status = true
    //TODO 临时解决方案
    this.__fireRuleCallbackYet = false
    //规则回调
    this.ruleCallback = null
    //规则路由回调
    this.routeCallback = []

    this.setRouteCallback(
      (function (ctx) {
        return function () {
          eventManager.fire({
            event: eventManager.Events.AfterRuleExe,
            args: [ctx]
          })
        }
      })(this)
    )
  }
  /**
   * 获取规则实例配置
   * @return Object
   */
  getRuleCfg() {
    return this.ruleCfg
  }
  /**
   * 设置规则业务返回值
   * @param {Any} result 业务返回值
   */
  setBusinessRuleResult(result: any) {
    this.businessResult = result
  }
  /**
   * 获取所有规则业务返回值
   * @return Any
   */
  getAllBusinessRuleResult() {
    return this.businessResult
  }
  /**
   * 获取活动集上下文
   * @return {@link RouteContext}
   */
  getRouteContext() {
    return this.routeContext
  }
  /**
   * 注册事件回调
   * @param {Object} params 参数信息
   * {
   * 		"eventName" : {@link RuleContext#Events|Events} 事件名称
   * 		"handler" : {Function} 事件回调
   * }
   */
  on(params: { eventName: string; handler: (...args: any[]) => void }) {
    let eventName = params.eventName,
      handler = params.handler
    let handlers = this.handlers[eventName]
    if (!handlers) {
      handlers = []
      this.handlers[eventName] = handlers
    }
    handlers.push(handler)
  }

  /**
   * 触发规则事件
   * @param {Object} params 参数信息
   * {
   * 		"eventName" : {@link RuleContext#Events|Events} 事件名称
   * 		"args" : {Array} 参数信息
   * }
   */
  fireListener(params: { eventName: string; args: any[] }) {
    let eventName = params.eventName,
      args = params.args || []
    let handlers = this.handlers[eventName]
    if (handlers) {
      let routeContext = this.getRouteContext()
      let scopeId = routeContext.getScopeId()
      scopeManager.openScope(scopeId)
      try {
        for (let i = 0, handler; (handler = handlers[i]); i++) {
          handler.apply(this, args)
        }
      } finally {
        scopeManager.closeScope()
      }
    }
  }
  /**
   * 设置规则执行状态
   * @param {Boolean} status 执行状态
   */
  setRuleStatus(status: boolean) {
    if (typeof status == 'boolean') {
      this.__status = status
    }
  }
  /**
   * 获取规则执行状态
   * @return Boolean
   */
  getRuleStatus() {
    return this.__status
  }
  /**
   *  处理规则执行异常
   * @param {Error} e 异常
   */
  handleException(e: any) {
    //modify by xiedh 2015-04-30 规则异步回调中调用此接口造成域不正确问题处理 缺陷编号：55
    let routeContext = this.getRouteContext()
    let scopeId = routeContext.getScopeId()
    scopeManager.openScope(scopeId)
    try {
      if (routeContext.duringTransaction()) {
        let transactionId = routeContext.getTransactionId()
        if (transactionManager) {
          transactionManager.doRollback(transactionId)
          transactionManager.remove(transactionId)
          routeContext.clearTransaction()
        }
      }
      exceptionHandler.handle(e)
    } catch (e: any) {
      logUtil.error(
        '[ruleContext.handleException]规则链处理异常时出现错误！message：' +
          e.message
      )
    } finally {
      scopeManager.closeScope()
    }
  }
  /**
   * 设置活动集回调
   * @param {Function} callback 活动集回调
   */
  setRouteCallback(callback: (...args: any[]) => void) {
    this.routeCallback.push(callback)
  }
  _getScopeId() {
    let routeCtx = this.getRouteContext()
    return routeCtx.getScopeId()
  }
  /**
   * 触发活动集回调
   */
  fireRouteCallback(...args: any[]) {
    let routeCtx = this.getRouteContext()
    let scopeId = this._getScopeId()
    scopeManager.openScope(scopeId)
    snapshotManager.begine(routeCtx.snapshotId)
    try {
      this.fireListener({
        eventName: this.Events.ROUTECALLBACK,
        args: args
      })
      for (let i = 0, len = this.routeCallback.length; i < len; i++) {
        this.routeCallback[i].call(routeCtx, routeCtx, this)
      }
    } catch (e) {
      routeCtx.markForInterrupt(routeCtx.EXCEPTION)
      this.handleException(e)
    } finally {
      scopeManager.closeScope()
      snapshotManager.end()
    }
  }
  /**
   * 设置规则回调
   * @param {Function} callback 规则回调
   */
  setRuleCallback(callback: (ctx: RouteContext) => void) {
    this.ruleCallback = callback
  }
  /**
   * 触发规则回调
   */
  fireRuleCallback() {
    if (typeof this.ruleCallback == 'function') {
      let ctx = this.routeContext
      let scopeId = ctx.getScopeId()
      scopeManager.openScope(scopeId)
      let rr = ctx.cloneForRuleCallback()
      this.ruleCallback(rr)
      scopeManager.closeScope()
    }
  }
  /**
   * 标记活动集后续逻辑不自动执行
   */
  markRouteExecuteUnAuto() {
    this.autoExecute = false
  }
  /**
   *  活动集是否自动执行
   */
  isRouteExecuteAuto() {
    return this.autoExecute
  }
  /**
   * 生成异步回调
   */
  genAsynCallback(func: (...args: any[]) => void) {
    let scopeId = this._getScopeId()
    let _snapshot = this._SnapshotManager
    let routeContext = this.getRouteContext()
    let _snapshotId = routeContext.snapshotId
    return (...args: any[]) => {
      scopeManager.openScope(scopeId)
      if (_snapshot && _snapshotId) {
        _snapshot.begine(_snapshotId)
      }
      try {
        if (typeof func == 'function') {
          func.apply(this, args)
        }
      } catch (e) {
        this.handleException(e)
      } finally {
        if (_snapshot && _snapshotId) {
          _snapshot.end()
        }
        scopeManager.closeScope()
      }
    }
  }
  setSnapshotManager(manager: snapshotManager) {
    this._SnapshotManager = manager
  }
}

export default RuleContext
