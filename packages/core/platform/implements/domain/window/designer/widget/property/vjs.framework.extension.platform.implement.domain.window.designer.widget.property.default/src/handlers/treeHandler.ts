import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { TreeHandler as treeHandler } from '@v-act/vjs.framework.extension.ui.smartclient.plugin.services.treehandler'

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
