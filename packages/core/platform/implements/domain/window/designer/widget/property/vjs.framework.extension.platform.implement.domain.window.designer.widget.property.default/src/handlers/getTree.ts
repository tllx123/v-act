define('./getTree', function (require, exports, module) {
  var scopeManager, treeManager

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    treeManager = sb.getService(
      'vjs.framework.extension.platform.services.model.manager.tree.TreeManager'
    )
  }

  export function getHandlerName() {
    return 'getTree'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (dsName, treeStruct) {
          var treeInstance = treeManager.lookup({
            datasourceName: dsName,
            treeStruct: treeStruct
          })
          return treeInstance
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
