export function initModule(sb) {
  let webviewService = sb.getService(
    'vjs.framework.extension.platform.services.integration.render'
  )
  webviewService._putInstance(exports)
}

/**
 * 初始化cordova的webview插件，注为全局对象
 *
 */
if (window.VJSBridge) {
  window.VJSBridge.plugins.vplatform.Webview = cordova.plugins.webview
}

const renderAsWindow = function (params) {
  let componentCode = params.componentCode
  let windowCode = params.windowCode
  let exitFunction = params.onClose
  let fail = params.fail
  let inputParam = params.inputParam || {}

  let config = {
    type: 'VPAGE',
    componentCode: componentCode,
    windowCode: windowCode,
    inputParam: inputParam,
    url: '',
    exescript: ''
  }

  let eventObj = {
    exit: exitFunction
  }

  cordova.plugins.webview.open(config, eventObj)
}

const renderAsModal = function (params) {
  let failFunc = function () {
    if (params.fail) {
      params.fail.apply(V3Integration, [])
    }
  }
  let inputParam = params.inputParam || {}
  let vars = inputParam.variable || {}
  vars['formulaOpenMode'] = 'container'
  inputParam.variable = vars
  params.inputParam = inputParam
  V3Integration.load({
    //目前只有打开移动窗体情况
    vjsList: [
      'vjs.framework.extension.platform.interface.scope',
      'vjs.framework.extension.ui.plugin.bootstrap_mobile.JGComponentAction',
      'vjs.framework.extension.ui.adapter.dependency.web',
      'vjs.framework.extension.platform.services.domain.weixin.browser'
    ],
    success: function (sb) {
      let componentCode = params.componentCode,
        windowCode = params.windowCode
      let scopeManager = sb.getService(
        'vjs.framework.extension.platform.interface.scope.ScopeManager'
      )
      let newScopeId = scopeManager.createWindowScope({
        parentScopeId: null,
        componentCode: componentCode,
        windowCode: windowCode,
        series: 'bootstrap_mobile'
      })
      V3Integration.load({
        vjsList: ['vjs.framework.extension.platform.services.browser'],
        success: function (sb) {
          let browser = sb.getService(
            'vjs.framework.extension.platform.services.browser.Browser'
          )
          scopeManager.openScope(newScopeId)
          browser.showModalModule({
            componentCode: params.componentCode,
            windowCode: params.windowCode,
            inputParam: params.inputParam,
            closeCallback: params.onClose
          })
          scopeManager.closeScope()
        },
        fail: failFunc
      })
    },
    fail: failFunc
  })
}

const closeCurrentWindow = function (param) {
  cordova.plugins.webview.close(param)
}

const openUrl = function (params) {
  let serverUrl = GlobalVariables.getServerUrl()
  let encodeUrl = encodeURIComponent(serverUrl)
  let url = params.url
  if (url.indexOf('?') > 0) {
    url = url + '&server_url=' + encodeUrl
  } else {
    url = url + '?server_url=' + encodeUrl
  }

  let config = {
    type: 'H5PAGE',
    url: url
  }

  let eventObj = {
    exit: params.onClose
  }

  cordova.plugins.webview.open(config, eventObj)
}

export { renderAsWindow, renderAsModal, closeCurrentWindow, openUrl }
