import { Qrcode as service } from '@v-act/vjs.framework.extension.platform.services.native.mobile.qrcode'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.interface.route'




function main(ruleContext:RuleContext) {
  let success = function (rs:any) {
    setBusinessRuleResult(ruleContext, rs)
    ruleContext.fireRouteCallback()
  }
  service.scanQRCode(success)
  ruleContext.markRouteExecuteUnAuto()
}
function setBusinessRuleResult(ruleContext:RuleContext, result:any) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      path: result
    })
  }
}

export { main }
