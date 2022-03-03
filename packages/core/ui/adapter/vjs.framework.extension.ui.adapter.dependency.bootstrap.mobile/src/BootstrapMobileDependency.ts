import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let undefined

exports.initModule = function (sBox) {}

let _getUrlConfigs = function () {
  return [
    'itop/common/bootstrap/css/bootstrap.min.css',
    'itop/common/bootstrap/extra/css/bootstrap.extra.base.css',
    VMetrix.getRealPath('mobile_base_skin'),
    'itop/common/bootstrap/css/animate.css',
    'itop/common/iconfont/iconfont.css',
    'itop/common/bootstrap/js/iscroll.min.js',
    'itop/common/weixin/weixin-1.0.0.js',
    'itop/common/fastclick/fastclick.min.js',
    'itop/common/spainjs/spin.min.js',
    'itop/common/template/template-native.js',
    'itop/common/template/template-native.js',
    'itop/common/flexible/flexible.js',
    'itop/common/jquery/jquery-1.10.2.min.js',
    'itop/common/bootstrap/js/bootstrap.min.js',
    'itop/common/bootstrap/extra/js/placeHolder.js',
    'itop/common/bootstrap/thirdui/icheck/icheck.min.js',
    'itop/common/bootstrap/thirdui/stickUp/stickUp.js'
  ]
}

let _getUrls = function () {
  let configs = _getUrlConfigs()
  if (window.GlobalVariables) {
    let rs = []
    for (let i = 0, l = configs.length; i < l; i++) {
      rs.push(GlobalVariables.getServerUrl() + '/' + configs[i])
    }
    return rs
  } else {
    return configs
  }
}

/**
 * 加载BS的依赖资源
 *
 */
let loadDependencies = function (sId, callback) {
  if (!window.__$bootstrap_loaded) {
    let urls = _getUrls()
    head.js(urls, function () {
      if (typeof callback == 'function') {
        let scopeId = sId || ScopeManager.createScope()
        ScopeManager.openScope(scopeId)
        ScopeManager.setProperty('type', 'bootstrap_mobile')
        callback()
        ScopeManager.closeScope()
      }
    })
    window.__$bootstrap_loaded = true
  } else {
    if (typeof callback == 'function') {
      let scopeId = sId || ScopeManager.createScope()
      ScopeManager.openScope(scopeId)
      ScopeManager.setProperty('type', 'bootstrap_mobile')
      callback()
      ScopeManager.closeScope()
    }
  }
}

export { loadDependencies, loadDependencies }
