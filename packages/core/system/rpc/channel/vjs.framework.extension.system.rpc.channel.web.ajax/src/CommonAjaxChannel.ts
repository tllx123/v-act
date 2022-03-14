import { AbstractChannel } from '@v-act/vjs.framework.extension.system.rpc.channel'
import {$} from '@v-act/vjs.framework.extension.vendor.jquery'


let objectUtil:any, cUtils:any

let CommonAjaxChannel = function () {
  AbstractChannel.apply(this, arguments)
}

CommonAjaxChannel.prototype = {
  initModule: function (sb:any) {
    objectUtil = sb.util.object
    cUtils = sb.util.collections
    var initFunc = AbstractChannel.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(AbstractChannel.prototype)
    prototype.constructor = CommonAjaxChannel
    objectUtil.extend(prototype, CommonAjaxChannel.prototype)
    CommonAjaxChannel.prototype = prototype
    var channelManager = sb.getService(
      'vjs.framework.extension.system.rpc.channel.Manager'
    )
    channelManager.injectCurrentChannel(CommonAjaxChannel, 'common')
  },
  buildRequest: function (request:any, contract:any) {
    let data = {}
    let operations = request.getOperations()
    cUtils.each(operations, function (op:any) {
      objectUtil.extend(data, op.getParams())
    })
    let host = request.getHost()
    //@ts-ignore
    let headNamespace = window.head //TODO ie11下异步请求后，会重写该变量，导致headjs无法使用，目前在此作兼容处理
    let body = {
      type: this.type,
      url: host,
      async: request.isAsync(),
      data: data,
      complete: function (res:any, status:any) {
        //@ts-ignore
        window.head = headNamespace
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
        request.callErrorCallback(res, status)
      }
      
    }
    let timeout = request.getTimeout()
    if (timeout) {
      //body.timeout = timeout
      throw new Error('未识别异常，请联系系统管理员处理')
    }
    return body
  },

  request: function (request:any, contract:any) {
    let ajax
    if ($) {
      ajax = $.ajax
    }
    let operations = request.getOperations()
    cUtils.each(operations, function (op:any) {
      let func = op.getBeforeRequest()
      if (typeof func === 'function') {
        func.call(request)
      }
    })
    request = this.buildRequest(request, contract)
    ajax(request)
  }
}

export default CommonAjaxChannel
