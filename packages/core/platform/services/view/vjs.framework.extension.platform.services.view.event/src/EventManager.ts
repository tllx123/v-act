import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { ExceptionHandler as exceptionHandler } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { callbackFactory as callbackFactory } from '@v-act/vjs.framework.extension.platform.interface.event'
import * as RightClickEventHandler from './RightClickEventHandler'

let undefined

let SCOPE_STORAGE_TOKEN = 'EVENTMANAGER_STORAGE'

let platformEventStorage

exports.initModule = function (sb) {}

/**
 * 增加事件处理器
 */
let addEventHandler = function (widgetId, eventName, handler) {
  let scopeId = scopeManager.getCurrentScopeId()
  let key = scopeId + '_' + widgetId
  // 获取当前控件的事件处理器
  let poolInScope = getPoolInScope()
  if (undefined != poolInScope && null != poolInScope) {
    let widgetEventHandler = poolInScope.get(key)
    if (!widgetEventHandler) {
      widgetEventHandler = {}
      poolInScope.put(key, widgetEventHandler)
    }
    // 获取该事件的处理器
    let eventHandler = widgetEventHandler[eventName]
    if (!eventHandler) {
      eventHandler = widgetEventHandler[eventName] = []
    }
    eventHandler.push(handler)
  }
}

let _remove = function (a, index) {
  for (let i = index, l = a.length; i < l; i++) {
    a[i] = a[i + 1]
  }
  a.length = a.length - 1
}

let removeEventHandler = function (widgetId, eventName, handler) {
  let scopeId = scopeManager.getCurrentScopeId()
  let key = scopeId + '_' + widgetId
  let poolInScope = getPoolInScope()
  if (poolInScope) {
    let widgetEventHandler = poolInScope.get(key)
    if (widgetEventHandler) {
      let eventHandler = widgetEventHandler[eventName]
      if (eventHandler) {
        for (let i = 0, l = eventHandler.length; i < l; i++) {
          let h = eventHandler[i]
          if (handler == h) {
            _remove(eventHandler, i)
          }
        }
      }
    }
  }
}

let removeAllEventHandler = function (widgetId) {}

/**
 * 执行事件
 */
let fireDynamicWidgetEvent = function (eventName, success, fail) {
  let scopeId = scopeManager.getCurrentScopeId()
  return function (widgetId) {
    scopeManager.openScope(scopeId)
    try {
      let called = false
      let key = scopeId + '_' + widgetId
      let poolInScope = getPoolInScope()
      if (undefined != poolInScope && null != poolInScope) {
        let widgetHandlers = poolInScope.get(key)
        if (widgetHandlers) {
          let handlers = widgetHandlers[eventName]
          if (handlers) {
            let args = Array.prototype.slice.call(arguments)
            if (success)
              args.push(_createCallback(callbackFactory.Types.Success, success))
            if (fail)
              args.push(_createCallback(callbackFactory.Types.Fail, fail))

            for (let j = 0, l = handlers.length; j < l; j++) {
              called = true
              let handler = handlers[j]
              handler.apply(handler, args)
            }
          }
        }
      }
      if (!called) {
        _fire(success, this, arguments)
        let args = Array.prototype.slice.call(arguments)
        for (let i = 0, l = args.length; i < l; i++) {
          let arg = args[i]
          if (
            callbackFactory.isCallback(arg) &&
            arg.getType() == callbackFactory.Types.Success
          ) {
            let handler = arg.getHandler()
            _fire(handler, this, arguments)
          }
        }
      }
    } catch (e) {
      exceptionHandler.handle(e)
    } finally {
      scopeManager.closeScope()
    }
  }
}

let _createCallback = function (type, handler) {
  return callbackFactory.create({ type: type, handler: handler })
}

let _fire = function (fn, _this, args) {
  if (fn) {
    fn.apply(_this, args)
  }
}

/**
 * 执行事件
 */
let fireEvent = function (widgetId, eventName, success, fail) {
  let scopeId = scopeManager.getCurrentScopeId()
  let key = scopeId + '_' + widgetId
  return function () {
    scopeManager.openScope(scopeId)
    try {
      let called = false
      let poolInScope = getPoolInScope()
      if (undefined != poolInScope && null != poolInScope) {
        let widgetHandlers = poolInScope.get(key)
        if (widgetHandlers) {
          let handlers = widgetHandlers[eventName]
          if (handlers) {
            let args = Array.prototype.slice.call(arguments)
            if (success)
              args.push(_createCallback(callbackFactory.Types.Success, success))
            if (fail)
              args.push(_createCallback(callbackFactory.Types.Fail, fail))

            for (let j = 0, l = handlers.length; j < l; j++) {
              called = true
              let handler = handlers[j]
              handler.apply(this, args)
            }
          }
        }
      }
      if (!called) {
        _fire(success, this, arguments)
        let args = Array.prototype.slice.call(arguments)
        for (let i = 0, l = args.length; i < l; i++) {
          let arg = args[i]
          if (
            callbackFactory.isCallback(arg) &&
            arg.getType() == callbackFactory.Types.Success
          ) {
            let handler = arg.getHandler()
            _fire(handler, this, arguments)
          }
        }
      }
    } catch (e) {
      exceptionHandler.handle(e)
    } finally {
      scopeManager.closeScope()
    }
  }
}

/**
 * 判断事件是否存在
 * @param String widgetId 控件编码
 * @param String eventName 事件名称
 */
let existEvent = function (widgetId, eventName) {
  /*var scopeId = scopeManager.getCurrentScopeId();
    var key = scopeId + "_" + widgetId;
    scopeManager.openScope(scopeId);
    try {
        var poolInScope = getPoolInScope();
        if (undefined != poolInScope && null != poolInScope) {
            var widgetHandlers = poolInScope.get(key);
            if (widgetHandlers) {
                var handlers = widgetHandlers[eventName];
                if (handlers) {
                    return true;
                }
            }
        }
    } catch (e) {
        exceptionHandler.handle(e);
    } finally {
        scopeManager.closeScope();
    }
    return false;*/
  return true
}

let getPoolInScope = function () {
  let scope = scopeManager.getScope()
  let storage = null
  if (scope != null) {
    if (scope.has(SCOPE_STORAGE_TOKEN)) {
      storage = scope.get(SCOPE_STORAGE_TOKEN)
    } else {
      storage = storageManager.newInstance(storageManager.TYPES.MAP)
      scope.set(SCOPE_STORAGE_TOKEN, storage)
    }
  }
  return storage
}

let getPlatformEventStorage = function () {
  if (!platformEventStorage) {
    platformEventStorage = storageManager.newInstance(storageManager.TYPES.MAP)
  }
  return platformEventStorage
}

//添加平台事件回调（事件名称，回调函数）
let addPlatformEventHandler = function (eventName, handler) {
  if (
    PlatformEvents.WindowRightClick == eventName &&
    !(handler instanceof RightClickEventHandler)
  ) {
    throw exceptionFactory.create({
      message:
        '注册右键事件回调失败！ 原因：回调不是RightClickEventHandler的示例'
    })
  }
  let storage = getPlatformEventStorage()
  //传进来的是多个回调函数，
  let handlers
  if (!storage.containsKey(eventName)) {
    handlers = []
    storage.put(eventName, handlers)
  } else {
    handlers = storage.get(eventName)
  }
  handlers.push(handler)
}
//触发平台事件回调(事件名称，事件参数)
let firePlatformEvent = function (eventName, parms) {
  //遍历eventName这个事件的回调函数，执行
  let storage = getPlatformEventStorage()
  let handlers = storage.get(eventName)
  if (handlers) {
    let args = Array.prototype.slice.call(parms)
    if (eventName == PlatformEvents.WindowRightClick) {
      let contextMenuFunc = document.oncontextmenu
      if (!contextMenuFunc || !contextMenuFunc._v3PlatformFunc) {
        let func = (function (func) {
          let f = function () {
            if (func) {
              func.apply(this, arguments)
            }
            if (window._v3Platform_global_contentMenu_handlers) {
              let pool = window._v3Platform_global_contentMenu_handlers
              let htmlArray = [],
                handlers = []
              for (let i = 0, l = pool.length; i < l; i++) {
                let cfg = pool[i]
                let html = cfg.html
                let el = $(html).attr('eventindex', i)
                htmlArray.push(el[0].outerHTML)
                handlers.push(cfg.handler)
              }
              $('.RightMenuTitle>ul').html(htmlArray.join(''))
              for (let i = 0, l = handlers.length; i < l; i++) {
                let handler = handlers[i]
                $('.RightMenuTitle>ul')
                  .find("[eventindex='" + i + "']")
                  .unbind('click')
                  .click(handler)
              }
              $('#mask').show()
              $('#rightMenu_div').css({ top: event.pageY, left: event.pageX })
              window._v3Platform_global_contentMenu_handlers = null
              return false
            } else {
              return true
            }
          }
          f._v3PlatformFunc = true
          return f
        })(contextMenuFunc)
        document.oncontextmenu = func
      }
      let pool
      if (!window._v3Platform_global_contentMenu_handlers) {
        pool = []
        window._v3Platform_global_contentMenu_handlers = pool
      } else {
        pool = window._v3Platform_global_contentMenu_handlers
      }
      for (let j = 0, l = handlers.length; j < l; j++) {
        let handler = handlers[j]
        if (handler.jugde.apply(handler, args)) {
          let html = handler.getHtml()
          let handlerId = handler.getId()
          let isAdd = true
          //去除重复的handlerId，根据id增加事件到pool中
          if (pool.length > 0) {
            for (let k = 0; k < pool.length; k++) {
              if (handlerId == pool[k].id) {
                isAdd = false
                break
              }
            }
          }
          if (isAdd) {
            pool.push({
              id: handlerId,
              html: html,
              handler: (function (hd, params) {
                return function () {
                  hd.getHandler().apply(hd, params)
                }
              })(handler, args)
            })
          }
        }
      }
      if (pool.length == 0) {
        window._v3Platform_global_contentMenu_handlers = null
      }
    } else {
      for (let j = 0, l = handlers.length; j < l; j++) {
        let handler = handlers[j]
        handler.apply(this, args)
      }
    }
  }
}

const hasPlatformEventHandler = function (eventName) {
  let storage = getPlatformEventStorage()
  let handlers = storage.get(eventName)
  return handlers && handlers.length > 0
}

let PlatformEvents = {
  WindowRightClick: '_$WindowRightClick'
}

export {
  hasPlatformEventHandler,
  fireEvent,
  addEventHandler,
  existEvent,
  removeEventHandler,
  fireDynamicWidgetEvent,
  removeAllEventHandler,
  addPlatformEventHandler,
  firePlatformEvent,
  PlatformEvents
}
