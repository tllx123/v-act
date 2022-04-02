import { ApplicationParam as AppData } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { RouteContext } from '@v-act/vjs.framework.extension.platform.interface.route'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { RouteEngine as RouteManager } from '@v-act/vjs.framework.extension.platform.services.engine'
import { EventExtension as eventExtension } from '@v-act/vjs.framework.extension.system.event'

const SERVICE_MAPPING_DATAS = 'Service_Mapping_Datas'
const MEDIATOR_SERVICE = 'mediator'
const CurrentWindowInstanceKey = 'currentWindowInstanceIds' //当前窗体实例id

const getStorage = function () {
  return storageManager.get(storageManager.TYPES.MAP, SERVICE_MAPPING_DATAS)
}

type FuncType = (...args: any[]) => any

type EPImpInfoType = { componentCode: string; windowCode?: string }

const _exe = function (
  serviceName: string,
  targetConfig: { componentCode: string; windowCode: string },
  inputParam: any,
  config: {
    callback?: FuncType
    currentRouteContext: RouteContext
    parentRouteContext: RouteContext
  },
  epconditionParams: {
    [key: string]: any
  },
  cbk: FuncType
) {
  const cb = (function (cb, tc) {
    return function (resultFromExeRuleSet: any) {
      //@ts-ignore
      if (typeof cb == 'function') cb.apply(this, [resultFromExeRuleSet, tc])
    }
  })(config.callback, targetConfig)
  const cfg: {
    callback: FuncType
    currentRouteContext: RouteContext
    parentRouteContext: RouteContext
    instanceRefs: string[]
  } = {
    callback: cb,
    currentRouteContext: config.currentRouteContext,
    parentRouteContext: config.parentRouteContext,
    instanceRefs: []
  }
  let windosInstansIds
  //优先取当前ep实现的窗体实例id，避免实现里面加载新窗体时导致新窗体的实现也执行的问题
  if (
    epconditionParams[CurrentWindowInstanceKey] &&
    epconditionParams[CurrentWindowInstanceKey][
      targetConfig.componentCode + '$_$' + targetConfig.windowCode
    ]
  ) {
    windosInstansIds =
      epconditionParams[CurrentWindowInstanceKey][
        targetConfig.componentCode + '$_$' + targetConfig.windowCode
      ]
  } else {
    windosInstansIds = scopeManager._getInstanceIds(
      targetConfig.componentCode,
      targetConfig.windowCode
    )
  }
  if (windosInstansIds) {
    const invokeScopes = epconditionParams['#invokeScope#']
    if (invokeScopes) {
      const appointScopeIds: string[] = []
      for (let i = 0, len = invokeScopes.length; i < len; i++) {
        const info = invokeScopes[i]
        const scopeId = info.scopeId
        if (windosInstansIds.indexOf(scopeId) != -1)
          appointScopeIds.push(scopeId)
      }
      cfg.instanceRefs = appointScopeIds
    } else cfg.instanceRefs = windosInstansIds
    //列表切换事件（当前窗体的容器）和列的链接事件（打开到首页）打开框架窗体可能会引发ep实现执行异常
    const tmpIds = cfg.instanceRefs
    const ids: string[] = []
    for (let i = 0, len = tmpIds.length; i < len; i++) {
      const tId = tmpIds[i]
      if (!scopeManager.isWindowScope(tId)) {
        continue
      }
      const scope = scopeManager.getScope(tId)
      if (!scope.isRendered || scope.isRendered()) {
        ids.push(tId)
      }
    }
    cfg.instanceRefs = ids
  }
  const current = arguments.callee.caller
  const callback = (function () {
    return function () {
      emitNext(
        serviceName,
        //@ts-ignore
        current,
        [inputParam, config, epconditionParams],
        cbk,
        arguments
      )
    }
  })()
  RouteManager.execute({
    targetConfig: targetConfig,
    inputParam: inputParam,
    config: cfg,
    callback: callback
  })
}
/**
 * 初始化数据
 * */
export function init() {
  //TODO 暂未实现
  /*const services = sandbox.getAllServices(
    'vjs.framework.extension.platform.init.view.schema.ApplicationData'
  )
  if (null != services) {
    const windowMappings = []
    for (const i = 0, len = services.length; i < len; i++) {
      const service = services[i]
      const datas = service.getEpDatas()
      addServiceMapping(datas)
      const tmpWindowMappings = service.getWindowMappings()
      if (tmpWindowMappings) {
        windowMappings = windowMappings.concat(tmpWindowMappings)
      }
    }
    AppData.initWindowMapping(windowMappings)
  }*/
}

export function addServiceMapping(
  epDatas: {
    [ke: string]: {
      componentCode: string
      windowCode: string
      metaCode: string
      metaType: string
      impls: Array<{
        metaType: string
        metaCode: string
        componentCode: string
        windowCode?: string
      }>
    }
  } | null
) {
  if (null != epDatas) {
    for (const key in epDatas) {
      const epData = epDatas[key]
      const serviceName = getServiceName(
        epData.componentCode,
        epData.windowCode,
        epData.metaCode,
        epData.metaType
      )
      const epImplDatas = epData.impls
      if (null != epImplDatas) {
        for (let j = 0, _l = epImplDatas.length; j < _l; j++) {
          const epImplData = epImplDatas[j]
          const targetConfig = {
            sourceType: epImplData.metaType,
            ruleSetCode: epImplData.metaCode,
            componentCode: epImplData.componentCode,
            invokeType: 'local',
            windowCode: epImplData.windowCode ? epImplData.windowCode : ''
          }
          const listence = (function (_targetConfig, _serviceName) {
            return function (
              inputParam: any,
              config: {
                callback?: FuncType
                currentRouteContext: RouteContext
                parentRouteContext: RouteContext
              },
              epconditionParams: {
                [key: string]: any
              },
              callback: FuncType
            ) {
              _exe(
                _serviceName,
                _targetConfig,
                inputParam,
                config,
                epconditionParams,
                callback
              )
            }
          })(targetConfig, serviceName)
          subscribe(serviceName, listence, {
            ruleSetCode: epImplData.metaCode,
            componentCode: epImplData.componentCode,
            windowCode: epImplData.windowCode ? epImplData.windowCode : '',
            metaType: epImplData.metaType
          })
        }
      }
    }
  }
}

/**
 * 添加服务映射
 * */
export function subscribe(
  serviceName: string,
  listener: FuncType,
  epImpInfo: {
    componentCode: string
    windowCode: string
    ruleSetCode: string
    metaType: string
  }
) {
  const eventService = eventExtension.getInstance(MEDIATOR_SERVICE)
  if (epImpInfo) {
    const storage = getStorage()
    const epImpKey = getServiceName(
      epImpInfo.componentCode,
      epImpInfo.windowCode,
      epImpInfo.ruleSetCode,
      epImpInfo.metaType
    )
    if (!storage.containsKey(serviceName)) {
      const info: {
        [key: string]: {
          func: FuncType
          epImpInfo: {
            componentCode: string
            windowCode: string
            ruleSetCode: string
            metaType: string
          }
        }
      } = {}
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

export function publish(serviceName: string, arg: any, callback?: any) {
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
const getListeners = function (
  serviceName: string,
  epConditionParams: {
    [key: string]: Array<{ componentCode: string; windowCode?: string }>
  }
) {
  const eventService = eventExtension.getInstance(MEDIATOR_SERVICE)
  const listeners = eventService.listeners(serviceName)
  if (listeners && listeners.length > 0) {
    const storage = getStorage()
    const info = storage.get(serviceName)
    if (null != info) {
      /*const mappings = spiMappingUtils   //TODO 暂未实现
        ? spiMappingUtils.getMappings(serviceName, epConditionParams)
        : null*/
      const mappings = null
      const invokeScopeKeys = getInvokeScopeKey(
        epConditionParams['#invokeScope#']
      )
      const newListeners: Array<FuncType> = []
      if (null != mappings) {
        /*for (let i = 0, len = mappings.length; i < len; i++) {
          const epImpKey = mappings[i]
          appendListener(info[epImpKey], invokeScopeKeys, newListeners)
        }
        return removeExtendEPImp(newListeners, info)*/
      } else if (invokeScopeKeys) {
        for (const key in info) {
          appendListener(info[key], invokeScopeKeys, newListeners)
        }
        const resultListeners = []
        for (let i = 0, len = listeners.length; i < len; i++) {
          //确保顺序
          const listener = listeners[i]
          if (newListeners.indexOf(listener) != -1) {
            resultListeners.push(listener)
          }
        }
        return removeExtendEPImp(resultListeners, info)
      }
      return removeExtendEPImp(listeners, info)
    }
  }
  return listeners
}
/**
 * 如果子级和父级同时存在同一个扩展点的实现，则父级扩展点忽略
 * */
const removeExtendEPImp = function (
  listeners: Array<FuncType> | null,
  infos: { [key: string]: { epImpInfo: EPImpInfoType; func: FuncType } }
) {
  let newListeners: Array<FuncType> = []
  if (listeners && listeners.length > 0) {
    const keys = [] //所有实现key
    const waitInfo: { [key: string]: Array<FuncType> } = {} //存在子窗体的实现，等遍历完再放进去
    for (const key in infos) {
      if (!infos.hasOwnProperty(key)) {
        continue
      }
      const info = infos[key]
      const epImpInfo = info.epImpInfo
      if (!epImpInfo.windowCode) {
        //构件实现可以直接添加
        newListeners.push(info.func)
        continue
      }
      const iKey = getImpInfoKey(epImpInfo)
      keys.push(iKey)
      const winMap = AppData.getWindowMapping({
        //如果能取到子窗体，则需要判断当前实现是否存在子窗体实现
        componentCode: epImpInfo.componentCode,
        windowCode: epImpInfo.windowCode
      })
      if (null == winMap) {
        //不存在窗体实现，则可以直接添加
        if (waitInfo[iKey]) {
          //父级可能先添加
          try {
            delete waitInfo[iKey]
          } catch (e) {}
        }
        newListeners.push(info.func)
      } else {
        const childIKey = getImpInfoKey({
          componentCode: winMap.componentCode,
          windowCode: winMap.windowCode
        })
        if (keys.indexOf(childIKey) != -1) {
          //已经找到子实现，则忽略父级实现
          continue
        }
        if (!waitInfo[childIKey]) {
          waitInfo[childIKey] = [info.func]
        } else {
          waitInfo[childIKey].push(info.func)
        }
      }
    }
    for (const key in waitInfo) {
      if (waitInfo.hasOwnProperty(key)) {
        newListeners = newListeners.concat(waitInfo[key])
      }
    }
  }
  return newListeners
}
const getImpInfoKey = function (epImpInfo: EPImpInfoType) {
  const arr = [epImpInfo.componentCode, epImpInfo.windowCode]
  return arr.join('$_$')
}
const getInvokeScopeKey = function (
  invokeScopes?: Array<{ componentCode: string; windowCode?: string }>
) {
  if (invokeScopes) {
    const invokeScopeKeys: Array<string> = []
    for (let i = 0, len = invokeScopes.length; i < len; i++) {
      const info = invokeScopes[i]
      const windowCode = info.windowCode ? info.windowCode : ''
      invokeScopeKeys.push(info.componentCode + '$_$' + windowCode)
    }
    return invokeScopeKeys
  }
  return null
}
/**
 * 追加事件
 * */
const appendListener = function (
  data: {
    epImpInfo: { componentCode: string; windowCode: string }
    func: FuncType
  },
  invokeScopeKeys: Array<string> | null,
  newListeners: Array<FuncType>
) {
  if (!data) {
    return
  }
  if (invokeScopeKeys) {
    const epImpInfo = data.epImpInfo
    const windowCode = epImpInfo.windowCode
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

/**
 * 串行执行(发布)服务：如果没有对应的服务返回false
 * 1，serviceName支持通配符,例如:发布服务 service.* 则会触发 service.A
 * 2，serviceName分隔符默认使用"."
 * 3，serviceName可以是字符串或数组
 *
 * @param serviceName<String>  服务名称,必须有
 * @param arg<Array> 服务对应的listener的参数,非必选
 * @param arg<Function> 回调函数,非必须
 * //TODO 回调暂未实现
 */
export function publishSerializable(
  serviceName: string,
  arg?: any[],
  callback?: FuncType
) {
  const epConditionParams = arg ? arg[2] : null
  const listeners = getListeners(serviceName, epConditionParams)
  if (listeners && listeners.length > 0) {
    const listener = listeners[0]
    let args: any[] = []
    if (arg) {
      args = args.concat(arg)
    }
    args.push(callback)
    if (arg && arg[2]) {
      //保存当前ep实现的窗体实例id，避免实现里面加载新窗体时导致新窗体的实现也执行的问题
      arg[2][CurrentWindowInstanceKey] =
        getEpImpWindowInstanceIdByServiceName(serviceName)
    }
    listener.apply(listener, args)
  } else {
    if (typeof callback == 'function') {
      callback()
    }
  }
}

/**
 * 获取当前ep实现的窗体实例id
 * */
const getEpImpWindowInstanceIdByServiceName = function (serviceName: string) {
  const datas: { [id: string]: any } = {}
  const storage = getStorage()
  const infos = storage.get(serviceName)
  if (infos) {
    for (const key in infos) {
      const epInfo = infos[key].epImpInfo
      if (epInfo && epInfo.componentCode && epInfo.windowCode) {
        const componentCode = epInfo.componentCode
        const windowCode = epInfo.windowCode
        const iden = componentCode + '$_$' + windowCode
        if (datas[iden]) {
          //已经取过的跳过
          continue
        }
        const windosInstansIds = scopeManager._getInstanceIds(
          componentCode,
          windowCode
        )
        datas[iden] = windosInstansIds ? windosInstansIds : []
      }
    }
  }
  return datas
}

export function emitNext(
  serviceName: string,
  current: FuncType,
  arg: any,
  callback?: FuncType,
  callbckArgs?: any[]
) {
  let next
  const epConditionParams = arg ? arg[2] : null
  const listeners = getListeners(serviceName, epConditionParams)
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
    let args: any[] = []
    if (arg) args = args.concat(arg)
    args.push(callback)
    next.apply(next, args)
  } else {
    if (typeof callback == 'function') {
      callback.apply(callback, callbckArgs ? callbckArgs : [])
    }
  }
}

/**
 * 返回当前服务中介注册的所有服务
 */
export function getAllService() {
  const eventEmitterService = eventExtension.getInstance(MEDIATOR_SERVICE)
  return eventEmitterService.listenerTree
}

/**
 * 根据规范返回服务名称。规范：下划线链接
 * @param componentCode 构件code
 * @param windowCode    窗体code
 * @param ruleSetCode   活动集code
 * @param metaType      元信息类型
 */
export function getServiceName(
  componentCode: string,
  windowCode: string,
  ruleSetCode: string,
  metaType: string
) {
  if (!windowCode) {
    windowCode = ''
  }
  return componentCode + '_' + windowCode + '_' + ruleSetCode + '_' + metaType
}

/**
 * 判断此服务是否存在
 * @param 服务名称
 */
export function isExistService(serviceName: string) {
  const eventEmitterService = eventExtension.getInstance(MEDIATOR_SERVICE)
  const listeners = eventEmitterService.listeners(serviceName)
  if (listeners && listeners.length > 0) {
    return true
  }
  return false
}

/**
 * 判断是否为数组
 * TODO暂时引不到jsTool
 */
const isArray = function (object: any) {
  return Array.isArray(object)
}
