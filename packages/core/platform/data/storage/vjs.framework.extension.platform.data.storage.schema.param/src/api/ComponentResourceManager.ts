import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
let COMPONENT_RESOURCE_KEY = 'COMPONENT_RESOURCE_KEY'

/**
 * 获取窗体资源仓库
 */
let _getComponentResourceStorage = function () {
  return StorageManager.get(StorageManager.TYPES.MAP, COMPONENT_RESOURCE_KEY)
}

let getKey = function (params: any) {
  return '$_$' + params.componentCode + '$_$' + params.fullName + '$_$'
}

const addComponentResource = function (
  componentCode: string,
  fullName: string,
  hashCode: string
) {
  let params = {
    componentCode: componentCode,
    fullName: fullName,
    hashCode: hashCode
  }
  let storage = _getComponentResourceStorage()
  let key = getKey(params)
  storage.put(key, params)
}

const getComponentResourcePath = function (params: any) {
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
    } else {
      return 'itop/resources/' + params.componentCode + '_' + params.fullName
    }
  }
  return null
}

const getComponentResourcePaths = function (params: any) {
  let paths = []
  if (params && typeof params == 'object' && params.length > 0) {
    for (let i = 0, len = params.length; i < len; i++) {
      let param = params[i]
      let path = getComponentResourcePath(param)
      if (path) paths.push(path)
    }
  }
  return paths
}

export {
  // addRuleSetInputs,
  // getRuleSetInputs,
  // exists,
  // getRuleSetInput,
  // initWindowMapping,
  // getWindowMapping,
  // existWindowMapping,
  // addVariantDefines,
  // addOptionDefines,
  // getVariantDefine,
  // getVariantDefines,
  // getOptionDefine,
  // getOptionDefines,
  // registerMetadata,
  // getMetadata,
  addComponentResource,
  getComponentResourcePath,
  getComponentResourcePaths
}
