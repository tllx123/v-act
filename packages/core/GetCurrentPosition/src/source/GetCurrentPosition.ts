import { Geolocation as service } from '@v-act/vjs.framework.extension.platform.services.native.mobile'

let undefined

exports.initModule = function (sBox) {}

function main(ruleContext) {
  let success = function (rs) {
    setBusinessRuleResult(ruleContext, rs, true)
    ruleContext.fireRouteCallback()
  }
  let error = function (rs) {
    if (ruleContext.setBusinessRuleResult) {
      ruleContext.setBusinessRuleResult({
        isSuccess: false
      })
    }
    ruleContext.fireRouteCallback()
  }
  service.getCurrentPosition(success, error)
  ruleContext.markRouteExecuteUnAuto()
}
function setBusinessRuleResult(ruleContext, result, isSuccess) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      // 纬度
      latitude: result.coords.latitude,
      longitude: result.coords.longitude,
      isSuccess: true
    })
  }
}
export { main }
