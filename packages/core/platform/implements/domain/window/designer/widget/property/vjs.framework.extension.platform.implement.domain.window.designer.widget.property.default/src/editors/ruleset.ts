import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.event.binding'

import { EventManager as eventHandler } from '@v-act/vjs.framework.extension.platform.services.view.event'

export function getType() {
  return 'ruleset'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var editor = property.editor
    var widgetCode = widgetProperty.Code
    var code = property.code
    widgetProperty['_$' + code] = widgetProperty[code]
    var concurrent = true
    if (editor.hasOwnProperty('concurrent')) {
      concurrent = editor.concurrent
    }
    widgetProperty[code] = concurrent
      ? eventHandler.fireEvent(widgetCode, code)
      : eventManager.fireEvent(widgetCode, code)
  }
}
