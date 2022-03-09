import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

export function getType() {
  return 'DropDownSource'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var compatible = property.compatible
    var dropdownSourceHandler = compatible.dropdownSourceHandler
    if (dropdownSourceHandler) {
      var dropDownSourceEventHandler = sandbox.getService(
        'vjs.framework.extension.platform.services.view.widget.common.logic.eventhandler.DropDownSourceEventHandler'
      )
      var widgetCode = widgetProperty.Code
      var scopeId = scopeManager.getCurrentScopeId()
      var handler = (function (sId, code) {
        return function () {
          try {
            scopeManager.openScope(sId)
            dropDownSourceEventHandler.loadDropDownSourceFromEntity(code)
          } finally {
            scopeManager.closeScope()
          }
        }
      })(scopeId, widgetCode)
      widgetProperty[dropdownSourceHandler] = handler
    }
  }
}