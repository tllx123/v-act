import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let undefined

exports.initModule = function (sBox) {}

/**
 * 加载BS的依赖资源
 *
 */
let loadDependencies = function (sId, callback) {
  if (!window.__$bootstrap_loaded) {
    vdk.resource.load(
      [
        'itop/common/bootstrap/css/bootstrap.min.css',
        window.__$bootstrap_extra,
        'itop/common/bootstrap/js/bootstrap.min.js',
        'itop/common/bootstrap/extra/js/bootstrap.extra.js',
        'itop/common/bootstrap/extra/js/placeHolder.js',
        'itop/common/bootstrap/js/jquery.easing.min.js'
      ],
      function () {
        if (typeof callback == 'function') {
          let scopeId = sId || ScopeManager.createScope()
          ScopeManager.openScope(scopeId)
          ScopeManager.setProperty('type', 'bootstrap')
          callback()
          ScopeManager.closeScope()
        }
      }
    )
    window.__$bootstrap_loaded = true
  } else {
    if (typeof callback == 'function') {
      let scopeId = sId || ScopeManager.createScope()
      ScopeManager.openScope(scopeId)
      ScopeManager.setProperty('type', 'bootstrap')
      callback()
      ScopeManager.closeScope()
    }
  }
}

export { loadDependencies, loadDependencies, loadDependencies }
