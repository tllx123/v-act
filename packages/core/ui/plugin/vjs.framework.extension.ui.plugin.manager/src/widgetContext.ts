import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let _context: { [code: string]: any } = {}

let _getScopeContext = function () {
  let scopeId: any = ScopeManager.getCurrentScopeId()

  let scopeContext = _context[scopeId]
  if (!scopeContext) {
    scopeContext = _context[scopeId] = {}
  }
  return scopeContext
}

let _getWidgetContext = function (widgetId: string) {
  let scopeContext = _getScopeContext()
  let widgetObj = scopeContext[widgetId]
  if (!widgetObj) {
    widgetObj = scopeContext[widgetId] = {}
  }
  return widgetObj
}

let putAll = function (widgetId: string, properties: []) {
  let widgetObj = _getWidgetContext(widgetId)
  for (let key in properties) {
    widgetObj[key] = properties[key]
  }
}

let put = function (widgetId: string, key: string, value: string) {
  let widgetObj = _getWidgetContext(widgetId)
  let old = widgetObj[key]
  widgetObj[key] = value
  return old
}

let get = function (widgetId: string, key: string) {
  let widgetObj = _getWidgetContext(widgetId)
  return widgetObj[key]
}

let getAll = function (widgetId: string) {
  return _getWidgetContext(widgetId)
}

export {
  // addEventHandler,
  //fireDynamicWidgetEvent,
  //fireEvent,
  get,
  getAll,
  //Hide,
  put,
  putAll
  // removeAllEventHandler,
  //Show
}
