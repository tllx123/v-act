let StorageManager
let token = 'Platform_Component_Pack_Data'
let sandbox
let loadedIconCodes = []

export function initModule(sb) {
  if (sb) {
    sandbox = sb
    StorageManager = sb.getService(
      'vjs.framework.extension.platform.interface.storage.StorageManager'
    )
  }
}
let getStorage = function () {
  return StorageManager.get(StorageManager.TYPES.MAP, token)
}

const init = function (datas) {
  if (datas) {
    let storage = getStorage()
    for (let code in datas) {
      if (datas.hasOwnProperty(code)) {
        storage.put(code, datas[code])
      }
    }
  }
}

const existMapping = function (params) {
  let storage = getStorage()
  let componentCode = params.componentCode
  let code = params.code
  let componentInfos = storage.get(componentCode)
  if (componentInfos && componentInfos[code]) {
    return true
  }
  return false
}

const getMapping = function (params) {
  let storage = getStorage()
  let componentCode = params.componentCode
  let code = params.code
  let componentInfos = storage.get(componentCode)
  if (componentInfos) {
    return componentInfos[code]
  }
  return null
}

export {
  addRuleSetInputs,
  getRuleSetInputs,
  exists,
  getRuleSetInput,
  isAppConfigInfoLoaded,
  markAppConfigInfoLoaded,
  addComponentRouteInfo,
  getRouteConfig,
  addComponentVariantDefines,
  getComponentVariantDefine,
  addComponentOptionDefines,
  getComponentOptionDefine,
  destroy,
  componentIsLoaded,
  markForComponentLoaded,
  componentIsInited,
  markForComponentInited,
  setComponentType,
  getComponentType,
  init,
  existMapping,
  getMapping
}
