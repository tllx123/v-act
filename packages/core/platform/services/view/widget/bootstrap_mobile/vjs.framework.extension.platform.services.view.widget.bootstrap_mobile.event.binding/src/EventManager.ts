import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { EventManager as oldEventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'

let sb

export function initModule(sandbox) {
  sb = sandbox
}

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
 * widgetCode 控件ID（必填）
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
      oldEventManager
        .fireEvent(widgetCode, eventName, success, fail)
        .apply(this, arguments)
    }
    scopeManager.closeScope()
  }
}

/**
 *
 * 生成事件
 * @param {Object} params
 * {
 * 		'widgetCode':'控件编码',
 * 		'targetKey':'事件触发源标识',
 * 		'eventName':'事件编码',
 * 		'interval':'事件触发间隔，默认为0',
 * 		'success':'事件触发成功回调',
 * 		'fail':'事件触发失败回调'
 * }
 *
 * */
let genEventHandle = function (params) {
  let widgetCode = params.widgetCode
  let targetKey = params.targetKey
  let eventName = params.eventName
  let interval = params.interval
  let success = params.success
  let fail = params.fail

  /* 当前域id */
  let scopeId = scopeManager.getCurrentScopeId()
  /* 如果传入事件源标识，则以此为标识，否则以域id+控件编码为标识 */
  let key = targetKey ? targetKey : scopeId + '_' + widgetCode
  return function () {
    scopeManager.openScope(scopeId)
    if (!interval) {
      interval = 0
    }
    if (!isExistNow(key)) {
      setPool(key, interval)
      oldEventManager
        .fireEvent(widgetCode, eventName, success, fail)
        .apply(this, arguments)
    }
    scopeManager.closeScope()
  }
}

export { genEventHandle, fireEvent }
