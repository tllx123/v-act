let COMPONENT_RESOURCE_KEY = 'COMPONENT_RESOURCE_KEY',
  StorageManager,
  sandbox

export function initModule(sb) {
  if (sb) {
    StorageManager = sb.getService(
      'vjs.framework.extension.platform.interface.storage.StorageManager'
    )
    sandbox = sb
  }
}

/**
 * 获取窗体资源仓库
 */
let _getComponentResourceStorage = function () {
  return StorageManager.get(StorageManager.TYPES.MAP, COMPONENT_RESOURCE_KEY)
}

let getKey = function (params) {
  return '$_$' + params.componentCode + '$_$' + params.fullName + '$_$'
}

const addComponentResource = function (componentCode, fullName, hashCode) {
  let params = {
    componentCode: componentCode,
    fullName: fullName,
    hashCode: hashCode
  }
  let storage = _getComponentResourceStorage()
  let key = getKey(params)
  storage.put(key, params)
}

const getComponentResourcePath = function (params) {
  if (params) {
    let storage = _getComponentResourceStorage()
    let key = getKey(params)
    if (storage.containsKey(key)) {
      let cInfo = storage.get(key)
      let hashCode = cInfo.hashCode
      return (
        'itop/resources/' +
        params.componentCode +
        '_' +
        params.fullName +
        '?hashcode=' +
        hashCode
      )
    }
  }
  return null
}

const getComponentResourcePaths = function (params) {
  let paths = []
  if (params && typeof params == 'object' && params.length > 0) {
    for (let i = 0, len = params.length; i < len; i++) {
      let param = params[i]
      let path = exports.getComponentResourcePath(param)
      if (path) paths.push(path)
    }
  }
  return paths
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
  getMetadata,
  addComponentResource,
  getComponentResourcePath,
  getComponentResourcePaths
}
