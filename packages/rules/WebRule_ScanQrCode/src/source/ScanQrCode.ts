import { Qrcode as service } from '@v-act/vjs.framework.extension.platform.services.native.mobile'

let undefined

exports.initModule = function (sBox) {}

function main(ruleContext) {
  let success = function (rs) {
    setBusinessRuleResult(ruleContext, rs)
    ruleContext.fireRouteCallback()
  }
  service.scanQRCode(success)
  ruleContext.markRouteExecuteUnAuto()
}
function setBusinessRuleResult(ruleContext, result) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      path: result
    })
  }
}

export { main }
