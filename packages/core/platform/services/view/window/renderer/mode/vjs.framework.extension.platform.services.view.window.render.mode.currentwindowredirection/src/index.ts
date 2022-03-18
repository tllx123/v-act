import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { render as renderer } from '@v-act/vjs.framework.extension.platform.services.view.window.render.mode.currentwindow'

var getRootWindow = function () {
  var windowScope = scopeManager.getWindowScope()
  var parentId = scopeManager.getParentScopeId(windowScope.getInstanceId())
  if (parentId) {
    scopeManager.openScope(parentId)
    var scope = getRootWindow()
    scopeManager.closeScope()
    return scope
  }
  return windowScope
}

export function render(params) {
  var windowScope = scopeManager.getWindowScope()
  var series = windowScope.getSeries()
  var version = widgetContext.get(windowScope.getWindowCode(), 'version')
  if (series == 'bootstrap_mobile' && version == '4') {
    //移动端原型窗体浏览器刷新调整为根窗体当前页面跳转
    var root = getRootWindow()
    var rootScopeId = root.getInstanceId()
    scopeManager.openScope(rootScopeId)

    renderer.render(params)
    scopeManager.closeScope()
  } else {
    var componentCode = params.componentCode
    var windowCode = params.windowCode
    var title = params.title
    var windowInputParams = params.inputs
    browser.redirectLocation({
      componentCode: componentCode,
      windowCode: windowCode,
      title:
        title == undefined || title == null ? title : encodeURIComponent(title),
      inputParam: windowInputParams
    })
  }
}
