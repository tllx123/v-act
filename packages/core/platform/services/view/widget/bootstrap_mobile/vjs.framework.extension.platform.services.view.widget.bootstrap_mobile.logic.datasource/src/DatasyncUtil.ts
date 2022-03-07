import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'
import { WidgetProperty as widgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

let sb

export function initModule(sandbox) {
  sb = sandbox
}

/**
 * 注册DB更新事件
 */
let initInput = function (widgetId) {
  let globalCode = widgetContext.get(widgetId, 'GlobalCode')
  eventManager.addEventHandler(widgetId, 'DBUpdate', function () {
    let value = $('#' + globalCode).val()
    value = value == '' ? null : value
    widgetProperty.set(widgetId, 'Value', value)
  })
}

export { initInput }
