import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RouteEngine as routeEngine } from '@v-act/vjs.framework.extension.platform.services.engine'
import { RemoteMethodAccessor as remoteMethodAccessor } from '@v-act/vjs.framework.extension.platform.services.operation.remote.ruleset'

let sandbox

export function initModule(sb) {
  sandbox = sb
}

const doAction = function (params: any) {
  let item = params.data
  let widget = params.properties
  let cbFunc = params.callback
  // 执行活动集
  if (item.ruleCompCode && item.ruleCode) {
    let _conCode = scopeManager.getWindowScope().getComponentCode()
    let _winCode = scopeManager.getWindowScope().getWindowCode()
    let targetConfig = {}
    targetConfig['sourceType'] = 'client-ruleSet'
    targetConfig['invokeType'] = 'local'
    targetConfig['componentCode'] = item.ruleCompCode
    targetConfig['windowCode'] = item.ruleWinCode
    targetConfig['ruleSetCode'] = item.ruleCode

    let ruleParams = item.ruleParams
    let inputParam = {}
    if (ruleParams) {
      ruleParams = ruleParams.split('&')
      for (let i = 0; i < ruleParams.length; i++) {
        let param = ruleParams[i].split('=')
        inputParam[param[0]] = param[1]
      }
    }
    let config = {}
    config['instanceRefs'] = null
    config['currRouteRuntime'] = null
    let params = {}
    if (_winCode) {
      params = {
        targetConfig: targetConfig,
        inputParam: inputParam,
        config: config,
        callback: cbFunc
      }
    } else {
      params = {
        targetConfig: targetConfig,
        inputParam: {
          variable: inputParam
        },
        config: config,
        callback: cbFunc
      }
    }
    routeEngine.execute(params)
  } else if (item.compCode && item.winCode) {
    let sConfig = {
      isAsyn: false,
      componentCode: item.compCode,
      ruleSetCode: item.winCode,
      afterResponse: cbFunc
    }
    remoteMethodAccessor.invoke(sConfig)
  } else {
    cbFunc()
    throw new Error('执行方法的构建编号和活动集名称不能为空')
  }
}

export { doAction }
