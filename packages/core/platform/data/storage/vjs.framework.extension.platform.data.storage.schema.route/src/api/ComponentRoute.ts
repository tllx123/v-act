import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global'
import { RouteConfigFactory as routeConfigFactory } from '@v-act/vjs.framework.extension.platform.interface.model.config'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let token = 'ComponentRoute_RouteConfig_Key'

export function initModule(sb: any) {}
/**
 * 替换构件包信息
 * */
let replaceComponentPackInfo = function (
  componentCode: string,
  windowCode: string
) {
  let result = null
  let info = {
    componentCode: componentCode,
    code: windowCode
  }
  if (componentPackData.existMapping(info)) {
    let newInfo = componentPackData.getMapping(info)
    if (newInfo) {
      result = {}
      for (let key in newInfo) {
        if (newInfo.hasOwnProperty(key)) {
          result[key] = newInfo[key]
        }
      }
    }
  }
  return result
}

const addRoute = function (params: any) {
  let componentCode = params.componentCode
  let cStorage
  let storage = storageManager.get(storageManager.TYPES.MAP, token)
  if (storage.containsKey(componentCode)) {
    cStorage = storage.get(componentCode)
  } else {
    cStorage = storageManager.newInstance(storageManager.TYPES.MAP)
    storage.put(componentCode, cStorage)
  }
  let routeConfig = routeConfigFactory.unSerialize(params.route)
  cStorage.put(routeConfig.getCode(), routeConfig)
}

const getRoute = function (params: any) {
  let componentCode = params.componentCode
  let routeCode = params.routeCode
  //替换构件包映射信息
  let newInfo: any = replaceComponentPackInfo(componentCode, routeCode)
  if (newInfo) {
    componentCode = newInfo.componentCode
    if (newInfo.funcCode) {
      routeCode = newInfo.funcCode
    }
  }
  let storage = storageManager.get(storageManager.TYPES.MAP, token)
  let cStorage = storage.containsKey(componentCode)
    ? storage.get(componentCode)
    : null
  return cStorage ? cStorage.get(routeCode) : null
}

export { addRoute, getRoute }
