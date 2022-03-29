import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  EventManager as eventManager,
  RightClickEventHandler as RightClickEventHander
} from '@v-act/vjs.framework.extension.platform.services.view.event'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

// export function initModule(sb) {
// let RightClickEventHander = sb.getService(
//   'vjs.framework.extension.platform.services.view.event.RightClickEventHandler'
// )
let _handler: any
let evenHandler = new RightClickEventHander({
  title: '导出当前数据',
  handler: _handler,
  accept: function (eventType: string) {
    return eventType === 'exportCurData'
  }
})
eventManager.addPlatformEventHandler(
  eventManager.PlatformEvents.WindowRightClick,
  evenHandler
)
// }

_handler = function (widgetId: string, scopeId: string | null) {
  ScopeManager.openScope(scopeId)
  let widget = widgetContext.get(widgetId, 'widgetObj')
  let exportColumns = { exportColumns: widget._genExportColmn() }
  let gridId = { gridId: widgetId },
    exportModel = { exportModel: 'current' }
  eventManager.fireEvent(widgetId, 'OnJGDataGridExportDataAction')(
    exportColumns,
    gridId,
    exportModel
  )
  ScopeManager.closeScope()
  this.hideMenu()
}
