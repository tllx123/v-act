import { log as logUtil } from '@v-act/vjs.framework.extension.util'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { ComponentParam as schemaComponentParam } from '@v-act/vjs.framework.extension.platform.data.storage.schema.param'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { Initor as dataInitor } from '@v-act/vjs.framework.extension.platform.data.adapter'
import { Operation as Operation } from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { Request as Request } from '@v-act/vjs.framework.extension.platform.interface.rpc.operation'
import { WindowRuntimeInit as windowRuntimeInit } from '@v-act/vjs.framework.extension.platform.init.view'
import { RemoteOperation as remoteOperation } from '@v-act/vjs.framework.extension.platform.services.operation.remote'
import { RPC as rpcOperation } from '@v-act/vjs.framework.extension.system'

let undefined

exports.initModule = function (sb) {}

const setVariant = function (params) {
  //不能获取窗体域，当可能在构件域(构件方法)中调用
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode()
  let windowCode = scopeManager.isWindowScope(scope.getInstanceId())
    ? scope.getWindowCode()
    : null
  let synToServer = params.synToServer
  synToServer = typeof synToServer == 'boolean' ? synToServer : true
  let variantValue = this.getVariant({
    code: params.code
  })
  if (variantValue != params.value && synToServer) {
    let requestParams = {
      componentCode: componentCode,
      windowCode: windowCode,
      operationName: 'SysVariableCtrl',
      isAsync: false,
      param: {
        actionType: 'set',
        variables: [
          {
            name: params.code,
            value: params.value
          }
        ]
      },
      afterResponse: function (result) {
        //设置构件编码的值为规则链所在的构件
        var ruleScope = scopeManager.getScope()
        var ruleComponentCode = ruleScope.getComponentCode()
        componentParam.setVariant(ruleComponentCode, params.code, params.value)
      },
      error: function (result) {
        logUtil.error('设置构件变量的值失败\n->' + result.message)
      }
    }
    rpcOperation.invokeOperation(requestParams)
  } else {
    componentParam.setVariant(componentCode, params.code, params.value)
  }
}

const setVariants = function (params) {
  let scope = scopeManager.getWindowScope()
  let componentCode = scope.getComponentCode()
  let windowCode = scope.getWindowCode()
  if (params != undefined && params.length > 0) {
    let result_param = []
    let handle_param = []
    for (let i = 0; i < params.length; i++) {
      let simple_param = params[i]
      let simple_param_handle = {}
      let variantValue = this.getVariant({
        code: simple_param.code
      })
      if (variantValue != simple_param.value) {
        result_param.push(simple_param)
        simple_param_handle['name'] = simple_param.code
        simple_param_handle['value'] = simple_param.value
        handle_param.push(simple_param_handle)
      }
    }
    let requestParams = {
      componentCode: componentCode,
      windowCode: windowCode,
      operationName: 'SysVariableCtrl',
      isAsync: false,
      param: {
        actionType: 'set',
        variables: handle_param
      },
      afterResponse: function (result) {
        for (var i = 0; i < params.length; i++) {
          var sim_param = params[i]
          //设置构件编码的值为规则链所在的构件
          var ruleScope = scopeManager.getScope()
          var ruleComponentCode = ruleScope.getComponentCode()
          componentParam.setVariant(
            ruleComponentCode,
            sim_param.code,
            sim_param.value
          )
        }
      },
      error: function (result) {
        logUtil.error('设置构件变量的值失败\n->' + result.message)
      }
    }
    rpcOperation.invokeOperation(requestParams)
  }
}

const initVariant = function (params) {
  //构建operation对象
  //设置成功回掉：设置构建变量值
  //operation对象注入WindowuntimeInit.registerVariableHandler
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode()
  let isInited = componentParam.isVariantInited(componentCode)
  if (!isInited) {
    //xiedh 2016-08-30 如果构件变量未初始化，才执行此逻辑
    let opt = new Operation()
    let windowCode = scope.getWindowCode()
    opt.setOperation('ComponentVariables')
    opt.setComponentCode(componentCode)
    opt.setWindowCode(windowCode)
    opt.setAfterResponse(function (result) {
      for (let i = 0; i < result.data.length; i++) {
        let v = result.data[i]
        let code = v.code
        let val = dataInitor.init({
          code: code,
          type: v.type.toLowerCase(),
          value: v.value,
          configs: v.configs
        })
        componentParam.setVariant(componentCode, code, val)
      }
      componentParam.markVariantInited(componentCode)
    })
    windowRuntimeInit.registerVariableHandler({
      operation: opt
    })
  }
}

const getVariant = function (params) {
  let scope = scopeManager.getScope()
  let componentCode = scope.getComponentCode(),
    variantCode = params.code
  if (componentParam.existsVariant(componentCode, variantCode)) {
    return componentParam.getVariant(componentCode, variantCode)
  } else {
    let define = schemaComponentParam.getVariantDefine(
      componentCode,
      variantCode
    )
    if (define) {
      let val = dataInitor.init({
        code: define.getCode(),
        type: define.getType(),
        value: define.geInitValue(),
        configs: define.getConfigs()
      })
      componentParam.setVariant(componentCode, variantCode, val)
      return val
    } else {
      throw Error(
        '[ComponentParam.getVariant]未找到构件变量定义,请检查!构件编号:' +
          componentCode +
          ',变量编号：' +
          variantCode
      )
    }
  }
}

const getOption = function (params) {
  let componentCode = params.componentCode,
    optionCode = params.code
  if (componentParam.existsOption(componentCode, optionCode)) {
    return componentParam.getOption(componentCode, optionCode)
  } else {
    let define = schemaComponentParam.getOptionDefine(componentCode, optionCode)
    if (define) {
      let val = dataInitor.init({
        code: define.getCode(),
        type: define.getType(),
        value: define.geInitValue(),
        configs: define.getConfigs()
      })
      return val
    } else {
      throw Error(
        '[ComponentParam.getOption]未找到构件常量定义,请检查!构件编号:' +
          componentCode +
          ',变量编号：' +
          optionCode
      )
    }
  }
}

const refreshVariant = function (params) {
  let codes = params.codes
  let operation = new Operation()
  let scope = scopeManager.getScope()
  let componentCode = params.hasOwnProperty('componentCode')
    ? params.componentCode
    : scope.getComponentCode()
  let windowCode = params.hasOwnProperty('windowCode')
    ? params.windowCode
    : scopeManager.isWindowScope(scope.getInstanceId())
    ? scope.getWindowCode()
    : null
  operation.setComponentCode(componentCode)
  operation.setWindowCode(windowCode)
  operation.setOperation('SysVariableCtrl')
  //operation.setTransactionId(params.transactionId);
  let results = null
  let cb = function (rs) {
    results = rs.data
  }
  let variables = []
  for (let i = 0, l = codes.length; i < l; i++) {
    let variable = {}
    variable.name = codes[i]
    variables.push(variable)
  }
  operation.setAfterResponse(cb)
  operation.addParam('actionType', 'get')
  operation.addParam('variables', variables)
  let request = new Request()
  let isAsync = false
  request.setAsync(isAsync)
  request.setOperations([operation])
  request.setErrorCallback(function (e) {
    throw e
  })
  remoteOperation.request({
    request: request
  })
  if (results) {
    for (let i = 0, l = results.length; i < l; i++) {
      let result = results[i]
      //schemaComponentParam.getVariantDefine(componentCode, result.name).setInitValue(result.value);
      exports.setVariant({
        code: result.name,
        value: result.value,
        synToServer: false
      })
    }
  }
}

const getMetadata = function (componentCode, domain) {
  return schemaComponentParam.getMetadata(componentCode, domain)
}

export {
  getRuleSetInputs,
  setVariant,
  setVariants,
  initVariant,
  getVariant,
  getOption,
  refreshVariant,
  getMetadata
}
