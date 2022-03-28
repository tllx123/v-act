import * as widgetAction from './WidgetAction'
import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let set = function (widgetId: any, propertyName: string, propertyValue: any) {
  //let actionName = 'set' + propertyName
  //return widgetAction.executeWidgetAction(widgetId, actionName)
  const windowScope = ScopeManager.getWindowScope()
  const handler = windowScope.get('changeComponentByProperties')
  if (handler) {
    const attrs = {}
    propertyName = getPropertyName(propertyName)
    attrs[propertyName] = propertyValue
    handler(widgetId, attrs)
  }
}

let get = function (widgetId: any, propertyName: string) {
  const windowScope = ScopeManager.getWindowScope()
  const handler = windowScope.get('getComponentProperty')
  if (handler) {
    propertyName = getPropertyName(propertyName)
    return handler(widgetId, propertyName)
  }
  return null
}

let getPropertyName = function (propertyName) {
  if (propertyName.length > 1) {
    propertyName =
      propertyName.substring(0, 2).toLowerCase() + propertyName.substring(2)
  } else {
    propertyName = propertyName.toLowerCase()
  }
  return propertyName
}

let hasProperty = function (widgetId: any, propertyName: string) {
  let getActionName = 'get' + propertyName
  let setActionName = 'set' + propertyName
  if (
    widgetAction.isWidgetActionExist(widgetId, getActionName) ||
    widgetAction.isWidgetActionExist(widgetId, setActionName)
  )
    return true
  else return false
}

export { get, hasProperty, set }
