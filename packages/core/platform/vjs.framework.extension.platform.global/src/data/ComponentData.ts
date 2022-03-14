import {
  ParamConfigFactory,
  RouteConfigFactory
} from '@v-act/vjs.framework.extension.platform.interface.model.config'
import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let tokenPrefix = 'ComponentData_'

let COMPONENT_ROUTE_INFO_KEY = 'COMPONENT_ROUTE_INFO_KEY'

let COMPONENT_VARIANT_INFO_KEY = 'COMPONENT_VARIANT_INFO_KEY'

let COMPONENT_OPTION_INFO_KEY = 'COMPONENT_OPTION_INFO_KEY'

let COMPONENT_FLAG = 'COMPONENT_FLAG'

let COMPONENT_INITED_FLAG = 'COMPONENT_INITED_FLAG'

let COMPONENT_LOADED_FLAG = 'COMPONENT_LOADED_FLAG'

let COMPONENT_TYPE_FLAG = null

/**
 * 生成数据仓库标志id
 * @param {String} componentCode 构件编号
 * @param {String} domain 领域
 * @return String
 */
let generateToken = function (componentCode, domain) {
  return tokenPrefix + componentCode + '_' + domain
}

/**
 * 获取指定构件领域数据仓库，如果不存在，则创建
 * @param {String} componentCode 构件编号
 * @param {String} domain 领域
 * @return {Storage}
 */
let getComponentStorage = function (componentCode, domain) {
  let token = generateToken(componentCode, domain)
  return StorageManager.get(StorageManager.TYPES.MAP, token)
}

/**
 * 获取指定领域数据仓库中的值
 * @param {String} componentCode 构件编号
 * @param {String} domain 领域
 * @param {String} key
 * @return Object
 */
let getStorageValue = function (componentCode, domain, key) {
  let token = generateToken(componentCode, domain)
  if (StorageManager.exists(StorageManager.TYPES.MAP, token)) {
    let storage = StorageManager.get(StorageManager.TYPES.MAP, token)
    return storage.get(key)
  }
  return null
}

const addComponentRouteInfo = function (componentCode, routeCode, routeInfo) {
  let storage = getComponentStorage(componentCode, COMPONENT_ROUTE_INFO_KEY)
  let routeConfig = RouteConfigFactory.unSerialize(routeInfo)
  storage.put(routeCode, routeConfig)
}

const getRouteConfig = function (componentCode, routeCode) {
  let route = getStorageValue(
    componentCode,
    COMPONENT_ROUTE_INFO_KEY,
    routeCode
  )
  if (route) {
    return route
  }
  throw Error(
    '[ComponentDataPool.getRouteConfig]查找活动集失败！构建编号:' +
      componentCode +
      ',活动集编号:' +
      routeCode
  )
}

/**
 * 添加参数信息到数据仓库中(如构件变量、常量等)
 */
let addParamsToStorage = function (componentCode, domain, configs) {
  let params = ParamConfigFactory.unSerialize(configs)
  if (params) {
    let storage = getComponentStorage(componentCode, domain)
    sandbox.util.collections.each(params, function (param) {
      storage.put(param.getCode(), param)
    })
  }
}

const addComponentVariantDefines = function (componentCode, variants) {
  addParamsToStorage(componentCode, COMPONENT_VARIANT_INFO_KEY, variants)
}

let getParamFromStorage = function (componentCode, domain, code) {
  let value = getStorageValue(componentCode, domain, code)
  if (value) {
    return value
  }
  throw Error(
    '[ComponentDataPool.getParamFromStorage]查找构件配置信息(变量、常量等)失败！构件编号:' +
      componentCode +
      '变量编号:' +
      code
  )
}

const getComponentVariantDefine = function (componentCode, variantCode) {
  return getParamFromStorage(
    componentCode,
    COMPONENT_VARIANT_INFO_KEY,
    variantCode
  )
}

const addComponentOptionDefines = function (componentCode, options) {
  addParamsToStorage(componentCode, COMPONENT_OPTION_INFO_KEY, options)
}

const getComponentOptionDefine = function (componentCode, optionCode) {
  return getParamFromStorage(
    componentCode,
    COMPONENT_OPTION_INFO_KEY,
    optionCode
  )
}

const destroy = function (componentCode) {
  let type = StorageManager.TYPES.MAP
  let token = generateToken(componentCode, COMPONENT_ROUTE_INFO_KEY)
  StorageManager.destory(type, token)
  token = generateToken(componentCode, COMPONENT_VARIANT_INFO_KEY)
  StorageManager.destory(type, token)
  token = generateToken(componentCode, COMPONENT_OPTION_INFO_KEY)
  StorageManager.destory(type, token)
  token = generateToken(componentCode, COMPONENT_FLAG)
  StorageManager.destory(type, token)
}

const componentIsLoaded = function (componentCode) {
  let value = getStorageValue(
    componentCode,
    COMPONENT_FLAG,
    COMPONENT_LOADED_FLAG
  )
  return !!value
}

const markForComponentLoaded = function (componentCode) {
  let storage = getComponentStorage(componentCode, COMPONENT_FLAG)
  storage.put(COMPONENT_LOADED_FLAG, true)
}

const componentIsInited = function (componentCode) {
  let value = getStorageValue(
    componentCode,
    COMPONENT_FLAG,
    COMPONENT_INITED_FLAG
  )
  return !!value
}

const markForComponentInited = function (componentCode) {
  let storage = getComponentStorage(componentCode, COMPONENT_FLAG)
  storage.put(COMPONENT_INITED_FLAG, true)
}

const setComponentType = function (componentType) {
  COMPONENT_TYPE_FLAG = componentType
}

const getComponentType = function () {
  return COMPONENT_TYPE_FLAG
}

export {
  addComponentOptionDefines,
  addComponentRouteInfo,
  addComponentVariantDefines,
  addRuleSetInputs,
  componentIsInited,
  componentIsLoaded,
  destroy,
  exists,
  getComponentOptionDefine,
  getComponentType,
  getComponentVariantDefine,
  getRouteConfig,
  getRuleSetInput,
  getRuleSetInputs,
  isAppConfigInfoLoaded,
  markAppConfigInfoLoaded,
  markForComponentInited,
  markForComponentLoaded,
  setComponentType
}
