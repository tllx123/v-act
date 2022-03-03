import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

let allEventHandler = {}
let undefined
exports.initModule = function (sBox) {}

let handleError = function (e) {
  if (e.handle) {
    let error = e
    while (error.error && error.error.handle) {
      error = error.error
    }
    error.handle()
  } else {
    //errorDialog("系统内部错误，请联系系统管理员处理。", false);
    if (window.console && console.log && e.stack) {
      console.log(e.stack.toString().replaceAll(',', '\n'))
    }
    throw e
  }
}

/**
 * 增加事件处理器
 */
let addEventHandler = function (widgetId, eventName, handler) {
  let scopeId = ScopeManager.getCurrentScopeId()

  let key = scopeId + '_' + widgetId

  // 获取当前控件的事件处理器
  let widgetEventHandler = allEventHandler[key]
  if (!widgetEventHandler) {
    widgetEventHandler = allEventHandler[key] = {}
  }

  // 获取该事件的处理器
  let eventHandler = widgetEventHandler[eventName]
  if (!eventHandler) {
    eventHandler = widgetEventHandler[eventName] = []
  }

  eventHandler.push(handler)
}

let removeAllEventHandler = function (widgetId) {}

/**
 * 执行事件
 */
let fireDynamicWidgetEvent = function (eventName) {
  let scopeId = ScopeManager.getCurrentScopeId()

  return function (widgetId) {
    ScopeManager.openScope(scopeId)
    try {
      let key = scopeId + '_' + widgetId

      let widgetHandlers = allEventHandler[key]
      if (widgetHandlers) {
        let handlers = widgetHandlers[eventName]
        if (handlers) {
          for (let j = 0, l = handlers.length; j < l; j++) {
            let handler = handlers[j]
            handler.apply(handler, arguments)
          }
        }
      }
    } catch (e) {
      handleError(e)
    } finally {
      ScopeManager.closeScope()
    }
  }
}

/**
 * 执行事件
 */
let fireEvent = function (widgetId, eventName) {
  let scopeId = ScopeManager.getCurrentScopeId()
  let key = scopeId + '_' + widgetId

  return function () {
    ScopeManager.openScope(scopeId)
    try {
      let widgetHandlers = allEventHandler[key]
      if (widgetHandlers) {
        let handlers = widgetHandlers[eventName]
        if (handlers) {
          for (let j = 0, l = handlers.length; j < l; j++) {
            let handler = handlers[j]
            handler.apply(handler, arguments)
          }
        }
      }
    } catch (e) {
      handleError(e)
    } finally {
      ScopeManager.closeScope()
    }
  }
}

export {
  Show,
  Hide,
  fireEvent,
  addEventHandler,
  fireDynamicWidgetEvent,
  removeAllEventHandler
}
