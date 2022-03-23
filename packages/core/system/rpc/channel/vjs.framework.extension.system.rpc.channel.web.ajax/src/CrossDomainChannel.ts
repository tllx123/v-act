import AbstractChannel from './spi/AbstractChannel'
import { $ } from '@v-act/vjs.framework.extension.vendor.jquery'

let objectUtil: any, cUtils: any

class CrossDomainChannel extends AbstractChannel {
  buildRequest(request: any, contract: any) {
    let data = {}
    let operations = request.getOperations()
    cUtils.each(operations, function (op: any) {
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
      success(res: any, status: any) {
        var timeoutIden = request._$TimeOutIden
        if (timeoutIden) {
          clearTimeout(timeoutIden)
        }
        if (status === 'success' || status === 'notmodified') {
          var operations = request.getOperations()
          cUtils.each(operations, function (op: any) {
            op.callAfterResponse(res, status)
          })
          request.callSuccessCallback(res, status)
        } else {
          request.callErrorCallback(res, status)
        }
      },
      error(res: any, status: any) {
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
  }

  request(request: any, contract: any) {
    let ajax = $.ajax
    let operations = request.getOperations()
    cUtils.each(operations, function (op: any) {
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
