import { aop } from '@v-act/vjs.framework.extension.platform.aop'
import { WindowRoute as windowRoute } from '@v-act/vjs.framework.extension.platform.data.storage.schema.route'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { callbackFactory } from '@v-act/vjs.framework.extension.platform.interface.event'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import {
  RouteContext,
  RuleContext
} from '@v-act/vjs.framework.extension.platform.interface.route'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { TransactionManager as transactionManager } from '@v-act/vjs.framework.extension.platform.transaction.manager'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'
import { ObjectUtil as objectUtil } from '@v-act/vjs.framework.extension.util.object'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

import RuleExecutor from '../impl/RuleExecutor'
import * as ruleFactory from '../impl/RuleFactory'

let _isBusinessRule = function (ruleInstance) {
  return ruleInstance.hasOwnProperty('transactionType')
}

const execute = function (params) {
  let ruleCode = params.ruleCode,
    routeCtx = params.routeContext
  //如果事务状态为回滚，中断规则链执行
  let transactionManager = _getTransactionManager()
  let transactionId = routeCtx.getTransactionId()
  if (transactionManager && transactionManager.isRollbacked(transactionId)) {
    return false
  }
  let routeConfig = routeCtx.getRouteConfig()
  if (!routeConfig) {
    let scope = scopeManager.getScope()
    let componentCode = scope.getComponentCode()
    let windowCode = scopeManager.isWindowScope(scope.getInstanceId())
      ? scope.getWindowCode()
      : null
    let arr = ruleCode.split('.')
    let hasWinCode = arr.length == 3
    let comCode = arr[0]
    let winCode = hasWinCode ? arr[1] : null
    let activeCode = hasWinCode ? arr[2] : arr[1]
    let activeInfo = activeCode
    let name = '活动集编码'
    if (componentCode != comCode || windowCode != winCode) {
      //非同一个窗体/构件内，显示具体的构件/窗体编码
      name = '活动集信息'
      activeInfo =
        '构件编码：' +
        comCode +
        (hasWinCode ? ',窗体编码：' + winCode : '') +
        ',活动集编码：' +
        activeCode
    }
    let exceptionDatas = [
      { name: '构件编码', code: 'componentCode', value: comCode }
    ]
    if (hasWinCode) {
      exceptionDatas.push({
        name: '窗体编码',
        code: 'windowCode',
        value: windowCode
      })
    }
    exceptionDatas.push({ name: name, code: 'activeInfo', value: activeInfo })
    throw exceptionFactory.create({
      type: exceptionFactory.TYPES.Config,
      exceptionDatas: exceptionDatas,
      message: '获取活动集' + activeCode + '信息失败,请检查配置！'
    })
  }
  let ruleInstance = routeConfig.getRuleInstance(ruleCode)
  if (!ruleInstance) {
    let scope = scopeManager.getScope()
    throw exceptionFactory.create({
      message:
        '获取规则定义信息失败,请检查配置！构件编号：' +
        scope.get('componentCode') +
        ',窗体编号：' +
        scope.get('windowCode') +
        ',活动集编号：' +
        routeConfig.getCode() +
        ',规则编号：' +
        ruleCode
    })
  }
  let ruleContext = new RuleContext(ruleInstance, routeCtx)
  let executor = new RuleExecutor(ruleContext)
  executor.on(executor.EVENTS.BEGIN, function () {
    let ruleCtx = this.getRuleContext()
    let ruleCfg = ruleCtx.getRuleCfg()
    if (_isBusinessRule(ruleCfg) && scopeManager.getScope()) {
      //内置规则无需打印
      log.debug(
        '[RuleExecutor.execute]开始执行规则，' +
          _getRuleMessage(ruleCtx) +
          '，执行条件：' +
          ruleCfg.condition
      )
    }
  })
  executor.on(executor.EVENTS.END, function () {
    let ruleCtx = this.getRuleContext()
    let ruleCfg = ruleCtx.getRuleCfg()
    if (_isBusinessRule(ruleCfg) && scopeManager.getScope()) {
      //内置规则无需打印
      log.debug(
        '[RuleExecutor.execute]规则执行结束，' +
          _getRuleMessage(ruleCtx) +
          '，执行耗时：' +
          this.getExeTime() +
          '毫秒'
      )
    }
  })
  let handler = _getRuleCallbackHandler(ruleContext)
  ruleContext.setRouteCallback(handler)
  let routeCallback = params.routeCallback
  if (routeCallback) {
    ruleContext.setRouteCallback(routeCallback)
  }
  let ruleCallback = params.ruleCallback
  if (ruleCallback) {
    ruleContext.setRuleCallback(ruleCallback)
  }
  //TODO
  //FormulaEngine.Map.prototype.routeContext = routeCtx;
  routeCtx.setRuleInstanceId(ruleCode)
  _dealTransaction(routeCtx, ruleInstance)
  if (ruleInstance.needLog) {
    //执行规则前先添加日志信息，防止规则中关闭组件造成日志信息无法生成
    routeCtx.setLogInfo()
  }
  if (_isBusinessRule(ruleInstance)) {
    //业务规则才需要调试，内置规则不需要
    aop.beforeRuleExecute(routeConfig.getCode(), ruleCode, routeCtx)
  }
  let retValue = executor.execute(ruleInstance.ruleCode, ruleContext)
  return retValue
}

let _getRuleMessage = function (ruleCtx) {
  let ruleCfg = ruleCtx.getRuleCfg()
  let msg = []
  let scope = scopeManager.getScope()
  msg.push('构件编号：')
  msg.push(scope.getComponentCode())
  msg.push(',')
  if (scopeManager.isWindowScope(scope.getInstanceId())) {
    msg.push('窗体编号：')
    msg.push(scope.getWindowCode())
    msg.push(',')
  }
  let routeCtx = ruleCtx.getRouteContext()
  if (routeCtx && routeCtx.getRouteConfig()) {
    let routeCfg = routeCtx.getRouteConfig()
    msg.push('方法编码：')
    msg.push(routeCfg.getCode())
    msg.push(',')
  }
  if (ruleCfg.ruleName) {
    msg.push('规则名称：')
    msg.push(ruleCfg.ruleName)
    msg.push(',')
  }
  msg.push('规则编码：')
  msg.push(ruleCfg.ruleCode)
  msg.push(',')
  if (ruleCfg.instanceCode) {
    msg.push('实例编码：')
    msg.push(ruleCfg.instanceCode)
  }
  return msg.join('')
}

const executeRouteRule = function (params) {
  let ruleSetCode = params.ruleSetCode,
    ruleCode = params.ruleCode,
    args = params.args
  let windowScope = scopeManager.getWindowScope()
  let routeCfg = windowRoute.getRouteByRuleInstanceCode({
    componentCode: windowScope.getComponentCode(),
    windowCode: windowScope.getWindowCode(),
    ruleCode: ruleCode
  })
  let scopeId = scopeManager.getCurrentScopeId()
  let rr = new RouteContext(routeCfg)
  rr.isVirtual = true //TODO 标记为虚拟路由，用于前端执行耗时展示
  rr.setScopeId(scopeId)
  args = Array.prototype.slice.call(args, 0)
  _putArgsToRouteContext(rr, args)
  let mapping = params.argMapping
  let argIndex = params.argIndex
  if (scopeId) {
    scopeManager.openScope(scopeId)
    let dtd = $.Deferred()
    let completeCB = function () {
      dtd.resolve()
    }
    let scope = scopeManager.getScope(scopeId)
    let dtdList = scope.get('completeDTDList') || []
    dtdList.push(dtd)
    scope.set('completeDTDList', dtdList)
    rr.onCompleteCallback(completeCB)
  }
  if (routeCfg) {
    let instance = routeCfg.getRuleInstance(ruleCode)
    let inParam = jsonUtil.json2obj(instance.inParams)
    if (Object(inParam) == inParam) {
      let invokeParams = null
      if (!objectUtil.isEmpty(argIndex)) {
        //新版方法输入与事件参数映射
        invokeParams = []
        let argList = args[0]
        for (let key in argIndex) {
          if (argIndex.hasOwnProperty(key)) {
            let index = argIndex[key]
            rr.setInputParam(key, argList[index])
            invokeParams.push({
              paramCode: key,
              paramType: 'expression',
              paramValue: 'BR_IN_PARENT.' + key
            })
          }
        }
      } else if (!objectUtil.isEmpty(mapping)) {
        invokeParams = []
        let obj = args[0]
        if (Object(obj) !== obj) {
          throw exceptionFactory.create({
            message: '事件参数输入类型有误，请检查！',
            type: exceptionFactory.TYPES.UnExpected
          })
        }
        for (let key in mapping) {
          if (mapping.hasOwnProperty(key)) {
            let va = mapping[key]
            rr.setInputParam(va, obj[key])
            invokeParams.push({
              paramCode: va,
              paramType: 'expression',
              paramValue: 'BR_IN_PARENT.' + va
            })
          }
        }
      }
      //调整规则实例信息，传递事件参数
      inParam.invokeParams = invokeParams
      instance.inParams = jsonUtil.obj2json(inParam)
    }
  }
  execute({
    ruleCode: ruleCode,
    routeContext: rr,
    routeCallback: function () {
      rr.fireRouteCallBack()
    }
  })
}

let _putArgsToRouteContext = function (routeRuntime, args) {
  let len = args.length
  let index = -1
  for (let i = len - 1; i >= 0; i--) {
    if (typeof args[i] == 'object' && !callbackFactory.isCallback(args[i])) {
      index = i
      break
    }
  }
  let lastArgs = index != -1 ? args[index] : undefined //参数有增加，不能直接取最后一个。Task20210201108
  if (
    lastArgs &&
    typeof lastArgs == 'object' &&
    typeof lastArgs.hasOwnProperty == 'function' &&
    lastArgs.hasOwnProperty('isPrimitive') &&
    !lastArgs.isPrimitive
  ) {
    routeRuntime.putEventArgument(lastArgs)
    args.splice(index, 1)
    //			args.pop();
  }
  let types = callbackFactory.Types
  for (let i = 0, l = args.length; i < l; i++) {
    let arg = args[i]
    if (callbackFactory.isCallback(arg)) {
      let type = arg.getType()
      let handler = arg.getHandler()
      if (type == types.Success) {
        routeRuntime.onRouteCallBack(handler)
      } else if (type == types.Fail) {
        routeRuntime.setExceptionHandler(handler)
        /*routeRuntime.on({
                    "eventName":routeRuntime.Events.EXCEPTION,
                    "handler":handler
                });*/
      }
      arrayUtil.remove(args, arg)
      i--
    }
  }
  routeRuntime.setParams(args)
}

const executeWithRouteCallback = function (params, callback) {
  params.routeCallback = callback
  execute(params)
}

let _dealTransaction = function (routeRuntime, ruleInstance) {
  let transactionManager = _getTransactionManager()
  if (!transactionManager) return
  let transactionType = ruleInstance.transactionType
  let instId = ruleInstance.instanceCode
  if (transactionType == 'TRANSACTION' && !routeRuntime.duringTransaction()) {
    //该规则有事务,如果路由上下文中未开启事务，则开启事务
    let transactionId = transactionManager.newTransaction()
    routeRuntime.setTransactionId(transactionId)
    transactionManager.doBegin(transactionId)
    if (environment.isDebug()) {
      log.debug(
        '规则开启事务，规则名称：' +
          ruleInstance.ruleName +
          '，规则编号：' +
          ruleInstance.ruleCode +
          '，规则实例Id：' +
          ruleInstance.instanceCode +
          ',规则事务类型：' +
          ruleInstance.transactionType
      )
    }
  } else if (
    !routeRuntime.isInTransaction(instId) &&
    routeRuntime.duringTransaction()
  ) {
    //该规则没有事务，如果路由上下文中已开启事务，则提交事务
    let transactionId = routeRuntime.getTransactionId()
    transactionManager.doCommit(transactionId)
    transactionManager.remove(transactionId)
    routeRuntime.clearTransaction()
    if (environment.isDebug()) {
      log.debug(
        '规则提交事务，规则名称：' +
          ruleInstance.ruleName +
          '，规则编号：' +
          ruleInstance.ruleCode +
          '，规则实例Id：' +
          ruleInstance.instanceCode +
          ',规则事务类型：' +
          ruleInstance.transactionType
      )
    }
  }
}

/**
 *获取事务管理服务
 */
let _getTransactionManager = function () {
  return transactionManager
}

/**
 * 获取规则执行后处理器
 */
let _getRuleCallbackHandler = function () {
  return function (routeRuntime, ruleContext) {
    let ruleStatus = ruleContext.getRuleStatus()
    let ruleInstance = ruleContext.getRuleCfg()
    let instanceCode = ruleInstance.instanceCode
    let routeCfg = routeRuntime.getRouteConfig()
    routeRuntime.setRuleResult(instanceCode, ruleStatus)
    routeRuntime.setBusinessRuleResult(
      instanceCode,
      ruleContext.getAllBusinessRuleResult()
    )
    if (_isBusinessRule(ruleInstance)) {
      //业务规则才需要调试，内置规则不需要
      aop.ruleExecuted(routeCfg.getCode(), instanceCode, routeRuntime)
    }
  }
}

const createRuleException = function (params) {
  return ruleFactory.createRuleException(params)
}

export {
  createRuleException,
  execute,
  executeRouteRule,
  executeWithRouteCallback,
  initModule
}
