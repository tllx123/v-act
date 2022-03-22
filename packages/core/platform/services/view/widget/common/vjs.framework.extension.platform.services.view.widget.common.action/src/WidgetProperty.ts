import * as widgetAction from './WidgetAction'

let set = function (widgetId: any, propertyName: string) {
  let actionName = 'set' + propertyName
  return widgetAction.executeWidgetAction(widgetId, actionName)
}

let get = function (widgetId: any, propertyName: string) {
  let actionName = 'get' + propertyName
  return widgetAction.executeWidgetAction(widgetId, actionName)
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
