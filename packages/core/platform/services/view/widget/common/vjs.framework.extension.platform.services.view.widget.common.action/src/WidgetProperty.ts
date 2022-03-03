import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import * as widgetAction from './WidgetAction'

let undefined
let undefined

exports.initModule = function (sb) {}

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
  getService,
  isWidgetActionExist,
  isComponentActionExist,
  getWidgetActionHandler,
  getComponentActionHandler,
  executeWidgetAction,
  executeSubWidgetAction,
  executeComponentAction,
  getProxyWidgetId,
  get,
  set,
  hasProperty
}
