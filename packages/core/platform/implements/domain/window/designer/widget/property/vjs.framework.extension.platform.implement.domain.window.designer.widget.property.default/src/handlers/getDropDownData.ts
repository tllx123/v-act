define('./getDropDownData', function (require, exports, module) {
  var scopeManager, widgetContext, dropDownSourceUtil

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    dropDownSourceUtil = sb.getService(
      'vjs.framework.extension.platform.services.domain.dropdown.DropDownSourceUtil'
    )
  }

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
})
