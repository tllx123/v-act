import { WindowInfo as windowInfo } from '@v-act/vjs.framework.extension.platform.data.manager.runtime.info'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

let sb

// 权限池
let permissionPool: any = {}

// export function initModule(sandbox) {
//   sb = sandbox
// }

let getScopeContext = function () {
  let scopeId = scopeManager.getCurrentScopeId() || 'null'
  let scopeContext = permissionPool[scopeId]
  if (!scopeContext) {
    scopeContext = permissionPool[scopeId] = {}
  }
  return scopeContext
}

let getPermissionContext = function () {
  let scopeContext = getScopeContext()
  let permission = scopeContext['permission']
  if (!permission) {
    permission = scopeContext['permission'] = {}
  }
  return permission
}

let addPermission = function (widgetId: string, hasPermission: any) {
  let permissionList = getPermissionContext()
  permissionList[widgetId] = hasPermission
}

let setPermission = function (permission: any) {
  let permissionList = getPermissionContext()
  for (let key in permission) {
    permissionList[key] = permission[key]
  }
}

let hasPermission = function (widgetId: string, propertyName: string) {
  let permissionList = getPermissionContext()
  if (permissionList.hasOwnProperty(widgetId)) {
    let info = permissionList[widgetId]
    if (info) {
      if (typeof info == 'object') {
        if (info.hasOwnProperty('_hasPermission')) {
          //权限旧数据
          return info['_hasPermission']
        } else {
          //如果控制了使能为false或者不显示或者只读，则没权限
          switch (propertyName) {
            case 'setEnabled':
            case 'getEnabled':
              if (info.hasOwnProperty('Enabled')) {
                return info['Enabled']
              }
              break
            case 'setVisible':
            case 'getVisible':
              if (info.hasOwnProperty('Visible')) {
                return info['Visible']
              }
              break
            case 'setReadOnly':
            case 'getReadOnly':
              if (info.hasOwnProperty('ReadOnly')) {
                return !info['ReadOnly']
              }
              break
            //							case "setValue":
            //							case "getValue":
            //							case "getDefaultValue":
            //								if(info.hasOwnProperty("Value")){
            //									return info["Value"];
            //								}
            //								break;
            default:
              return true
          }
          return true
        }
      }
    }
    return info
  } else {
    return true
  }
}

let initViewLibPermssion = function (
  mappings: any,
  allRelationStr: any,
  componentCode: any,
  windowCode: any
) {
  if (null != allRelationStr && '' != allRelationStr) {
    let allRelations = JSON.parse(allRelationStr)
    let aRs = {}
    if (allRelations) {
      for (let pId in allRelations) {
        if (!allRelations.hasOwnProperty(pId)) continue
        let childInfos = allRelations[pId]
        if (!childInfos || childInfos.length < 1) continue
        for (let i = 0; i < childInfos.length; i++) {
          let childInfo = childInfos[i]
          let type = childInfo.type
          let code = childInfo.code
          widgetContext.put(code, 'ProxyWidgetId', childInfo.proxyWidgetId)
          widgetContext.put(code, 'WidgetType', childInfo.type)
          aRs[code] = pId
        }
      }
    }
    let widgetPermission = windowInfo.getWidgetPermission(
      componentCode,
      windowCode
    )
    if (widgetPermission && widgetPermission.edit) {
      let wp = widgetPermission.edit
      for (let wId in wp) {
        let modifyProperty = wp[wId]
        if (aRs[wId]) {
          let parentId = aRs[wId]
          let parentProperty = mappings[parentId]
          if (!parentProperty) continue
          let childPropertys = {}
          switch (parentProperty._$WidgetType) {
            case 'JGDataGrid':
            case 'JGTreeGrid':
              var fields = parentProperty.fields
              if (!fields || fields.length < 1) continue
              for (var i = 0; i < fields.length; i++) {
                var fieldProperty = fields[i]
                var columnId = fieldProperty.columnId
                if (columnId == wId) {
                  if (modifyProperty.hasOwnProperty('ReadOnly')) {
                    fieldProperty.canEdit = !modifyProperty.ReadOnly
                  }
                  if (modifyProperty.hasOwnProperty('Enabled')) {
                    fieldProperty.disabled = !modifyProperty.Enabled
                  }
                  if (modifyProperty.hasOwnProperty('Visible')) {
                    fieldProperty.showIf = modifyProperty.Visible + ''
                  }
                  childPropertys[fieldProperty.columnId] = fieldProperty
                }
              }

              break
            case 'JGTabControl':
              var tabs = parentProperty.tabs
              if (!tabs || tabs.length < 1) continue
              for (var i = 0; i < tabs.length; i++) {
                var tabProperty = tabs[i]
                childPropertys[tabProperty.id] = tabProperty
              }
              break
          }
          let childProperty = childPropertys[wId]
          if (!childProperty) continue
          for (let mP in modifyProperty) {
            if (!modifyProperty.hasOwnProperty(mP)) continue
            if (mP == '_hasPermission') {
              childProperty['Enabled'] = modifyProperty[mP]
            } else {
              childProperty[mP] = modifyProperty[mP]
            }
            childProperty[mP] = modifyProperty[mP]
          }
        } else {
          let parentProperty = mappings[wId]
          if (!parentProperty) continue
          for (let mP in modifyProperty) {
            if (!modifyProperty.hasOwnProperty(mP)) continue
            if (mP == '_hasPermission') {
              parentProperty['Enabled'] = modifyProperty[mP]
            } else {
              parentProperty[mP] = modifyProperty[mP]
            }
          }
        }
      }
    }
  }
}

export { addPermission, hasPermission, initViewLibPermssion, setPermission }
