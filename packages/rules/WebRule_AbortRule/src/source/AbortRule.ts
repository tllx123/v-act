import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
let undefined
exports.initModule = function (sBox) {}
// 规则主入口(必须有)
let main = function (ruleContext) {
  // dengb:xiedh说不需要事务
  // 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  // 如果开发系统有传入abortType，则按传入的中断方式来操作
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  if (undefined != inParams && null != inParams && '' != inParams) {
    let inParamObj = jsonUtil.json2obj(inParams)
    let abortType = inParamObj.abortType
    if (abortType.toUpperCase() == 'CURRENT')
      routeContext.markForInterrupt(routeContext.CURRENT)
    else if (abortType.toUpperCase() == 'GLOBAL')
      routeContext.markForInterrupt(routeContext.GLOBAL)
    else throw new Error('不支持中断方式：' + abortType)
  }
  // 如果开发系统没有传入abortType，则是旧数据，作兼容处理只中断当前规则
  else {
    routeContext.markForInterrupt(routeContext.CURRENT)
  }
}

export { main }
