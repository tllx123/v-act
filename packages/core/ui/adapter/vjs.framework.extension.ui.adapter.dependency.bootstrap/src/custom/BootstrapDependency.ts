import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let undefined

exports.initModule = function (sBox) {}

/**
 * 加载BS的依赖资源
 *
 */
let loadDependencies = function (sId, callback) {
  if (typeof callback == 'function') {
    let scopeId = sId || ScopeManager.createScope()
    ScopeManager.openScope(scopeId)
    ScopeManager.setProperty('type', 'bootstrap')
    callback()
    ScopeManager.closeScope()
  }
}

export {
  loadDependencies,
  loadDependencies,
  loadDependencies,
  loadDependencies
}
