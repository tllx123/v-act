import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import * as TreeDataModel from './TreeDataModel'

/**
 * 移动的状态ss
 */
let Enum_MoveTo = {
  ABOVE: 'ABOVE',
  BELOW: 'BELOW',
  APPEND: 'APPEND'
}

let __treeViewModelInstanceCache = {}

/**
 *  获取treeViewModel 的实例
 *  @param dataSourceName 数据源
 *  @param treeStruct 树结构信息，单条记录。 不接受数组{pid:***, dd:***}
 *  @return treeViewModel
 */
let getInstance = function (dataSourceName, treeStruct) {
  let scopeId = ScopeManager.getCurrentScopeId()
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
    if (
      treeViewModelInstances[i].getDataSourceName() == dataSourceName &&
      treeViewModelInstances[i].getTreeStruct()['type'] == treeType
    ) {
      if (
        (treeType == '1' || treeType == '2') &&
        treeStruct['pidField'] ==
          treeViewModelInstances[i].getParentIdRefField()
      ) {
        instance = treeViewModelInstances[i]
        break
      } else if (
        treeType == '3' &&
        treeStruct['bizCodeField'] ==
          treeViewModelInstances[i].getBusinessCodeRefField()
      ) {
        instance = treeViewModelInstances[i]
        break
      }
    }
  }
  if (!instance) {
    let treeViewModel
    if (treeType == '1' || treeType == '2') {
      treeViewModel = TreeDataModel
    } else if (treeType == '3') {
      //treeViewModel = require("system/view/bizCodeTreeViewModel");
    }
    instance = treeViewModel.getInstance(dataSourceName, treeStruct)
    treeViewModelInstances.push(instance)
  }
  return instance
}

let destroy = function () {
  let scopeId = ScopeManager.getCurrentScopeId()
  delete __treeViewModelInstanceCache[scopeId]
}

export { destroy, Enum_MoveTo, getInstance }
