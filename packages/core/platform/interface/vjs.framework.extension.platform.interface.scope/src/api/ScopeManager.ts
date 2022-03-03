import * as Scope from './api/Scope'
import * as WindowScope from './api/WindowScope'
import { ApplicationParam as ApplicationParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ComponentPackData as componentPackData } from '@v-act/vjs.framework.extension.platform.global.data'
import * as ComponentScope from './api/ComponentScope'

let StorageManager,
  Scope_Instance_Storage_Token = 'ScopeManager_Scope_Instance_Storage_Token',
  Scope_Event_Storage_Token = 'ScopeManager_Scope_Event_Storage_Token',
  scopeStack = [],
  token = 'WINDOW_INSTANCE_DATASOURCE',
  sandbox

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

exports.initModule = function (sb) {
  if (sb) {
    sandbox = sb
    StorageManager = sb.getService(
      'vjs.framework.extension.platform.interface.storage.StorageManager'
    )
  }
  if (window) {
    let unloadFunc = window.onunload
    window.onunload = function () {
      let storage = _getScopeInstanceStorage()
      storage.iterate(function (id, scope) {
        exports.destroy(id)
      })
      if (unloadFunc) {
        unloadFunc.apply(window, [])
      }
    }
  }
}

let _putScopeIntoStorage = function (parentScopeId, scope) {
  let scopeId = scope.getInstanceId()
  let storage = _getScopeInstanceStorage()
  storage.add(parentScopeId, scopeId, scope)
  return scopeId
}

const createScope = function (parentScopeId, scopeId) {
  let scope = new Scope(scopeId)
  return _putScopeIntoStorage(parentScopeId, scope)
}

const createWindowScope = function (params) {
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
    let sId = exports.createWindowScope({
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
let replaceComponentPackInfo = function (componentCode, windowCode) {
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
function getSource(comCode, winCode, isTarget) {
  let result = null
  if (!componentPackData && sb) {
    componentPackData = sb.getService(
      'vjs.framework.extension.platform.global.data.ComponentPackData'
    )
  }
  if (componentPackData) {
    //替换构件包映射信息
    let newInfo = replaceComponentPackInfo(comCode, winCode)
    if (newInfo) {
      comCode = newInfo.componentCode
      winCode = newInfo.windowCode
    }
  }
  if (!ApplicationParam && sb) {
    ApplicationParam = sb.getService(
      'vjs.framework.extension.platform.data.storage.schema.param.ApplicationParam'
    )
  }
  if (ApplicationParam) {
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
  }
  return result
}

const createComponentScope = function (params) {
  let scope = new ComponentScope(params.scopeId, params.componentCode)
  return _putScopeIntoStorage(params.parentScopeId, scope)
}

const isWindowScope = function (scopeId) {
  let scope = exports.getScope(scopeId)
  return scope
    ? scope instanceof WindowScope || scope.constructor === WindowScope
    : false
}

const isComponentScope = function (scopeId) {
  let scope = exports.getScope(scopeId)
  return scope
    ? scope instanceof ComponentScope || scope.constructor === ComponentScope
    : false
}

const getWindowScope = function () {
  let scopeId = exports.getCurrentScopeId()
  while (scopeId != null) {
    let flag = exports.isWindowScope(scopeId)
    if (flag) {
      return exports.getScope(scopeId)
    } else {
      let storage = _getScopeInstanceStorage()
      let parent = storage.getParent(scopeId)
      scopeId = parent == null ? null : parent.getInstanceId()
    }
  }
  return null
}

const openScope = function (scopeId) {
  //把当前域存到window上，在div中触发事件时可以拿到当前域对象
  if (!window.VPlatformScope) {
    window.VPlatformScope = []
  }
  window.VPlatformScope.push(scopeId)
  scopeStack.push(scopeId)
}

const getCurrentScopeId = function () {
  return scopeStack.length > 0 ? scopeStack[scopeStack.length - 1] : null
}

const getParentScopeId = function (scopeId) {
  let storage = _getScopeInstanceStorage()
  let node = storage.getTreeNode(scopeId)
  if (node) {
    return node.getPId()
  }
  return null
}

const closeScope = function () {
  if (!window.VPlatformScope) {
    window.VPlatformScope = []
  } else {
    window.VPlatformScope.pop()
  }
  scopeStack.pop()
}

let _fire = function (eventName, scope) {
  let scopeId = scope.getInstanceId()
  let args = Array.prototype.slice.call(arguments, 2)
  try {
    let storage = _getScopeManagerEventStorage()
    exports.openScope(scopeId)
    if (storage.containsKey(eventName)) {
      let handlers = storage.get(eventName)
      sandbox.util.collections.each(handlers, function (handler) {
        handler.apply(exports, args)
      })
    }
    let args1 = [eventName].concat(args)
    scope.fire.apply(scope, args1)
  } finally {
    exports.closeScope()
  }
}

const getChildrenScopes = function (scopeId) {
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

const destroy = function (scopeId) {
  let storage = _getScopeInstanceStorage()
  let descendants = storage.getDescendants(scopeId)
  let args = Array.prototype.slice.call(arguments, 1)
  while (descendants.length > 0) {
    let child = descendants.pop()
    if (!child._isDestroyed()) {
      let args1 = [exports.EVENTS.DESTROY, child].concat(args)
      _fire.apply(this, args1)
      //TODO
      child._markDestroyed()
    }
  }
  let scope = storage.get(scopeId)
  if (scope && !scope._isDestroyed()) {
    let args1 = [exports.EVENTS.DESTROY, scope].concat(args)
    _fire.apply(this, args1)
    //TODO
    scope._markDestroyed()
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

const isDestroy = function (scopeId) {
  let scope = this.getScope(scopeId)
  return !scope || scope._isDestroyed()
}

const on = function (eventName, handler) {
  let storage = _getScopeManagerEventStorage()
  let handlers = storage.containsKey(eventName) ? storage.get(eventName) : []
  handlers.push(handler)
  storage.put(eventName, handlers)
}

const getScope = function (scopeId) {
  scopeId = scopeId || exports.getCurrentScopeId()
  let storage = _getScopeInstanceStorage()
  return storage.get(scopeId)
}

const getProperty = function (key) {
  let scopeId = exports.getCurrentScopeId()
  return exports.getPropertyById(scopeId, key)
}

const getPropertyById = function (scopeId, key) {
  let scope = exports.getScope(scopeId)
  return scope.get(key)
}

const setProperty = function (key, val) {
  let scopeId = exports.getCurrentScopeId()
  let scope = exports.getScope(scopeId)
  scope.set(key, val)
}

const hasProperty = function (key) {
  let scopeId = exports.getCurrentScopeId()
  let scope = exports.getScope(scopeId)
  return scope.has(key)
}

const removeProperty = function (key) {
  let scopeId = exports.getCurrentScopeId()
  let scope = exports.getScope(scopeId)
  return scope.remove(key)
}

const _getInstanceIds = function (componentCode, windowCode) {
  let instanceIds = []
  let storage = _getScopeInstanceStorage()
  storage.iterate(function (scopeId, scope) {
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

const createScopeHandler = function (params) {
  let scopeId = params.scopeId ? params.scopeId : exports.getCurrentScopeId()
  let handle = params.handler
  let _this = params.callObject ? params.callObject : this
  return function () {
    if (typeof handle == 'function') {
      exports.openScope(scopeId)
      let result = handle.apply(_this, arguments)
      exports.closeScope()
      return result
    }
  }
}

let existEntity = function (scopeId, dsName, recursion) {
  let result = exports.createScopeHandler({
    scopeId: scopeId,
    handler: function (sId, code) {
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

const checkEntity = function (params) {
  let recursion = params.recursion === false ? false : true
  let result = existEntity(params.scopeId, params.datasourceName, recursion)
  return result
}

const getChildWindowScope = function (scopeId) {
  let scope = scopeId ? exports.getScope(scopeId) : exports.getWindowScope()
  if (scope) {
    try {
      while (true) {
        let childId = scope.getChildId()
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

const getParentWindowScope = function (scopeId) {
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
  createScope,
  createWindowScope,
  createComponentScope,
  isWindowScope,
  isComponentScope,
  getWindowScope,
  openScope,
  getCurrentScopeId,
  getParentScopeId,
  closeScope,
  getChildrenScopes,
  destroy,
  isDestroy,
  on,
  getScope,
  getProperty,
  getPropertyById,
  setProperty,
  hasProperty,
  removeProperty,
  _getInstanceIds,
  createScopeHandler,
  checkEntity,
  getChildWindowScope,
  getParentWindowScope
}
