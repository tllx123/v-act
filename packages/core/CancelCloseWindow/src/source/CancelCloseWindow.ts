import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
let undefined
//初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sBox) {
  //sBox：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sBox
}

//规则主入口(必须有)
let main = function (ruleContext) {
  let scopeId = ScopeManager.getCurrentScopeId()
  ScopeManager.openScope(scopeId)
  let windowScope = ScopeManager.getWindowScope() //获取窗体域
  windowScope.cancelClose()
  ScopeManager.closeScope()
}

export { main }
