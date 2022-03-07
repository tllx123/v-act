define('./ruleset', function (require, exports, module) {
  var eventManager, eventHandler

  export function initModule(sb) {
    eventManager = sb.getService(
      'vjs.framework.extension.platform.services.view.widget.common.event.binding.EventManager'
    )
    eventHandler = sb.getService(
      'vjs.framework.extension.platform.services.view.event.EventManager'
    )
  }

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
})
