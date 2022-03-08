import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let _context = {}

export function initModule(sBox) {}

let _getScopeContext = function () {
  let scopeId = ScopeManager.getCurrentScopeId()

  let scopeContext = _context[scopeId]
  if (!scopeContext) {
    scopeContext = _context[scopeId] = {}
  }
  return scopeContext
}

let _getWidgetContext = function (widgetId) {
  let scopeContext = _getScopeContext()
  let widgetObj = scopeContext[widgetId]
  if (!widgetObj) {
    widgetObj = scopeContext[widgetId] = {}
  }
  return widgetObj
}

let putAll = function (widgetId, properties) {
  let widgetObj = _getWidgetContext(widgetId)
  for (let key in properties) {
    widgetObj[key] = properties[key]
  }
}

let put = function (widgetId, key, value) {
  let widgetObj = _getWidgetContext(widgetId)
  let old = widgetObj[key]
  widgetObj[key] = value
  return old
}

let get = function (widgetId, key) {
  let widgetObj = _getWidgetContext(widgetId)
  return widgetObj[key]
}

let getAll = function (widgetId) {
  return _getWidgetContext(widgetId)
}

export {
  addEventHandler,
  fireDynamicWidgetEvent,
  fireEvent,
  get,
  getAll,
  Hide,
  put,
  putAll,
  removeAllEventHandler,
  Show
}
