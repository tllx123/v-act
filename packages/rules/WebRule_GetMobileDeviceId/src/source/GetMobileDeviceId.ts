//初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
// export function initModule(sBox) {}
//规则主入口(必须有)
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import { HardwareOperation as hardwareOperationService } from '@v-act/vjs.framework.extension.platform.services.native.mobile.hardwareoperation'

const main = function (ruleContext: RuleContext) {
  //		// 获取规则链路由上下文,终止执行后续规则
  //		var routeContext = ruleContext.getRouteContext();
  //		// 获取规则链路由上下文的配置参数值
  //		var ruleCfgValue = ruleContext.getRuleCfg();
  //		// 获取开发系统配置的参数
  //		var inParams = ruleCfgValue["inParams"];
  let successCB = function (deviceId: string) {
    setDirectResult(ruleContext, deviceId)
    ruleContext.fireRouteCallback()
  }
  let errorCB = function (msg: string) {
    setDirectResult(ruleContext, '')
    ruleContext.fireRouteCallback()
  }

  hardwareOperationService.getDeviceId(successCB, errorCB)
  ruleContext.markRouteExecuteUnAuto()
}
function setDirectResult(ruleContext: any, deviceId: string) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      deviceId: deviceId
    })
  }
}

export { main }
