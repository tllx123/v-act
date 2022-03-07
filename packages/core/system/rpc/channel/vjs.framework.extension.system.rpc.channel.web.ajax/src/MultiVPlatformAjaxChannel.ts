import {
  ScopeTask,
  TaskManager as taskManager
} from '@v-act/vjs.framework.extension.platform.global.task'
import { Environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RPC as rpc } from '@v-act/vjs.framework.extension.system'
import {
  AbstractChannel,
  Manager as channelManager
} from '@v-act/vjs.framework.extension.system.rpc.channel'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

import * as generateRequestIdenUtil from './util/GenerateRequestIdenUtil'

let objectUtil

let MultiVPlatformAjaxChannel = function () {
  AbstractChannel.apply(this, arguments)
  let contextPath = Environment.getContextPath()
  if (contextPath) {
    this.url = contextPath + '/module-operation!executeMultiOperation'
  } else {
    this.url = 'module-operation!executeMultiOperation'
  }
  this.count = 0
  this.requestParams = null
  this.contractParams = null
}

let _genExceptionFromResult = function (result) {
  let exception
  if (
    typeof result == 'object' &&
    (result['success'] == false || result.isError || result.error)
  ) {
    exception = exceptionFactory.create(result)
  }
  return exception
}

let _log = function (res, status, requestInfo) {
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
  initModule: function (sb) {
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
  buildRequest: function (request, contract) {
    this.requestParams = request
    this.contractParams = contract
    let operations = request.getOperations()
    let data = contract.generate(request)
    let scopeId = scopeManager.getCurrentScopeId()
    let headNamespace = window.head //TODO ie11下异步请求后，会重写该变量，导致headjs无法使用，目前在此作兼容处理
    let scopeTask = new ScopeTask(
      scopeId,
      false,
      (function (channel, operations, contract, request) {
        return function (res, status) {
          window.head = headNamespace
          var results = channel.processResponse(res, status, {
            request: request,
            contract: contract
          })

          //如果是系统内置识别异常，则不需要处理，等待下次请求。
          if (
            results &&
            results.exceptionType &&
            results.exceptionType == 'SystemCustomException'
          ) {
            return
          }
          if (!objectUtil.isArray(results)) {
            results.from = 'service'
            var exception = _genExceptionFromResult(results)
            //exception.handle();  comment by xiedh 2016-09-12 会抛出异常，造成后面语句无法执行
            request.callErrorCallback(exception)
            //如果是同步请求，则抛出异常，阻止后续逻辑执行  add by xiedh 2018-05-29
            //当登录超时时，返回登录异常，未获取到正常数据，如果不抛出异常，导致规则后续逻辑继续执行，导致一些不可意料的错误
            if (!request.isAsync()) {
              throw exception
            }
          } else {
            var exception
            for (var i = 0; i < results.length; i++) {
              var result = contract.deserializeResponse(results[i])
              result.from = 'service'
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
              //exception.handle();  comment by xiedh 2016-09-12 会抛出异常，造成后面语句无法执行
              request.callErrorCallback(exception)
            } else {
              request.callSuccessCallback(results)
            }
          }
        }
      })(this, operations, contract, request)
    )
    let taskId = taskManager.addTask(scopeTask)
    let url = this.url
    if (window.GlobalVariables) {
      url = window.GlobalVariables.getServerUrl() + '/' + url
    }
    let splitChar = url.indexOf('?') == -1 ? '?' : '&'
    url += splitChar + 'randomId=' + Math.random()
    let body = {
      type: this.type,
      url: url,
      async: request.isAsync(),
      data: data,
      //timeout : this.getTimeout(),
      complete: (function (tId) {
        return function (res, status) {
          taskManager.execTaskById(tId, [res, status])
        }
      })(taskId),
      error: (function (tId) {
        return function () {
          taskManager.execTaskById(tId, [{ readyState: 0 }, status])
        }
      })(taskId)
    }
    let timeout = request.getTimeout()
    if (timeout) {
      body.timeout = timeout
    }
    return body
  },

  processResponse: function (res, status, requestInfo) {
    if (status === 'success' || status === 'notmodified') {
      this.count = 0
      return eval('(' + res.responseText + ')')
    } else if (status === 'timeout') {
      if (this.count < 3) {
        //如果请求超时并且重新请求次数少于3次，就再重新请求
        this.count = this.count + 1
        this.log('请求失败，正在重新请求，当前重新请求次数为：' + this.count)
        this.request(this.requestParams, this.contractParams)
        return {
          isError: true,
          exceptionType: 'SystemCustomException'
        }
      }
      this.count = 0
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
      let msg, type
      if (res.readyState < 4) {
        if (this.count < 3) {
          //如果请求超时并且重新请求次数少于3次，就再重新请求
          this.count = this.count + 1
          this.log('请求失败，正在重新请求，当前重新请求次数为：' + this.count)
          this.request(this.requestParams, this.contractParams)
          return {
            isError: true,
            exceptionType: 'SystemCustomException'
          }
        }
        msg = '网络连接失败，请检查网络是否正常！'
        type = 'NetworkException'
      } else {
        msg = typeof res == 'string' ? res : res.responseText
        type = 'UnExpectedException'
      }
      this.count = 0
      return {
        isError: true,
        exceptionType: type,
        msg: msg
      }
    }
  },

  request: function (request, contract) {
    let ajax
    if (jQuery) {
      ajax = jQuery.ajax
    }
    let operations = request.getOperations()
    if (operations && operations.length > 0) {
      for (let i = 0, l = operations.length; i < l; i++) {
        let func = operations[i].getBeforeRequest()
        if (typeof func === 'function') {
          func.call(operation)
        }
      }
      let rq = this.buildRequest(request, contract)
      /* 获取额外参数 */
      let iden = generateRequestIdenUtil.calculateAsciiCode(rq.url, rq.data)
      let url = rq.url
      if (url) {
        if (url.indexOf('?') != -1) {
          rq.url += '&_request_validate_token_=' + iden
        } else {
          rq.url += '?_request_validate_token_=' + iden
        }
      }
      ajax(rq)
    }
  },

  log: function (msg) {
    if (logUtil) logUtil.log(msg)
  }
}

return MultiVPlatformAjaxChannel
