import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
let sandbox
//初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//规则主入口(必须有)
let main = function (ruleContext) {
  //		// 获取规则链路由上下文,终止执行后续规则
  let routeContext = ruleContext.getRouteContext()
  //		// 获取规则链路由上下文的配置参数值
  let ruleCfgValue = ruleContext.getRuleCfg()
  //		// 获取开发系统配置的参数
  let inParams = ruleCfgValue['inParams']
  let inParamObj = jsonUtil.json2obj(inParams)
  //执行类型 break/continue
  let type = inParamObj.abortType
  if (type == 'break' || type == 'continue') {
    routeContext.setExecuteType(type)
  } else {
    throw Error('中断循环类型值不正确：[' + type + ']')
  }
}

export { main }
