let ScopeManager

export function initModule(sb) {
  if (sb) {
    let dependency = sb.getService(
      'vjs.framework.extension.ui.adapter.dependency'
    )
    ScopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    dependency.putInstance(exports)
  }
}

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
