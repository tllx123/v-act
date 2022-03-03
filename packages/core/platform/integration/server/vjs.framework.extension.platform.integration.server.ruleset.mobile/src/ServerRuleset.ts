exports.initModule = function (sb) {
  let serverRuleSet = sb.getService(
    'vjs.framework.extension.platform.services.integration.server.Ruleset'
  )
  serverRuleSet._putInstance(exports)
}

const invoke = function (params) {
  let fail = params.fail
  let args = {
    ruleSetCode: params.ruleSetCode,
    componentCode: params.componentCode,
    windowCode: params.windowCode,
    isAsyn: params.isAsync,
    afterResponse: params.success,
    error: fail,
    commitParams: params.params
  }
  V3Integration.load({
    vjsList: [
      'vjs.framework.extension.platform.services.operation.remote.ruleset',
      'vjs.framework.extension.system.rpc.contract.vplatform',
      'vjs.framework.extension.system.rpc.channel.native.cordova',
      'vjs.framework.extension.platform.datasource.taffy',
      'vjs.framework.extension.platform.interface.scope'
    ],
    success: function (sb) {
      let scopeManager = sb.getService(
        'vjs.framework.extension.platform.interface.scope.ScopeManager'
      )
      let rpc = sb.getService(
        'vjs.framework.extension.platform.services.operation.remote.RemoteMethodAccessor'
      )
      let scopeId = scopeManager.createWindowScope({
        parentScopeId: null,
        componentCode: '$integration'
      })
      scopeManager.openScope(scopeId)
      rpc.invoke(args)
      scopeManager.closeScope()
    },
    fail: function () {
      if (fail) fail()
    }
  })
}

export { invoke }
