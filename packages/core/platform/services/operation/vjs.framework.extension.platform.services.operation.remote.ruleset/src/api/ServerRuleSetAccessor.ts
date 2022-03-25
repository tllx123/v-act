import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RPC as rpc } from '@v-act/vjs.framework.extension.system.rpc'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import { jsonUtil as jsonUtils } from '@v-act/vjs.framework.extension.util.jsonutil'

// export function initModule(sb) {}

const invoke = function (params: any) {
  let ruleSetCode = params.ruleSetCode,
    commitParams = params.commitParams
  let beforeRequest = params.beforeRequest
  let afterResponse = params.afterResponse
  let isAsyn = params.isAsyn
  isAsyn = typeof isAsyn == 'boolean' ? isAsyn : true
  let config: any = {}
  config.param = {
    params: commitParams,
    ruleSetCode: ruleSetCode,
    componentCode: params.componentCode,
    transaction_id: params.transactionId,
    transaction_action: params.transaction_action,
    devId: params.devId,
    debuggerId: params.debuggerId
  }
  config.componentCode = params.componentCode
  if (params.hasOwnProperty('windowCode')) {
    config.windowCode = params.windowCode
  }
  //组装新参数 $_sourceWindow
  let scope = scopeManager.getWindowScope()
  let tmp_componentCode = scope ? scope.getComponentCode() : null
  let tmp_windowCode = scope ? scope.getWindowCode() : null
  if (null != tmp_componentCode && null != tmp_windowCode) {
    config.param.$_sourceWindow = tmp_componentCode + '.' + tmp_windowCode
  }

  if (params.hasOwnProperty('isRuleSetCode') && params.isRuleSetCode == false) {
    config.operationName = ruleSetCode
  } else {
    config.operationName = 'ExecuteRuleSet'
  }

  config.host = params.host
  config.transactionId = params.transactionId
  config.transaction_action = params.transaction_action
  config.isAsync = isAsyn
  config.timeout = params.timeout
  config.beforeRequest = beforeRequest
  config.afterResponse = afterResponse
  config.error = params.error
  rpc.invokeExtensibleOperation(config)
}

const invokeV3Webapi = function (params: any) {
  if (params) {
    let host
    //@ts-ignore
    if (window.GlobalVariables) {
      //@ts-ignore
      host = window.GlobalVariables.getServerPath() + '/'
    } else {
      //Task20200623111
      //host = params.host ? params.host : window.location.origin;
      host = params.host ? params.host + '/' : ''
    }
    let v3WebApiUrl =
      host + 'webapi/' + params.componentCode + '/' + params.apiCode
    let customError = params.error
    let customSuccess = params.afterResponse
    /**
     * 重写错误回调，因为后台返回的数据存在转换不了的情况。
     * */
    let errorFun = function (res: any) {
      if (typeof customError == 'function') customError(res)
    }
    /**
     * 成功回调
     * */
    let successFun = function (res: any) {
      if (typeof customSuccess == 'function') {
        //移动版添加对结果处理，保持与pc版一致
        //@ts-ignore
        if (window.GlobalVariables) {
          res = jsonUtils.json2obj(res.responseText)
        }
        if (res.success) {
          customSuccess(res.data)
        } else {
          errorFun({
            msg: res.msg,
            exceptionType: res.exceptionType
          })
        }
      }
    }
    let _p = params.param
    if (_p) {
      let _null_params_ = []
      for (let key in _p) {
        let value = _p[key]
        if (_p.hasOwnProperty(key)) {
          if (arrayUtil.isArray(value)) {
            _p[key] = jsonUtils.obj2json(value)
          } else if (null == value) {
            _null_params_.push(key)
            try {
              delete _p[key]
            } catch (e) {}
          }
        }
      }
      if (_null_params_.length > 0) {
        _p._null_params_ = _null_params_.join(',')
      }
    }
    rpc.crossDomainRequest({
      host: v3WebApiUrl,
      param: _p,
      timeout: params.timeout,
      afterResponse: successFun,
      error: errorFun
    })
  }
}

export { invoke, invokeV3Webapi }
