define('./treeHandler', function (require, exports, module) {
  var scopeManager, treeHandler

  export function initModule(sb) {
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    treeHandler = sb.getService(
      'vjs.framework.extension.ui.smartclient.plugin.services.TreeHandler',
      {
        type: 'smartclient'
      }
    )
  }

  export function getHandlerName() {
    return 'treeHandler'
  }

  export function getHandler() {
    return function (property, widgetProperty) {
      var handler = scopeManager.createScopeHandler({
        handler: function (widgetId, type) {
          switch (type) {
            case 'load':
              return treeHandler.genLoadAction(widgetId)
            case 'insert':
              return treeHandler.genInsertAction(widgetId)
            case 'fetch':
              return treeHandler.genFetchAction(widgetId)
            case 'fetched':
              return treeHandler.genFetchedAction(widgetId)
            case 'delete':
              return treeHandler.genDeleteAction(widgetId)
            case 'update':
              return treeHandler.genUpdateAction(widgetId)
            case 'current':
              return treeHandler.genCurrentAction(widgetId)
            case 'select':
              return treeHandler.genSelectAction(widgetId)
          }
        }
      })
      widgetProperty[property.code] = handler
    }
  }
})
