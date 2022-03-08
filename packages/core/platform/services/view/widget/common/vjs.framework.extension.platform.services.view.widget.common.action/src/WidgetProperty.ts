import * as widgetAction from './WidgetAction'

export function initModule(sb) {}

let set = function (widgetId, propertyName, propertyValue) {
  let actionName = 'set' + propertyName
  return widgetAction.executeWidgetAction(widgetId, actionName, propertyValue)
}

let get = function (widgetId, propertyName) {
  let actionName = 'get' + propertyName
  return widgetAction.executeWidgetAction(widgetId, actionName)
}

let hasProperty = function (widgetId, propertyName) {
  let getActionName = 'get' + propertyName
  let setActionName = 'set' + propertyName
  if (
    widgetAction.isWidgetActionExist(widgetId, getActionName) ||
    widgetAction.isWidgetActionExist(widgetId, setActionName)
  )
    return true
  else return false
}

export {
  executeComponentAction,
  executeSubWidgetAction,
  executeWidgetAction,
  get,
  getComponentActionHandler,
  getProxyWidgetId,
  getService,
  getWidgetActionHandler,
  hasProperty,
  isComponentActionExist,
  isWidgetActionExist,
  set
}
