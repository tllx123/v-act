import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let token = 'Platform_Component_Pack_Data'
let sandbox
let loadedIconCodes = []

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
  addComponentOptionDefines,
  addComponentRouteInfo,
  addComponentVariantDefines,
  addRuleSetInputs,
  componentIsInited,
  componentIsLoaded,
  destroy,
  existMapping,
  exists,
  getComponentOptionDefine,
  getComponentType,
  getComponentVariantDefine,
  getMapping,
  getRouteConfig,
  getRuleSetInput,
  getRuleSetInputs,
  init,
  isAppConfigInfoLoaded,
  markAppConfigInfoLoaded,
  markForComponentInited,
  markForComponentLoaded,
  setComponentType
}
