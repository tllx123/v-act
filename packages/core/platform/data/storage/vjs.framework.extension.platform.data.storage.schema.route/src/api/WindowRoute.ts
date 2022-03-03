import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { RouteConfigFactory as routeConfigFactory } from '@v-act/vjs.framework.extension.platform.interface.model.config'
import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global.data'

let token = 'WindowRoute_RouteConfig_Key'

exports.initModule = function (sb) {}

let getStorage = function (depth, isCreate) {
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

const addRoute = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode
  let wStorage = getStorage([componentCode, windowCode], true)
  let routeConfig = routeConfigFactory.unSerialize(params.route)
  wStorage.put(routeConfig.getCode(), routeConfig)
}

/**
 * 替换构件包信息
 * */
let replaceComponentPackInfo = function (componentCode, windowCode) {
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

const getRoute = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode
  let routeCode = params.routeCode
  let iden =
    windowCode && '' != windowCode ? windowCode + '.' + routeCode : routeCode
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(componentCode, iden)
  if (newInfo) {
    componentCode = newInfo.componentCode
    if (newInfo.funcCode) {
      routeCode = newInfo.funcCode
    }
  }
  let wStorage = getStorage([componentCode, windowCode], false)
  return wStorage ? wStorage.get(routeCode) : null
}

const getRouteByRuleInstanceCode = function (params) {
  let componentCode = params.componentCode,
    windowCode = params.windowCode,
    ruleCode = params.ruleCode
  let wStorage = getStorage([componentCode, windowCode], false)
  let route = null
  if (wStorage) {
    wStorage.iterate(function (routeCode, r) {
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

export { addRoute, getRoute, addRoute, getRoute, getRouteByRuleInstanceCode }
