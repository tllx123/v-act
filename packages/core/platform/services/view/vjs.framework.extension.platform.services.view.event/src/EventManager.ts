// import { default } from 'yargs'

import { callbackFactory } from '@v-act/vjs.framework.extension.platform.interface.event'
import {
  ExceptionFactory as exceptionFactory,
  ExceptionHandler as exceptionHandler
} from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

import * as RightClickEventHandler from './RightClickEventHandler'

let SCOPE_STORAGE_TOKEN = 'EVENTMANAGER_STORAGE'

let platformEventStorage = storageManager.newInstance(storageManager.TYPES.MAP)

/**
 * 增加事件处理器
 */
let addEventHandler = function (
  widgetId: string,
  eventName: string,
  handler: unknown
) {
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

let _remove = function (a: any[], index: number) {
  for (let i = index, l = a.length; i < l; i++) {
    a[i] = a[i + 1]
  }
  a.length = a.length - 1
}

let removeEventHandler = function (
  widgetId: string,
  eventName: string,
  handler: unknown
) {
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

let removeAllEventHandler = function (widgetId: string) {}

/**
 * 触发平台控件事件前事件
 * */
var firePlatformWidgetEventBefore = function (
  eventName: string,
  widgetId: string
) {
  //控件的子控件点击需要找代理ID
  var code = widgetId
  var proxyWidgetId = widgetAction.getProxyWidgetId(widgetId)
  if (proxyWidgetId) {
    code = proxyWidgetId
  }
  var widgetObj = widgetContext.get(code, 'widgetObj')
  //统一控件的平台事件前
  if (widgetObj && typeof widgetObj.firePlatformEventBefore == 'function') {
    widgetObj.firePlatformEventBefore(eventName, code, widgetId)
  }
}
/*
 * 执行事件
 */
let fireDynamicWidgetEvent = function (
  eventName: string,
  success: unknown,
  fail: unknown
) {
  let scopeId = scopeManager.getCurrentScopeId()
  return function (widgetId: string) {
    scopeManager.openScope(scopeId)
    //统一控件的平台事件后
    var sucFunc = getPlatformWidgetEventAfter(widgetId, eventName, success)
    var failFunc = getPlatformWidgetEventAfter(widgetId, eventName, fail)
    try {
      firePlatformWidgetEventBefore(eventName, widgetId)
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
        //@ts-ignore
        _fire(success, this, arguments)
        let args = Array.prototype.slice.call(arguments)
        for (let i = 0, l = args.length; i < l; i++) {
          let arg = args[i]
          if (
            callbackFactory.isCallback(arg) &&
            arg.getType() == callbackFactory.Types.Success
          ) {
            let handler = arg.getHandler()
            //@ts-ignore
            _fire(handler, this, arguments)
          }
        }
      }
    } catch (e) {
      if (exceptionFactory.isException(e)) {
        if (typeof e.setModalClosedHandler == 'function') {
          e.setModalClosedHandler(failFunc)
        } else {
          failFunc()
        }
      }
      exceptionHandler.handle(e, null)
    } finally {
      scopeManager.closeScope()
    }
  }
}

let _createCallback = function (type: any, handler: any) {
  return callbackFactory.create({ type: type, handler: handler })
}

let _fire = function (fn: any, _this: any, args: any) {
  if (fn) {
    fn.apply(_this, args)
  }
}

/**
 * 获取控件的平台事件后的事件
 * */
var getPlatformWidgetEventAfter = function (
  widgetCode: string,
  eventName: string,
  func: any
) {
  const scopeId = scopeManager.getCurrentScopeId()
  var callback = scopeManager.createScopeHandler({
    //@ts-ignore
    scopeId,
    handler: (function (code: string, name: string, cb: any) {
      return function (param: any, func: any) {
        //如果参数一是异常对象，则参数二是默认的异常处理方法
        var afterFunc = scopeManager.createScopeHandler({
          //@ts-ignore
          scopeId,
          handler: function () {
            var pwCode = code
            var proxyWidgetId = widgetAction.getProxyWidgetId(code)
            if (proxyWidgetId) {
              pwCode = proxyWidgetId
            }
            var widgetObj = widgetContext.get(pwCode, 'widgetObj')
            //统一触发平台事件后
            if (
              widgetObj &&
              typeof widgetObj.firePlatformEventAfter == 'function'
            ) {
              widgetObj.firePlatformEventAfter(eventName, pwCode, code)
            }
          }
        })
        if (typeof cb == 'function') {
          //先执行平台事件后，再触发外部事件
          afterFunc()
          //@ts-ignore
          cb.apply(this, arguments)
        } else {
          //如果是异常，则在异常弹框后才执行平台事件后。如果非异常，则直接执行平台事件后
          if (exceptionFactory.isException(param)) {
            if (typeof param.setModalClosedHandler == 'function') {
              param.setModalClosedHandler(afterFunc)
            }
            if (param.isTiped) {
              //如果已经提示过的异常，直接执行回调
              if (!param._isLog) {
                param._isLog = true //标记已经打印过日志的异常，后台返回的异常，调用父级路由存在异常多次被处理的情况
                var detailMsg = param.getDetailMessage()
                var msgs = []
                for (var i = 0, len = detailMsg.length; i < len; i++) {
                  var msg = detailMsg[i]
                  msgs.push(msg.name + ': ' + msg.value)
                }
                logUtil.error('\n' + msgs.join('\n'))
              }
              afterFunc()
              return
            } else {
              param._isLog = true
            }
          }
          if (typeof func == 'function') {
            //非正常异常对象支持第二个参数为错误弹框关闭回调
            //@ts-ignore
            func.apply(this, [param, afterFunc])
          } else {
            afterFunc()
          }
        }
      }
    })(widgetCode, eventName, func)
  })
  return callback
}
/**
 * 执行事件
 * @param {String} widgetCode 控件编号
 * @param {String} eventName  事件名称
 * @param {Function} success  事件触发成功回调
 * @param {Function} fail	  事件触发失败回调
 */
let fireEvent = function (
  widgetId: string,
  eventName: string,
  success?: any,
  fail?: any
) {
  let scopeId = scopeManager.getCurrentScopeId()
  var winScope = scopeManager.getWindowScope()
  let key = scopeId + '_' + widgetId
  //统一控件的平台事件后
  var sucFunc = getPlatformWidgetEventAfter(widgetId, eventName, success)
  var failFunc = getPlatformWidgetEventAfter(widgetId, eventName, fail)
  return function () {
    //        	//窗体设计器里不需要执行事件
    if (
      //@ts-ignore
      window._v3Platform &&
      typeof window._v3Platform.SkipFormLoad == 'function' &&
      window._v3Platform.SkipFormLoad() &&
      eventName != 'OnResize'
    ) {
      if (
        !winScope ||
        !inWhiteRoster(winScope.getComponentCode(), winScope.getWindowCode())
      )
        return
    }
    scopeManager.openScope(scopeId)
    //统一控件的平台事件前
    firePlatformWidgetEventBefore(eventName, widgetId)
    try {
      let called = false
      let poolInScope = getPoolInScope()
      if (undefined != poolInScope && null != poolInScope) {
        let widgetHandlers = poolInScope.get(key)
        if (widgetHandlers) {
          let handlers = widgetHandlers[eventName]
          if (handlers) {
            var args = Array.prototype.slice.call(arguments)
            if (sucFunc)
              args.push(_createCallback(callbackFactory.Types.Success, sucFunc))
            if (failFunc)
              args.push(_createCallback(callbackFactory.Types.Fail, failFunc))
            if (event || window.event) {
              var event: any = event || window.event
              args.push({
                isPrimitive: false,
                Shift: event.shiftKey,
                Alt: event.altKey,
                Ctrl: event.ctrlKey,
                KeyCode: event.keyCode
              })
            }
            for (var j = 0, l = handlers.length; j < l; j++) {
              called = true
              var handler = handlers[j]
              //@ts-ignore
              handler.apply(this, args)
            }
          }
        }
      }
      if (!called) {
        //@ts-ignore
        _fire(success, this, arguments)
        let args = Array.prototype.slice.call(arguments)
        for (let i = 0, l = args.length; i < l; i++) {
          let arg = args[i]
          if (
            callbackFactory.isCallback(arg) &&
            arg.getType() == callbackFactory.Types.Success
          ) {
            let handler = arg.getHandler()
            //@ts-ignore
            _fire(handler, this, arguments)
          }
        }
      }
    } catch (e) {
      //@ts-ignore
      failFunc.apply(this, [e, exceptionHandler.handle])
      //                exceptionHandler.handle(e);
    } finally {
      scopeManager.closeScope()
    }
  }
}

/**
 * @private
 * 判断事件是否存在
 * @param String widgetId 控件编码
 * @param String eventName 事件名称
 */
let existEvent = function (widgetId: string, eventName: string) {
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
let addPlatformEventHandler = function (eventName: string, handler: any) {
  if (
    //@ts-ignore
    PlatformEvents.WindowRightClick == eventName &&
    !(handler instanceof RightClickEventHandler)
  ) {
    throw exceptionFactory.create({
      message:
        '注册右键事件回调失败！ 原因：回调不是RightClickEventHandler的示例'
    })
  }
  let storage: any = getPlatformEventStorage()
  //传进来的是多个回调函数，
  let handlers: any
  if (!storage.containsKey(eventName)) {
    handlers = []
    storage.put(eventName, handlers)
  } else {
    handlers = storage.get(eventName)
  }
  handlers.push(handler)
}
//触发平台事件回调(事件名称，事件参数)
let firePlatformEvent = function (eventName: string, parms: any) {
  //遍历eventName这个事件的回调函数，执行
  let storage = getPlatformEventStorage()
  let handlers = storage.get(eventName)
  if (handlers) {
    let args = Array.prototype.slice.call(parms)
    if (eventName == PlatformEvents.WindowRightClick) {
      let contextMenuFunc = document.oncontextmenu
      //@ts-ignore
      if (!contextMenuFunc || !contextMenuFunc._v3PlatformFunc) {
        let func = (function (func) {
          let f = function () {
            if (func) {
              //@ts-ignore
              func.apply(this, arguments)
            }
            //@ts-ignore
            if (window._v3Platform_global_contentMenu_handlers) {
              //@ts-ignore
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
              //@ts-ignore
              $('#rightMenu_div').css({ top: event.pageY, left: event.pageX })
              //@ts-ignore
              window._v3Platform_global_contentMenu_handlers = null
              return false
            } else {
              return true
            }
          }
          //@ts-ignore
          f._v3PlatformFunc = true
          return f
        })(contextMenuFunc)
        document.oncontextmenu = func
      }
      let pool: any
      //@ts-ignore
      if (!window._v3Platform_global_contentMenu_handlers) {
        pool = []
        //@ts-ignore
        window._v3Platform_global_contentMenu_handlers = pool
      } else {
        //@ts-ignore
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
        //@ts-ignore
        window._v3Platform_global_contentMenu_handlers = null
      }
    } else {
      for (let j = 0, l = handlers.length; j < l; j++) {
        let handler = handlers[j]
        //@ts-ignore
        handler.apply(this, args)
      }
    }
  }
}

const hasPlatformEventHandler = function (eventName: string) {
  let storage = getPlatformEventStorage()
  let handlers = storage.get(eventName)
  return handlers && handlers.length > 0
}

let PlatformEvents = {
  WindowRightClick: '_$WindowRightClick'
}
/**
 * 添加白名单
 * @param	{Object}	params
 * {
 * 	componentCode:'构件编码',
 * 	windowCode:'窗体编码'
 * }
 * */
var addWhiteRoster = function (params: any) {
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  if (componentCode && windowCode) {
    //@ts-ignore
    eventWhiteList.push(componentCode + '$_$' + windowCode)
  }
}
/**
 * 删除白名单
 * @param	{Object}	params
 * {
 * 	componentCode:'构件编码',
 * 	windowCode:'窗体编码'
 * }
 * */
var removeWhiteRoster = function (params: any) {
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  if (componentCode && windowCode) {
    //@ts-ignore
    var index = eventWhiteList[componentCode + '$_$' + windowCode]
    if (index != -1) {
      //@ts-ignore
      eventWhiteList.splice(index, 1)
    }
  }
}
/**
 * 判断窗体是否在白名单
 * @param	{String}	componentCode
 * @param	{String}	windowCode
 * */
var inWhiteRoster = function (componentCode: string, windowCode: string) {
  if (componentCode && windowCode) {
    //@ts-ignore
    var index = eventWhiteList.indexOf(componentCode + '$_$' + windowCode)
    return index != -1
  }
  return false
}
export default {
  addEventHandler,
  addPlatformEventHandler,
  addWhiteRoster,
  existEvent,
  fireDynamicWidgetEvent,
  fireEvent,
  firePlatformEvent,
  hasPlatformEventHandler,
  PlatformEvents,
  removeAllEventHandler,
  removeEventHandler,
  removeWhiteRoster
}
