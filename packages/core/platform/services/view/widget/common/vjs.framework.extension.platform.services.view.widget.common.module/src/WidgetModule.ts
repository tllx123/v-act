import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

let sb

export function initModule(sandbox) {
  sb = sandbox
}

/**
 * 获取控件接口管理类
 *
 * @widgetId 控件编号
 */
let getWidgetActionHandler = function (widgetId: string) {
  let proxyWidgetId = widgetContext.get(widgetId, 'ProxyWidgetId')
  let widgetType
  if (undefined == proxyWidgetId || null == proxyWidgetId) {
    widgetType = widgetContext.getType(widgetId)
  } else {
    widgetType = widgetContext.getType(proxyWidgetId)
  }
  let seriesType = scopeManager.getWindowScope().getSeries()
  let widgetActionHandler = sb.getService(
    'vjs.framework.extension.ui.plugin.' +
      widgetType +
      '.action.' +
      widgetType +
      'Action',
    {
      type: seriesType
    }
  )
  return widgetActionHandler
}

/**
 * 获取控件数据管理类
 *
 * @widgetId 控件编号
 */
let getWidgetDataHandler = function (widgetId: string) {
  let widgetType = widgetContext.getType(widgetId)
  let seriesType = scopeManager.getWindowScope().getSeries()
  let widgetDataHandler = sb.getService(
    'vjs.framework.extension.ui.plugin.' +
      widgetType +
      '.data.' +
      widgetType +
      'Handler',
    {
      type: seriesType
    }
  )
  return widgetDataHandler
}
export { getWidgetActionHandler, getWidgetDataHandler }
