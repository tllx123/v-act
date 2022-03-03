import * as actionHandler from 'module'
import * as viewModel from 'module'

//加载actionHandler模块
let undefined
//加载jsonUtil模块
let jsonUtil
let ScopeManager

exports.initModule = function (sb) {
  if (sb) {
    jsonUtil = sb.getService('vjs.framework.extension.util.JsonUtil')
    ScopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
  }
}

/**
 * 主入口
 * @param widgetId 当前门户控件ID
 * @param configDataJson 初始化数据
 * @param tabSetInitConfig
 */
let main = function (widgetId, configDataJson, tabSetInitConfig) {
  let configDataJsonArr = jsonUtil.json2obj(configDataJson)
  let tabSetInitConfigArr = jsonUtil.json2obj(tabSetInitConfig)
  if (configDataJsonArr && configDataJsonArr.length > 0) {
    for (let i = 0; i < configDataJsonArr.length; i++) {
      let configDataJsonOnePageArr = configDataJsonArr[i]
      if (configDataJsonOnePageArr && configDataJsonOnePageArr.length > 0) {
        for (let j = 0; j < configDataJsonOnePageArr.length; j++) {
          let configDataJsonObj = configDataJsonOnePageArr[j]
          if (configDataJsonObj.moreWindowCode) {
            let paramsJson = {}
            let portletId = configDataJsonObj.id
            bindingPortletEvent(
              widgetId,
              portletId,
              configDataJsonObj.moreComponentCode,
              configDataJsonObj.moreWindowCode,
              paramsJson
            )
          }
        }
      }
    }
  }
  actionHandler.executeWidgetAction(widgetId, 'removeAllPortlets')
  actionHandler.executeWidgetAction(
    widgetId,
    'initPortalTabSet',
    tabSetInitConfigArr
  )
  actionHandler.executeWidgetAction(
    widgetId,
    'initAllPortlets',
    configDataJsonArr
  )
}

//绑定注册事件
let bindingPortletEvent = function (
  widgetId,
  portletId,
  componentCode,
  windowCode,
  params
) {
  let fn = getOpenNewWindowFunc(widgetId, componentCode, windowCode, params)
  actionHandler.executeWidgetAction(
    widgetId,
    'onPortletEvent',
    'click',
    fn,
    portletId
  )
}

// 以新窗体方式打开组件
let getOpenNewWindowFunc = function (
  widgetId,
  componentCode,
  windowCode,
  params
) {
  let scopeId = ScopeManager.getCurrentScopeId()
  return (function (componentCode, windowCode, params) {
    function innerFunc() {
      ScopeManager.openScope(scopeId)
      var componentVariable = {}
      componentVariable['variable'] = params
      // 标注打开方式为dialog
      componentVariable['variable']['formulaOpenMode'] = 'dialog'
      viewModel
        .getCmpModule()
        .callModalModule(
          componentCode,
          windowCode,
          null,
          null,
          null,
          componentVariable,
          null
        )
      ScopeManager.closeScope()
    }
    return innerFunc
  })(componentCode, windowCode, params)
}

export { main }
