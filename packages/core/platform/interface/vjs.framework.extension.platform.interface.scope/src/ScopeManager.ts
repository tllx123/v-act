import { ApplicationParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global'
import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

import ComponentScope from './ComponentScope'
import Scope from './Scope'
import WindowScope from './WindowScope'

const Scope_Instance_Storage_Token = 'ScopeManager_Scope_Instance_Storage_Token'
const Scope_Event_Storage_Token = 'ScopeManager_Scope_Event_Storage_Token'
const scopeStack: string[] = []
const token = 'WINDOW_INSTANCE_DATASOURCE'

if (typeof window != 'undefined') {
  let unloadFunc = window.onunload
  window.onunload = function () {
    let storage = _getScopeInstanceStorage()
    storage.iterate(function (id: string) {
      destroy(id)
    })
    if (unloadFunc) {
      //@ts-ignore
      unloadFunc.apply(window, [])
    }
  }
}

/**
 * 获取域实例仓库
 */
let _getScopeInstanceStorage = function () {
  return StorageManager.get(
    StorageManager.TYPES.TREE,
    Scope_Instance_Storage_Token
  )
}

/**
 * 获取域管理事件仓库
 */
let _getScopeManagerEventStorage = function () {
  return StorageManager.get(StorageManager.TYPES.MAP, Scope_Event_Storage_Token)
}

let _putScopeIntoStorage = function (
  parentScopeId: string | null,
  scope: Scope
) {
  let scopeId = scope.getInstanceId()
  let storage = _getScopeInstanceStorage()
  storage.add(parentScopeId, scopeId, scope)
  return scopeId
}

const createScope = function (parentScopeId: string, scopeId: string) {
  let scope = new Scope(scopeId)
  return _putScopeIntoStorage(parentScopeId, scope)
}

const createWindowScope = function (params: {
  componentCode: string
  windowCode: string
  series: string
  scopeId: string | null
  parentScopeId: string | null
  isTarget?: boolean
}) {
  let componentCode = params.componentCode
  let windowCode = params.windowCode
  let scope = new WindowScope(
    params.scopeId,
    componentCode,
    windowCode,
    params.series
  )
  let isTarget = params.isTarget === false ? false : true
  let infos = getSource(componentCode, windowCode, isTarget)
  let tmpScope = null
  if (infos && infos.componentCode && infos.windowCode) {
    let sId = createWindowScope({
      scopeId: null,
      parentScopeId: null,
      componentCode: infos.componentCode,
      windowCode: infos.windowCode,
      series: params.series
    })
    if (isTarget) {
      scope.setExtendId(sId)
      getScope(sId).setChildId(scope.getInstanceId())
    } else {
      scope.setChildId(sId)
      getScope(sId).setExtendId(scope.getInstanceId())
    }
  }
  return _putScopeIntoStorage(params.parentScopeId, scope)
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
      result = {
        componentCode: newInfo.componentCode,
        windowCode: newInfo.windowCode
      }
    }
  }
  return result
}
/**
 * 获取上一层来源窗体信息
 * @param {String} comCode 构件编码
 * @param {String} winCode 窗体编码
 * recurssion
 * */
function getSource(comCode: string, winCode: string, isTarget: boolean) {
  let result = null
  //替换构件包映射信息
  let newInfo = replaceComponentPackInfo(comCode, winCode)
  if (newInfo) {
    comCode = newInfo.componentCode
    winCode = newInfo.windowCode
  }

  let windowMappingInfo = ApplicationParam.getWindowMapping({
    componentCode: comCode,
    windowCode: winCode,
    isTarget: isTarget
  })
  if (windowMappingInfo != null) {
    result = {
      componentCode: windowMappingInfo.componentCode,
      windowCode: windowMappingInfo.windowCode,
      series: windowMappingInfo.series
    }
  }
  return result
}

const createComponentScope = function (params: {
  scopeId: string
  componentCode: string
  parentScopeId: string
}) {
  let scope = new ComponentScope(params.scopeId, params.componentCode)
  return _putScopeIntoStorage(params.parentScopeId, scope)
}

let _isWindowScope = function (scope: Scope) {
  return scope
    ? scope instanceof WindowScope || scope.constructor === WindowScope
    : false
}

const isWindowScope = function (scopeId: string) {
  return _isWindowScope(getScope(scopeId))
}

let _isComponentScope = function (scope: Scope) {
  return scope
    ? scope instanceof ComponentScope || scope.constructor === ComponentScope
    : false
}

const isComponentScope = function (scopeId: string) {
  return _isComponentScope(getScope(scopeId))
}

const getWindowScope = function () {
  let scopeId = getCurrentScopeId()
  while (scopeId != null) {
    let flag = isWindowScope(scopeId)
    if (flag) {
      return getScope(scopeId)
    } else {
      let storage = _getScopeInstanceStorage()
      let parent = storage.getParent(scopeId)
      scopeId = parent == null ? null : parent.getInstanceId()
    }
  }
  return null
}

const openScope = function (scopeId: string | null) {
  if (scopeId !== null) {
    //把当前域存到window上，在div中触发事件时可以拿到当前域对象
    //@ts-ignore
    if (!window.VPlatformScope) {
      //@ts-ignore
      window.VPlatformScope = []
    }
    //@ts-ignore
    window.VPlatformScope.push(scopeId)
    scopeStack.push(scopeId)
  } else {
    throw Error('scopeId不能为null')
  }
}

const getCurrentScopeId = function () {
  return scopeStack.length > 0 ? scopeStack[scopeStack.length - 1] : null
}

const getParentScopeId = function (scopeId: string) {
  let storage = _getScopeInstanceStorage()
  let node = storage.getTreeNode(scopeId)
  if (node) {
    return node.getPId()
  }
  return null
}

const closeScope = function () {
  //@ts-ignore
  if (!window.VPlatformScope) {
    //@ts-ignore
    window.VPlatformScope = []
  } else {
    //@ts-ignore
    window.VPlatformScope.pop()
  }
  scopeStack.pop()
}

let _fire = function (eventName: string, scope: Scope, ...args1: any[]) {
  let scopeId = scope.getInstanceId()
  let args = Array.prototype.slice.call(arguments, 2)
  try {
    let storage = _getScopeManagerEventStorage()
    openScope(scopeId)
    if (storage.containsKey(eventName)) {
      let handlers = storage.get(eventName)
      handlers.forEach((handler: (...args: any[]) => void) => {
        handler(scopeId)
      })
    }
    scope.fire(eventName, ...args)
  } finally {
    closeScope()
  }
}

const getChildrenScopes = function (scopeId?: string) {
  if (scopeId) {
    while (true) {
      let scope = getScope(scopeId)
      if (scope && typeof scope.getChildId == 'function') {
        //窗体继承时，子域是关联到继承窗体，被继承窗体没有子域信息Task20210527032
        let childId = scope.getChildId()
        if (childId && childId != scopeId) {
          scopeId = childId
        } else {
          break
        }
      } else {
        break
      }
    }
  }
  let storage = _getScopeInstanceStorage()
  let children = storage.getChildren(scopeId)
  let rs = []
  if (children) {
    for (let i = 0, l = children.length; i < l; i++) {
      let child = children[i]
      if (!child._isDestroyed()) {
        rs.push(child)
      }
    }
  }
  return rs
}

const destroy = function (scopeId: string) {
  if (isDestroy(scopeId)) return
  let storage = _getScopeInstanceStorage()
  let descendants = storage.getDescendants(scopeId)
  let args = Array.prototype.slice.call(arguments, 1)
  while (descendants.length > 0) {
    let child = descendants.pop()
    if (!child._isDestroyed()) {
      //TODO
      child._markDestroyed()
      _fire(EVENTS.DESTROY, child, ...args)
    }
  }
  let scope = storage.get(scopeId)
  if (scope && !scope._isDestroyed()) {
    //TODO
    scope._markDestroyed()
    _fire(EVENTS.DESTROY, scope, ...args)
  }
  //TODO
  setTimeout(function () {
    let descendants = storage.getDescendants(scopeId)
    while (descendants.length > 0) {
      let child = descendants.pop()
      storage.remove(child.getInstanceId())
    }
    storage.remove(scopeId)
  }, 60000)
}

/**
 * 事件名称
 * @enum {String}
 */
const EVENTS = {
  /**域销毁事件*/
  DESTROY: 'destroy',
  //域销毁前事件
  BEFOREDESTROY: 'beforeDestroy',
  //域销毁后事件
  AFTERDESTROY: 'afterDestroy',
  //全局渲染事件
  RENDERED: 'rendered'
}

const OpenMode = {
  //模态容器打开
  ModalContaniner: 'ModalContainer',
  //普通模态窗口
  ModalCommon: 'dialog'
}

const CloseMode = {
  //销毁域
  DestroyScope: 'DestroyScope',
  //自定义关闭函数
  CustomFunc: 'CustomFunc'
}

let _isDestroy = function (scope: Scope) {
  return !scope || scope._isDestroyed()
}

const isDestroy = function (scopeId: string) {
  return _isDestroy(getScope(scopeId))
}

const on = function (eventName: string, handler: (...args: any[]) => void) {
  let storage = _getScopeManagerEventStorage()
  let handlers = storage.containsKey(eventName) ? storage.get(eventName) : []
  handlers.push(handler)
  storage.put(eventName, handlers)
}

const un = function (eventName: string) {
  let storage = _getScopeManagerEventStorage()
  if (storage.containsKey(eventName)) {
    let handlers = storage.get(eventName)
    for (let i = handlers.length - 1; i >= 0; i--) {
      handlers.splice(i)
    }
  }
}

const getScope = function (scopeId?: string | null) {
  scopeId = scopeId || getCurrentScopeId()
  let storage = _getScopeInstanceStorage()
  return storage.get(scopeId)
}

const getProperty = function (key: string) {
  let scopeId = getCurrentScopeId()
  return getPropertyById(scopeId, key)
}

const getPropertyById = function (scopeId: string | null, key: string) {
  if (scopeId !== null) {
    let scope = getScope(scopeId)
    return scope.get(key)
  }
  return null
}

const setProperty = function (key: string, val: any) {
  let scopeId = getCurrentScopeId()
  let scope = getScope(scopeId)
  scope.set(key, val)
}

const hasProperty = function (key: string) {
  let scopeId = getCurrentScopeId()
  let scope = getScope(scopeId)
  return scope.has(key)
}

const removeProperty = function (key: string) {
  let scopeId = getCurrentScopeId()
  let scope = getScope(scopeId)
  return scope.remove(key)
}

const _getInstanceIds = function (componentCode: string, windowCode: string) {
  let instanceIds: string[] = []
  let storage = _getScopeInstanceStorage()
  storage.iterate(function (scopeId: string, scope: Scope) {
    if (!scope._isDestroyed()) {
      //TODO
      let cCode = scope.get('componentCode')
      let wCode = scope.get('windowCode')
      if (componentCode == cCode && windowCode == wCode) {
        instanceIds.push(scopeId)
      }
    }
  })
  return instanceIds
}

const createScopeHandler = function (params: {
  scopeId: string
  handler: (...args: any[]) => void
  callObject?: any
}): (...args: any[]) => any {
  let scopeId = params.scopeId ? params.scopeId : getCurrentScopeId()
  let handle = params.handler
  const callObject = params.callObject
  return (...args: any[]) => {
    if (typeof handle == 'function') {
      let result
      openScope(scopeId)
      try {
        if (callObject) {
          result = handle.apply(callObject, args)
        } else {
          handle(...args)
        }
      } finally {
        closeScope()
      }
      return result
    }
  }
}

let existEntity = function (
  scopeId: string,
  dsName: string,
  recursion: boolean
) {
  let result = createScopeHandler({
    scopeId: scopeId,
    handler: function (sId: string, code: string) {
      var windowScope = getScope()
      var targetScopeId = null
      var entity = null
      if (windowScope && windowScope.has(token)) {
        var storage = windowScope.get(token)
        entity = storage.get(code)
      }
      if (entity != null) {
        targetScopeId = sId
      } else if (recursion) {
        var extendId = windowScope.getExtendId()
        if (extendId != null) {
          targetScopeId = existEntity(extendId, code, recursion)
        }
      }
      return targetScopeId
    }
  })(scopeId, dsName)
  return result
}

const checkEntity = function (params: {
  scopeId: string
  datasourceName: string
  recursion: boolean
}) {
  let recursion = params.recursion === false ? false : true
  let result = existEntity(params.scopeId, params.datasourceName, recursion)
  return result
}

const getChildWindowScope = function (scopeId?: string) {
  let scope = scopeId ? getScope(scopeId) : getWindowScope()
  if (scope) {
    try {
      while (true) {
        let childId = scope.getChildId()
        if (childId) {
          scope = getScope(childId)
        } else {
          break
        }
      }
    } catch (e) {
      //
    }
  }
  return scope
}

const getParentWindowScope = function (scopeId: string) {
  let scope = scopeId ? getScope(scopeId) : getWindowScope()
  try {
    while (true) {
      if (scope && scope.getExtendId()) {
        scope = getScope(scope.getExtendId())
      } else {
        break
      }
    }
  } catch (e) {
    //
  }
  return scope
}

const getAllWindowScopes = function () {
  let result = []
  let storage = _getScopeInstanceStorage()
  let rs = storage.getAll()
  for (let i = 0, l = rs.length; i < l; i++) {
    let scope = rs[i]
    if (
      !_isDestroy(scope) &&
      _isWindowScope(scope) &&
      scope.getComponentCode() &&
      scope.getWindowCode()
    ) {
      result.push(scope)
    }
  }
  return result
}

const fireEvent = _fire

export {
  _fire,
  _getInstanceIds,
  checkEntity,
  CloseMode,
  closeScope,
  createComponentScope,
  createScope,
  createScopeHandler,
  createWindowScope,
  destroy,
  EVENTS,
  fireEvent,
  getAllWindowScopes,
  getChildrenScopes,
  getChildWindowScope,
  getCurrentScopeId,
  getParentScopeId,
  getParentWindowScope,
  getProperty,
  getPropertyById,
  getScope,
  getWindowScope,
  hasProperty,
  isComponentScope,
  isDestroy,
  isWindowScope,
  on,
  OpenMode,
  openScope,
  removeProperty,
  setProperty,
  un
}
