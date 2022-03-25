import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  EventManager,
  RightClickEventHandler as RightClickEventHander
} from '@v-act/vjs.framework.extension.platform.services.view.event'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

//@ts-ignore
seajs.use(['itop/common/smartclient/extra/thirdpart/clipboard/clipboard.js'])
let handler = new RightClickEventHander({
  title:
    "<div class='copyBtn' style='text-align:center' id='girdWidgetcopyBtn'>复制</div>",
  accept: function (eventType: string, scopeId: string | null) {
    ScopeManager.openScope(scopeId)
    ScopeManager.closeScope()
    return eventType === 'datagridClick'
  },
  handler: function (widgetId: string, scopeId: string | null, cellVal: any) {
    ScopeManager.openScope(scopeId)
    var widget = widgetContext.get(widgetId, 'widgetObj')
    //var cellData = widget._widget.getSelectedCellData()[0][0];
    var cellData = cellVal
    $('body').append(
      '<div style="display:none" id="' + scopeId + widgetId + 'copyBtn"></div>'
    )
    var tdParent = $('#' + scopeId + widgetId + 'copyBtn')
    tdParent.attr('data-clipboard-text', cellData)
    //@ts-ignore
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
