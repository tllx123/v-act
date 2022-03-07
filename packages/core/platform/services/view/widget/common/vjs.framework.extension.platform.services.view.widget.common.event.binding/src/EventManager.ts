import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { EventManager as oldEventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'

let sb

export function initModule(sb) {}

let pool = {}

let setPool = function (key, millisecond) {
  if (!pool.key) {
    pool[key] = true
    let callback = function (key) {
      delete pool[key]
    }
    setTimeout(function () {
      callback(key)
    }, millisecond)
  }
}

let isExistNow = function (key) {
  if (pool[key]) {
    return true
  }
  return false
}

/**
 * 执行事件（防止事件连续触发）
 *
 * @widgetCode 控件ID（必填）
 * @eventName 事件名称（必填）
 * @millisecond 事件触发间隔毫秒数，默认1000ms（可选）
 *
 * return Function
 */
let fireEvent = function (widgetCode, eventName, millisecond, success, fail) {
  let scopeId = scopeManager.getCurrentScopeId()
  let key = scopeId + '_' + widgetCode
  return function () {
    scopeManager.openScope(scopeId)
    if (!millisecond) {
      millisecond = 1000
    }
    if (!isExistNow(key)) {
      setPool(key, millisecond)
      oldEventManager.fireEvent(widgetCode, eventName, success, fail)()
    }
    scopeManager.closeScope()
  }
}

/**
 * 执行方法（防止事件连续触发）
 *
 * @widgetCode 控件ID（必填）
 * @func 方法（必填）
 * @millisecond 事件触发间隔毫秒数，默认1000ms（可选）
 *
 * return Function
 */
let fireFunc = function (widgetCode, func, millisecond) {
  let scopeId = scopeManager.getCurrentScopeId()
  let key = scopeId + '_' + widgetCode
  return function () {
    scopeManager.openScope(scopeId)
    if (!millisecond) {
      millisecond = 1000
    }
    if (!isExistNow(key)) {
      setPool(key, millisecond)
      func()
      scopeManager.closeScope()
    }
  }
}

/**
 * 处理控件键盘按下事件（防止事件连续触发）
 * @widgetCode 控件ID（必填）
 * @eventName 事件名称（必填）
 * @millisecond 事件触发间隔毫秒数，默认1000ms（可选）
 */
let handleKeyDown = function (widgetCode, eventName, millisecond) {
  let handler = oldEventManager.fireEvent(widgetCode, eventName)
  let syncFunc = oldEventManager.fireEvent(widgetCode, 'DBUpdate')
  let scopeId = scopeManager.getCurrentScopeId()
  let key = scopeId + '_' + widgetCode
  return function () {
    scopeManager.openScope(scopeId)
    let args = []
    for (let i = 0, len = arguments.length; i < len; i++) {
      args.push(arguments[i])
    }
    let eventArgs = {
      isPrimitive: false
    }
    eventArgs.KeyCode = event.keyCode
    args.push(eventArgs)
    if (!millisecond) {
      millisecond = 1000
    }
    if (!isExistNow(key)) {
      if (event.keyCode == 13) {
        setPool(key, millisecond)
        syncFunc.call(this)
      }
      handler.apply(this, args)
    }
    scopeManager.closeScope()
  }
}

export { handleKeyDown, fireEvent, fireFunc }
