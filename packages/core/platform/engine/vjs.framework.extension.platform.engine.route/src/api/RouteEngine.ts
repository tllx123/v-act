import { aop } from '@v-act/vjs.framework.extension.platform.aop'
import { snapshotManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.snapshot'
import { WindowMappingManager as windowMappingManager } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.window.mapping'
import {
  ComponentPackData as componentPackData,
  ScopeTask,
  TaskManager as taskManager
} from '@v-act/vjs.framework.extension.platform.global'
import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import {
  ExceptionFactory as exceptionFactory,
  ExceptionHandler as exceptionHandler
} from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteMethodAccessor as accessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote.ruleset'
import { TransactionManager as transactionManager } from '@v-act/vjs.framework.extension.platform.transaction.manager'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'
import { uuid as uuidUtil } from '@v-act/vjs.framework.extension.util.uuid'

const execute = function (params) {
  let targetConfig = params.targetConfig,
    inputParam = params.inputParam,
    config = params.config,
    callback = params.callback
  let errorFunc
  if (config && config.error) {
    errorFunc = config.error
  }
  let sourceType = targetConfig.sourceType
  if ('server-ruleSet' === sourceType) {
    //后台活动集
    exeServerRuleSet(targetConfig, inputParam, config, callback)
  } else if ('client-ruleSet' === sourceType) {
    //前端活动集
    let windowCode = targetConfig.windowCode
    if (windowCode) {
      //如果存在窗体编号，则为窗体活动集
      exeWindowRuleSet(targetConfig, inputParam, config, callback)
    } else {
      //构件活动集
      exeComponentRuleSet(targetConfig, inputParam, config, callback)
    }
  } else {
    _fireExceptionEvent(config.currRouteContext)
    let message =
      '[RouteUtil.exeRuleSet]未能识别活动集类型[' +
      sourceType +
      ']，请检查！活动集编号：' +
      targetConfig.ruleSetCode
    if (errorFunc) {
      let e = exceptionFactory.create({ message: message })
      errorFunc.apply(this, [e])
    } else {
      throw Error(message)
    }
  }
}

let _exeFunc = function (func, self, args) {
  if (typeof func == 'function') {
    return func.apply(self, args)
  }
  return null
}

let _fireExceptionEvent = function (routeContext) {
  if (routeContext) routeContext.markForInterrupt(routeContext.EXCEPTION)
}

const executeWindowRoute = function (params) {
  let windowScope = scopeManager.getWindowScope()
  let ps = {
    targetConfig: {
      sourceType: 'client-ruleSet',
      invokeType: 'local',
      componentCode: windowScope.getComponentCode(),
      windowCode: windowScope.getWindowCode(),
      ruleSetCode: params.ruleSetCode
    },
    inputParam: params.args,
    config: {
      parentRouteContext: params.parentRouteContext,
      error: params.fail
    },
    callback: params.success
  }
  exports.execute(ps)
}

/**
 *执行后台活动集
 */
let exeServerRuleSet = function (targetConfig, inputParam, config, callback) {
  let DBFactory = sb.getService(
    'vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
  )
  let params = []
  for (let attr in inputParam) {
    let val = inputParam[attr]
    let type = DBFactory.isDatasource(val) ? 'entity' : typeof val
    params.push({
      paramName: attr,
      paramType: type,
      paramValue: val
    })
  }
  let componentCode = targetConfig.componentCode
  let ruleSetCode = targetConfig.ruleSetCode
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(componentCode, ruleSetCode)
  if (newInfo) {
    componentCode = newInfo.componentCode
    if (newInfo.funcCode) {
      ruleSetCode = newInfo.funcCode
    }
  }
  //执行后台活动集
  let sConfig = {
    ruleSetCode: ruleSetCode,
    commitParams: params,
    componentCode: componentCode,
    windowCode: targetConfig.windowCode,
    isAsync: true
  }
  let parentRouteContext = config.parentRouteContext
  //获取方法所属的规则路由。
  let parentRuleContext = config.currentRouteContext
    ? config.currentRouteContext.getParentRuleContext()
    : null
  //能执行后台活动集的都是构件活动集
  let rr = initRouteContext({
    //componentCode,null,ruleSetCode,"component",parentRouteContext,'server'
    componentCode: componentCode,
    ruleSetCode: ruleSetCode,
    routeType: 'component',
    parentRouteContext: parentRouteContext,
    parentRuleContext: parentRuleContext,
    type: 'server'
  })
  rr.setExceptionHandler(config.error)
  let tmpUUID = uuidUtil.generate()
  //监控标志 用于标识路由
  rr._monitorSign = 'ROUTE_' + tmpUUID
  eventManager.fire({
    event: eventManager.Events.BeforeRouteExe,
    args: [rr]
  })
  let routeCfg = rr.getRouteConfig()
  let handler = (function () {
    return function () {
      sConfig['transactionId'] = rr.getTransactionId()
      let debuggerId = aop.startServerRuleDebugger({
        transactionId: rr.getTransactionId()
      })
      if (debuggerId != null) {
        sConfig['debuggerId'] = debuggerId
        sConfig['devId'] = aop.getDevId()
      }
      let scopeId = scopeManager.getCurrentScopeId()
      let snapshotId = snapshotManager.takeSnapshot()
      let errorFunc = config.error
      let task = new ScopeTask(
        scopeId,
        false,
        function (result) {
          var pros = this.props
          var sId = pros.scopeId
          var rre = pros.routeRuntime
          var ssId = rre.snapshotId
          aop.stopServerRuleDebugger(pros.debuggerId)
          snapshotManager.begine(ssId)
          try {
            scopeManager.openScope(sId)
            rre.setScopeId(sId)
            var args = [result]
            _exeFunc(pros.callback, rre, args)
            _exeFunc(pros.success, rre, args)
            scopeManager.closeScope()
            snapshotManager.end()
            //如果活动集属于顶级活动集，则需要提交事务
            if (!rre.isInRouteContext()) {
              _commitIfNecessary(rre)
            }
          } catch (re) {
            snapshotManager.end()
            _rollbackIfNecessary(rre)
            if (pros.errorFunc) {
              _exeFunc(pros.errorFunc, rre, [re])
            } else {
              exceptionHandler.handle(re)
              throw re
            }
          }
        },
        {
          scopeId: scopeId,
          callback: config.callback,
          routeRuntime: rr,
          success: callback,
          debuggerId: debuggerId,
          errorFunc: errorFunc
        }
      )
      let windowCode = targetConfig.windowCode
      if (!windowCode) {
        sConfig['componentCode'] = componentCode
      }
      let taskId = taskManager.addTask(task)
      sConfig.afterResponse = (function (tId, routeRuntime) {
        return function (result) {
          eventManager.fire({
            event: eventManager.Events.AfterRouteExe,
            args: [rr]
          })
          if (taskManager.exists(taskId)) {
            taskManager.execTaskById(taskId, [result])
          } else {
            _commitIfNecessary(routeRuntime)
          }
        }
      })(taskId, rr)
      let errorCb = (function (routeRuntime) {
        return function (e) {
          eventManager.fire({
            event: eventManager.Events.AfterRouteExe,
            args: [rr]
          })
          aop.stopServerRuleDebugger(debuggerId)
          _rollbackIfNecessary(routeRuntime)
          _fireExceptionEvent(routeRuntime)
          if (errorFunc) {
            _exeFunc(errorFunc, routeRuntime, [e])
          } else {
            rr.handleException(e)
            //							exceptionHandler.handle(e);
          }
        }
      })(rr)
      sConfig.error = errorCb
      accessor.invoke(sConfig)
    }
  })()
  //执行后台规则时，判断如果当前事务未开启，则开启事务，反之则不做处理
  if (
    routeCfg &&
    routeCfg.getTransactionType() == 'TRANSACTION' &&
    !rr.duringTransaction()
  ) {
    let transactionId = transactionManager.newTransaction()
    rr.setTransactionId(transactionId)
    transactionManager.doBegin(transactionId, {
      isAsync: true,
      success: handler
    })
  } else {
    handler()
  }
}

/**
 *执行窗体活动集
 */
let exeWindowRuleSet = function (targetConfig, inputParam, config, callback) {
  let invokeType = targetConfig.invokeType
  let ruleSetCode = targetConfig.ruleSetCode
  let parentRouteContext = config.parentRouteContext
  let parentRuleContext = config.currentRouteContext
    ? config.currentRouteContext.getParentRuleContext()
    : null
  let componentCode = targetConfig.componentCode
  let windowCode = targetConfig.windowCode
  let iden =
    windowCode && '' != windowCode
      ? windowCode + '.' + ruleSetCode
      : ruleSetCode
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(componentCode, iden)
  if (newInfo) {
    componentCode = newInfo.componentCode
    windowCode = newInfo.windowCode
    if (newInfo.funcCode) {
      ruleSetCode = newInfo.funcCode
    }
  }
  let scopeIds = config.instanceRefs
  let errorFunc = config.error
  //如果为api或extensionPoint调用方式，窗体实例Id必须传，否则报错
  if (invokeType == 'api' || invokeType == 'extensionPoint') {
    if (windowCode && (!scopeIds || scopeIds.length == 0)) {
      _fireExceptionEvent(parentRouteContext)
      let ep = exceptionFactory.create({
        type: exceptionFactory.TYPES.Dialog,
        message: '跨构件执行活动集,请先打开目标组件容器！'
      })
      if (errorFunc) {
        _exeFunc(errorFunc, this, [ep])
      } else {
        throw ep
      }
    }
  }
  if (scopeIds && scopeIds.length > 0) {
    //modify by xiedh 2015-10-31 cause:当批量执行活动集回调时，活动集回调中有异步，并且开启事务，会造成事务问题
    let scopeId = scopeIds.pop()
    let cb = config.callback
    let cbk = (function () {
      return function () {
        _exeFunc(cb, this, arguments)
        let instanceRefs = config.instanceRefs
        if (instanceRefs.length > 0) {
          exeWindowRuleSet(targetConfig, inputParam, config, callback)
        } else {
          _exeFunc(callback, this, arguments)
        }
        //					if(parentRouteContext){
        //						eventManager.fire({
        //							event: eventManager.Events.AfterRouteExe,
        //							args: [parentRouteContext]
        //						});
        //					}
      }
    })(
      cCode,
      wCode,
      ruleSetCode,
      scopeId,
      inputParam,
      parentRouteContext,
      config
    )
    if (!scopeId) {
      _fireExceptionEvent(parentRouteContext)
      let ep = exceptionFactory.create({
        type: exceptionFactory.TYPES.Dialog,
        message: '跨构件执行活动集,请先打开目标组件容器！'
      })
      if (errorFunc) {
        _exeFunc(errorFunc, this, [ep])
      } else {
        throw ep
      }
    }
    scopeManager.openScope(scopeId)
    let scope = scopeManager.getWindowScope()
    let cCode = scope.getComponentCode()
    let wCode = scope.getWindowCode()
    scopeManager.closeScope()
    let cfg = Object.create(config)
    cfg['callback'] = cbk
    //cCode,wCode,ruleSetCode,scopeId,inputParam,parentRouteContext,cfg
    _exeWindowHandler({
      componentCode: cCode,
      windowCode: wCode,
      ruleSetCode: ruleSetCode,
      scopeId: scopeId,
      inputParam: inputParam,
      parentRouteContext: parentRouteContext,
      parentRuleContext: parentRuleContext,
      config: cfg
    })
  } else {
    //若没传窗体实例，则执行当前窗体的活动集
    let scopeId = scopeManager.getCurrentScopeId()
    if (scopeManager.isWindowScope(scopeId)) {
      //如果当前域不是窗体域，则忽略
      let scope = scopeManager.getScope(scopeId)
      if (
        scope.getWindowCode() == windowCode &&
        scope.getComponentCode() == componentCode
      ) {
        //当前窗体域跟窗体编号要匹配
        let cbk = config.callback
        let cb = (function () {
          return function () {
            _exeFunc(cbk, this, arguments)
            _exeFunc(callback, this, arguments)
            //							if(parentRouteContext){
            //								eventManager.fire({
            //									event: eventManager.Events.AfterRouteExe,
            //									args: [parentRouteContext]
            //								});
            //							}
          }
        })()
        let cfg = Object.create(config)
        cfg.callback = cb
        _exeWindowHandler({
          componentCode: componentCode,
          windowCode: windowCode,
          ruleSetCode: ruleSetCode,
          scopeId: scopeId,
          inputParam: inputParam,
          parentRouteContext: parentRouteContext,
          parentRuleContext: parentRuleContext,
          config: cfg
        })
      } else {
        _exeFunc(callback, this, arguments)
      }
    } else {
      _exeFunc(callback, this, arguments)
    }
  }
}
let getTargetRuleInfo = function (params) {
  let scopeId = params.scopeId
  let ruleSetCode = params.ruleSetCode
  //兼容处理：移动窗体，客户端调用窗体方法传过来是构件域id
  let scope = scopeManager.isComponentScope(scopeId)
    ? scopeManager.getWindowScope(scopeId)
    : scopeManager.getScope(scopeId)
  let componentCode = scope.getComponentCode()
  let windowCode = scope.getWindowCode()
  if (componentCode && windowCode) {
    let extendId = scope.getExtendId()
    if (extendId) {
      let newRuleSetCode = windowMappingManager.getRuleset({
        componentCode: componentCode,
        windowCode: windowCode,
        ruleSetCode: ruleSetCode
      })
      if (newRuleSetCode) {
        ruleSetCode = newRuleSetCode
        return getTargetRuleInfo({
          scopeId: extendId,
          ruleSetCode: ruleSetCode
        })
      }
    }
  }
  return {
    scope: scope,
    ruleSetCode: ruleSetCode
  }
}
/**
 * 替换构件包信息
 * */
let replaceComponentPackInfo = function (componentCode, windowCode) {
  let result = null
  let info = {
    componentCode: componentCode,
    code: windowCode
  }
  if (componentPackData.existMapping(info)) {
    let newInfo = componentPackData.getMapping(info)
    if (newInfo) {
      result = {}
      for (let key in newInfo) {
        if (newInfo.hasOwnProperty(key)) {
          result[key] = newInfo[key]
        }
      }
    }
  }
  return result
}
/**
 * 执行窗体活动集
 * */
let _exeWindowHandler = function (params) {
  //componentCode,windowCode,ruleSetCode,scopeId,inputParam,parentRouteContext,config
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    ruleSetCode = params.ruleSetCode,
    scopeId = params.scopeId,
    inputParam = params.inputParam,
    parentRouteContext = params.parentRouteContext,
    parentRuleContext = params.parentRuleContext,
    config = params.config
  let newParams = getTargetRuleInfo(params)
  if (newParams) {
    let _scope = newParams.scope
    let _scopeId = _scope.getInstanceId()
    if (_scopeId != scopeId) {
      componentCode = _scope.getComponentCode()
      windowCode = _scope.getWindowCode()
      scopeId = _scopeId
      ruleSetCode = newParams.ruleSetCode
    }
  }

  let routeContext = initRouteContext({
    componentCode: componentCode,
    windowCode: windowCode,
    ruleSetCode: ruleSetCode,
    routeType: 'window',
    parentRouteContext: parentRouteContext,
    parentRuleContext: parentRuleContext,
    completed: config.completed
  })
  if (routeContext) {
    putRouteContextCallback(routeContext, config.callback)
    //获取活动集配置信息
    let routeCfg = routeContext.getRouteConfig()
    let errorFunc = config.error
    if (!routeCfg) {
      let e = exceptionFactory.create({
        message:
          '获取窗体活动集定义信息失败，请检查配置！构件编号：' +
          componentCode +
          ',窗体编号：' +
          windowCode +
          ',活动集编号：' +
          ruleSetCode
      })
      if (errorFunc) {
        errorFunc.apply(routeContext, [e])
      } else {
        throw e
      }
    }
    routeContext.setExceptionHandler(errorFunc)
    let handler = routeCfg.getHandler()
    routeContext.setScopeId(scopeId)
    let tmpUUID = uuidUtil.generate()
    //监控标志 用于标识路由
    routeContext._monitorSign = 'ROUTE_' + tmpUUID
    eventManager.fire({
      event: eventManager.Events.BeforeRouteExe,
      args: [routeContext]
    })
    scopeManager.openScope(scopeId)
    let snapshotId = routeContext.snapshotId
    snapshotManager.begine(snapshotId)
    try {
      _exeHandler(handler, routeContext, routeCfg, inputParam)
    } catch (e) {
      if (errorFunc) {
        errorFunc.apply(routeContext, [e])
      } else {
        throw e
      }
    } finally {
      snapshotManager.end()
    }
    scopeManager.closeScope()
  }
}

let putRouteContextCallback = function (routeContext, callback) {
  if (callback) {
    let func = function (result) {
      scopeManager.openScope(this.scopeId)
      let output = {}
      for (let attr in result) {
        //遍历结果集,属性值是DB，则反序列化
        let val = result[attr]
        output[attr] = val
      }
      this.callback.apply(this.routeContext, [output])
      scopeManager.closeScope()
    }
    routeContext.onRouteCallBack(
      sb.util.functions.bind(func, {
        scopeId: scopeManager.getCurrentScopeId(),
        callback: callback,
        routeContext: routeContext
      })
    )
  }
}

/**
 *执行构件活动集
 */
let exeComponentRuleSet = function (
  targetConfig,
  inputParam,
  config,
  callback
) {
  let componentCode = targetConfig.componentCode
  let ruleSetCode = targetConfig.ruleSetCode
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(componentCode, ruleSetCode)
  if (newInfo) {
    componentCode = newInfo.componentCode
    if (newInfo.funcCode) {
      ruleSetCode = newInfo.funcCode
    }
  }
  let viewInit = sb.getService(
    'vjs.framework.extension.platform.init.view.ViewInit'
  )
  let scopeId = scopeManager.getCurrentScopeId()
  let errorFunc = config.error
  viewInit.initComponentSchema({
    componentCode: componentCode,
    success: function () {
      _exeComponentHandler({
        componentCode: componentCode,
        ruleSetCode: ruleSetCode,
        inputParam: inputParam,
        config: config,
        scopeId: scopeId,
        callback: callback
      })
    },
    error: function (error) {
      _fireExceptionEvent(config.parentRouteContext)
      let ep
      if (error && exceptionFactory.isException(error)) {
        /* 如果入参为平台对象，则不需要创建异常对象 Task20210910023 */
        ep = error
      } else {
        ep = exceptionFactory.create({
          type: exceptionFactory.TYPES.System,
          message:
            '执行目标构件活动集出错！请检查目标构件:' +
            componentCode +
            '是否已部署！'
        })
      }
      if (errorFunc) {
        errorFunc.apply(this, [ep])
      } else {
        throw ep
      }
    }
  })
}

let _exeComponentHandler = function (params) {
  let componentCode = params.componentCode,
    ruleSetCode = params.ruleSetCode,
    inputParam = params.inputParam,
    config = params.config,
    scopeId = params.scopeId,
    callback = params.callback
  let parentRouteContext = config.parentRouteContext
  let parentRuleContext = config.currentRouteContext
    ? config.currentRouteContext.getParentRuleContext()
    : null
  let routeContext = initRouteContext({
    //componentCode, null, ruleSetCode, "component", parentRouteContext
    componentCode: componentCode,
    ruleSetCode: ruleSetCode,
    routeType: 'component',
    parentRouteContext: parentRouteContext,
    parentRuleContext: parentRuleContext
  })
  if (routeContext) {
    //move to line 458
    //			eventManager.fire({
    //				event:eventManager.Events.BeforeRouteExe,
    //				args : [routeContext]
    //			});
    let cb = config.callback
    let cbk = (function () {
      return function () {
        _exeFunc(cb, this, arguments)
        _exeFunc(callback, this, arguments)
        //					eventManager.fire({
        //						event:eventManager.Events.AfterRouteExe,
        //						args : [routeContext]
        //					});
      }
    })()
    let errorFunc = config.error
    routeContext.setExceptionHandler(errorFunc)
    putRouteContextCallback(routeContext, cbk)
    let routeCfg = routeContext.getRouteConfig()
    if (!routeCfg) {
      let ep = exceptionFactory.create({
        message:
          '获取构件活动集定义信息失败，请检查配置！构件编号：' +
          componentCode +
          ',活动集编号：' +
          ruleSetCode
      })
      if (errorFunc) {
        errorFunc.apply(routeContext, [ep])
      } else {
        throw ep
      }
    }
    let handler = routeCfg.getHandler()
    //TODO 执行构件活动集临时处理
    if (handler) {
      handler = (function (func) {
        return function (rc) {
          var result = false
          var newScopeId = scopeManager.createComponentScope({
            parentScopeId: scopeId,
            componentCode: componentCode
          })
          scopeManager.openScope(newScopeId)
          rc.setScopeId(newScopeId)
          var tmpUUID = uuidUtil.generate()
          //监控标志 用于标识路由
          rc._monitorSign = 'ROUTE_' + tmpUUID
          eventManager.fire({
            event: eventManager.Events.BeforeRouteExe,
            args: [rc]
          })
          var snapshotId = routeContext.snapshotId
          snapshotManager.begine(snapshotId)
          try {
            var rs = func.apply(func, [rc])
            result = rs === false ? false : true
          } catch (e) {
            if (errorFunc) {
              var ep = exceptionFactory.create({ error: e })
              errorFunc.apply(rc, [ep])
            } else {
              throw e
            }
          } finally {
            scopeManager.closeScope()
            snapshotManager.end()
          }
          return result
        }
      })(handler)
    }
    _exeHandler(handler, routeContext, routeCfg, inputParam)
  }
}

let _exeHandler = function (handler, routeContext, routeCfg, inputParam) {
  if (inputParam) {
    routeContext.setInputParams(inputParam)
  }
  try {
    return _exeFunc(handler, handler, [routeContext])
  } catch (re) {
    _rollbackIfNecessary(routeContext)
    _fireExceptionEvent(routeContext)
    throw re
  }
}

let _commitIfNecessary = function (routeContext) {
  _doTransaction(routeContext, 'commit')
}

let _rollbackIfNecessary = function (routeContext) {
  _doTransaction(routeContext, 'rollback')
}

let _doTransaction = function (routeContext, type) {
  try {
    // 事务回滚
    let transactionManager = _getTransactionManager()
    if (!transactionManager) return
    let transactonId = routeContext.getTransactionId()
    if (transactionManager.isBegined(transactonId)) {
      if (type == 'commit') {
        transactionManager.doCommit(transactonId)
      } else {
        transactionManager.doRollback(transactonId)
      }
    }
    routeContext.clearTransaction()
    transactionManager.remove(transactonId)
  } catch (e) {
    logUtil.error(
      '执行规则异常中断，系统自动' +
        (type == 'commit' ? '提交' : '回滚') +
        '规则事务失败。' +
        e.toString()
    )
  }
}

/**
 *获取事务管理服务
 */
let _getTransactionManager = function () {
  return sb.getService('vjs.framework.extension.platform.transaction.manager')
}

/**
 *初始化路由运行时上下文
 */
let initRouteContext = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    ruleSetCode = params.ruleSetCode,
    routeType = params.routeType,
    parentRouteContext = params.parentRouteContext,
    parentRuleContext = params.parentRuleContext,
    type = params.type,
    completed = params.completed
  let routeCfg
  if (routeType == 'component') {
    let componentRoute = sb.getService(
      'vjs.framework.extension.platform.data.storage.schema.route.ComponentRoute'
    )
    routeCfg = componentRoute.getRoute({
      componentCode: componentCode,
      routeCode: ruleSetCode
    })
  } else {
    let windowRoute = sb.getService(
      'vjs.framework.extension.platform.data.storage.schema.route.WindowRoute'
    )
    routeCfg = windowRoute.getRoute({
      componentCode: componentCode,
      windowCode: windowCode,
      routeCode: ruleSetCode
    })
  }
  //获取活动集配置信息
  if (!routeCfg && type != 'server') {
    let exceptionDatas = [
      { name: '构件编码', code: 'componentCode', value: componentCode }
    ]
    let name = '客户端'
    let winVal = ''
    if (windowCode) {
      name = '窗体'
      winVal = '，窗体编码：' + windowCode
      exceptionDatas.push({
        name: '窗体编码',
        code: 'windowCode',
        value: windowCode
      })
    }
    exceptionDatas.push({
      name: name + '方法编码',
      code: 'activeCode',
      value: ruleSetCode
    })
    let exception = factory.create({
      type: exceptionFactory.TYPES.Config,
      exceptionDatas: exceptionDatas,
      message:
        name +
        '方法不存在，请检查配置，构件编码：' +
        componentCode +
        winVal +
        '，方法编码：' +
        ruleSetCode
    })
    if (
      typeof environment.useCompatibleMode == 'function' &&
      environment.useCompatibleMode() != false
    ) {
      //沿用旧版逻辑，不存在的活动集不弹提示框，只打印日志Task20210625044
      exception.markTiped()
    }
    throw exception
    //			logUtil.log("[RouteEngie.initRouteContext]未找到可执行的规则路由,路由code为："+ruleSetCode);
    return null
  }
  let RouteContext = sb.getService(
    'vjs.framework.extension.platform.interface.route.RouteContext'
  )
  let ctx = new RouteContext(routeCfg, parentRouteContext)
  ctx.setParentRuleContext(parentRuleContext)
  if (completed) {
    ctx.onCompleteCallback(completed)
  }
  if (parentRouteContext && parentRouteContext.snapshotId) {
    ctx.snapshotId = parentRouteContext.snapshotId
  } else {
    ctx.snapshotId = snapshotManager.takeSnapshot()
  }
  return ctx
}

export { execute, executeWindowRoute }
