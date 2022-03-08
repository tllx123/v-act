export function initModule(sb) {
  let serverRuleSet = sb.getService(
    'vjs.framework.extension.platform.services.integration.server.Ruleset'
  )
  serverRuleSet._putInstance(exports)
}
/**
 * 加载vjs服务
 * @param {Object} params 成功、失败的回调
 * {
 * 	success : Function,
 * 	fail : Function
 * }
 * */
function loadVjsServices(params) {
  V3Integration.load({
    vjsList: [
      'vjs.framework.extension.platform.services.operation.remote.ruleset',
      'vjs.framework.extension.system.rpc.contract.vplatform',
      'vjs.framework.extension.system.rpc.channel.web.ajax',
      'vjs.framework.extension.platform.datasource.taffy',
      'vjs.framework.extension.platform.interface.scope'
    ],
    success: function (sb) {
      if (params && typeof params.success == 'function') {
        params.success(sb)
      }
    },
    fail: function () {
      if (params && typeof params.fail == 'function') {
        params.fail()
      }
    }
  })
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
  loadVjsServices({
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
  //		V3Integration.load({
  //			"vjsList":[
  //				"vjs.framework.extension.platform.services.operation.remote.ruleset",
  //				"vjs.framework.extension.system.rpc.contract.vplatform",
  //				"vjs.framework.extension.system.rpc.channel.web.ajax",
  //				"vjs.framework.extension.platform.datasource.taffy",
  //				"vjs.framework.extension.platform.interface.scope"
  //			],
  //			"success":function(sb){
  //				var scopeManager = sb.getService("vjs.framework.extension.platform.interface.scope.ScopeManager");
  //				var rpc = sb.getService("vjs.framework.extension.platform.services.operation.remote.RemoteMethodAccessor");
  //				var scopeId = scopeManager.createWindowScope({
  //					"parentScopeId":null,
  //					"componentCode":"$integration"
  //				});
  //				scopeManager.openScope(scopeId);
  //				rpc.invoke(args);
  //				scopeManager.closeScope();
  //			},
  //			"fail":function(){
  //				if(fail)fail();
  //			}
  //		});
}

const invokeV3Webapi = function (params) {
  loadVjsServices({
    success: function (sb) {
      let remote = sb.getService(
        'vjs.framework.extension.platform.services.operation.remote.RemoteMethodAccessor'
      )
      remote.invokeV3Webapi(params)
    },
    fail: function () {
      alert('加载vjs依赖失败.')
    }
  })
}

export { invoke, invokeV3Webapi }
