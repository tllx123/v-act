import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { ParamConfigFactory } from '@v-act/vjs.framework.extension.platform.interface.model.config'
import { ComponentInit as componentInit } from '@v-act/vjs.framework.extension.platform.services.init'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

let tokenPrefix = 'COMPONENT_SCHEMA_PARAM',
  COMPONENT_VARIANT_INFO_KEY = 'COMPONENT_VARIANT_INFO_KEY',
  COMPONENT_OPTION_INFO_KEY = 'COMPONENT_OPTION_INFO_KEY',
  componentMetadataToken = 'COMPONENT_METADATA'

/**
 * 生成数据仓库标志id
 * @param {String} componentCode 构件编号
 * @param {String} domain 领域
 * @return String
 */
const generateToken = function (componentCode: string, domain: string) {
  return tokenPrefix + componentCode + '_' + domain
}

/**
 * 获取指定构件领域数据仓库，如果不存在，则创建
 * @param {String} componentCode 构件编号
 * @param {String} domain 领域
 * @return {Storage}
 */
let getComponentStorage = function (componentCode: string, domain: string) {
  let token = generateToken(componentCode, domain)
  return StorageManager.get(StorageManager.TYPES.MAP, token)
}

/**
 * 添加参数信息到数据仓库中(如构件变量、常量等)
 */
let addParamsToStorage = function (
  componentCode: string,
  domain: string,
  configs: any
) {
  let params = ParamConfigFactory.unSerialize(configs)
  if (params) {
    let storage = getComponentStorage(componentCode, domain)
    // @ts-ignore
    sandbox.util.collections.each(params, function (param: any) {
      storage.put(param.getCode(), param)
    })
  }
}

/**
 * 获取指定领域数据仓库中的值
 * @param {String} componentCode 构件编号
 * @param {String} domain 领域
 * @param {String} key
 * @return Object
 */
let getStorageValue = function (
  componentCode: string,
  domain: string,
  key: any
) {
  let token = generateToken(componentCode, domain)
  if (StorageManager.exists(StorageManager.TYPES.MAP, token)) {
    let storage = StorageManager.get(StorageManager.TYPES.MAP, token)
    return storage.get(key)
  }
  return null
}

let getStorageValues = function (componentCode: string, domain: string) {
  let result: any = []
  let token = generateToken(componentCode, domain)
  if (StorageManager.exists(StorageManager.TYPES.MAP, token)) {
    let storage = StorageManager.get(StorageManager.TYPES.MAP, token)
    storage.iterate(function (k: any, v: any) {
      result.push(v)
    })
  }
  return result
}

let getParamFromStorage = function (
  componentCode: string,
  domain: string,
  code: string
) {
  let value = getStorageValue(componentCode, domain, code)
  if (value) {
    return value
  }
  throw new Error(
    '查找构件配置信息(变量、常量等)失败！构件编号:' +
      componentCode +
      '，变量编号:' +
      code
  )
}

const addVariantDefines = function (componentCode: string, variants: any) {
  addParamsToStorage(componentCode, COMPONENT_VARIANT_INFO_KEY, variants)
}

const addOptionDefines = function (componentCode: string, options: any) {
  addParamsToStorage(componentCode, COMPONENT_OPTION_INFO_KEY, options)
}

const getVariantDefine = function (componentCode: string, variantCode: string) {
  return getParamFromStorage(
    componentCode,
    COMPONENT_VARIANT_INFO_KEY,
    variantCode
  )
}

const getVariantDefines = function (componentCode: string) {
  return getStorageValues(componentCode, COMPONENT_VARIANT_INFO_KEY)
}

const getOptionDefine = function (componentCode: string, optionCode: string) {
  return getParamFromStorage(
    componentCode,
    COMPONENT_OPTION_INFO_KEY,
    optionCode
  )
}

const getOptionDefines = function (componentCode: string) {
  return getStorageValues(componentCode, COMPONENT_OPTION_INFO_KEY)
}

let getComponentMetaStorage = function (componentCode: string) {
  let storage = StorageManager.get(
    StorageManager.TYPES.MAP,
    componentMetadataToken
  )
  let componentInfos
  if (!storage.containsKey(componentCode)) {
    componentInfos = {}
    storage.put(componentCode, componentInfos)
  } else {
    componentInfos = storage.get(componentCode)
  }
  return componentInfos
}
/**
 * 判断是否包含metadata信息
 * */
let hasComponentMetadata = function (componentCode: string) {
  let storage = StorageManager.get(
    StorageManager.TYPES.MAP,
    componentMetadataToken
  )
  if (!storage.containsKey(componentCode)) {
    return false
  }
  return true
}

const registerMetadata = function (
  componentCode: string,
  domain: string,
  data: any
) {
  if (componentCode && domain) {
    let componentInfos = getComponentMetaStorage(componentCode)
    componentInfos[domain] = data
  }
}

/**
 * 默认的metadata回调
 * */
let defaultMetadataCallback = function (dtd: any, value: any) {
  setTimeout(
    (function (_dtd, _value) {
      return function () {
        _dtd.resolve(_value)
      }
    })(dtd, value),
    0
  )
}

const getMetadata = function (componentCode: string, domain: string) {
  // @ts-ignore
  let dtd = $.Deferred()
  let value
  if (componentCode && domain) {
    if (hasComponentMetadata(componentCode)) {
      let componentInfos = getComponentMetaStorage(componentCode)
      value = componentInfos[domain]
      defaultMetadataCallback(dtd, value)
    } else {
      // @ts-ignore
      let cb = scopeManager.createScopeHandler({
        handler: (function (_dtd, _domain) {
          return function () {
            let componentInfos = getComponentMetaStorage(componentCode)
            _dtd.resolve(componentInfos[_domain])
          }
        })(dtd, domain)
      })
      componentInit.initComponent({
        componentCode: componentCode,
        success: cb,
        error: cb
      })
    }
  } else {
    defaultMetadataCallback(dtd, value)
  }
  return dtd
}

export {
  // addRuleSetInputs,
  // getRuleSetInputs,
  // exists,
  // getRuleSetInput,
  // initWindowMapping,
  // getWindowMapping,
  // existWindowMapping,
  addVariantDefines,
  addOptionDefines,
  getVariantDefine,
  getVariantDefines,
  getOptionDefine,
  getOptionDefines,
  registerMetadata,
  getMetadata
}
