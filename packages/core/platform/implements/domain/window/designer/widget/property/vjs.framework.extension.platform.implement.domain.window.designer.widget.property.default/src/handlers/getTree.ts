import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { TreeManager as treeManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.tree'

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
