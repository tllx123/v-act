import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { DropDownSourceUtil as dropDownSourceUtil } from '@v-act/vjs.framework.extension.platform.services.domain.dropdown'

export function getHandlerName() {
  return 'getDropDownData'
}

export function getHandler() {
  return function (property, widgetProperty) {
    var handler = scopeManager.createScopeHandler({
      handler: function (dataSource, valueFieldName, textFieldName) {
        var dropData = dropDownSourceUtil.getDataByDataSource(
          dataSource,
          valueFieldName,
          textFieldName
        )
        return dropData
      }
    })
    widgetProperty[property.code] = handler
  }
}
