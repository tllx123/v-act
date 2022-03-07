import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function initModule(sb) {}

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
  addRequest,
  clear,
  genParams,
  getComponentCode,
  getHook,
  getWindowCode,
  init,
  isDebugger,
  isInited,
  isWindowScope,
  remove,
  update
}
