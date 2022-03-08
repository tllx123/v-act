import { Environment as environmentUtils } from '@v-act/vjs.framework.extension.platform.interface.environment'
import {
  ExceptionFactory as exceptionFactory,
  ExceptionHandler as exceptionHandler
} from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { jsonUtil as jsonUtils } from '@v-act/vjs.framework.extension.util.jsonutil'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

let storage,
  token = 'V3_Platform_Services_Event_AOP',
  crossDomainStorage,
  //是否启动监听
  isStartListener = false,
  V3_TOONE_PLATFORM_CROSSDOMAIN_IDEN =
    'TOONE_COM_CN_V3_PLATFORM_POST_MESSAGE_IDEN_THREE'
crossDomainEventKey = 'Coross_Domain_Event_Key'

export function initModule(sb) {}

let _getStorage = function () {
  if (!storage) {
    storage = storageManager.get(storageManager.TYPES.MAP, token)
  }
  return storage
}

let _getCrossDomainStorage = function () {
  if (!crossDomainStorage) {
    crossDomainStorage = storageManager.get(
      storageManager.TYPES.MAP,
      crossDomainEventKey
    )
  }
  return crossDomainStorage
}

const register = function (params) {
  let sg = _getStorage(),
    event = params.event,
    handler = params.handler
  let handlers
  if (!sg.containsKey(event)) {
    handlers = []
    sg.put(event, handlers)
  } else {
    handlers = storage.get(event)
  }
  handlers.push(handler)
}

const fire = function (params) {
  let event = params.event,
    args = params.args,
    sg = _getStorage()
  if (sg.containsKey(event)) {
    let handlers = sg.get(event)
    for (let i = 0, l = handlers.length; i < l; i++) {
      let handler = handlers[i]
      handler.apply(this, args)
    }
  }
}

const startCrossDomainListener = function () {
  let handle = scopeManager.createScopeHandler({
    handler: function (e) {
      if (e && e.data) {
        try {
          let _data = e.data
          //console.log("["+window._$index+"]_data:"+JSON.stringify(_data) + ",location: "+window.location.href);
          //第一版和第二版（旧版本）提交的数据
          if (
            (typeof _data == 'string' &&
              _data == 'TOONE_COM_CN_V3_PLATFORM_POST_MESSAGE_IDEN') ||
            (typeof _data == 'object' &&
              _data['TOONE_IDEN'] ==
                'TOONE_COM_CN_V3_PLATFORM_POST_MESSAGE_IDEN')
          ) {
            let cds = _getCrossDomainStorage()
            let events = cds.get(exports.CrossDomainEvents.ModalWindowClose)
            if (events && events.length > 0) {
              let event = events[0]
              if (typeof event == 'object') {
                event = event.handler
              }
              if (typeof event == 'function') {
                event.apply(this, arguments)
              }
            }
          } else {
            let _data = e.data
            if (environmentUtils.isIE9()) {
              _data = jsonUtils.json2obj(e.data)
            }
            if (_data['TOONE_IDEN'] == V3_TOONE_PLATFORM_CROSSDOMAIN_IDEN) {
              //平台标识
              let type = _data.TYPE
                ? _data.TYPE
                : exports.CrossDomainMessageType.EVENT
              let cds = _getCrossDomainStorage()
              switch (type) {
                case exports.CrossDomainMessageType.EVENT:
                  var eventName = _data['EVENTNAME']
                  var fInfo = _data['EVENTINFO'] //触发的值
                  var params = _data['PARAMS']
                  if (!params) {
                    params = {}
                  }
                  params.MsgEvent = e
                  if (cds.containsKey(eventName)) {
                    var events = cds.get(eventName)
                    if (events && events.length > 0) {
                      var removeIndex = []
                      for (var i = 0, len = events.length; i < len; i++) {
                        var event = events[i]
                        if (typeof event == 'object') {
                          var rInfo = event.eventInfo //注册的条件
                          var fu = event.handler
                          var isExcute = false
                          if (
                            rInfo &&
                            null != rInfo.condition &&
                            '' != rInfo.condition
                          ) {
                            var nowPM = fInfo.nowPM
                            var parentPM = fInfo.parentPM
                            type = fInfo.type
                            var origin = fInfo.origin
                            try {
                              if (eval(rInfo.condition)) {
                                isExcute = true
                                fu(params)
                              }
                            } catch (e) {}
                          } else {
                            isExcute = true
                            fu(params)
                          }
                          if (isExcute && rInfo && true == rInfo.isDelete) {
                            removeIndex.push(i)
                          }
                        } else if (typeof event == 'function') {
                          event(params)
                        }
                      }
                      for (var i = removeIndex.length - 1; i >= 0; i--) {
                        events.splice(removeIndex[i], 1)
                      }
                    }
                  }
                  break
                case exports.CrossDomainMessageType.MESSAGE:
                  var msgParams = _data.PARAMS
                  if (msgParams && msgParams.msg == 'UnLogin') {
                    var newParams = msgParams.params
                    newParams.TYPE = exports.CrossDomainMessageType.EVENT
                    newParams.TOONE_IDEN = V3_TOONE_PLATFORM_CROSSDOMAIN_IDEN //平台跨域事件标识
                    var childs = window.frames
                    if (childs && childs.length > 0) {
                      for (var i = 0, len = childs.length; i < len; i++) {
                        window.frames[i].postMessage(newParams, '*')
                      }
                    }
                    var ex = exceptionFactory.create({
                      type: exceptionFactory.TYPES.Unlogin,
                      error: 'Exception',
                      message: '未登录'
                    })
                    exceptionHandler.handle(ex)
                  }
                  break
              }
            }
          }
        } catch (e) {
          //						if(window && window.console){
          //							window.console.info("暂不处理")
          //						}
        }
      }
    }
  })
  if (!isStartListener) {
    isStartListener = true
    window.addEventListener('message', handle, false)
  }
}

exports.CrossDomainEvents = {
  //模态窗体关闭
  ModalWindowClose: 'ModalWindowClose',
  //关闭组件容器里面的窗体
  ContainerWindowClose: 'ContainerWindowClose',
  //设置模态窗体标题
  SetModalWindowTitle: 'SetModalWindowTitle',
  //未登录异常处理
  UnLoginException: 'UnLoginException',
  //创建窗体
  OpenWindow: 'OpenWindow',
  //激活窗体
  ActiveWindow: 'ActiveWindow',
  //关闭窗体
  CloseWindow: 'CloseWindow',
  //自定义事件, 最好搭配事件条件，不然可能误执行
  CustomEvent: 'CustomEvent'
}

/**
 * 消息类型
 * */
exports.CrossDomainMessageType = {
  EVENT: 'Event',
  MESSAGE: 'Message'
}

const onCrossDomainEvent = function (params) {
  let eventName = params.eventName
  let handler = params.handler
  if (eventName && typeof handler == 'function') {
    //			console.log("["+window._$index+"]onCrossDomainEvent:"+eventName);
    let cds = _getCrossDomainStorage()
    let handlers
    if (!cds.containsKey(eventName)) {
      handlers = []
      cds.put(eventName, handlers)
    } else {
      handlers = cds.get(eventName)
    }
    let info = {
      handler: handler,
      eventInfo: params.eventInfo
    }
    handlers.push(info)
  }
}

const unCrossDomainEvent = function (params) {
  let eventName = params.eventName
  let handler = params.handler
  if (eventName && typeof handler == 'function') {
    //			console.log("["+window._$index+"]unCrossDomainEvent:"+eventName);
    let cds = _getCrossDomainStorage()
    let handlers
    if (cds.containsKey(eventName)) {
      handlers = cds.get(eventName)
      for (let i = 0, len = handlers.length; i < len; i++) {
        let event = handlers[i]
        if (typeof event == 'object') {
          event = event.handler
        }
        if (typeof event == 'function' && handler === event) {
          handlers.splice(i, 1)
        }
      }
    }
  }
}

const fireCrossDomainEvent = function (params) {
  if (!params) {
    return false
  }
  //跨域消息类型
  let type = params.type ? params.type : exports.CrossDomainMessageType.EVENT
  //		console.log("["+window._$index+"]fireCrossDomainEvent: "+JSON.stringify(params));
  let newParams = {
    PARAMS: params.params,
    EVENTINFO: params.eventInfo,
    TYPE: type,
    TOONE_IDEN: V3_TOONE_PLATFORM_CROSSDOMAIN_IDEN //平台跨域事件标识
  }
  if (type == exports.CrossDomainMessageType.EVENT) {
    let eventName = params.eventName
    if (!eventName) {
      logUtil.warn('跨域处理的事件名称不能为空.')
      return
    } else {
      newParams.EVENTNAME = eventName
    }
  }
  try {
    if (environmentUtils.isIE9()) {
      newParams = jsonUtils.obj2json(newParams)
    }
    if (params.win) {
      params.win.postMessage(newParams, '*')
    } else {
      window.parent.postMessage(newParams, '*')
    }
  } catch (e) {}
}

exports.Events = {
  //规则执行前
  BeforeRuleExe: 'BeforeRuleExe',
  //规则执行后
  AfterRuleExe: 'AfterRuleExe',
  //方法执行前
  BeforeRouteExe: 'BeforeRouteExe',
  //方法执行后
  AfterRouteExe: 'AfterRouteExe',
  //窗体加载前
  BeforeWindowLoad: 'BeforeWindowLoad',
  //窗体加载后
  AfterWindowLoad: 'AfterWindowLoad',
  //窗体渲染前
  BeforeWindowRender: 'BeforeWindowRender',
  //窗体渲染后
  AfterWindowRender: 'AfterWindowRender',
  //窗体初始化前
  BeforeWindowInit: 'BeforeWindowInit',
  //窗体初始化后
  AfterWindowInit: 'AfterWindowInit',
  //构件加载前
  BeforeComponentLoad: 'BeforeComponentLoad',
  //构件加载后
  AfterComponentLoad: 'AfterComponentLoad',
  //构件初始化前
  BeforeComponentInit: 'BeforeComponentInit',
  //构件初始化后
  AfterComponentInit: 'AfterComponentInit',
  //远程请求前
  BeforeRPC: 'BeforeRPC',
  //远程请求后
  AfterRPC: 'AfterRPC'
}

export {
  create,
  fire,
  fireCrossDomainEvent,
  isCallback,
  onCrossDomainEvent,
  register,
  startCrossDomainListener,
  unCrossDomainEvent
}
