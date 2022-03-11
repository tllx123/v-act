import { AbstractChannel } from '@v-act/vjs.framework.extension.system.rpc.channel'

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
    channelManager.injectCurrentChannel(CommonAjaxChannel, 'crossDomain')
  },
  buildRequest: function (request, contract) {
    let data = {}
    let operations = request.getOperations()
    cUtils.each(operations, function (op) {
      objectUtil.extend(data, op.getParams())
    })
    let host = request.getHost()
    let callback = function (res, status) {
      //更新sessionId
      if (res.JSESSIONID) {
        GlobalVariables.setJSESSIONID(res.JSESSIONID)
      }
      //              GlobalVariables.setJSESSIONID(res.JSESSIONID);
      //              GlobalVariables.isJSESSIONID = true;
      if (!status) {
        status = res.status
      }
      if (status === 'success' || status === 'notmodified') {
        let operations = request.getOperations()
        cUtils.each(operations, function (op) {
          op.callAfterResponse(res, status)
        })
        request.callSuccessCallback(res, status)
      } else {
        request.callErrorCallback(res, status)
      }
    }
    let timeout = 60 * 60 * 24 //如果没设置超时
    if (request && request.timeout) {
      timeout = request.timeout
    }
    let config = {
      trustAll: true,
      timeout: timeout,
      isAsync: request.isAsync(),
      JSESSIONID: GlobalVariables.getJSESSIONID()
    }
    return [host, this.type, data, config, callback]
  },

  request: function (request, contract) {
    let operations = request.getOperations()
    cUtils.each(operations, function (op) {
      let func = op.getBeforeRequest()
      if (typeof func === 'function') {
        func.call(request)
      }
    })
    let args = this.buildRequest(request, contract)
    let func = window.VJSBridge.plugins.vplatform.RPC.httprequestplugin.execute
    func.apply(this, args)
  }
}

return CommonAjaxChannel
