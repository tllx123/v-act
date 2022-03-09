import spiMappingUtils from '@v-act/vjs.framework.extension.platform.data.spi.mapings'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { EventEmitterManager as eventExtension } from '@v-act/vjs.framework.extension.system.event'

let SERVICE_MAPPING_DATAS = 'Service_Mapping_Datas'
let MEDIATOR_SERVICE = 'mediator'
export function initModule(sBox) {}

let getStorage = function () {
  return storageManager.get(storageManager.TYPES.MAP, SERVICE_MAPPING_DATAS)
}

const subscribe = function (serviceName, listener, epImpInfo) {
  let eventService = eventExtension.getInstance(MEDIATOR_SERVICE)
  if (epImpInfo) {
    let storage = getStorage()
    let epImpKey = exports.getServiceName(
      epImpInfo.componentCode,
      epImpInfo.windowCode,
      epImpInfo.ruleSetCode,
      epImpInfo.metaType
    )
    if (!storage.containsKey(serviceName)) {
      let info = {}
      info[epImpKey] = {
        func: listener,
        epImpInfo: epImpInfo
      }
      storage.put(serviceName, info)
    } else {
      storage.get(serviceName)[epImpKey] = {
        func: listener,
        epImpInfo: epImpInfo
      }
    }
  }
  return eventService.on.apply(eventService, arguments)
}

const publish = function (serviceName, arg, callback) {
  let eventService = eventExtension.getInstance(MEDIATOR_SERVICE)
  //拼装eventEmitter触发事件函数的参数列表
  let param = []
  param.push(serviceName)
  if (arguments[1] && isArray(arguments[1])) {
    for (let i = 0; i < arguments[1].length; i++) {
      param.push(arguments[1][i])
    }
  }
  let result = eventService.emit.apply(eventService, param)
  //执行回调函数
  for (let i = 1; i < arguments.length; i++) {
    if (typeof arguments[i] === 'function') {
      arguments[i]()
    }
  }
  return result
}

/**
 * 获取事件列表
 * */
let getListeners = function (serviceName, epConditionParams) {
  let eventService = eventExtension.getInstance(MEDIATOR_SERVICE)
  let listeners = eventService.listeners(serviceName)
  if (listeners && listeners.length > 0) {
    let storage = getStorage()
    let info = storage.get(serviceName)
    if (null != info) {
      let mappings = spiMappingUtils
        ? spiMappingUtils.getMappings(serviceName, epConditionParams)
        : null
      let invokeScopeKeys = getInvokeScopeKey(
        epConditionParams['#invokeScope#']
      )
      let newListeners = []
      if (null != mappings) {
        for (let i = 0, len = mappings.length; i < len; i++) {
          let epImpKey = mappings[i]
          appendListener(info[epImpKey], invokeScopeKeys, newListeners)
        }
        return newListeners
      } else if (invokeScopeKeys) {
        for (let key in info) {
          appendListener(info[key], invokeScopeKeys, newListeners)
        }
        let resultListeners = []
        for (let i = 0, len = listeners.length; i < len; i++) {
          //确保顺序
          let listener = listeners[i]
          if (newListeners.indexOf(listener) != -1) {
            resultListeners.push(listener)
          }
        }
        return resultListeners
      }
    }
  }
  return listeners
}
let getInvokeScopeKey = function (invokeScopes) {
  let invokeScopeKeys = null
  if (invokeScopes) {
    invokeScopeKeys = []
    for (let i = 0, len = invokeScopes.length; i < len; i++) {
      let info = invokeScopes[i]
      let windowCode = info.windowCode ? info.windowCode : ''
      invokeScopeKeys.push(info.componentCode + '$_$' + windowCode)
    }
  }
  return invokeScopeKeys
}
/**
 * 追加事件
 * */
let appendListener = function (data, invokeScopeKeys, newListeners) {
  if (!data) {
    return
  }
  if (invokeScopeKeys) {
    let epImpInfo = data.epImpInfo
    let windowCode = epImpInfo.windowCode
    if (
      !windowCode ||
      invokeScopeKeys.indexOf(epImpInfo.componentCode + '$_$' + windowCode) !=
        -1
    ) {
      newListeners.push(data.func)
    }
  } else {
    newListeners.push(data.func)
  }
}

const publishSerializable = function (serviceName, arg, callback) {
  let epConditionParams = arg ? arg[2] : null
  let listeners = getListeners(serviceName, epConditionParams)
  if (listeners && listeners.length > 0) {
    let listener = listeners[0]
    let args = []
    if (arg) {
      args = args.concat(arg)
    }
    args.push(callback)
    listener.apply(listener, args)
  } else {
    if (typeof callback == 'function') {
      callback()
    }
  }
}

const emitNext = function (serviceName, current, arg, callback, callbckArgs) {
  let next
  let epConditionParams = arg ? arg[2] : null
  let listeners = getListeners(serviceName, epConditionParams)
  if (listeners && listeners.length > 0) {
    for (let i = 0, l = listeners.length; i < l; i++) {
      if (current == listeners[i]) {
        if (i + 1 < l) {
          next = listeners[i + 1]
          break
        } else {
          break
        }
      }
    }
  }
  if (next) {
    let args = []
    if (arg) args = args.concat(arg)
    args.push(callback)
    next.apply(next, args)
  } else {
    if (typeof callback == 'function') {
      callback.apply(callback, callbckArgs)
    }
  }
}

const getAllService = function () {
  let eventEmitterService = eventExtension.getInstance(MEDIATOR_SERVICE)
  return eventEmitterService.listenerTree
}

const getServiceName = function (
  componentCode,
  windowCode,
  ruleSetCode,
  metaType
) {
  if (!windowCode) {
    windowCode = ''
  }
  return componentCode + '_' + windowCode + '_' + ruleSetCode + '_' + metaType
}

const isExistService = function (serviceName) {
  let eventEmitterService = eventExtension.getInstance(MEDIATOR_SERVICE)
  let listeners = eventEmitterService.listeners(serviceName)
  if (listeners && listeners.length > 0) {
    return true
  }
  return false
}

/**
 * 判断是否为数组
 * TODO暂时引不到jsTool
 */
let isArray = function (object) {
  return Object.prototype.toString.call(object) === '[object Array]'
}
export {
  emitNext,
  getAllService,
  getServiceName,
  isExistService,
  publish,
  publishSerializable,
  subscribe
}
