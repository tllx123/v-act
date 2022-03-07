import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'

export function getHandlerName() {
  return 'browser.showModal'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (params) {
        var extraParams = params || {}
        var componentCode = extraParams.componentCode || {}
        var windowCode = extraParams.windowCode || {}
        //窗体输入
        var inputParam = extraParams.inputParam || {}
        //模态宽度
        var width = extraParams.width || 600
        //模态高度
        var height = extraParams.height || 600
        //关闭回调
        var closed = extraParams.closeCallback || function () {}
        //模态标题
        var title = extraParams.title || ''
        var componentVariable = {}
        componentVariable['variable'] = inputParam
        // 标注打开方式为dialog
        componentVariable['variable']['formulaOpenMode'] = 'dialog'
        browser.showModalModule({
          componentCode: componentCode,
          windowCode: windowCode,
          title: '',
          width: width,
          height: height,
          inputParam: componentVariable,
          closeCallback: closed
        })
      }
    })
    widgetProperty[property.code] = handler
  }
}
