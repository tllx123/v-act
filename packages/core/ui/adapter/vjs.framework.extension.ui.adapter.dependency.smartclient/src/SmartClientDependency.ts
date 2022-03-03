import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let undefined
let sandbox
exports.initModule = function (sBox) {
  sandbox = sBox
}

/**
 *  加载SC的依赖资源
 *
 */
let loadDependencies = function (sId, callback) {
  if (!window._$iscLibLoaded) {
    let defalutLoadSkin = 'default' // 网页窗体中打开普通窗体，默认写死load_skin.js的路径，处理找不到该文件错误
    window.smartclientDir = 'itop/common/smartclient'
    window.isomorphicDir = smartclientDir + '/isomorphic/'
    let loader = window.vplatformMatrix || window.head
    let res = new vdk.resource({
      id: 'smartclient.base.style',
      paths: [window.isomorphicDir + 'skins/' + window.__$smartclient_base],
      deps: []
    })
    vdk.resource.add(res)
    vdk.resource.load(function () {
      let sandBox = sandbox.create()
      let extensionCfgs = []
      extensionCfgs.push(
        'vjs.framework.extension.resource.platform.smartclient'
      )
      sandBox.use(extensionCfgs)
      sandBox
        .active()
        .done(function () {
          window._$iscLibLoaded = true
          window.isc = window.isc || {}
          window.isc_useSimpleNames = false
          if (isc.EventHandler.handleLoad) {
            isc.EventHandler.handleLoad()
          }

          // 初始化 mxGraph 参数
          window.mxLoadResources = false
          window.mxBasePath = 'itop/common/smartclient/extra/thirdpart/mxGraph'

          if (typeof callback == 'function') {
            var scopeId = sId || ScopeManager.createScope()
            ScopeManager.openScope(scopeId)
            ScopeManager.setProperty('type', 'smartclient')
            callback()
            ScopeManager.closeScope()
          }
        })
        .fail(function (dependencyLib) {
          let exception = exceptionFactory.create({
            message: dependencyLib.message,
            type: dependencyLib.type,
            exceptionLib: dependencyLib.exceptionLib
          })
          if (errorFunc) errorFunc(exception)
        })
    })
    /*vdk.resource.load([
            "itop/common/iconfont/iconfont.css",
            window.isomorphicDir + "skins/" + window.__$smartclient_base,
            VMetrix.getRealPath("itop_v3_publish_smartclient_allforsmartclient_core_js"),
            window.isomorphicDir + "system/modules/ISC_Foundation.js",
            window.isomorphicDir + "system/modules/ISC_Containers.js",
            window.isomorphicDir + "system/modules/ISC_Grids.js",
            window.isomorphicDir + "system/modules/ISC_Forms.js",
            window.smartclientDir + "/locales/frameworkMessages_zh_CN.properties.js",
            window.isomorphicDir + "skins/" + defalutLoadSkin + "/load_skin.js",
            VMetrix.getRealPath("itop_common_smartclient_release_smartclientEXT_js")
        ], function() {
            window._$iscLibLoaded = true;
            window.isc = window.isc || {};
            window.isc_useSimpleNames = false;
            if (isc.EventHandler.handleLoad) {
                isc.EventHandler.handleLoad();
            }

            // 初始化 mxGraph 参数
            window.mxLoadResources = false;
            window.mxBasePath = 'itop/common/smartclient/extra/thirdpart/mxGraph';

            if (typeof(callback) == "function") {
                var scopeId = sId || ScopeManager.createScope();
                ScopeManager.openScope(scopeId);
                ScopeManager.setProperty('type', 'smartclient');
                callback();
                ScopeManager.closeScope();
            }
        });*/
  } else {
    if (typeof callback == 'function') {
      let scopeId = sId || ScopeManager.createScope()
      ScopeManager.openScope(scopeId)
      ScopeManager.setProperty('type', 'smartclient')
      callback()
      ScopeManager.closeScope()
    }
  }
}

export { loadDependencies, loadDependencies }
