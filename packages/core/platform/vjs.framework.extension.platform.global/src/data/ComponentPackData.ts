import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let token = 'Platform_Component_Pack_Data'
let sandbox
let loadedIconCodes = []

export function initModule(sb: any) {
  if (sb) {
    sandbox = sb
  }
}
let getStorage = function () {
  return StorageManager.get(StorageManager.TYPES.MAP, token)
}

const init = function (datas: any) {
  if (datas) {
    let storage = getStorage()
    for (let code in datas) {
      if (datas.hasOwnProperty(code)) {
        storage.put(code, datas[code])
      }
    }
  }
}

const existMapping = function (params: {
  componentCode: string
  code: string
}) {
  let storage = getStorage()
  let componentCode = params.componentCode
  let code = params.code
  let componentInfos = storage.get(componentCode)
  if (componentInfos && componentInfos[code]) {
    return true
  }
  return false
}

const getMapping = function (params: { componentCode: string; code: string }) {
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
  // addRuleSetInputs,
  //getRuleSetInputs,
  // exists,
  // getRuleSetInput,
  // isAppConfigInfoLoaded,
  // markAppConfigInfoLoaded,
  // addComponentRouteInfo,
  // getRouteConfig,
  // addComponentVariantDefines,
  // getComponentVariantDefine,
  // addComponentOptionDefines,
  //getComponentOptionDefine,
  // destroy,
  // componentIsLoaded,
  // markForComponentLoaded,
  // componentIsInited,
  // markForComponentInited,
  // setComponentType,
  // getComponentType,
  init,
  existMapping,
  getMapping
}
