import {
  ScopeTask,
  TaskManager as taskManager
} from '@v-act/vjs.framework.extension.platform.global'
import { Environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RPC as rpc } from '@v-act/vjs.framework.extension.system.rpc'
import {
  AbstractChannel,
  Manager as channelManager
} from '@v-act/vjs.framework.extension.system.rpc.channel'

let objectUtil:any

let MultiVPlatformAjaxChannel = function () {
  AbstractChannel.apply(this, arguments)
  let contextPath = Environment.getContextPath()
  if (contextPath) {
    this.url = contextPath + '/module-operation!executeMultiOperation'
  } else {
    this.url = 'module-operation!executeMultiOperation'
  }
}

let _genExceptionFromResult = function (result:any) {
  let exception
  if (
    typeof result == 'object' &&
    (result['success'] == false || result.isError || result.error)
  ) {
    exception = exceptionFactory.create(result)
  }
  return exception
}

let _log = function (res:any, status:any, requestInfo:any) {
  if (requestInfo) {
    let params = {
      request: requestInfo.request,
      contract: requestInfo.contract,
      response: res,
      responseStatus: status
    }
    rpc.log(params)
  }
}

MultiVPlatformAjaxChannel.prototype = {
  initModule: function (sb:any) {
    objectUtil = sb.util.object
    var initFunc = AbstractChannel.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(AbstractChannel.prototype)
    prototype.constructor = MultiVPlatformAjaxChannel
    objectUtil.extend(prototype, MultiVPlatformAjaxChannel.prototype)
    MultiVPlatformAjaxChannel.prototype = prototype
    channelManager.injectCurrentChannel(
      MultiVPlatformAjaxChannel,
      'multiVPlatform'
    )
  },

  /**
   * //TODO 默认构建jquery请求
   * @param {Object} url
   */
  buildRequest: function (request:any, contract:any) {
    //@ts-ignore
    if (window.GlobalVariables) {
      //@ts-ignore
      this.url = GlobalVariables.getServerUrl() + '/' + this.url
    }
    let operations = request.getOperations()
    let data = contract.generate(request)
    let scopeId = scopeManager.getCurrentScopeId()
    let scopeTask = new ScopeTask(
      scopeId,
      false,
      (function (channel, operations, contract, request) {
        return function (res:any, status:any) {
          //更新sessionId
          if (res.JSESSIONID) {
            //@ts-ignore
            GlobalVariables.setJSESSIONID(res.JSESSIONID)
          }
          //	              GlobalVariables.setJSESSIONID(res.JSESSIONID);
          //	              GlobalVariables.isJSESSIONID = true;
          if (!status) {
            status = res.status
          }
          var results = channel.processResponse(res, status, {
            request: request,
            contract: contract
          })
          if (!objectUtil.isArray(results)) {
            var exception = _genExceptionFromResult(results)
            //						exception.handle();
            request.callErrorCallback(exception)
          } else {
            var exception
            for (var i = 0; i < results.length; i++) {
              var result = contract.deserializeResponse(results[i])
              var exception
              if (result) {
                exception = _genExceptionFromResult(result)
              }
              if (exception) {
                break
              }
              operations[i].callAfterResponse(result)
            }
            if (exception) {
              //							exception.handle();
              request.callErrorCallback(exception)
            } else {
              request.callSuccessCallback(results)
            }
          }
        }
      })(this, operations, contract, request)
    )
    let taskId = taskManager.addTask(scopeTask)
    let callback = function (res:any, status:any) {
      taskManager.execTaskById(taskId, [res, status])
    }
    let timeout = 60 * 60 * 24 //如果没设置超时
    if (request && request.timeout) {
      timeout = request.timeout
    }

    let config = {
      timeout: timeout,
      trustAll: true,
      isAsync: request.isAsync(),
      //@ts-ignore
      JSESSIONID: GlobalVariables.getJSESSIONID()
    }
    return [this.url, this.type, data, config, callback]
  },

  processResponse: function (res:any, status:any, requestInfo:any) {
    if (status === 'success' || status === 'notmodified') {
      return eval('(' + res.responseText + ')')
    } else if (status === 'timeout') {
      if (requestInfo) {
        let params = {
          request: requestInfo.request,
          contract: requestInfo.contract,
          response: res,
          responseStatus: status
        }
        this.log(params)
      }
      return {
        isError: true,
        exceptionType: 'DialogException',
        msg: '请求超时'
      }
    } else {
      if (requestInfo) {
        let params = {
          request: requestInfo.request,
          contract: requestInfo.contract,
          response: res,
          responseStatus: status
        }
        this.log(params)
      }
      return {
        isError: true,
        msg: '网络连接失败，请检查网络是否正常！',
        type: 'NetworkException'
      }
    }
  },

  request: function (request:any, contract:any) {
    let operations = request.getOperations()
    if (operations && operations.length > 0) {
      for (let i = 0, l = operations.length; i < l; i++) {
        let func = operations[i].getBeforeRequest()
        if (typeof func === 'function') {
          func.call(operation)
        }
      }
      let args = this.buildRequest(request, contract)
      let func =
      //@ts-ignore
        window.VJSBridge.plugins.vplatform.RPC.httprequestplugin.execute
      func.apply(this, args)
    }
  }
}

return MultiVPlatformAjaxChannel
