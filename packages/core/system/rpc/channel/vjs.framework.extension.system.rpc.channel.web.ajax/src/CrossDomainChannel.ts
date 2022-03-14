import { AbstractChannel } from '@v-act/vjs.framework.extension.system.rpc.channel'
import {$} from '@v-act/vjs.framework.extension.vendor.jquery'

let objectUtil:any, cUtils:any

let CrossDomainChannel = function () {
  AbstractChannel.apply(this, arguments)
}

CrossDomainChannel.prototype = {
  initModule: function (sb:any) {
    objectUtil = sb.util.object
    cUtils = sb.util.collections
    var initFunc = AbstractChannel.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(AbstractChannel.prototype)
    prototype.constructor = CrossDomainChannel
    objectUtil.extend(prototype, CrossDomainChannel.prototype)
    CrossDomainChannel.prototype = prototype
    var channelManager = sb.getService(
      'vjs.framework.extension.system.rpc.channel.Manager'
    )
    channelManager.injectCurrentChannel(CrossDomainChannel, 'crossDomain')
  },
  buildRequest: function (request:any, contract:any) {
    let data = {}
    let operations = request.getOperations()
    cUtils.each(operations, function (op:any) {
      objectUtil.extend(data, op.getParams())
    })
    let host = request.getHost()
    let type = 'GET',
      dataType = 'jsonp'
    if (host) {
      let localhost = window.location.origin
      //判断是否为同域请求
      if (host.substring(0, localhost.length) == localhost) {
        type = 'POST'
        dataType = 'json'
      }
    }
    let body = {
      type: type,
      url: host,
      dataType: dataType,
      data: data,
      success: function (res:any, status:any) {
        var timeoutIden = request._$TimeOutIden
        if (timeoutIden) {
          clearTimeout(timeoutIden)
        }
        if (status === 'success' || status === 'notmodified') {
          var operations = request.getOperations()
          cUtils.each(operations, function (op:any) {
            op.callAfterResponse(res, status)
          })
          request.callSuccessCallback(res, status)
        } else {
          request.callErrorCallback(res, status)
        }
      },
      error: function (res:any, status:any) {
        var timeoutIden = request._$TimeOutIden
        if (timeoutIden) {
          clearTimeout(timeoutIden)
        }
        request.callErrorCallback(res, status)
      }
    }
    let timeout = request.getTimeout()
    if (timeout) {
      //body.timeout = timeout
      throw new Error('未识别异常，请联系系统管理员处理')
    }
    throw new Error('未识别异常，请联系系统管理员处理')
    return body
  },

  request: function (request:any, contract:any) {
    let ajax = $.ajax
    let operations = request.getOperations()
    cUtils.each(operations, function (op:any) {
      let func = op.getBeforeRequest()
      if (typeof func === 'function') {
        func.call(request)
      }
    })
    let rq = this.buildRequest(request, contract)
    ajax(rq)
    let timeout = request.getTimeout()
    if (timeout) {
      request._$TimeOutIden = setTimeout(function () {
        request.callErrorCallback({}, 'timeout')
      }, timeout)
    }
  }
}

export default CrossDomainChannel
