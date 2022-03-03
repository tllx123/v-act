import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let undefined

exports.initModule = function (sb) {}

const getComponentCode = function () {
  let scope = scopeManager.getScope()
  return scope.getComponentCode()
}

const getWindowCode = function () {
  let scope = scopeManager.getScope()
  return scope.getWindowCode()
}

const isWindowScope = function () {
  let scopeId = scopeManager.getCurrentScopeId()
  return scopeManager.isWindowScope(scopeId)
}

export {
  _putAop,
  getHook,
  isInited,
  init,
  isDebugger,
  update,
  clear,
  addRequest,
  remove,
  genParams,
  _putAop,
  getHook,
  update,
  getComponentCode,
  getWindowCode,
  isWindowScope
}
