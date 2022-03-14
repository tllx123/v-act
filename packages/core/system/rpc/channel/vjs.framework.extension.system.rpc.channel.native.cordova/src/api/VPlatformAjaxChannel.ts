import { AbstractChannel as AbstractChannel } from '@v-act/vjs.framework.extension.system.rpc.channel'
import { Manager as channelManager } from '@v-act/vjs.framework.extension.system.rpc.channel'
import { TaskManager as taskManager } from '@v-act/vjs.framework.extension.platform.global'
import { ScopeTask as ScopeTask } from '@v-act/vjs.framework.extension.platform.global'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Environment as Environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'

let objectUtil

let VPlatformAjaxChannel = function () {
  AbstractChannel.apply(this, arguments)
  let contextPath = Environment.getContextPath()
  if (contextPath) {
    //@ts-ignore
    this.url = contextPath + '/module-operation!executeOperation'
  } else {
    //@ts-ignore
    this.url = 'module-operation!executeOperation'
  }
}

VPlatformAjaxChannel.prototype = {
  initModule: function (sb:any) {
    objectUtil = sb.util.object
    var initFunc = AbstractChannel.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    var prototype = Object.create(AbstractChannel.prototype)
    prototype.constructor = VPlatformAjaxChannel
    objectUtil.extend(prototype, VPlatformAjaxChannel.prototype)
    VPlatformAjaxChannel.prototype = prototype
    channelManager.injectCurrentChannel(VPlatformAjaxChannel, 'vPlatform')
  },

  /**
   * //TODO 默认构建jquery请求
   * @param {Object} url
   */
  buildRequest: function (request:any, contract:any) {
    let data = contract.generate(request)
    let operation = request.getOperations()[0]
    this.url += '?componentCode=' + operation.getComponentCode()
    let windowCode = operation.getWindowCode()
    if (windowCode != null && typeof windowCode != 'undefined') {
      this.url += '&windowCode=' + windowCode
    }
    //@ts-ignore
    if (window.GlobalVariables) {
      //@ts-ignore
      this.url = GlobalVariables.getServerUrl() + '/' + this.url
    }
    let scopeId = scopeManager.getCurrentScopeId()
    let scopeTask = new ScopeTask(
      scopeId,
      false,
      (function (channel, request, contract) {
        return function (res:any, status:any) {
          //更新sessionId
          if (res.JSESSIONID) {
            //@ts-ignore
            GlobalVariables.setJSESSIONID(res.JSESSIONID)
          }
          //		              GlobalVariables.setJSESSIONID(res.JSESSIONID);
          //		              GlobalVariables.isJSESSIONID = true;
          if (!status) {
            status = res.status
          }
          var result = channel.processResponse(res, status)
          if (result && (result.isError || result.error)) {
            var exception = exceptionFactory.create(result)
            //							exception.handle();
            request.callErrorCallback(exception)
            return
          }
          var datas
          var operation = request.getOperations()[0]
          if (
            operation.getOperation() != 'ExecuteRuleSet' &&
            result.data &&
            !result.data.result
          ) {
            datas = result
          } else {
            datas = contract.deserializeResponse(result)
          }
          request.callSuccessCallback(datas)
        }
      })(this, request, contract)
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

  processResponse: function (res:any, status:any) {
    if (status === 'success' || status === 'notmodified') {
      return eval('(' + res.responseText + ')')
    } else {
      return {
        isError: true,
        msg: '网络连接失败，请检查网络是否正常！',
        type: 'NetworkException'
      }
    }
  },

  request: function (request:any, contract:any) {
    let operations = request.getOperations()
    let operation = operations[0] //单重请求，只有一个operation
    let func = operation.getBeforeRequest()
    if (typeof func === 'function') {
      func.call(request)
    }
    let args = this.buildRequest(request, contract)
    //@ts-ignore
    func = window.VJSBridge.plugins.vplatform.RPC.httprequestplugin.execute
    func.apply(this, args)
  }
}

return VPlatformAjaxChannel
