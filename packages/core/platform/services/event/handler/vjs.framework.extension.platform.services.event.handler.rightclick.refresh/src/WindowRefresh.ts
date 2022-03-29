import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import {
  EventManager,
  RightClickEventHandler as RightClickEventHander
} from '@v-act/vjs.framework.extension.platform.services.view.event'
import { WidgetAction as actionHandler } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let refresh_handler
let handlerRefresh = new RightClickEventHander({
  title: '刷新当前页面',
  handler: refresh_handler,
  accept: function (
    _this: any,
    _scopeId: any,
    scopeId: any,
    eventType: string
  ) {
    return eventType === 'windowRightClick'
  }
})
//一进来就注册了鼠标右键刷新事件
EventManager.addPlatformEventHandler(
  EventManager.PlatformEvents.WindowRightClick,
  handlerRefresh
)
// }

refresh_handler = function (
  _this: any,
  _scopeId: string | null,
  scopeId: string | null
) {
  //抽离出来的刷新方法
  /*$(".RightMenuTitle>ul").html("<li>刷新当前页面</li>");
    $('#mask').show();
    $("#rightMenu_div").css({top:e.pageY,left:e.pageX})*/

  ScopeManager.openScope(_scopeId)
  let _code = $(_this).parent().attr('id')
  let componentCode = widgetContext.get(_code, 'ComponentCode')
  let windowCode = widgetContext.get(_code, 'WindowCode')
  ScopeManager.closeScope()
  this.hideMenu()
  ScopeManager.openScope(scopeId)
  let params = windowParam.getInputs()
  actionHandler.executeComponentAction(
    'loadComponent',
    componentCode,
    windowCode,
    { variable: params }
  )
  ScopeManager.closeScope()
  //e.stopPropagation()
  //return false;
  return false
}
