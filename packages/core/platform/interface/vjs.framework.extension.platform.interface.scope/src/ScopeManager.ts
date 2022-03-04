import { ApplicationParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global.data'
import { StorageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

import ComponentScope from './ComponentScope'
import Scope from './Scope'
import WindowScope from './WindowScope'

const Scope_Instance_Storage_Token = 'ScopeManager_Scope_Instance_Storage_Token'
const Scope_Event_Storage_Token = 'ScopeManager_Scope_Event_Storage_Token'
const scopeStack: string[] = []
const token = 'WINDOW_INSTANCE_DATASOURCE'

if (window) {
  const unloadFunc = window.onunload
  window.onunload = function () {
    const storage = _getScopeInstanceStorage()
    storage.iterate(function (id: string, scope: Scope) {
      exports.destroy(id)
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
const _getScopeInstanceStorage = function () {
  return StorageManager.get(
    StorageManager.TYPES.TREE,
    Scope_Instance_Storage_Token
  )
}

/**
 * 获取域管理事件仓库
 */
const _getScopeManagerEventStorage = function () {
  return StorageManager.get(StorageManager.TYPES.MAP, Scope_Event_Storage_Token)
}

const _putScopeIntoStorage = function (parentScopeId: string, scope: Scope) {
  const scopeId = scope.getInstanceId()
  const storage = _getScopeInstanceStorage()
  storage.add(parentScopeId, scopeId, scope)
  return scopeId
}

const createScope = function (parentScopeId: string, scopeId: string) {
  const scope = new Scope(scopeId)
  return _putScopeIntoStorage(parentScopeId, scope)
}

const createWindowScope = function (params: {
  componentCode: string
  windowCode: string
  parentScopeId: string
  scopeId: string
  series: string
  isTarget?: boolean
}) {
  const componentCode = params.componentCode
  const windowCode = params.windowCode
  const scope = new WindowScope(
    params.scopeId,
    componentCode,
    windowCode,
    params.series
  )
  const isTarget = params.isTarget === false ? false : true
  const infos = getSource(componentCode, windowCode, isTarget)
  const tmpScope = null
  if (infos && infos.componentCode && infos.windowCode) {
    const sId = exports.createWindowScope({
      componentCode: infos.componentCode,
      windowCode: infos.windowCode,
      series: params.series
    })
    if (isTarget) {
      scope.setExtendId(sId)
      exports.getScope(sId).setChildId(scope.getInstanceId())
    } else {
      scope.setChildId(sId)
      exports.getScope(sId).setExtendId(scope.getInstanceId())
    }
  }
  return _putScopeIntoStorage(params.parentScopeId, scope)
}

/**
 * 替换构件包信息
 * */
const replaceComponentPackInfo = function (
  componentCode: string,
  windowCode: string
) {
  let result = null
  const info = {
    componentCode: componentCode,
    code: windowCode
  }
  if (componentPackData.existMapping(info)) {
    const newInfo = componentPackData.getMapping(info)
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
  if (componentPackData) {
    //替换构件包映射信息
    const newInfo = replaceComponentPackInfo(comCode, winCode)
    if (newInfo) {
      comCode = newInfo.componentCode
      winCode = newInfo.windowCode
    }
  }
  if (ApplicationParam) {
    const windowMappingInfo = ApplicationParam.getWindowMapping({
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
  }
  return result
}

const createComponentScope = function (params: {
  scopeId: string
  componentCode: string
  parentScopeId: string
}) {
  const scope = new ComponentScope(params.scopeId, params.componentCode)
  return _putScopeIntoStorage(params.parentScopeId, scope)
}

const isWindowScope = function (scopeId: string) {
  const scope = exports.getScope(scopeId)
  return scope
    ? scope instanceof WindowScope || scope.constructor === WindowScope
    : false
}

const isComponentScope = function (scopeId: string) {
  const scope = exports.getScope(scopeId)
  return scope
    ? scope instanceof ComponentScope || scope.constructor === ComponentScope
    : false
}

const getWindowScope = function () {
  let scopeId = exports.getCurrentScopeId()
  while (scopeId != null) {
    const flag = exports.isWindowScope(scopeId)
    if (flag) {
      return exports.getScope(scopeId)
    } else {
      const storage = _getScopeInstanceStorage()
      const parent = storage.getParent(scopeId)
      scopeId = parent == null ? null : parent.getInstanceId()
    }
  }
  return null
}

const openScope = function (scopeId: string) {
  //把当前域存到window上，在div中触发事件时可以拿到当前域对象
  //@ts-ignore
  if (!window.VPlatformScope) {
    //@ts-ignore
    window.VPlatformScope = []
  }
  //@ts-ignore
  window.VPlatformScope.push(scopeId)
  scopeStack.push(scopeId)
}

const getCurrentScopeId = function () {
  return scopeStack.length > 0 ? scopeStack[scopeStack.length - 1] : null
}

const getParentScopeId = function (scopeId: string) {
  const storage = _getScopeInstanceStorage()
  const node = storage.getTreeNode(scopeId)
  if (node) {
    return node.getPId()
  }
  return null
}

const closeScope = function () {
  //@ts-ignore
  if (window && !window.VPlatformScope) {
    //@ts-ignore
    window.VPlatformScope = []
  } else {
    //@ts-ignore
    window.VPlatformScope.pop()
  }
  scopeStack.pop()
}

const _fire = function (eventName: string, scope: Scope) {
  const scopeId = scope.getInstanceId()
  const args = Array.prototype.slice.call(arguments, 2)
  try {
    const storage = _getScopeManagerEventStorage()
    exports.openScope(scopeId)
    if (storage.containsKey(eventName)) {
      const handlers = storage.get(eventName)
      handlers.forEach((handler: (...params: any[]) => void) => {
        handler.apply(exports, args)
      })
    }
    const args1 = [eventName].concat(args)
    //@ts-ignore
    scope.fire.apply(scope, args1)
  } finally {
    exports.closeScope()
  }
}

const getChildrenScopes = function (scopeId: string) {
  const storage = _getScopeInstanceStorage()
  const children = storage.getChildren(scopeId)
  const rs = []
  if (children) {
    for (let i = 0, l = children.length; i < l; i++) {
      const child = children[i]
      if (!child._isDestroyed()) {
        rs.push(child)
      }
    }
  }
  return rs
}

const destroy = function (scopeId: string) {
  const storage = _getScopeInstanceStorage()
  const descendants = storage.getDescendants(scopeId)
  const args = Array.prototype.slice.call(arguments, 1)
  while (descendants.length > 0) {
    const child = descendants.pop()
    if (!child._isDestroyed()) {
      const args1 = [exports.EVENTS.DESTROY, child].concat(args)
      //@ts-ignore
      _fire.apply(this, args1)
      //TODO
      child._markDestroyed()
    }
  }
  const scope = storage.get(scopeId)
  if (scope && !scope._isDestroyed()) {
    const args1 = [exports.EVENTS.DESTROY, scope].concat(args)
    //@ts-ignore
    _fire.apply(this, args1)
    //TODO
    scope._markDestroyed()
  }
  //TODO
  setTimeout(function () {
    const descendants = storage.getDescendants(scopeId)
    while (descendants.length > 0) {
      const child = descendants.pop()
      storage.remove(child.getInstanceId())
    }
    storage.remove(scopeId)
  }, 60000)
}

/**
 * 事件名称
 * @enum {String}
 */
exports.EVENTS = {
  /**域销毁事件*/
  DESTROY: 'destroy',
  //域销毁前事件
  BEFOREDESTROY: 'beforeDestroy',
  //域销毁后事件
  AFTERDESTROY: 'afterDestroy'
}

exports.OpenMode = {
  //模态容器打开
  ModalContaniner: 'ModalContainer',
  //普通模态窗口
  ModalCommon: 'dialog'
}

const isDestroy = function (scopeId: string) {
  const scope = getScope(scopeId)
  return !scope || scope._isDestroyed()
}

const on = function (eventName: string, handler: (...args: any[]) => void) {
  const storage = _getScopeManagerEventStorage()
  const handlers = storage.containsKey(eventName) ? storage.get(eventName) : []
  handlers.push(handler)
  storage.put(eventName, handlers)
}

const getScope = function (scopeId: string) {
  scopeId = scopeId || exports.getCurrentScopeId()
  const storage = _getScopeInstanceStorage()
  return storage.get(scopeId)
}

const getProperty = function (key: string) {
  const scopeId = exports.getCurrentScopeId()
  return exports.getPropertyById(scopeId, key)
}

const getPropertyById = function (scopeId: string, key: string) {
  const scope = exports.getScope(scopeId)
  return scope.get(key)
}

const setProperty = function (key: string, val: any) {
  const scopeId = exports.getCurrentScopeId()
  const scope = exports.getScope(scopeId)
  scope.set(key, val)
}

const hasProperty = function (key: string) {
  const scopeId = exports.getCurrentScopeId()
  const scope = exports.getScope(scopeId)
  return scope.has(key)
}

const removeProperty = function (key: string) {
  const scopeId = exports.getCurrentScopeId()
  const scope = exports.getScope(scopeId)
  return scope.remove(key)
}

const _getInstanceIds = function (componentCode: string, windowCode: string) {
  const instanceIds: string[] = []
  const storage = _getScopeInstanceStorage()
  storage.iterate(function (scopeId: string, scope: Scope) {
    if (!scope._isDestroyed()) {
      //TODO
      const cCode = scope.get('componentCode')
      const wCode = scope.get('windowCode')
      if (componentCode == cCode && windowCode == wCode) {
        instanceIds.push(scopeId)
      }
    }
  })
  return instanceIds
}

const createScopeHandler = function (params: {
  scopeId?: string
  handler: (...args: any[]) => void
  callObject?: any
}) {
  const scopeId = params.scopeId ? params.scopeId : exports.getCurrentScopeId()
  const handle = params.handler
  //@ts-ignore
  const _this = params.callObject ? params.callObject : this
  return function (...args: any[]) {
    if (typeof handle == 'function') {
      exports.openScope(scopeId)
      const result = handle.apply(_this, args)
      exports.closeScope()
      return result
    }
  }
}

const existEntity = function (
  scopeId: string,
  dsName: string,
  recursion: boolean
) {
  const result = exports.createScopeHandler({
    scopeId: scopeId,
    handler: function (sId: string, code: string) {
      var windowScope = exports.getScope()
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
  recursion?: boolean
  scopeId: string
  datasourceName: string
}) {
  const recursion = params.recursion === false ? false : true
  const result = existEntity(params.scopeId, params.datasourceName, recursion)
  return result
}

const getChildWindowScope = function (scopeId: string) {
  let scope = scopeId ? exports.getScope(scopeId) : exports.getWindowScope()
  if (scope) {
    try {
      while (true) {
        const childId = scope.getChildId()
        if (childId) {
          scope = exports.getScope(childId)
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
  let scope = scopeId ? exports.getScope(scopeId) : exports.getWindowScope()
  try {
    while (true) {
      if (scope && scope.getExtendId()) {
        scope = exports.getScope(scope.getExtendId())
      } else {
        break
      }
    }
  } catch (e) {
    //
  }
  return scope
}

export {
  _getInstanceIds,
  checkEntity,
  closeScope,
  createComponentScope,
  createScope,
  createScopeHandler,
  createWindowScope,
  destroy,
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
  openScope,
  removeProperty,
  setProperty
}
