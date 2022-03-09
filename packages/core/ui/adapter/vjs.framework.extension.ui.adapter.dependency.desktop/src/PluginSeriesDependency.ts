import { dependency } from 'vjs.framework.extension.ui.adapter.dependency'

import { ScopeManager } from 'vjs.framework.extension.platform.interface.scope'

dependency.putInstance(exports)

const loadDependencyLib = function (
  componentCode,
  windowCode,
  sandbox,
  scopeId,
  callback
) {
  if (typeof callback == 'function') {
    scopeId = scopeId || ScopeManager.createScope()
    ScopeManager.openScope(scopeId)
    ScopeManager.setProperty('type', 'smartclient')
    callback()
    ScopeManager.closeScope()
  }
}

const loadDependencyLibs = function (wins, callback) {
  if (typeof callback == 'function') {
    callback('smartclient', wins)
  }
}

export { loadDependencyLib, loadDependencyLibs }
