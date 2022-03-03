import { WidgetAction as actionHandler } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { EventManager as EventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'

let sandbox
let undefined
let undefined
let undefined
exports.initModule = function (sb) {
  sandbox = sb
  let RightClickEventHander = sb.getService(
    'vjs.framework.extension.platform.services.view.event.RightClickEventHandler'
  )
  seajs.use(['itop/common/smartclient/extra/thirdpart/clipboard/clipboard.js'])
  let handler = new RightClickEventHander({
    title:
      "<div class='copyBtn' style='text-align:center' id='girdWidgetcopyBtn'>复制</div>",
    accept: function (eventType, widgetId, scopeId, cellVal) {
      ScopeManager.openScope(scopeId)
      ScopeManager.closeScope()
      return eventType === 'datagridClick'
    },
    handler: function (eventType, widgetId, scopeId, cellVal) {
      ScopeManager.openScope(scopeId)
      var widget = widgetContext.get(widgetId, 'widgetObj')
      //var cellData = widget._widget.getSelectedCellData()[0][0];
      var cellData = cellVal
      $('body').append(
        '<div style="display:none" id="' +
          scopeId +
          widgetId +
          'copyBtn"></div>'
      )
      var tdParent = $('#' + scopeId + widgetId + 'copyBtn')
      tdParent.attr('data-clipboard-text', cellData)
      var clipboard = new Clipboard(tdParent[0])
      ScopeManager.closeScope()
      tdParent.trigger('click')
      this.hideMenu()
    }
  })
  EventManager.addPlatformEventHandler(
    EventManager.PlatformEvents.WindowRightClick,
    handler
  )
}
