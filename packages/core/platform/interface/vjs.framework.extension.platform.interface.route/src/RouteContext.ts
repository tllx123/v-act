import { snapshotManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.snapshot'
import { RuleEngine as ruleEngine } from '@v-act/vjs.framework.extension.platform.engine.rule'
import { AsyncFacotory as asyncFactory } from '@v-act/vjs.framework.extension.platform.interface.async'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import {
  ParamConfig,
  RouteConfig
} from '@v-act/vjs.framework.extension.platform.interface.model.config'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { TransactionManager as transactionManager } from '@v-act/vjs.framework.extension.platform.transaction.manager'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { ObjectUtil } from '@v-act/vjs.framework.extension.util.object'

import { TransactionInfo } from '../../vjs.framework.extension.platform.interface.model.config/src/api/types'
import RuleContext from './RuleContext'

const extend = ObjectUtil.extend

/**
 * @namespace RouteContext
 * @class RouteContext
 * @desc 活动集上下文<br/>
 * vjs名称：vjs.framework.extension.platform.interface.route<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.route.RouteContext<br/>
 */
class RouteContext {
  static Events = {
    EXCEPTION: 'exception',
    INTERRUPT: 'interrupt'
  }

  Events: RouteContext.Events
  //路由状态：中断
  static INTERRUPT = 'INTERRUPT'
  //路由状态：正常
  static NORMAL = 'NORMAL'

  NOINTERRUPT = -1
  //终断本规则链
  CURRENT = 0
  //终断父规则链
  PARENT = 1
  //终断本实例中的规则链
  INSTANCE = 2
  //终断所有规则链
  GLOBAL = 3
  //异常
  EXCEPTION = 4

  //路由状态：中断
  INTERRUPT = RouteContext.INTERRUPT
  //路由状态：正常
  NORMAL = RouteContext.NORMAL
  snapshotId?: string
  //事件参数
  __params__ = null
  //事件名称
  __eventName: string | null = null
  //规则状态值
  __ruleResultPool__: { [code: string]: any } = {}
  //规则业务返回值
  __businessResult__: Array<{ ruleCode: string; result: any }> = []
  __routeConfig__?: RouteConfig
  //当前执行规则实例id
  __ruleInstanceId__: string | null = null
  __sourceId__: string | null = null
  __log__: string[] = []
  __transactionInfoTemp__: { [id: string]: boolean } = {}
  __status__ = RouteContext.NORMAL
  __eventArgs__: { [eventName: string]: any } | null = null
  __transactionId__: string | null = null
  __scopeId__?: string | null
  __currentRuleResult__ = true
  __needToCallBack = true
  __callBackFunc: null | ((...args: any[]) => void) = null
  __innerCallBackFunc: null | ((...args: any[]) => void) = null
  __parentRouteRuntime?: RouteContext | null = null
  __routeCallBack: Array<(...args: any[]) => void> = []
  //当路由中的某个规则异步化后，后面的所有规则将储存在此属性中
  __remainningHandler: null | ((...args: any[]) => void) = null
  //终断类型
  _interruptType = this.NOINTERRUPT
  //执行类型 前台foreach使用，break/continue
  _executeType = ''
  //输入参数
  __inputParam: { [code: string]: any } = {}
  //输出参数
  __outputParam: { [code: string]: any } = {}
  //活动集变量
  __variables: { [code: string]: any } = {}
  //foreach变量存放，{'变量名':{'name':'name','value':'value','datasource':'datasource'}}
  __foreachVar: { [code: string]: any } = {}

  //事件回调
  __eventHandlers: { [eventName: string]: Array<(...args: any[]) => void> } = {}

  parentRuleContext?: RuleContext

  constructor(routeConfig?: RouteConfig, parentRouteContext?: RouteContext) {
    //路由配置
    this.__routeConfig__ = routeConfig

    this.__parentRouteRuntime = parentRouteContext

    this.onRouteCallBack(this._dealTransaction)

    //this.onRouteCallBack(this._dealSnapshot);

    this.onRouteCallBack(() => {
      eventManager.fire({
        event: eventManager.Events.AfterRouteExe,
        args: [this]
      })
    })

    if (parentRouteContext) {
      let routeContext = this
      this.onRouteCallBack(
        (function (rt) {
          return function () {
            markInterrupt(routeContext, rt)
          }
        })(parentRouteContext)
      )
      this.joinRouteRuntime(parentRouteContext)
    }
    if (environment.isDebug() && routeConfig) {
      //调试事务信息
      let ruleSetCode = routeConfig.getCode()
      log.debug(
        '************开始调试规则路由事务信息，活动集编号：' +
          ruleSetCode +
          '*************'
      )
      let instances = routeConfig.getRuleInstances()
      for (let code in instances) {
        let instance = instances[code]
        log.debug(
          '*规则名称：' +
            instance.ruleName +
            '，规则编号：' +
            instance.ruleCode +
            '，实例id：' +
            code +
            '，运行时事务：' +
            this.isInTransaction(code) +
            '，规则事务类型：' +
            instance.transactionType
        )
      }
      log.debug(
        '************结束调试规则路由事务信息，活动集编号：' +
          ruleSetCode +
          '*************'
      )
    }
  }
  //添加Deferred
  addCompleteDeferred(dtd) {
    this.__completeDtdList.push(dtd)
  }
  //路由执行完成回调
  onCompleteCallback(func) {
    if (typeof func == 'function') {
      this.__onCompleteCallback.push(func)
    }
  }

  /*
   * 获取异步工厂
   * @return Object
   */
  getAsyncFactory() {
    return asyncFactory
  }
  /**
   * 克隆
   * @return {@link RouteContext}
   */
  clone() {
    let rr = new RouteContext()
    sb.util.object.extend(rr, this)
    return rr
  }

  /**
   *  获取上层路由实例
   * @return {@link RouteContext}
   */
  getParentRouteContext() {
    return this.__parentRouteRuntime
  }
  /**
   * 触发活动集回调 ,活动集执行完成时触发
   */
  fireRouteCallBack() {
    let outputs = this.getOutPutParams()
    for (let i = 0, handler; (handler = this.__routeCallBack[i]); i++) {
      handler.call(this, outputs)
    }
    let dtdList = this.__completeDtdList
    let _this = this
    $.when.apply($, dtdList).done(function () {
      let completeCallbacks = _this.__onCompleteCallback
      for (let j = 0; j < completeCallbacks.length; j++) {
        let func = completeCallbacks[j]
        func.call(_this, outputs)
      }
    })
  }
  /**
   * @private
   * 执行则路由余下逻辑
   */
  callRouteRemainHandler() {
    let func = this.__remainningHandler
    //路由规则身下的函数只能执行一次，否则会死循环
    this.__remainningHandler = null
    if (typeof func == 'function') {
      let scopeId = this.getScopeId()
      if (scopeId) {
        scopeManager.openScope(scopeId)
        func.call(this, this)
        scopeManager.closeScope()
      } else {
        throw Error('scopeId为空！')
      }
    }
  }

  /**
   *@private
   * 生成回调函数（此回调函数作为规则路由回调函数绑定到另外一个路由中）
   */
  genCallBackForRoute() {
    let rr = this
    let handler = this.__remainningHandler
    return () => {
      if (typeof handler == 'function') {
        const scopeId = rr.getScopeId()
        if (scopeId) {
          scopeManager.openScope(scopeId)
          handler.call(rr, rr)
          scopeManager.closeScope()
          return rr
        } else {
          throw Error('scopeId为空！')
        }
      }
    }
  }

  /**
   *@private
   * 绑定规则路由回调
   */
  onRouteCallBack(func: (...args: any[]) => void) {
    if (typeof func == 'function') {
      this.__routeCallBack.push(func)
    }
  }
  /**
   *@private
   * 移除规则路由回调
   */
  offRouteCallBack(func: (...args: any[]) => void) {
    arrayUtil.remove(this.__routeCallBack, func)
  }

  /**
   * 设置活动集状态
   */
  setStatus(status: string) {
    this.__status__ = status
  }
  /**
   * 设置活动集状态
   */
  getStatus() {
    return this.__status__
  }
  /**
   * 设置事件参数，如键盘按下值
   * @param {Object} arg 事件参数
   */
  putEventArgument(arg: any) {
    this.__eventArgs__ = arg
  }
  /**
   * 获取事件参数，如键盘按下值
   * @param {String} eventName 参数名称
   * @return Any
   */
  getEventArgument(eventName: string) {
    if (this.__eventArgs__) {
      return this.__eventArgs__[eventName]
    }
  }
  /**
   * 获取所有事件参数
   * @return Object
   */
  getEventArguments() {
    let args: { [eventName: string]: any } = {}
    if (this.__eventArgs__) {
      for (let attr in this.__eventArgs__) {
        args[attr] = this.__eventArgs__[attr]
      }
    }
    return args
  }
  /**
   * 设置规则路由执行时外部传入参数
   * @param {Object} param 参数信息
   */
  setParams(param: any) {
    this.__params__ = param
  }

  /**
   * 获取规则路由执行时外部传入参数
   */
  getParams() {
    return this.__params__
  }

  /**
   * 获取事件名称
   * @return String
   */
  getEventName() {
    return this.__eventName
  }

  /**
   * 设置事件名称
   * @param {String} eventName 事件名称
   */
  setEventName(eventName: string | null) {
    this.__eventName = eventName
  }

  /**
   * 保存规则执行结果
   * @param ruleCode 规则实例Code
   * @param result 规则执行结果
   */
  setRuleResult(ruleCode: string, result: any) {
    if (typeof ruleCode != 'undefined') {
      let ruleResultPool = this.getRuleResultPool(ruleCode)
      ruleResultPool['ruleResult'] = result
    }
  }
  /**
   *@private
   * 获取规则执行结果 池
   * @param {Object} ruleCode 规则编码
   */
  getRuleResultPool(ruleCode: string) {
    let ruleResultPool = this.__ruleResultPool__
    if (ruleCode in ruleResultPool) {
      return ruleResultPool[ruleCode]
    } else {
      ruleResultPool[ruleCode] = {}
      return ruleResultPool[ruleCode]
    }
  }

  /**
   * 获取规则执行结果
   * @param {String} ruleCode 规则编号
   * @return Boolean
   */
  getRuleResult(ruleCode: string) {
    let ruleResultPool = this.getRuleResultPool(ruleCode)
    if (ruleResultPool) {
      return ruleResultPool['ruleResult']
    }
  }

  /**
   * 设置业务规则执行结果
   * @param {String} ruleCode 规则编号
   * @param {Any} result 规则业务返回值
   */
  setBusinessRuleResult(ruleCode: string, result: any) {
    if (typeof ruleCode != 'undefined') {
      let resultObj = {
        ruleCode: ruleCode,
        result: result
      }
      //是否已存在该规则的返回值
      let index = -1
      if (this.__businessResult__ && this.__businessResult__.length > 0) {
        for (let i = 0, len = this.__businessResult__.length; i < len; i++) {
          let result = this.__businessResult__[i]
          if (result && result.ruleCode == ruleCode) {
            index = i
            break
          }
        }
      }
      if (index != -1) {
        //存在，则替换现有的返回值
        this.__businessResult__[index] = resultObj
      } else {
        this.__businessResult__.push(resultObj)
      }
    }
  }

  /**
   * 获取业务规则执行结果
   * @param {String} ruleCode 规则编号
   * @param {String} key 业务返回值key
   * @return Any
   */
  getBusinessRuleResult(...args: any[]) {
    if (args.length == 0) {
      throw new Error('获取业务规则执行结果失败！原因：没有传入规则Code')
    }
    let ruleCode = arguments[0]
    for (let i = 0, len = this.__businessResult__.length; i < len; i++) {
      let result = this.__businessResult__[i]
      if (result.ruleCode == ruleCode) {
        let resultObj = result.result
        return arguments.length > 1 ? resultObj[arguments[1]] : resultObj
      }
    }
  }

  /**
   * 获取所有业务返回值
   * @return Array
   */
  getAllBusinessResult() {
    let result = []
    for (let i = 0, len = this.__businessResult__.length; i < len; i++) {
      result.push(this.__businessResult__[i])
    }
    return result
  }
  /**
   * 设置当前规则实例Id
   * @param {String} ruleInstanceId 规则实例id
   */
  setRuleInstanceId(ruleInstanceId: string) {
    this.__ruleInstanceId__ = ruleInstanceId
  }

  /**
   * 获取当前规则实例Id
   * @return String
   */
  getRuleInstanceId() {
    return this.__ruleInstanceId__
  }

  /**
   * @private
   * 设置路由sourceId
   */
  setSourceId(sourceId: string | null) {
    return (this.__sourceId__ = sourceId)
  }

  /**
   * @private
   * 获取路由sourceId
   */
  getSourceId() {
    return this.__sourceId__
  }

  /**
   * 设置日志信息
   * @param {Object} log 日志信息
   */
  setLogInfo(log: string) {
    this.__log__.push(log)
  }

  /**
   * 获取日志信息
   * @return Array
   */
  getLogInfo() {
    return this.__log__
  }

  /**
   *是否处于另一个活动集中
   *  @return Boolean
   */
  isInRouteContext() {
    return !!this.__parentRouteRuntime
  }
  /**
   * 获取规则路由配置
   * @return {@link RouteConfig}
   */
  getRouteConfig() {
    return this.__routeConfig__
  }

  /**
   *判断规则是否处于事务中
   * @param {String} instanceId 规则实例id
   */
  isInTransaction(instanceId: string | null) {
    if (instanceId !== null) {
      if (
        this.__transactionInfoTemp__ &&
        this.__transactionInfoTemp__.hasOwnProperty(instanceId)
      ) {
        return this.__transactionInfoTemp__[instanceId]
      } else if (this.__routeConfig__) {
        let transactonInfo = this.__routeConfig__.getTranscationInfo()
        if (transactonInfo && transactonInfo[instanceId]) {
          let transactionType = transactonInfo[instanceId]['transactionType']
          return transactionType != 'NONE'
        }
      }
    }
    return false
  }
  /**
   *@private
   * 执行规则
   * @param {String}  ruleInstId 规则实例Id
   * @param {Function} callBack 该规则后所有的逻辑函数
   */
  executeRuleAsCallBack(
    ruleInstId: string,
    callBack: (...args: any[]) => void
  ) {
    this.setRuleInstanceId(ruleInstId)
    this.__remainningHandler = callBack
    return this._callRule()
  }
  /**
   *@private
   * 执行规则
   */
  _callRule() {
    if (!this.isInterrupted()) {
      //规则路由未被中断才能执行规则
      if (!this.__scopeId__) {
        this.__scopeId__ = scopeManager.getCurrentScopeId()
      }
      if (this.__scopeId__) {
        scopeManager.openScope(this.__scopeId__)
        let rst = ruleEngine.executeRule.call(ruleEngine, this)
        scopeManager.closeScope()
        if (rst === false) {
          this.setStatus(RouteContext.INTERRUPT)
          this.__currentRuleResult__ = false
        }
      }
    } else {
      this.setStatus(RouteContext.INTERRUPT)
      this.__currentRuleResult__ = false
    }
    return this
  }
  /**
   * 执行规则
   * @param {String} ruleInstId 规则实例Id
   * @param {Function} callBack 规则回调函数
   */
  executeRule(ruleInstId: string, callBack: (...args: any[]) => void) {
    this.setCallBackFlag(true)
    this.setRuleInstanceId(ruleInstId)
    this.setCallBackFunc(callBack)
    return this._callRule()
  }
  /**
   *@private
   * 是否需要执行回调
   */
  needToCallBack() {
    return this.__needToCallBack
  }
  /**
   *@private
   * 设置是否需要回调
   */
  setCallBackFlag(flag: boolean) {
    this.__needToCallBack = flag
  }
  /**
   *@private
   * 设置回调函数
   */
  setCallBackFunc(func: (...args: any[]) => void) {
    this.__callBackFunc = func
  }
  /**
   *@private
   * 获取规则回调函数
   */
  getCallBackFunc() {
    let callback = this.__callBackFunc
    let scopeId = this.getScopeId()
    return (...args: any[]) => {
      if (typeof callback == 'function') {
        if (scopeId) {
          scopeManager.openScope(scopeId)
          callback.apply(this, args)
          scopeManager.closeScope()
        } else {
          throw Error('scopeId为空！')
        }
      }
    }
  }
  /**
   *设置活动集所处域实例id
   * @param {String} scopeId 实例id
   */
  setScopeId(scopeId: string) {
    this.__scopeId__ = scopeId
  }

  /**
   * 获取活动集所处域实例id
   * @return String
   */
  getScopeId() {
    return this.__scopeId__
  }
  /**
   *@private
   * 获取路由输出
   * @param {Object} outputType
   */
  getOutPut(outputType: string) {
    let outputCfg = this.__routeConfig__.getOutputCfg()
    if (outputCfg) {
      let cmpModule = viewModel.getCmpModule()
      scopeManager.openScope(this.__scopeId__)
      let variablesMapping = cmpModule.genOutputVariablesMapping(
        outputCfg.outputVariables
      )
      let result = cmpModule.genOutputValueResult(
        outputCfg.widgetCodes,
        variablesMapping,
        outputCfg.dsToFields,
        outputType
      )
      scopeManager.closeScope()
      return result
    } else {
      return []
    }
  }
  /**
   *获取事务实例id
   * @return String
   */
  getTransactionId() {
    return this.__transactionId__
  }
  /**
   *设置事务实例id
   * @param {String} transactionId 事务实例id
   */
  setTransactionId(transactionId: string | null) {
    let parentRuntime = this.getParentRouteContext()
    if (parentRuntime) {
      parentRuntime.setTransactionId(transactionId)
    }
    this.__transactionId__ = transactionId
  }
  /**
   *设置当前规则返回值
   * @param {Any} result 返回值
   */
  setCurrentRuleResult(result: any) {
    if (this.__currentRuleResult__ !== false) {
      //如果当前规则路由上下文状态已经中断，则无需再设置值
      this.__currentRuleResult__ = result
    }
  }
  /**
   *获取当前规则返回值
   * @return Any
   */
  getCurrentRuleResult() {
    return this.__currentRuleResult__
  }
  /**
   *@private
   * 获取规则链回调
   */
  getRouteCallBackFunc() {
    return this.__innerCallBackFunc
  }

  /**
   *@private
   * 合并路由运行时信息
   */
  joinRouteRuntime(routeRuntime: RouteContext) {
    this.__parentRouteRuntime = routeRuntime
    this.setEventName(routeRuntime.getEventName())
    this.setSourceId(routeRuntime.getSourceId())
    this.setParams(routeRuntime.getParams())
    this._dealRouteTransaction(routeRuntime)
    this.putEventArgument(routeRuntime.getEventArguments())
    let logInfo = routeRuntime.getLogInfo()
    if (logInfo.length > 0) {
      this.__log__ = this.__log__.concat(logInfo)
    }
    //this.onRouteCallBack(routeRuntime.genCallBackForRoute());
    this.setTransactionId(routeRuntime.getTransactionId())
  }

  /**
   *@private
   * 处理路由中规则配置
   * 由外部调用本规则路由，事务处理有5种情况
   * 1、两个路由都没有事务。不用处理
   * 2、外部已开启事务并且执行本规则路由后还有事务。处理方式：将本规则路由中所有规则都设置成处于事务中
   * 3、外部已开启事务，执行本规则路由中结束事务。处理方式：将本规则路由中有事务的规则到顶级规则之间的路径设置成处于事务中
   * 4、执行本规则路由中开启事务，本规则中结束事务。处理方式：不用处理
   * 5、执行本规则路由中开启事务，外部中结束事务。处理方式，本规则路由中有事务的规则到外部中有事务规则之间路径设置处理事务中
   */
  _dealRouteTransaction(routeRuntime: RouteContext) {
    if (!this.getRouteConfig()) return
    let instanceId = routeRuntime.getRuleInstanceId()
    let isInTransaction = routeRuntime.isInTransaction(instanceId)
    let nextInstanceIds = routeRuntime._getAllNextRuleInstanceIds(instanceId)
    let nextHasTransacton = false
    for (let i = 0, len = nextInstanceIds.length; i < len; i++) {
      let nextInstanceId = nextInstanceIds[i]
      let it = routeRuntime.isInTransaction(nextInstanceId)
      if (it) {
        nextHasTransacton = true
        break
      }
    }
    if (isInTransaction) {
      //2,3种情况
      if (nextHasTransacton) {
        //第二种情况
        this._setAllRuleInstanceInTransaction()
      } else {
        //第三种情况
        let ids = this._getInTransactionRuleIds()
        let idArray: string[] = []
        for (let i = 0, len = ids.length; i < len; i++) {
          idArray = idArray.concat(this._getAllPreRuleInstanceIds(ids[i]))
        }
        for (let i = 0, len = idArray.length; i < len; i++) {
          let id = idArray[i]
          this.markRuleInTransaction(id)
        }
      }
    } else {
      //4、5种情况
      if (nextHasTransacton) {
        //第5种情况
        let ids = this._getInTransactionRuleIds()
        let idArray: string[] = []
        for (let i = 0, len = ids.length; i < len; i++) {
          idArray = idArray.concat(this._getAllNextRuleInstanceIds(ids[i]))
        }
        for (let i = 0, len = idArray.length; i < len; i++) {
          let id = idArray[i]
          this.markRuleInTransaction(id)
        }

        let nextHasTransactionIds = []
        for (let i = 0, len = nextInstanceIds.length; i < len; i++) {
          let nextInstanceId = nextInstanceIds[i]
          let it = routeRuntime.isInTransaction(nextInstanceId)
          if (it) {
            nextHasTransactionIds.push(nextInstanceId)
          }
        }
        let searched = {}
        if (routeRuntime.__routeConfig__) {
          let transactionInfo =
            routeRuntime.__routeConfig__.getTranscationInfo()
          for (let i = 0, len = nextHasTransactionIds.length; i < len; i++) {
            let instId = nextHasTransactionIds[i]
            let result = this._iterate(
              instId,
              instanceId,
              nextInstanceIds,
              searched,
              transactionInfo
            )
            if (result) {
              ids = ids.concat(result)
            }
          }
          for (let i = 0, len = ids.length; i < len; i++) {
            let instId = ids[i]
            routeRuntime.markRuleInTransaction(instId)
          }
        }
      } else {
        //第4种情况
        return
      }
    }
  }

  _contains(obj: any, array: any[]) {
    if (array) {
      for (let i = 0, len = array.length; i < len; i++) {
        if (obj == array[i]) {
          return true
        }
      }
    }
    return false
  }

  _iterate(
    instanceId: string | null,
    ancestorId: string | null,
    instanceIds: string[],
    searched: { [id: string]: boolean },
    transactionInfo: TransactionInfo
  ) {
    if (instanceId !== null) {
      let cfg = transactionInfo[instanceId]
      if (cfg && cfg.preInstanceIds) {
        let rs: string[] = []
        let preInstanceIds = cfg.preInstanceIds
        for (let i = 0, len = preInstanceIds.length; i < len; i++) {
          let preInstanceId = preInstanceIds[i]
          if (this._contains(preInstanceId, instanceIds)) {
            if (!searched.hasOwnProperty(preInstanceId)) {
              searched[preInstanceId] = true
              rs.push(preInstanceId)
              let result = this._iterate(
                preInstanceId,
                ancestorId,
                instanceIds,
                searched,
                transactionInfo
              )
              if (result) {
                rs = rs.concat(result)
              }
            }
          }
        }
        return rs
      }
    }
    return null
  }

  _putCode(
    code: string,
    value: any,
    getTypeFn: (code: string | string[]) => string | any
  ) {
    let type = getTypeFn.call(this, [code])
    if (type == 'entity') {
      //如果为实体变量,则将实体名称设置为变量名称(需求来源:当通过表达式过滤实体变量中字段值时,需要使用到数据源名称)
      let metadata = value.getMetadata()
      metadata.setDatasourceName(code)
    }
  }

  /**
   *@private
   * 获取路由中有事务的规则
   */
  _getInTransactionRuleIds() {
    let result = []
    if (this.__routeConfig__) {
      let transactionInfo = this.__routeConfig__.getTranscationInfo()
      for (let instanceId in transactionInfo) {
        let it = this.isInTransaction(instanceId)
        if (it) {
          result.push(instanceId)
        }
      }
    }
    return result
  }

  /**
   *@private
   * 将路由中所有规则都设置成处于事务中
   * @param {Object} routeContext
   */
  _setAllRuleInstanceInTransaction() {
    if (this.__routeConfig__) {
      let transactionInfo = this.__routeConfig__.getTranscationInfo()
      for (let instanceId in transactionInfo) {
        this.markRuleInTransaction(instanceId)
      }
    }
  }
  /**
   * @private
   * 获取下一执行规则
   * @param {Object} instanceId
   * @param {Object} routeContext
   */
  _getNextRuleInstanceIds(instanceId: string) {
    let result = []
    if (this.__routeConfig__) {
      let transactionInfo = this.__routeConfig__.getTranscationInfo()
      for (let id in transactionInfo) {
        let cfg = transactionInfo[id]
        if (cfg && cfg.preInstanceIds) {
          let preInstanceIds = cfg.preInstanceIds
          for (let i = 0, len = preInstanceIds.length; i < len; i++) {
            let preInstanceId = preInstanceIds[i]
            if (preInstanceId == instanceId) {
              //@ts-ignore
              result.push(cfg.instanceId)
              break
            }
          }
        }
      }
    }
    return result
  }

  /**
   * @private
   * 获取前置规则
   * @param {Object} instanceId
   */
  _getPreRuleInstanceIds(instanceId: string) {
    if (this.__routeConfig__) {
      let transactionInfo = this.__routeConfig__.getTranscationInfo()
      let info = transactionInfo[instanceId]
      if (info) {
        let preIds = info.preInstanceIds
        if (preIds) {
          return preIds
        }
      }
    }
    return null
  }
  _getGenealogyIds(
    instanceId: string | null,
    func: (...args: any[]) => void | string[] | null,
    searched?: { [ids: string]: boolean }
  ) {
    let idArray = []
    if (instanceId !== null) {
      searched = searched || {}
      let rsMap: { [id: string]: boolean } = {}
      let ids = func.call(this, instanceId)
      searched[instanceId] = true
      if (ids && ids.length > 0) {
        for (let i = 0, l = ids.length; i < l; i++) {
          rsMap[ids[i]] = true
        }
        for (let i = 0, len = ids.length; i < len; i++) {
          let preId = ids[i]
          if (!searched[preId]) {
            let rs = this._getGenealogyIds(preId, func, searched)
            for (let j = 0, leng = rs.length; j < leng; j++) {
              rsMap[rs[j]] = true
            }
          }
        }
      }
      for (let attr in rsMap) {
        if (rsMap.hasOwnProperty(attr)) {
          idArray.push(attr)
        }
      }
    }
    return idArray
  }
  /**
   *@private
   * 获取所有前置规则Id
   * @param {Object} instanceId
   */
  _getAllPreRuleInstanceIds(instanceId: string) {
    return this._getGenealogyIds(instanceId, this._getPreRuleInstanceIds)
  }

  /**
   *@private
   * 获取所有后置规则Id
   * @param {Object} instanceId
   */
  _getAllNextRuleInstanceIds(instanceId: string | null) {
    return this._getGenealogyIds(instanceId, this._getNextRuleInstanceIds)
  }
  /**
   * 清除活动集事务状态
   */
  clearTransaction() {
    let parentRuntime = this.getParentRouteContext()
    if (parentRuntime) {
      parentRuntime.clearTransaction()
    }
    this.__transactionId__ = null
  }
  /**
   * 活动集是否正处于事务中
   * @return Boolean
   */
  duringTransaction() {
    return this.__transactionId__ != null
  }

  /**
   *标记规则处于事务中
   * @param {String} instanceId 规则实例id
   */
  markRuleInTransaction(instanceId: string) {
    this.__transactionInfoTemp__[instanceId] = true
  }
  /**
   *标记终断规则链
   * @param {String} type 终断类型
   */
  markForInterrupt(type: number) {
    if (this._interruptType < type) {
      this._interruptType = type
      let parentContext = this.getParentRouteContext()
      if (parentContext) {
        switch (type) {
          case this.CURRENT:
            break
          case this.PARENT:
            parentContext.markForInterrupt(this.CURRENT)
            break
          case this.INSTANCE:
            if (parentContext.getScopeId() == this.getScopeId()) {
              //如果当前规则路由上下文为中断状态，则设置当前域中父规则路由上下文
              parentContext.markForInterrupt(this.INSTANCE)
            }
            break
          case this.GLOBAL:
            parentContext.markForInterrupt(this.GLOBAL)
            break
          case this.EXCEPTION:
            parentContext.markForInterrupt(this.EXCEPTION)
            break
        }
      }
      if (type == this.EXCEPTION) {
        this._fireEvent(this.Events.EXCEPTION)
      } else {
        //非异常中断,提交事务,异常中断交给外层回滚事务
        this._dealTransaction()
        //this._dealSnapshot();
        this._fireEvent(this.Events.INTERRUPT)
      }
    }
    this.__currentRuleResult__ = false
  }
  /**
   *	获取活动集终断类型
   * @return String
   */
  getInterruptType() {
    return this._interruptType
  }
  /**
   * 活动集是否已终断
   * @return Boolean
   */
  isInterrupted() {
    return this.__currentRuleResult__ === false
  }
  /**
   * 设置执行类型 前台foreach使用，break/continue
   * */
  setExecuteType(type: string) {
    this._executeType = type
  }
  /**
   * 获取执行类型 前台foreach使用，break/continue
   * */
  getExecuteType() {
    return this._executeType
  }
  /**
   * 设置foreach变量
   * params:
   * {
   * 	'code' : code,//循环变量编码
   * 	'value' : value,//循环变量值
   *  'datasource' : datasource //数据源对象
   * }
   * */
  setForEachVar(params: { code: string; value: any; datasource: any }) {
    let code = params.code
    if (!this.__foreachVar[code]) {
      this.__foreachVar[code] = {}
    }
    this.__foreachVar[code] = params
  }
  /**
   * 获取foreach变量
   * @param code {String} 循环变量编码
   * */
  getForEachVarValue(code: string) {
    if (!this.__foreachVar[code]) {
      return null
    } else {
      return this.__foreachVar[code]['value']
    }
  }
  /**
   * 获取foreach数据源
   * @param code {String} 循环变量编码
   * */
  getForEachVarDataSource(code: string) {
    if (!this.__foreachVar[code]) {
      return null
    } else {
      return this.__foreachVar[code]['datasource']
    }
  }
  /**
   *获取输入参数值
   * @param {Object} paramCode 编号
   * @return Any
   */
  getInputParam(paramCode: string) {
    if (this.__inputParam.hasOwnProperty(paramCode)) {
      return this.__inputParam[paramCode]
    } else {
      if (this.__routeConfig__) {
        let input = this.__routeConfig__.getInput(paramCode)
        if (input) {
          let initVal = this._getVarInitValue(input)
          this.setInputParam(paramCode, initVal)
          return initVal
        }
      }
    }
    return null
  }

  /**
   *获取输入参数类型
   * @param {String} paramCode 编号
   * @return String
   */
  getInputParamType(paramCode: string) {
    if (this.__routeConfig__) {
      let input = this.__routeConfig__.getInput(paramCode)
      return input ? input.type : null
    }
    return null
  }

  /**
   *设置输入参数值
   * @param {String} paramCode 编号
   * @param {Any} paramValue 值
   */
  setInputParam(paramCode: string, paramValue: any) {
    if (this.__routeConfig__) {
      let input = this.__routeConfig__.getInput(paramCode)
      if (input) {
        let type = input.type
        //TODO 数据校验
        /*var isMatch = dataValidateUtil.dataValidate(paramValue,type);
            if(isMatch)
            { 
                this.__inputParam[paramCode] = paramValue;
      }
            return isMatch;*/
        this._putCode(paramCode, paramValue, this.getInputParamType)
        this.__inputParam[paramCode] = paramValue
      }
    }
    return false
  }
  /**
   * 批量设置活动集输入参数
   * @param {Object} inputParams 参数值
   */
  setInputParams(inputParams: { [code: string]: any }) {
    if (inputParams) {
      for (let paramCode in inputParams) {
        this.setInputParam(paramCode, inputParams[paramCode])
      }
    }
  }

  _getVarInitValue(varConfig: ParamConfig) {
    return varConfig.getInitValue()
  }

  /**
   *	获取输出参数值
   * @param {String} paramCode 编号
   * @return Any
   */
  getOutPutParam(paramCode: string) {
    if (this.__outputParam.hasOwnProperty(paramCode)) {
      return this.__outputParam[paramCode]
    } else {
      if (this.__routeConfig__) {
        let output = this.__routeConfig__.getOutput(paramCode)
        if (output) {
          let initVal = this._getVarInitValue(output)
          this.setOutputParam(paramCode, initVal)
          return initVal
        }
      }
    }
    return null
  }

  /**
   *获取输出参数类型
   * @param {String} paramCode 编号
   */
  getOutPutParamType(paramCode: string) {
    if (this.__routeConfig__) {
      let output = this.__routeConfig__.getOutput(paramCode)
      return output ? output.type : null
    }
    return null
  }

  /**
   * 获取活动集所有输出参数
   * @return Object
   */
  getOutPutParams() {
    if (this.__routeConfig__) {
      let outputs = this.__routeConfig__.getOutputs()
      let outputResult: { [code: string]: any } = {}
      if (outputs) {
        for (let i = 0, output; (output = outputs[i]); i++) {
          let code = output.getCode()
          outputResult[code] = this.getOutPutParam(code)
        }
      }
      return outputResult
    }
    return null
  }
  /**
   *设置输出参数值
   * @param {String} paramCode 编号
   * @param {Any} paramValue 值
   */
  setOutputParam(paramCode: string, paramValue: any) {
    if (this.__routeConfig__) {
      let input = this.__routeConfig__.getOutput(paramCode)
      if (input) {
        let type = input.type
        //TODO 数据校验
        /*var isMatch = dataValidateUtil.dataValidate(paramValue,type);
            if(isMatch)
            { 
                this.__outputParam[paramCode] = paramValue;
            }	
            return isMatch;*/
        this._putCode(paramCode, paramValue, this.getOutPutParamType)
        this.__outputParam[paramCode] = paramValue
      }
    }
    return false
  }
  /**
   *设置活动集变量
   * @param {String} variableCode 变量编号
   * @param {Any} value 变量值
   */
  setVariable(variableCode: string, value: any) {
    if (this.__routeConfig__) {
      let variable = this.__routeConfig__.getVar(variableCode)
      if (variable) {
        let type = variable.type
        //TODO 数据校验
        /*var isMatch = dataValidateUtil.dataValidate(value,type);
            if(isMatch)
            { 
        this.__variables[variableCode] = value
      }
            return isMatch;*/
        this._putCode(variableCode, value, this.getVariableType)
        this.__variables[variableCode] = value
      }
    }
    return false
  }

  /**
   * 根据实体变量编号获取变量配置信息
   * @param {String} variableCode 变量编号
   * @return {@link ParamConfig}
   */
  getVariableConfig(variableCode: string) {
    if (this.__routeConfig__) {
      return this.__routeConfig__.getVar(variableCode)
    }
    return null
  }

  /**
   *获取活动集变量值
   * @param {Object} variableCode 变量编号
   * @return Any
   */
  getVariable(variableCode: string) {
    if (this.__variables.hasOwnProperty(variableCode)) {
      return this.__variables[variableCode]
    } else {
      let variableCfg = this.getVariableConfig(variableCode)
      if (variableCfg) {
        let initVal = this._getVarInitValue(variableCfg)
        this.setVariable(variableCode, initVal)
        return initVal
      }
    }
    return null
  }

  /**
   *获取活动集变量类型
   * @param {String} variableCode 变量编号
   * @return String
   */
  getVariableType(variableCode: string) {
    if (this.__routeConfig__) {
      let variableCfg = this.__routeConfig__.getVar(variableCode)
      return variableCfg ? variableCfg.type : null
    }
    return null
  }

  _dealTransaction() {
    if (!this.isInRouteContext()) {
      //如果不处于另外一个规则路由中
      let transactionManager = _getTransactionManager()
      if (!transactionManager) return
      let transactionId = this.getTransactionId()
      if (transactionManager.isBegined(transactionId)) {
        //this.commitTransaction();不能使用该方法
        transactionManager.doCommit(transactionId)
      }
      this.clearTransaction()
      transactionManager.remove(transactionId)
    }
  }

  _dealSnapshot() {
    if (
      this.snapshotId &&
      (!this.isInRouteContext() ||
        (this.__parentRouteRuntime && !this.__parentRouteRuntime.snapshotId))
    ) {
      //顶层活动集
      let snapshotId = this.snapshotId
      if (snapshotId) {
        snapshotManager.clear(snapshotId)
      }
    }
  }

  /**
   * 注册事件
   * @param {Object} params 参数信息
   * {
   * 		"eventName" : {@link RouteContext.Events} 事件名称
   * 		"handler" : {Function} 回调
   * }
   */
  on(params: { eventName: string; handler: (...args: any[]) => void }) {
    let ctx = this._getTopContext()
    ctx._on(params)
    if (ctx !== this) {
      this._on(params)
    }
  }

  _on(params: { eventName: string; handler: (...args: any[]) => void }) {
    let name = params.eventName
    let handlers = this.__eventHandlers[name]
    if (!handlers) {
      handlers = []
      this.__eventHandlers[name] = handlers
    }
    handlers.push(params.handler)
  }

  _getTopContext() {
    let ctx: RouteContext = this
    while (ctx.__parentRouteRuntime != null) {
      ctx = ctx.__parentRouteRuntime
    }
    return ctx
  }
  /**
   * 触发事件
   */
  _fireEvent(eventName: string) {
    let handlers = this.__eventHandlers[eventName]
    if (handlers) {
      for (let i = 0, l = handlers.length; i < l; i++) {
        handlers[i].apply(this, [])
      }
    }
  }
  /**
   * 开启事务
   */
  begineTransaction(callback: (...args: any[]) => void) {
    let transactionManager = _getTransactionManager()
    if (transactionManager && !this.duringTransaction()) {
      let transactionId = transactionManager.newTransaction()
      this.setTransactionId(transactionId)
      transactionManager.doBegin(transactionId, {
        isAsync: true,
        success: callback
      })
    } else {
      callback()
    }
  }
  /**
   * 提交事务
   */
  commitTransaction(callback: () => void) {
    callback() //提交事务交由原有逻辑处理
  }

  cloneForRuleCallback() {
    let rr = new RouteContext()
    rr.__businessResult__ = this.__businessResult__
    rr.__eventArgs__ = this.__eventArgs__
    rr.__inputParam = this.__inputParam
    rr.__outputParam = this.__outputParam
    rr.__params__ = this.__params__
    rr.__routeConfig__ = this.__routeConfig__
    rr.__ruleResultPool__ = this.__ruleResultPool__
    rr.__variables = this.__variables
    rr.snapshotId = this.snapshotId
    rr.__scopeId__ = this.__scopeId__
    return rr
  }

  getParentRuleContext() {
    return this.parentRuleContext
  }

  setParentRuleContext(ctx: RuleContext) {
    this.parentRuleContext = ctx
  }
}

/**
 *标记规则路由中断类型
 */
let markInterrupt = function (
  routeContext: RouteContext,
  parentRouteContext: RouteContext
) {
  if (routeContext && parentRouteContext) {
    let type = routeContext.getInterruptType()
    switch (type) {
      case routeContext.CURRENT:
        //parentRouteContext.markForInterrupt(routeRuntime.CURRENT);
        break
      case routeContext.PARENT:
        parentRouteContext.markForInterrupt(routeContext.PARENT)
        break
      case routeContext.INSTANCE:
        if (parentRouteContext.getScopeId() == routeContext.getScopeId()) {
          //如果当前规则路由上下文为中断状态，则设置当前域中父规则路由上下文
          parentRouteContext.markForInterrupt(routeContext.INSTANCE)
        }
        break
      case routeContext.GLOBAL:
        parentRouteContext.markForInterrupt(routeContext.GLOBAL)
    }
  }
}

/**
 *获取事务管理服务
 */
let _getTransactionManager = function () {
  //没有主动添加依赖，所以实时获取服务
  return transactionManager
}

RouteContext.Events = RouteContext.prototype.Events

export default RouteContext
