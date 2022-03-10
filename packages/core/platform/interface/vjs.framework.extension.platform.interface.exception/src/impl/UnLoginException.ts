import { Environment as envir } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.interface.event'
import { platform as i18n } from '@v-act/vjs.framework.extension.platform.interface.i18n'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { StorageManager as storageManager } from '@v-act/vjs.framework.extension.platform.interface.storage'
import { UUID as uuidUtil } from '@v-act/vjs.framework.extension.util'

import * as ExpectedException from './impl/ExpectedException'
import * as callCommandService from './util/CallCommand'

let sb
let storage

let UnLoginException = function (message, e, errInfo, json) {
  ExpectedException.apply(this, arguments)
}

export function initModule(sandbox) {}

let _getStorage = function () {
  if (!storage) {
    storage = storageManager.get(
      storageManager.TYPES.MAP,
      'UNLOGIN_EXCEPTION_CROSSDOMAIN_IDEN'
    )
  }
  return storage
}

UnLoginException.prototype = {
  initModule: function (sandbox) {
    sb = sandbox
    var Extend = require('vjs/framework/extension/platform/interface/exception/util/Extend')
    Extend.extend(UnLoginException, ExpectedException, sb)
  },

  getClassName: function () {
    return 'UnloginException'
  },

  handling: function () {
    if (this.isInApp()) {
      let result = confirm(
        i18n.get('当前页面已过期，需要重新登录', '未登录异常弹框的提示信息')
      )
      if (result == true) {
        let url = envir.getLoginUrl()
        //					window.top.location.href = url;
        //统一门户那边登录超时时需要在容器内部进行跳转 2018-07-18
        window.location.href = url
      } else {
        ExpectedException.prototype.handling.apply(this)
      }
    } else {
      let eventName = 'unlogin_' + uuidUtil.generate()
      let _this = this
      let cb = scopeManager.createScopeHandler({
        handler: function () {
          let storage = _getStorage()
          //不存在事件获取事件需要触发
          if (
            !storage.containsKey(eventName) ||
            true === storage.get(eventName)
          ) {
            let callback = function () {
              let url = envir.getLoginUrl()
              //								window.top.location.href = url;
              //统一门户那边登录超时时需要在容器内部进行跳转 2018-07-18

              window.location.href = url
            }
            let params = {
              title: i18n.get('错误', '未登录异常弹框的标题'),
              msgHeader: i18n.get('未登录异常', '为登录异常弹框头部信息'),
              msg: i18n.get(
                '当前页面已过期，需要重新登录',
                '未登录异常弹框显示的错误信息'
              ),
              detail: i18n.get(
                '当前页面已过期，需要重新登录',
                '为登录异常弹框的详细描述信息'
              ),
              callback: callback,
              exceptionData: _this.getExceptionData(),
              exceptionMap: _this.serialize(),
              viewonly: _this.isViewonly(),
              network: _this.isNetwork(),
              isLoginException:
                true /* 标记此信息为未登录异常，会根据此标识调整异常弹框上可操作的按钮（登录异常只有一个确定按钮，没有反馈、查看详情等按钮） */,
              hideFeeback: _this.getHideFeeback(),
              containerId: _this.getContainerId()
            }
            if (_this.isSubmit())
              //服务端异常不需要提交，服务端异常在创建异常对象时会标记为服务端异常
              callCommandService.callCommand(params)
            callCommandService.showDialog(params, callback)
          }
        }
      })
      if (window.top && window.top != window) {
        let storage = _getStorage()
        storage.put(eventName, true)
        let cancalFire = scopeManager.createScopeHandler({
          handler: (function (event) {
            return function () {
              console.log('postMessage')
              let storage = _getStorage()
              storage.put(event, false)
            }
          })(eventName)
        })
        /**
         * 1、先注册跨域事件(注销回调跨域事件)
         * 2、发送消息（有接收到就执行注销回调事件）
         * */
        eventManager.onCrossDomainEvent({
          eventName: eventName,
          handler: cancalFire
        })
        eventManager.fireCrossDomainEvent({
          type: eventManager.CrossDomainMessageType.MESSAGE, //消息
          params: {
            msg: 'UnLogin',
            operation: eventManager.CrossDomainMessageType.EVENT, //消息的操作是触发事件
            params: {
              EVENTNAME: eventName, //事件名称
              TYPE: eventManager.CrossDomainMessageType.EVENT
            }
          }
        })
        setTimeout(cb, 200)
      } else {
        cb()
      }
    }
  }
}

export default UnLoginException
