import { Browser as browser } from '@v-act/vjs.framework.extension.platform.services.browser'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RuleEngine as ruleEngine } from '@v-act/vjs.framework.extension.platform.engine.rule'

export function render(params) {
  var componentCode = params.componentCode
  var windowCode = params.windowCode
  var title = params.title
  var windowInputParams = params.inputs
  windowInputParams['variable']['formulaOpenMode'] = 'locationHref'
  // 当前窗体跳转
  windowInputParams['variable']['windowtitle'] = title
  var ruleContext = params.ruleContext
  var errorCallback = scopeManager.createScopeHandler({
    handler: function (e) {
      if (ruleContext) {
        throw ruleEngine.createRuleException({
          ruleContext: ruleContext,
          exception: e
        })
      } else {
        throw e
      }
    }
  })
  browser.redirectModule({
    componentCode: componentCode,
    windowCode: windowCode,
    params: {
      inputParam: windowInputParams
    },
    extraParams: {
      errorCallback: errorCallback
    }
  })
}
