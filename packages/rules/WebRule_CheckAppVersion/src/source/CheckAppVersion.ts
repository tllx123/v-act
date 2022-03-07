import { AppVersion as VersionService } from '@v-act/vjs.framework.extension.platform.services.native.mobile'

//初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
export function initModule(sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//规则主入口(必须有)
const main = function (ruleContext) {
  let vs = ''
  let callback = function (version) {
    setBusinessRuleResult(ruleContext, version)
    ruleContext.fireRouteCallback()
  }
  VersionService.getVersionNumber(callback)
  ruleContext.markRouteExecuteUnAuto()

  return null
}
function setBusinessRuleResult(ruleContext, result) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      // 最新的App版本号
      version: result
    })
  }
}
export { main }
