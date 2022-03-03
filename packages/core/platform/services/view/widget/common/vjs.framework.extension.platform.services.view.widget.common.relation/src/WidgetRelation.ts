import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'

let undefined
let undefined
let collectionUtil

// 关系类型
let WIDGET_RELATION = 'widget_relation'
let SCOPE_STORAGE_TOKEN = 'WIDGETRELATION_STORAGE'

// 控件关系池
let relationPool = {}

exports.initModule = function (sb) {
  collectionUtil = sb.util.collections
}

/**
 * 设置控件关系
 *
 * @widgetId 控件编号
 * @widgetRelationList 子控件编号列表：['xxx', 'xxx']
 * @relationType 关系类型：[WidgetRelation.WIDGET_RELATION, COMPONENT_RELATION]
 */
let put = function (widgetId, widgetRelationList, relationType) {
  let poolInScope = getPoolInScope()
  if (undefined != poolInScope && null != poolInScope) {
    relationType = relationType ? relationType : WIDGET_RELATION
    let pool = poolInScope.get(WIDGET_RELATION)
    pool = pool ? pool : {}
    pool[widgetId] = widgetRelationList
    poolInScope.put(WIDGET_RELATION, pool)
  }
}

/**
 * 获取控件关系
 *
 * @widgetId 父控件编码
 * @isRecursive 是否递归获取
 * @relationType 关系类型：[WidgetRelation.WIDGET_RELATION,
 *               WidgetRelation.COMPONENT_RELATION]
 */
let get = function (widgetId, isRecursive, relationType) {
  let poolInScope = getPoolInScope()
  if (undefined == poolInScope || null == poolInScope) {
    return []
  }
  relationType = relationType ? relationType : WIDGET_RELATION
  let pool = poolInScope.get(WIDGET_RELATION)
  if (!pool) {
    return []
  }
  let widgetRelationList = pool[widgetId]
  if (widgetRelationList && widgetRelationList.length > 0) {
    if (isRecursive) {
      for (let i = 0; i < widgetRelationList.length; i++) {
        widgetRelationList = widgetRelationList.concat(
          get(widgetRelationList[i], isRecursive, relationType)
        )
      }
    } else {
      return widgetRelationList
    }
  } else {
    return []
  }
}

let getWidgetList = function () {
  let poolInScope = getPoolInScope()
  if (undefined == poolInScope || null == poolInScope) {
    return []
  }
  let pool = poolInScope.get(WIDGET_RELATION)
  if (!pool) {
    return []
  }
  let widgetListObject = {}
  for (let widgetId in pool) {
    let widgetRelationList = pool[widgetId]
    for (let i = 0; i < widgetRelationList.length; i++) {
      widgetListObject[widgetRelationList[i]] = widgetRelationList[i]
    }
  }
  let widgetList = []
  for (let widgetId in widgetListObject) {
    widgetList.push(widgetListObject[widgetId])
  }
  return widgetList
}

let getPoolInScope = function () {
  let scope = scopeManager.getScope()
  let storage = null
  if (scope != null) {
    if (scope.has(SCOPE_STORAGE_TOKEN)) {
      storage = scope.get(SCOPE_STORAGE_TOKEN)
    } else {
      storage = storageManager.newInstance(storageManager.TYPES.MAP)
      scope.set(SCOPE_STORAGE_TOKEN, storage)
    }
  }
  return storage
}

const getParent = function (widgetId, relationType) {
  let poolInScope = getPoolInScope()
  if (undefined == poolInScope || null == poolInScope) {
    return null
  }
  relationType = relationType ? relationType : WIDGET_RELATION
  let pool = poolInScope.get(WIDGET_RELATION)
  if (!pool) {
    return null
  }
  let parent = null
  collectionUtil.find(pool, function (val, key) {
    if (val && collectionUtil.contains(val, widgetId)) {
      parent = key
      return true
    }
  })
  return parent
}

const getParents = function (widgetId, relationType) {
  let parents = []
  let parent = this.getParent(widgetId, relationType)
  while (parent != null) {
    parents.push(parent)
    parent = this.getParent(parent, relationType)
  }
  return parents
}

export { getParent, getParents, get, put, getWidgetList, WIDGET_RELATION }
