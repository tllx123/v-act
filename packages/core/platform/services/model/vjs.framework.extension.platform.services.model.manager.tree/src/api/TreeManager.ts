import { Tree } from '@v-act/vjs.framework.extension.platform.interface.model.tree'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { DataAdapter as dataAdapter } from '@v-act/vjs.framework.extension.platform.services.viewmodel.dataadapter'
import { WindowVMMappingManager as vmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'

let __treeViewModelInstanceCache = {}

// export function initModule(sb) {}

const lookup = function (params: any) {
  let datasourceName = params.datasourceName,
    treeStruct = params.treeStruct
  let scopeId: any = scopeManager.getCurrentScopeId()
  let treeType = treeStruct['type']
  if (!treeType) {
    throw new Error('参数传入错误！请检查。')
  }
  let isContain = false
  let instance
  let treeViewModelInstances = __treeViewModelInstanceCache[scopeId]
  if (!treeViewModelInstances) {
    treeViewModelInstances = []
    __treeViewModelInstanceCache[scopeId] = treeViewModelInstances
  }
  for (let i = 0; i < treeViewModelInstances.length; i++) {
    let tree = treeViewModelInstances[i]
    let metadata = tree.getMetadata()
    let struct = tree.getTreeStruct()
    if (
      metadata.getDatasourceName() == datasourceName &&
      struct.type == treeType
    ) {
      if (
        (treeType == '1' || treeType == '2') &&
        treeStruct['pidField'] == struct['pidField']
      ) {
        instance = treeViewModelInstances[i]
        break
      } else if (
        treeType == '3' &&
        treeStruct['bizCodeField'] == struct['bizCodeField']
      ) {
        instance = treeViewModelInstances[i]
        break
      }
    }
  }
  if (!instance) {
    let treeViewModel
    if (treeType == '1' || treeType == '2') {
      let db = datasourceManager.lookup({ datasourceName: datasourceName })
      instance = Tree.createFromDatasource({
        datasource: db,
        treeStruct: treeStruct
      })
      instance._putWidgetAction(widgetAction)
      instance._putDataAdapter(dataAdapter)
      //设置关联控件id
      if (!treeStruct.hasOwnProperty('refWidgetId')) {
        let widgetIds = vmManager.getWidgetCodesByDatasourceName({
          datasourceName: datasourceName
        })
        if (widgetIds && widgetIds.length > 0) {
          for (let i = 0, widgetId; (widgetId = widgetIds[i]); i++) {
            let widget = widgetContext.get(widgetId, 'widgetObj')
            if (
              widget &&
              widget.getParentField &&
              typeof widget.getParentField == 'function'
            ) {
              let parentField = widget.getParentField()
              if (
                parentField == treeStruct['pidField'] ||
                parentField.toUpperCase() ==
                  treeStruct['pidField'].toUpperCase()
              ) {
                treeStruct.refWidgetId = widgetId
                break
              }
            }
          }
        }
      }
    } else if (treeType == '3') {
    }
    treeViewModelInstances.push(instance)
  }
  return instance
}

const lookupByName = function (params: any) {
  let datasourceName = params.datasourceName
  let scopeId: any = scopeManager.getCurrentScopeId()
  let isContain = false
  let instance = []
  let treeViewModelInstances = __treeViewModelInstanceCache[scopeId]
  if (treeViewModelInstances) {
    for (let i = 0; i < treeViewModelInstances.length; i++) {
      let tree = treeViewModelInstances[i]
      let metadata = tree.getMetadata()
      if (metadata.getDatasourceName() == datasourceName) {
        instance.push(treeViewModelInstances[i])
      }
    }
  }
  if (instance.length < 1) {
    return []
  }
  return instance
}

export { lookup, lookupByName }
