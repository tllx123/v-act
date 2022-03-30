import {
  ScopeTask,
  TaskManager as taskManager
} from '@v-act/vjs.framework.extension.platform.global'
import { Environment } from '@v-act/vjs.framework.extension.platform.interface.environment'
import { ExceptionFactory as exceptionFactory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import AbstractChannel from './spi/AbstractChannel'
import { Log as logUtil } from '@v-act/vjs.framework.extension.util.logutil'

import * as generateRequestIdenUtil from './util/GenerateRequestIdenUtil'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

class VPlatformAjaxChannel extends AbstractChannel {
  contextPath
  url
  count
  requestParams: any
  contractParams: any

  constructor() {
    super()
    this.contextPath = Environment.getContextPath()
    // if (this.contextPath) {
    //   this.url = "/api/vplatform/"+this.contextPath + '/module-operation!executeOperation'
    // } else {
    //   // this.url = '/api/vplatform/module-operation!executeOperation'
    //   this.url = '/api/vplatform/module-operation!executeOperation'
    // }

    // 代理
    this.url = '/api/vplatform'

    this.count = 0
    this.requestParams = null
    this.contractParams = null
  }

  buildRequest(request: any, contract: any) {
    this.requestParams = request
    this.contractParams = contract
    let data = contract.generate(request)
    let scopeId = scopeManager.getCurrentScopeId()
    //@ts-ignore
    let headNamespace = window.head //TODO ie11下异步请求后，会重写该变量，导致headjs无法使用，目前在此作兼容处理
    let scopeTask = new ScopeTask(
      scopeId,
      false,
      (function (channel, request, contract) {
        return function (res: any, status: any) {
          //@ts-ignore
          window.head = headNamespace
          var result = channel.processResponse(res, status)
          if (result && (result.isError || result.error)) {
            //如果是系统内置识别异常，则不需要处理，等待下次请求。
            if (
              result.exceptionType &&
              result.exceptionType == 'SystemCustomException'
            ) {
              return
            }
            result.from = 'service'
            var exception = exceptionFactory.create(result)
            //exception.handle(); comment by xiedh 2016-09-12 会抛出异常，造成后面语句无法执行
            request.callErrorCallback(exception)
            //如果是同步请求，则抛出异常，阻止后续逻辑执行  add by xiedh 2018-05-29
            //当登录超时时，返回登录异常，未获取到正常数据，如果不抛出异常，导致规则后续逻辑继续执行，导致一些不可意料的错误
            if (!request.isAsync()) {
              throw exception
            }
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
    let operation = request.getOperations()[0]
    let url = this.url
    //@ts-ignore
    if (window.GlobalVariables) {
      //@ts-ignore
      url = window.GlobalVariables.getServerUrl() + '/' + url
    }
    url += '?componentCode=' + operation.getComponentCode()
    //this.url += "?componentCode=" + operation.getComponentCode();
    let windowCode = operation.getWindowCode()
    if (windowCode != null && typeof windowCode != 'undefined') {
      url += '&windowCode=' + windowCode
    }
    let splitChar = url.indexOf('?') == -1 ? '?' : '&'
    url += splitChar + 'randomId=' + Math.random()
    let body = {
      type: this.type,
      url: url,
      async: request.isAsync(),
      data: data,
      //timeout: this.getTimeout(),
      complete: (function (tId) {
        return function (res: any, status: any) {
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
      //body.timeout = timeout
      throw new Error('未识别异常，请联系系统管理员处理')
    }
    return body
  }

  processResponse(res: any, status: any) {
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
      return {
        isError: true,
        exceptionType: 'DialogException',
        msg: '请求超时'
      }
    } else {
      let msg, type
      if (res.readyState < 4) {
        if (this.count < 3) {
          //如果请求超时并且重新请求次数少于3次，就再重新请求
          this.count = this.count + 1
          this.log('请求失败，正在重新请求，当前重新请求次数为：' + this.count)
          this.request(this.requestParams, this.contractParams)
          return {
            isError: true,
            exceptionType: 'SystemCustomException',
            msg: '系统内置识别异常'
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
  }

  request(request: any, contract: any) {
    let ajax
    if ($) {
      ajax = $.ajax
    }
    let operations = request.getOperations()
    let operation = operations[0] //单重请求，只有一个operation
    let func = operation.getBeforeRequest()
    if (typeof func === 'function') {
      func.call(request)
    }
    try {
      let scopeId = scopeManager.getCurrentScopeId()
      scopeManager.openScope(scopeId)
      request = this.buildRequest(request, contract)
      /* 获取额外参数 */
      let iden = generateRequestIdenUtil.calculateAsciiCode(
        request.url,
        request.data
      )
      let url = request.url
      if (url) {
        if (url.indexOf('?') != -1) {
          request.url += '&_request_validate_token_=' + iden
        } else {
          request.url += '?_request_validate_token_=' + iden
        }
      }
      ajax(request)
    } finally {
      scopeManager.closeScope()
    }
  }

  log(msg: string) {
    if (logUtil) logUtil.log(msg)
  }
}

export default VPlatformAjaxChannel

//export default { calculateAsciiCode }
