import { AbstractChannel as AbstractChannel } from '@v-act/vjs.framework.extension.system.rpc.channel'
import { RPC as rpc } from '@v-act/vjs.framework.extension.system'

let objectUtil, cUtils

let CommonAjaxChannel = function () {
  AbstractChannel.apply(this, arguments)
}

CommonAjaxChannel.prototype = {
  initModule: function (sb) {
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
  buildRequest: function (request, contract) {
    let data = {}
    let operations = request.getOperations()
    cUtils.each(operations, function (op) {
      objectUtil.extend(data, op.getParams())
    })
    let host = request.getHost()
    let headNamespace = window.head //TODO ie11下异步请求后，会重写该变量，导致headjs无法使用，目前在此作兼容处理
    let body = {
      type: this.type,
      url: host,
      async: request.isAsync(),
      data: data,
      complete: function (res, status) {
        window.head = headNamespace
        if (status === 'success' || status === 'notmodified') {
          var operations = request.getOperations()
          cUtils.each(operations, function (op) {
            op.callAfterResponse(res, status)
          })
          request.callSuccessCallback(res, status)
        } else {
          request.callErrorCallback(res, status)
        }
      },
      error: function (res, status) {
        request.callErrorCallback(res, status)
      }
    }
    let timeout = request.getTimeout()
    if (timeout) {
      body.timeout = timeout
    }
    return body
  },

  request: function (request, contract) {
    let ajax
    if (jQuery) {
      ajax = jQuery.ajax
    }
    let operations = request.getOperations()
    cUtils.each(operations, function (op) {
      let func = op.getBeforeRequest()
      if (typeof func === 'function') {
        func.call(request)
      }
    })
    let request = this.buildRequest(request, contract)
    ajax(request)
  }
}

return CommonAjaxChannel
