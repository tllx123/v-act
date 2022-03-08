/**
 * 方法
 * @desc 提供方法接口，使用前请先import：vds.import("vds.method.*")
 * @namespace vds/method
 * @module method
 * @catalog 工具方法/方法
 * @example
 * vds.import("vds.method.*");
 * vds.method.get("funcode");
 */

import {
  ComponentRoute as componentRoute,
  WindowRoute as windowRoute
} from '@v-act/vjs.framework.extension.platform.data.storage.schema.route'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.engine.route'
import { RouteContext } from '@v-act/vjs.framework.extension.platform.interface.route'
import { ComponentInit as componentInit } from '@v-act/vjs.framework.extension.platform.services.init'
import { ApplicationParam as appData } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { Mediator as mediator } from '@v-act/vjs.framework.extension.system.mediator'

import * as Method from './Method'

/**
 * 获取方法对象
 * @param {String} methodCode 方法编码
 * @param {String} componentCode 方法所在构件的编码（可选：方法所属构件非当前构件时需要传入）
 * @param {String} windowCode 方法所在窗体的编码（构件方法不用传）（可选）
 * @returns {@link Method} 方法对象，若方法不存在，则返回null
 * @example
 * var method = vds.method.get("methodCode1");
 * */
export function get(methodCode, componentCode, windowCode) {
  if (null == methodCode) {
    return null
  }
  if (!componentCode) {
    var scope = scopeManager.getScope()
    if (scope) {
      componentCode = scope.getComponentCode()
      if (!componentCode) {
        return null
      }
    } else {
      return null
    }
  }
  var ruleSetConfig = null
  if (windowCode) {
    ruleSetConfig = windowRoute.getRoute({
      componentCode: componentCode,
      windowCode: windowCode,
      routeCode: methodCode
    })
  } else {
    ruleSetConfig = componentRoute.getRoute({
      componentCode: componentCode,
      routeCode: methodCode
    })
  }
  if (ruleSetConfig) {
    ruleSetConfig = new Method(ruleSetConfig)
  }
  return ruleSetConfig
}
/**
 * 执行方法
 * @param {String} methodCode 方法编码
 * @param {Object} params 其他方法（可选）
 * {
 *  componentCode {String} 构件编码
 *  windowCode {String} 窗体编码，执行窗体方法时需要传入（可选）
 *  methodType {@link MethodType} 方法类型：MethodType[Client|Server]
 *  invokeType {@link InvokeType} 调用类型：InvokeType[Spi|Local|Api|ExtentPoint]
 *  inputParam {Object} 方法入参
 *  ruleContext {@link RuleContext} 规则上下文
 *  instanceIds {Array<String>} 窗体实例，跨构件执行窗体方法时需要传入
 *  isParallelism {Boolean} 是否并行执行，默认false(可选)
 *  epParams {Object} ep执行条件参数
 *  epScope {@link EpScope} ep执行范围,EpScope.All(全部,默认),EpScope.SelfAndActiveChild(本窗体及激活的子窗体) EpScope.SelfAndChildren(本窗体及全部子窗体)
 * }
 * @returns {Promise}
 */
export function execute(methodCode, params) {
  var _info = _getInfo()
  return new Promise(function (resolve, reject) {
    try {
      if (!methodCode) {
        throw vds.exception.newConfigException('执行的方法编码不能为空！')
      }
      params = params || {}
      var componentCode = params.componentCode
      var windowCode = params.windowCode
      var ruleContext = params.ruleContext
      if (ruleContext && typeof ruleContext._get == 'function') {
        ruleContext = ruleContext._get()
      }
      var currRouteRuntime = null
      var parentRouteContext = null
      var scopeId = scopeManager.getCurrentScopeId()
      var success = (function (sId, rultCtx) {
        return function () {
          var values = arguments
          //如果当前域已效果再去执行返回值设置会引发问题，Task20200917109
          if (scopeManager.isDestroy(sId)) {
            values = null
            if (rultCtx) {
              if (rultCtx._get) {
                rultCtx = rultCtx._get()
              }
              routeContext =
                rultCtx.getRouteContext && rultCtx.getRouteContext()
              if (routeContext) {
                routeContext.markForInterrupt(routeContext.GLOBAL)
              }
            }
          }
          resolve.apply(this, values)
        }
      })(scopeId, ruleContext)
      if (ruleContext) {
        var routeContext = ruleContext.getRouteContext()
        var args = routeContext.getEventArguments()
        var isParallelism = params.isParallelism === true
        parentRouteContext = isParallelism ? null : routeContext
        currRouteRuntime = new RouteContext(null, parentRouteContext) //routeRuntime.init();
        if (typeof currRouteRuntime.setParentRuleContext == 'function') {
          currRouteRuntime.setParentRuleContext(ruleContext)
        }
        currRouteRuntime.putEventArgument(args)
      }
      var config = {
        instanceRefs: params.instanceIds || [],
        parentRouteContext: parentRouteContext,
        currentRouteContext: currRouteRuntime,
        callback: success
      }
      var sourceType =
        params.methodType == exports.MethodType.Server
          ? exports.MethodType.Server
          : exports.MethodType.Client
      var serviceName = mediator.getServiceName(
        componentCode,
        windowCode,
        methodCode,
        sourceType
      )
      var inputParam = params.inputParam
        ? handleParam(
            params.inputParam,
            params.invokeType,
            methodCode,
            componentCode,
            windowCode
          )
        : {}

      var invokeTarget = {
        componentCode: componentCode,
        windowCode: windowCode,
        ruleSetCode: methodCode,
        sourceType: sourceType
      }
      switch (params.invokeType) {
        case exports.InvokeType.Spi:
        case exports.InvokeType.Local:
          invokeTarget['invokeType'] = params.invokeType
          config['error'] = reject
          routeEngine.execute({
            targetConfig: invokeTarget,
            inputParam: inputParam,
            config: config
          })
          break
        case exports.InvokeType.Api:
          if (sourceType == exports.MethodType.Server) {
            //服务端方法直接执行
            invokeTarget['invokeType'] = params.invokeType
            config['error'] = reject
            routeEngine.execute({
              targetConfig: invokeTarget,
              inputParam: inputParam,
              config: config
            })
          } else {
            var publishCallback = function () {
              var checkAgaingServece = mediator.isExistService(serviceName)
              if (checkAgaingServece) {
                mediator.publish(serviceName, [inputParam, config])
              } else {
                var _exception = vds.exception.newConfigException(
                  '执行目标构件活动集出错！请检查目标构件:' +
                    componentCode +
                    '是否包含此API:' +
                    methodCode
                )
                reject(_exception)
              }
            }
            var errorPublishCallback = function (e) {
              var _exception = vds.exception.newConfigException(
                '执行目标构件活动集出错！请检查目标构件:' +
                  componentCode +
                  '是否已部署！'
              )
              reject(_exception)
            }
            componentInit.initComponent({
              componentCode: componentCode,
              success: publishCallback,
              error: errorPublishCallback
            })
          }
          break
        case exports.InvokeType.ExtensionPoint:
          var epConditionParams = params.epParams
          var isExistService = mediator.isExistService(serviceName)
          if (isExistService) {
            //ep执行条件参数
            epConditionParams['#invokeScope#'] = handleInvokeScope(
              params.epScope
            )
            config['callback'] = success
            mediator.publishSerializable(
              serviceName,
              [inputParam, config, epConditionParams],
              success
            )
          } else {
            //throw new BusinessException("执行活动集出错(扩展点),请先打开目标组件容器！");
            vds.log.warn(
              '该扩展点实现未找到[构件编号:' +
                componentCode +
                '窗体编号:' +
                windowCode +
                '活动集名称：' +
                methodCode +
                '请检查服务映射信息是否发布或对应窗体是否已打开!'
            )
            // ruleContext.fireRuleCallback();
            //将扩展点与实现之间的映射信息拆分后，会出现找不到实现信息的情况（之前是合并在一起，一定能找到，但可能找不到满足条件实现），如果找不到实现，则执行后续规则 xiedh 2020-07-17
            success()
          }
          break
        default:
          success()
          break
      }
    } catch (err) {
      reject(err)
    }
  })
}
var handleParam = function (
  param,
  invokeType,
  methodCode,
  componentCode,
  windowCode
) {
  //如果调用活动集时，设置了入参，则将此入参的值覆盖到活动集原始配置参数中。
  var mockParam = {}
  //获取活动集配置
  var ruleSetConfig = exports.get(methodCode, componentCode, windowCode)
  if (ruleSetConfig && ruleSetConfig.getInputs()) {
    var ruleSetcfg_inputs = ruleSetConfig.getInputs()
    for (var i = 0, l = ruleSetcfg_inputs.length; i < l; i++) {
      var input_Obj = ruleSetcfg_inputs[i]
      var input_code = input_Obj.getCode()
      var input_value = input_Obj.geInitValue()
      var type = input_Obj.getType()
      //如果参数为实体类型，则转为游离DB
      if (type == 'entity') {
        var fieldsMapping = input_Obj.getConfigs()
        var freeDB = getFreeDB(fieldsMapping)
        input_value = freeDB
      }
      mockParam[input_code] = input_value
    }
  }
  if (mockParam) {
    for (var param_code in mockParam) {
      if (param_code) {
        var val = mockParam[param_code]
        if (val && vds.ds.isDatasource(val)) {
          val = val._get()
        }
        mockParam[param_code] = val
      }
    }
  }
  //执行SPI活动集时，当发现有configData信息时，需要以configData的入参来替换掉原装SPI入参
  if (invokeType == 'spi') {
    var configData_inputs = appData.getRuleSetInputs({
      componentCode: componentCode,
      windowCode: windowCode,
      metaCode: methodCode
    })
    if (configData_inputs && configData_inputs.length > 0) {
      //用configData过滤:只过滤非实体类型。(目前只考虑简单类型的匹配，即非实体类型)
      if (configData_inputs && configData_inputs.length > 0) {
        for (var input_code in mockParam) {
          for (var j = 0; j < configData_inputs.length; j++) {
            var configDataObj = configData_inputs[j]
            var configDataObj_code = configDataObj.getCode()
            var configDataObj_initValue = configDataObj.geInitValue()
            if (input_code == configDataObj_code) {
              mockParam[input_code] = configDataObj_initValue
            }
          }
        }
      }
    }
  }
  return mockParam
}
/**
 * 创建游离DB
 */
var getFreeDB = function (fieldsMapping) {
  var fields = []
  var freeDBName = 'freeDB_' + vds.string.uuid()
  for (var i = 0, l = fieldsMapping.length; i < l; i++) {
    var param = fieldsMapping[i]
    fields.push({
      code: param.code,
      name: param.name,
      type: param.type,
      defaultValue: param.initValue
    })
  }
  var json = {
    dsCode: freeDBName
  }
  return vds.ds.unSerialize(fields, json)
}
/**
 * 处理执行范围
 * @param {String} invokeScope 范围参数
 * */
var handleInvokeScope = function (invokeScope) {
  var childWindowInfos = null //null 表示没有配置执行范围，如果有配置执行范围，那就是数组
  if (invokeScope == 'activeChild') {
    childWindowInfos = getActiveChildScope()
  } else if (invokeScope == 'selfAndActiveChild') {
    childWindowInfos = []
    /**
     * 执行本窗体及子窗体扩展点，如果当前域为构件域，则该构件的扩展点实现也执行。确认人：weicl
     */
    var scopeId = scopeManager.getCurrentScopeId()
    if (scopeManager.isComponentScope(scopeId)) {
      var info = scopeManager.createScopeHandler({
        scopeId: scopeId,
        handler: getSelfScope
      })()
      childWindowInfos.push(info)
    }
    var scope = scopeManager.getWindowScope()
    if (scope) {
      var scopeId = scope.getInstanceId()
      var info = scopeManager.createScopeHandler({
        scopeId: scopeId,
        handler: getSelfScope
      })()
      childWindowInfos.push(info)
    }
    childWindowInfos = childWindowInfos.concat(getActiveChildScope())
  } else if (invokeScope == 'selfAndChildren') {
    childWindowInfos = []
    var scopeId = scopeManager.getCurrentScopeId()
    if (scopeManager.isComponentScope(scopeId)) {
      var info = scopeManager.createScopeHandler({
        scopeId: scopeId,
        handler: getSelfScope
      })()
      childWindowInfos.push(info)
    }
    var scope = scopeManager.getWindowScope()
    if (scope) {
      var scopeId = scope.getInstanceId()
      var info = scopeManager.createScopeHandler({
        scopeId: scopeId,
        handler: getSelfScope
      })()
      childWindowInfos.push(info)
    }
    var windowScope = scopeManager.getWindowScope()
    var childScopes = scopeManager.getChildrenScopes(
      windowScope.getInstanceId()
    )
    if (childScopes) {
      for (var i = 0, len = childScopes.length; i < len; i++) {
        var childScope = childScopes[i]
        var scopeId = childScope.getInstanceId()
        if (scopeManager.isWindowScope(scopeId)) {
          childWindowInfos.push({
            componentCode: childScope.getComponentCode(),
            windowCode: childScope.getWindowCode(),
            scopeId: scopeId
          })
        }
      }
    }
  }
  return childWindowInfos
}

/**
 * 获取激活子窗体信息
 */
var getActiveChildScope = function () {
  var childWindowInfos = []
  var windowScope = scopeManager.getWindowScope()
  var windowCode = windowScope.getWindowCode()
  var relationWidgets = scopeManager.createScopeHandler({
    scopeId: windowScope.getInstanceId(),
    handler: function () {
      return widgetRelation.get(
        windowCode,
        false,
        widgetRelation.WIDGET_RELATION
      )
    }
  })()
  if (relationWidgets) {
    childWindowInfos = []
    var exeFunc = scopeManager.createScopeHandler({
      scopeId: windowScope.getInstanceId(),
      handler: function (sourceCodes, funName) {
        var results = []
        for (var i = 0, len = sourceCodes.length; i < len; i++) {
          var childWidgetCode = sourceCodes[i]
          var widgetObj = widgetContext.get(childWidgetCode, 'widgetObj')
          var tmpActiveChilds
          if (widgetObj && typeof widgetObj[funName] == 'function')
            tmpActiveChilds = widgetObj[funName]()
          else if (widgetAction.isWidgetActionExist(childWidgetCode, funName))
            tmpActiveChilds = widgetAction.executeWidgetAction(
              childWidgetCode,
              funName
            )
          if (tmpActiveChilds)
            for (var j = 0, l = tmpActiveChilds.length; j < l; j++) {
              var code = tmpActiveChilds[j]
              if (results.indexOf(code) == -1) results.push(code)
            }
        }
        return results
      }
    })
    //筛选激活子控件编码
    var activeChildCodes = exeFunc(relationWidgets, 'getActiveChildWidgets')
    //筛选激活的子窗体域
    var activeScopeIds = exeFunc(activeChildCodes, 'getActiveChildWindows')
    for (var i = 0, len = activeScopeIds.length; i < len; i++) {
      var scopeId = activeScopeIds[i]
      var tmpScope = scopeManager.getScope(scopeId)
      childWindowInfos.push({
        componentCode: tmpScope.getComponentCode(),
        windowCode: tmpScope.getWindowCode(),
        scopeId: scopeId
      })
    }
  }
  return childWindowInfos
}
var getSelfScope = function () {
  var scopeId = scopeManager.getCurrentScopeId()
  var tmpScope = scopeManager.getScope(scopeId)
  return {
    componentCode: tmpScope.getComponentCode(),
    windowCode: scopeManager.isWindowScope(scopeId)
      ? tmpScope.getWindowCode()
      : null,
    scopeId: scopeId
  }
}
/**
 * 方法类型
 * @enum
 */
exports.MethodType = {
  /**
   * 客户端方法
   */
  Client: 'client-ruleSet',
  /**
   * 服务端方法
   */
  Server: 'server-ruleSet'
}
/**
 * 调用的方法类型
 * @enum
 */
exports.InvokeType = {
  /**
   * spi
   */
  Spi: 'spi',
  /**
   *
   */
  Local: 'local',
  /**
   * api
   */
  Api: 'api',
  /**
   * 扩展点
   */
  ExtensionPoint: 'extensionPoint'
}
/**
 * ep执行范围
 * @enum
 */
exports.EpScope = {
  /**
   * 全部
   */
  All: 'all',
  /**
   * 激活的子窗体
   * */
  ActiveChild: 'activeChild',
  /**
   * 本窗体及激活的子窗体
   */
  SelfAndActiveChild: 'selfAndActiveChild',
  /**
   * 本窗体及全部子窗体
   */
  SelfAndChildren: 'selfAndChildren'
}
/**
 * 获取窗体信息
 * */
var _getInfo = function () {
  var info = {
    componentCode: '',
    windowCode: ''
  }
  var scope = scopeManager.getScope()
  if (scope) {
    info.componentCode = scope.getComponentCode()
    if (scopeManager.isWindowScope(scope.getInstanceId())) {
      info.windowCode = scope.getWindowCode()
    }
  }
  return info
}
