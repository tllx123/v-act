import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global'
import { RouteConfigFactory as routeConfigFactory } from '@v-act/vjs.framework.extension.platform.interface.model.config'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let token = 'WindowRoute_RouteConfig_Key'

export function initModule(sb: any) {}

let getStorage = function (depth: any, isCreate: boolean) {
  let rs,
    s = storageManager.get(storageManager.TYPES.MAP, token)
  for (let i = 0, key; (key = depth[i]); i++) {
    if (s.containsKey(key)) {
      rs = s = s.get(key)
    } else if (isCreate) {
      rs = storageManager.newInstance(storageManager.TYPES.MAP)
      s.put(key, rs)
      s = rs
    }
  }
  return rs
}

const addRoute = function (params: any) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode
  let wStorage = getStorage([componentCode, windowCode], true)
  let routeConfig = routeConfigFactory.unSerialize(params.route)
  wStorage.put(routeConfig.getCode(), routeConfig)
}

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

const getRoute = function (params: any) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode
  let routeCode: any = params.routeCode
  let iden =
    windowCode && '' != windowCode ? windowCode + '.' + routeCode : routeCode
  //替换构件包映射信息
  let newInfo: any = replaceComponentPackInfo(componentCode, iden)
  if (newInfo) {
    componentCode = newInfo.componentCode
    if (newInfo.funcCode) {
      routeCode = newInfo.funcCode
    }
  }
  let wStorage = getStorage([componentCode, windowCode], false)
  return wStorage ? wStorage.get(routeCode) : null
}

const getRouteByRuleInstanceCode = function (params: any) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    ruleCode = params.ruleCode
  let wStorage = getStorage([componentCode, windowCode], false)
  let route = null
  if (wStorage) {
    wStorage.iterate(function (routeCode: any, r: any) {
      try {
        let instance = r.getRuleInstance(ruleCode)
        if (instance) {
          route = r
          return
        }
      } catch (e) {}
    })
  }
  return route
}

export { addRoute, getRoute, getRouteByRuleInstanceCode }
