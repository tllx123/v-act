import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { EventManager as eventManager } from '@v-act/vjs.framework.extension.platform.services.view.event'
// 加载
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}
// 规则主入口(必须有)
let main = function (ruleContext) {
  // 获取规则上下文中的规则配置值
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let scopeId = scopeManager.getCurrentScopeId()
  let mappingItems = inParamsObj['mappingItems'] //规则配置信息
  let funcArr = []
  for (let i = 0; i < mappingItems.length; i++) {
    let mappingItem = mappingItems[i]
    let widgetId = mappingItem['componentControlCode'] // 需要触发事件的控件
    let componentID = mappingItem['componentID']
    let eventName = mappingItem['actionName'] // 需要触发的事件
    if (undefined != widgetId && null != widgetId) {
      let fireWidget = function () {
        scopeManager.openScope(scopeId)
        eventManager.fireEvent(widgetId, eventName)() //触发某个控件的事件
        scopeManager.closeScope()
      }
      funcArr.push(fireWidget)
    }
  }

  let fireAllWidget = function () {
    for (let index = 0; index < funcArr.length; index++) {
      funcArr[index]()
    }
    funcArr = null
  }

  //延迟一毫秒调用
  let t = setTimeout(fireAllWidget, 1)
  return true
}

export { main }
