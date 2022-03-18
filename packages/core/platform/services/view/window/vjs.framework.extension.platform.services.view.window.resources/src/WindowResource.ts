import { Environment as environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import * as window from '@v-act/vjs.framework.extension.platform.services.integration.vds.window'
const vds = { window }

let loadedResourcePaths = []

let toLoadResources = []

// var vueLibPath;

// var Resource;

export function initModule(sb) {}

/*
 * var _getVueLibPath = function(){ var namespace =
 * window.__vplatformNamespace,libPath;
 * if(namespace&&namespace.vueLibPath){ toLoadResources.push(new
 * Resource({resources:[namespace.vueLibPath]})); } }
 */

let meger = function (aim: any, megered: any) {
  if (megered && megered.length > 0) {
    for (let i = 0, l = megered.length; i < l; i++) {
      let item = megered[i]
      let index = aim.indexOf(item)
      if (index == -1) {
        aim.push(item)
      }
    }
  }
}

// 通过依赖中的key值获取对应的资源对象
let mapResourceByKey = function (keys: any[]) {
  let resources = []
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < toLoadResources.length; j++) {
      if (toLoadResources[j].key && toLoadResources[j].key == keys[i]) {
        resources.push(toLoadResources[j])
        break
      }
    }
  }
  return resources
}
/**
 * 判断一个资源是否在资源列表中已存在，以key为标示
 */
let hasResource = function (orderList: any[], res: any) {
  for (let k = 0; k < orderList.length; k++) {
    if (res.key == orderList[k].key) {
      return true
    }
  }
  return false
}
/**
 * 对资源节点进行遍历访问，直到被访问的资源没有依赖，按资源依赖顺序进行排序，被依赖的资源总在最前
 * @param {Resource} resource 要访问的资源节点
 * @param {Array} orderList 最终排序队列
 */
let visitDeps = function (resource: any, orderList: any[]) {
  if (!resource || !resource.deps) {
    return
  }
  if (hasResource(orderList, resource)) {
    return
  }
  if (resource.deps && resource.deps.length == 0) {
    orderList.push(resource)
    return
  }
  // 通过依赖中的key值获取对应的资源对象
  let deps = mapResourceByKey(resource.deps)
  // 对resource的每个依赖都去总资源表中查找对应的资源对象
  for (let i = 0; i < deps.length; i++) {
    let res = visitDeps(deps[i], orderList)
    res && !hasResource(orderList, res) && orderList.push(res)
  }
  orderList.push(resource)
}
/**
 * 对给定的资源数组按依赖顺序进行排序，没有key值的放最后
 * @param {Array} resources
 */
let orderResource = function (resources: any[]) {
  if (!resources || resources.length < 2) {
    return resources
  }
  let noKeysource = [],
    hasKeysource = [],
    orderList = []
  for (let i = 0; i < resources.length; i++) {
    resources[i].key
      ? hasKeysource.push(resources[i]) && visitDeps(resources[i], orderList)
      : noKeysource.push(resources[i])
  }
  //添加没有key值的资源
  return orderList.concat(noKeysource)
}

const addResource = function (resource: any) {
  if (resource) {
    let resources = resource.getResources()
    if (resources && resources.length > 0) {
      let allLoaded = true
      for (let i = 0, l = resources.length; i < l; i++) {
        let res = resources[i]
        if (loadedResourcePaths.indexOf(res) == -1) {
          allLoaded = false
          break
        }
      }
      if (allLoaded) {
        resource.handleSuccess()
      } else {
        toLoadResources.push(resource)
      }
    } else {
      resource.handleSuccess()
    }
  }
}

let getSubfix = function (path: string) {
  let index = path.lastIndexOf('.')
  let subfix = 'js'
  if (index > 0) {
    subfix = path.substring(index + 1)
    // 处理包含?hashcode参数的url
    if (subfix.indexOf('?') > 0) {
      subfix = subfix.substring(0, subfix.indexOf('?'))
    }
  }
  return subfix
}

let concurrentLoadResources = function (libs: any) {
  try {
    //@ts-ignore
    vdk.resource.load.apply(vdk, libs)
  } catch (e) {
    //@ts-ignore
    head.js.apply(head, libs)
  }
}

const loadResources = function (params: any) {
  if (toLoadResources.length < 1 && params.success) {
    params.success()
  } else {
    //对资源加载顺序排序
    toLoadResources = orderResource(toLoadResources)
    let cssLibs = [],
      scriptLibs = [],
      loadingResourceIds = []
    let prefix = window.GlobalVariables
      ? window.GlobalVariables.getServerUrl() + '/'
      : ''
    for (let i = 0, l = toLoadResources.length; i < l; i++) {
      let resource = toLoadResources[i]
      loadingResourceIds.push(resource.getId())
      let resourcePaths = resource.getResources()
      for (let j = 0, len = resourcePaths.length; j < len; j++) {
        // 如果资源地址以http/https/ftp开头则保留原地址，否则添加本地主机前缀
        let path = /^(http|ftp|https):\/\//.test(resourcePaths[j])
          ? resourcePaths[j]
          : prefix + resourcePaths[j]
        if (loadedResourcePaths.indexOf(path) == -1) {
          let subfix = getSubfix(path)
          let libs = subfix == 'js' ? scriptLibs : cssLibs
          if (libs.indexOf(path) == -1) {
            libs.push(path)
          }
        }
      }
    }
    let libs = cssLibs.concat(scriptLibs)
    let callback = (function (cb, ids, paths) {
      return function () {
        for (let i = 0, l = ids.length; i < l; i++) {
          let id = ids[i]
          for (let j = 0; j < toLoadResources.length; j++) {
            let resource = toLoadResources[j]
            if (resource.getId() == id) {
              resource.handleSuccess()
              toLoadResources.splice(j, 1)
              break
            }
          }
        }
        markResourceLoaded(paths)
        if (cb) {
          cb()
        }
      }
    })(params.success, loadingResourceIds, libs)
    if (libs.length > 0) {
      if (environment.isIE9()) {
        // ie9下，css和js要分开请求，否则将很长时间才会触发加载成功回调
        let cssSuccess = (function (sLibs, cb) {
          return function () {
            if (sLibs.length > 0) {
              sLibs.push(cb)
              concurrentLoadResources(sLibs)
            } else {
              cb()
            }
          }
        })(scriptLibs, callback)
        if (cssLibs.length > 0) {
          cssLibs.push(cssSuccess)
          concurrentLoadResources(cssLibs)
        } else {
          cssSuccess()
        }
      } else {
        libs.push(callback)
        concurrentLoadResources(libs)
      }
    } else {
      callback()
    }
  }
}

let markResourceLoaded = function (libs: any) {
  if (libs && libs.length > 0) {
    meger(loadedResourcePaths, libs)
  }
}

export { addResource, loadResources }
