import * as eventManager from '@v-act/vjs.framework.extension.platform.services.view.event'
import * as widgetProperty from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import * as widgetContext from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import * as $ from '@v-act/vjs.framework.extension.vendor.jquery'
const vds = { eventManager, widgetProperty, widgetContext, $ }
let sb

export function initModule(sandbox) {
  sb = sandbox
}

/**
 * 注册DB更新事件
 */
let initInput = function (widgetId: string) {
  let globalCode = widgetContext.get(widgetId, 'GlobalCode')
  eventManager.addEventHandler(widgetId, 'DBUpdate', function () {
    let value = $('#' + globalCode).val()
    value = value == '' ? null : value
    widgetProperty.set(widgetId, 'Value', value)
  })
}

export { initInput }
