import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'

let undefined

exports.initModule = function (sb) {
  let render = sb.getService(
    'vjs.framework.extension.platform.services.integration.render'
  )
  render._putInstance(exports)
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

let _genUrl = function (params) {
  let url =
    'module-operation!executeOperation?operation=Form&componentCode=' +
    params.componentCode +
    '&windowCode=' +
    params.windowCode
  let inputParam = params.inputParam
  if (inputParam) {
    let data = { data: { inputParam: inputParam } }
    url +=
      '&token=' +
      encodeURIComponent(encodeURIComponent(jsonUtil.obj2json(data)))
  }
  return url
}

const renderAsWindow = function (params) {
  let inputParam = params.inputParam || {}
  let vars = inputParam.variable || {}
  vars['formulaOpenMode'] = 'retrunValues'
  inputParam.variable = vars
  params.inputParam = inputParam
  let win = window.open(_genUrl(params))
  if (win) {
    win._$closeCallback = params.onClose
  }
}

const renderAsElement = function (params) {
  V3Integration.load({
    vjsList: [
      'vjs.framework.extension.ui.adapter.dependency',
      'vjs.framework.extension.ui.adapter.dependency.web',
      'vjs.framework.extension.platform.interface.scope'
    ],
    success: function (sb) {
      let dep = sb.getService('vjs.framework.extension.ui.adapter.dependency')
      dep.loadResources(
        params.componentCode,
        params.windowCode,
        sb,
        null,
        function (s) {
          let manager = s.getService(
            'vjs.framework.extension.platform.interface.scope.ScopeManager'
          )
          let scope = manager.getScope()
          let series = scope.get('type')
          V3Integration.load({
            vjsList: [
              'vjs.framework.extension.ui.adapter.init.' + series + '.web'
            ],
            success: function (sb) {
              let util = sb.getService(
                'vjs.framework.extension.ui.adapter.init.' +
                  series +
                  '.web.util'
              )
              util.renderAsElement(params)
            },
            fail: params.fail
          })
        },
        params.fail
      )
    },
    fail: params.fail
  })
}

const preLoad = function (params) {
  V3Integration.load({
    vjsList: [
      'vjs.framework.extension.ui.adapter.dependency',
      'vjs.framework.extension.ui.adapter.dependency.web',
      'vjs.framework.extension.platform.interface.scope'
    ],
    success: function (sb) {
      let dep = sb.getService('vjs.framework.extension.ui.adapter.dependency')
      dep.loadResources(
        params.componentCode,
        params.windowCode,
        sb,
        null,
        function (s) {
          let manager = s.getService(
            'vjs.framework.extension.platform.interface.scope.ScopeManager'
          )
          let scope = manager.getScope()
          let series = scope.get('type')
          V3Integration.load({
            vjsList: [
              'vjs.framework.extension.ui.adapter.init.' + series + '.web'
            ],
            success: function (sb) {
              let util = sb.getService(
                'vjs.framework.extension.ui.adapter.init.' +
                  series +
                  '.web.util'
              )
              util.preLoad(params)
            }
          })
        },
        params.fail
      )
    }
  })
}

const openUrl = function (params) {
  let url = params.url
  let index = url.indexOf('?')
  if (index == -1) {
    url += '?server_url='
  } else {
    url += '&server_url='
  }
  let win = window.open(url)
  window._$closeCallback = params.onClose
}

const closeCurrentWindow = function (params) {
  let opener = window.opener
  if (opener && opener._$closeCallback) {
    opener._$closeCallback(params)
  }
  window.opener = null
  window.close()
}

export {
  renderAsModal,
  renderAsWindow,
  renderAsElement,
  preLoad,
  openUrl,
  closeCurrentWindow
}
