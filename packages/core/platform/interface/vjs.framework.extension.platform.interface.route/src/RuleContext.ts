import { snapshotManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.snapshot'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceFactory as datasourceFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import * as VObject from './mode/VObject'

let DataContainer = function () {
  this.data = {}
  this._inputDatas = {}
}
DataContainer.prototype = {
  //设置输出数据
  set: function (code, value) {
    this.data[code] = value
    return this
  },
  //获取输出数据
  get: function (code) {
    return this.data[code]
  },
  //设置输入数据
  _setInput: function (code, value) {
    this._inputDatas[code] = value
    return this
  },
  //获取输入数据
  _getInput: function (code) {
    if (!code) {
      return this._inputDatas
    }
    return this._inputDatas[code]
  }
}

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
    this._container = new DataContainer()
    this._mockDatas = {}
    this._cacheInputDatas = {}
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
  setBusinessRuleResult(result) {
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
  on(params) {
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
  fireListener(params) {
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
  setRuleStatus(status) {
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
  handleException(e) {
    //modify by xiedh 2015-04-30 规则异步回调中调用此接口造成域不正确问题处理 缺陷编号：55
    let exception = e
    if (e instanceof Error && !factory.isException(exception)) {
      //统一处理回调中的规则异常
      exception = this.createRuleException({
        exception: e
      })
    }
    let routeContext = this.getRouteContext()
    routeContext.handleException(exception)
  }
  /**
   * 把异常对象封装成规则异常对象
   * @param	{Object}	exception	当前异常对象
   * @param	{Object}	message		指定异常信息
   * @param	{Object}	exceptionType	指定异常类型
   * */
  createRuleException(params) {
    let e = params.exception,
      message = params.message
    let ruleCfg = this.getRuleCfg()
    let exceptionType = params.exceptionType
      ? params.exceptionType
      : factory.getExceptionTypeByError
      ? factory.getExceptionTypeByError(e, factory.TYPES.System)
      : factory.TYPES.System
    let scope = scopeManager.getScope()
    let componentCode = scope.getComponentCode()
    let windowCode = scopeManager.isWindowScope(scope.getInstanceId())
      ? scope.getWindowCode()
      : null
    let isAppend =
      factory.isException(e) && e.getDetailInfo && e.getDetailInfo() != null
    let pre = isAppend ? '所在' : ''
    let exceptionDatas = [
      { name: '构件编码', code: 'componentCode', value: componentCode },
      {
        name: pre + '规则实例名称',
        code: 'ruleInstanceName',
        value: ruleCfg.instanceName
      },
      {
        name: pre + '规则实例编码',
        code: 'ruleInstanceCode',
        value: ruleCfg.instanceCode
      },
      { name: '规则编码', code: 'ruleCode', value: ruleCfg.ruleCode },
      { name: '规则名称', code: 'ruleName', value: ruleCfg.ruleName },
      { name: '规则配置', code: 'ruleConfig', value: ruleCfg }
    ]
    if (windowCode) {
      exceptionDatas.splice(1, 0, {
        name: '窗体编码',
        code: 'windowCode',
        value: windowCode
      })
    }
    return factory.create({
      error: e,
      exceptionDatas: exceptionDatas,
      type: exceptionType,
      message: message
        ? message
        : '规则【' + ruleCfg.ruleCode + '】执行失败，错误原因：' + e.message
    })
  }
  /**
   * 设置活动集回调
   * @param {Function} callback 活动集回调
   */
  setRouteCallback(callback) {
    this.routeCallback.push(callback)
  }
  _getScopeId() {
    let routeCtx = this.getRouteContext()
    return routeCtx.getScopeId()
  }
  /**
   * 触发活动集回调
   */
  fireRouteCallback() {
    let routeCtx = this.getRouteContext()
    let scopeId = this._getScopeId()
    //如果域销毁了，则标记规则链中断全局，防止执行异常//退出规则可销毁域，应当中断当前域的规则Task20201117075
    if (scopeManager.isDestroy(scopeId)) {
      routeCtx.markForInterrupt(routeCtx.INSTANCE)
    }
    scopeManager.openScope(scopeId)
    snapshotManager.begine(routeCtx.snapshotId)
    try {
      this.fireListener({
        eventName: this.Events.ROUTECALLBACK,
        args: arguments
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
  setRuleCallback(callback) {
    this.ruleCallback = callback
  }
  /**
   * 触发规则回调
   */
  fireRuleCallback() {
    if (typeof this.ruleCallback == 'function') {
      let ctx = this.routeContext
      let scopeId = ctx.getScopeId()
      if (!scopeManager.isDestroy()) {
        scopeManager.openScope(scopeId)
        let rr = ctx.cloneForRuleCallback()
        //设置当前规则业务返回值，在规则回调中可能会使用到  2020-07-06 xiedh Task20200706169
        rr.setBusinessRuleResult(
          this.getRuleCfg().instanceCode,
          this.getAllBusinessRuleResult() || {}
        )
        this.ruleCallback(rr)
        scopeManager.closeScope()
      }
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
  genAsynCallback(func) {
    let scopeId = this._getScopeId()
    let _snapshot = this._SnapshotManager
    let routeContext = this.getRouteContext()
    let _snapshotId = routeContext.snapshotId
    let _this = this
    return function () {
      let result
      scopeManager.openScope(scopeId)
      if (_snapshot && _snapshotId) {
        _snapshot.begine(_snapshotId)
      }
      try {
        if (typeof func == 'function') {
          result = func.apply(this, arguments)
        }
      } catch (e) {
        _this.handleException(e)
      } finally {
        if (_snapshot && _snapshotId) {
          _snapshot.end()
        }
        scopeManager.closeScope()
      }
      return result
    }
  }
  getInput(code) {
    if (this._cacheInputDatas[code]) {
      return this._cacheInputDatas[code]
    }
    this.getVObject().getInput(code)
    let value = this._container._getInput(code)
    if (value && vds.ds.isDatasource(value)) {
      let resultSet = value.getAllRecords()
      let datas = []
      resultSet.iterate(function (record) {
        datas.push(record.toMap())
      })
      value = datas
      this._cacheInputDatas[code] = value
    }
    return value
  }
  newOutputVo() {
    return this._container
  }
  __getOutputs() {
    return this._container.data
  }
  __setMockInput(code, value, dsObj) {
    let source = datasourceFactory.isDatasource(dsObj) ? dsObj : value
    this.getVObject().__setMockInput(code, source)
    this._container._setInput(code, value)
  }
  getVObject() {
    if (!this._vObject) {
      this._vObject = new VObject()
    }
    return this._vObject
  }
  getInputSize() {
    let inputs = this._container._getInput()
    let count = 0
    for (let key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        count++
      }
    }
    return count
  }

  setSnapshotManager(manager: snapshotManager) {
    this._SnapshotManager = manager
  }
}

export default RuleContext
