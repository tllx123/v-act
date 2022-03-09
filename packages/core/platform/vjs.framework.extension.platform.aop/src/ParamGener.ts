import { WindowDatasource as windowDatasource } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.datasource'
import {
  ComponentParam as componentSchemaParam,
  WindowParam as windowSchemaParam
} from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  ComponentParam as componentParam,
  WindowParam as windowParam
} from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WindowVMMappingManager as vmmappingManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'

import * as utils from './Utils'

export function initModule(sb) {}

let _genParamFromDefine = function (componentCode, defines, fn) {
  let rs = {}
  if (defines) {
    for (let i = 0, l = defines.length; i < l; i++) {
      let df = defines[i],
        code = df.getCode()
      let param = { code: code }
      if (componentCode != null) param['componentCode'] = componentCode
      let value = fn(param)
      let value = df.getType() == 'entity' ? value.serialize() : value
      rs[code] = { config: df.serialize(), value: value }
    }
  }
  return rs
}

/**
 *	生成构件变量信息
 */
let _genComponentVariants = function () {
  let componentCode = utils.getComponentCode()
  let defines = componentSchemaParam.getVariantDefines(componentCode)
  return _genParamFromDefine(componentCode, defines, componentParam.getVariant)
}

/**
 *生成构件常量信息
 */
let _genComponentOptions = function () {
  let componentCode = utils.getComponentCode()
  let defines = componentSchemaParam.getOptionDefines(componentCode)
  return _genParamFromDefine(componentCode, defines, componentParam.getOption)
}

/**
 *生成窗体输入变量信息
 */
let _genWindowVariants = function () {
  if (utils.isWindowScope()) {
    let componentCode = utils.getComponentCode()
    let inputs = windowSchemaParam.getInputDefines(
      componentCode,
      utils.getWindowCode()
    )
    return _genParamFromDefine(componentCode, inputs, windowParam.getInput)
  }
  return {}
}

/**
 *生成窗体输入变量信息
 */
let _genWindowOutputs = function () {
  if (utils.isWindowScope()) {
    let componentCode = utils.getComponentCode()
    let inputs = windowSchemaParam.getOutputDefines(
      componentCode,
      utils.getWindowCode()
    )
    return _genParamFromDefine(componentCode, inputs, windowParam.getOutput)
  }
  return {}
}

/**
 * 生成规则路由上下文信息
 */
let _genRouteContext = function (routeContext) {
  let rs = {
    inTransaction: routeContext.duringTransaction()
  }
  let routeCfg = routeContext.getRouteConfig()
  let inputs = routeCfg.getInputs()
  let outputs = routeCfg.getOutputs()
  let vars = routeCfg.getVars()
  rs['inputs'] = _genParamFromDefine(null, inputs, function (param) {
    return routeContext.getInputParam(param.code)
  })
  rs['outputs'] = _genParamFromDefine(null, outputs, function (param) {
    return routeContext.getOutPutParam(param.code)
  })
  rs['variants'] = _genParamFromDefine(null, vars, function (param) {
    return routeContext.getVariable(param.code)
  })
  let bRes = routeContext.getAllBusinessResult(),
    businessResults = {}
  for (let i = 0, l = bRes.length; i < l; i++) {
    let br = bRes[i]
    businessResults[br.ruleCode] = br['result']
  }
  rs['businessResults'] = businessResults
  return rs
}

/**
 * 生成规则上下文信息
 */
let _genRuleContexts = function () {
  return {}
}

/**
 * 生成实体信息
 */
let _genEntities = function () {
  let entities = {}
  let scopeId = scopeManager.getCurrentScopeId()
  if (scopeManager.isWindowScope(scopeId)) {
    let datasources = windowDatasource.getAll()
    for (let i = 0, l = datasources.length; i < l; i++) {
      let ds = datasources[i]
      let md = ds.getMetadata()
      let name = md.getDatasourceName()
      if (!vmmappingManager.isVirtualDataSource({ datasourceName: name })) {
        entities[name] = ds.serialize()
      }
    }
  }
  return entities
}

/**
 * 生成控件信息
 */
let _genWidgets = function () {
  return {}
}

const genParams = function (routeContext) {
  let params = {
    componentCode: utils.getComponentCode(),
    componentVariants: _genComponentVariants(),
    componentOptions: _genComponentOptions(),
    windowVariants: _genWindowVariants(),
    windowOutputs: _genWindowOutputs(),
    routeContext: _genRouteContext(routeContext),
    ruleContexts: _genRuleContexts(),
    entities: _genEntities(),
    widgets: _genWidgets()
  }
  if (utils.isWindowScope()) {
    params['windowCode'] = utils.getWindowCode()
  }
  return params
}

export {
  _putAop,
  addRequest,
  clear,
  genParams,
  getHook,
  init,
  isDebugger,
  isInited,
  remove,
  update
}
