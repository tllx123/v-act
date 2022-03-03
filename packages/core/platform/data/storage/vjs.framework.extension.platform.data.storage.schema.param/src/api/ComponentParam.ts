let ParamConfigFactory,
  tokenPrefix = 'COMPONENT_SCHEMA_PARAM',
  COMPONENT_VARIANT_INFO_KEY = 'COMPONENT_VARIANT_INFO_KEY',
  COMPONENT_OPTION_INFO_KEY = 'COMPONENT_OPTION_INFO_KEY',
  StorageManager,
  componentMetadataToken = 'COMPONENT_METADATA',
  componentInit,
  scopeManager,
  logUtil,
  sandbox

exports.initModule = function (sb) {
  if (sb) {
    sandbox = sb
    StorageManager = sb.getService(
      'vjs.framework.extension.platform.interface.storage.StorageManager'
    )
    ParamConfigFactory = sb.getService(
      'vjs.framework.extension.platform.interface.model.config.ParamConfigFactory'
    )
    componentInit = sb.getService(
      'vjs.framework.extension.platform.services.init.ComponentInit'
    )
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    logUtil = sb.getService('vjs.framework.extension.util.log')
  }
}

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

let getStorageValues = function (componentCode, domain) {
  let result = []
  let token = generateToken(componentCode, domain)
  if (StorageManager.exists(StorageManager.TYPES.MAP, token)) {
    let storage = StorageManager.get(StorageManager.TYPES.MAP, token)
    storage.iterate(function (k, v) {
      result.push(v)
    })
  }
  return result
}

let getParamFromStorage = function (componentCode, domain, code) {
  let value = getStorageValue(componentCode, domain, code)
  if (value) {
    return value
  }
  throw Error(
    '[ComponentParam.getParamFromStorage]查找构件配置信息(变量、常量等)失败！构件编号:' +
      componentCode +
      '变量编号:' +
      code
  )
}

const addVariantDefines = function (componentCode, variants) {
  addParamsToStorage(componentCode, COMPONENT_VARIANT_INFO_KEY, variants)
}

const addOptionDefines = function (componentCode, options) {
  addParamsToStorage(componentCode, COMPONENT_OPTION_INFO_KEY, options)
}

const getVariantDefine = function (componentCode, variantCode) {
  return getParamFromStorage(
    componentCode,
    COMPONENT_VARIANT_INFO_KEY,
    variantCode
  )
}

const getVariantDefines = function (componentCode) {
  return getStorageValues(componentCode, COMPONENT_VARIANT_INFO_KEY)
}

const getOptionDefine = function (componentCode, optionCode) {
  return getParamFromStorage(
    componentCode,
    COMPONENT_OPTION_INFO_KEY,
    optionCode
  )
}

const getOptionDefines = function (componentCode) {
  return getStorageValues(componentCode, COMPONENT_OPTION_INFO_KEY)
}

let getComponentMetaStorage = function (componentCode) {
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
let hasComponentMetadata = function (componentCode) {
  let storage = StorageManager.get(
    StorageManager.TYPES.MAP,
    componentMetadataToken
  )
  if (!storage.containsKey(componentCode)) {
    return false
  }
  return true
}

const registerMetadata = function (componentCode, domain, data) {
  if (componentCode && domain) {
    let componentInfos = getComponentMetaStorage(componentCode)
    componentInfos[domain] = data
  }
}

/**
 * 默认的metadata回调
 * */
let defaultMetadataCallback = function (dtd, value) {
  setTimeout(
    (function (_dtd, _value) {
      return function () {
        _dtd.resolve(_value)
      }
    })(dtd, value),
    0
  )
}

const getMetadata = function (componentCode, domain) {
  let dtd = $.Deferred()
  let value
  if (componentCode && domain) {
    if (hasComponentMetadata(componentCode)) {
      let componentInfos = getComponentMetaStorage(componentCode)
      value = componentInfos[domain]
      defaultMetadataCallback(dtd, value)
    } else {
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
  addRuleSetInputs,
  getRuleSetInputs,
  exists,
  getRuleSetInput,
  initWindowMapping,
  getWindowMapping,
  existWindowMapping,
  addVariantDefines,
  addOptionDefines,
  getVariantDefine,
  getVariantDefines,
  getOptionDefine,
  getOptionDefines,
  registerMetadata,
  getMetadata
}
