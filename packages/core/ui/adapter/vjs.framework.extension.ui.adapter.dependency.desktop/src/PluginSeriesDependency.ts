import { Dependency as dependency } from '@v-act/vjs.framework.extension.ui.adapter.dependency'

import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

dependency.putInstance(this)

const loadDependencyLib = function (
  componentCode: string,
  windowCode: string,
  sandbox: any,
  scopeId: string,
  callback: any
) {
  if (typeof callback == 'function') {
    scopeId = scopeId || ScopeManager.createScope()
    ScopeManager.openScope(scopeId)
    ScopeManager.setProperty('type', 'smartclient')
    callback()
    ScopeManager.closeScope()
  }
}

const loadDependencyLibs = function (wins: any, callback: any) {
  if (typeof callback == 'function') {
    callback('smartclient', wins)
  }
}

export { loadDependencyLib, loadDependencyLibs }
