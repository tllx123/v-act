import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}

const main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()

  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)

  let condIsSucceed = true //inParamsObj["conditionResult"]; // TODO:判定结果
  let condFormula = inParamsObj['condition'] //判定字符串
  let mappingItems = inParamsObj['pageCodeItem']

  // TODO:解析公式，验证是否成立
  condIsSucceed = _parseCondFormulaSucceed(
    condFormula,
    ruleContext.getRouteContext()
  )

  if (condIsSucceed) {
    // 条件成立，进行判断隐藏
    let lastShowTabId
    for (let i = 0; i < mappingItems.length; i++) {
      let mappingItem = mappingItems[i]
      let widgetId = mappingItem['componentControlCode']

      let hide = mappingItem['visible']
      if (undefined != widgetId && null != widgetId) {
        if (hide.toString().toLowerCase() == 'true') {
          _hideOrShowByWidgetId(widgetId, 'hide') //设置页签隐藏
        } else if (hide.toString().toLowerCase() == 'false') {
          _hideOrShowByWidgetId(widgetId, 'show') //设置页签显示
          lastShowTabId = widgetId
        }
      }
    }
    if (lastShowTabId) {
      let widgetId = widgetContext.get(lastShowTabId, 'ProxyWidgetId')
      widgetAction.executeWidgetAction(widgetId, 'selectedById', lastShowTabId)
    }
  }
}

/**
 * 设置页签显示或隐藏
 */
let _hideOrShowByWidgetId = function (tabId, funcName) {
  try {
    let widgetId = widgetContext.get(tabId, 'ProxyWidgetId')
    let widget = widgetContext.get(widgetId, 'widgetObj')
    if (funcName == 'hide') {
      widget.hideItem(tabId)
    } else if (funcName == 'show') {
      widget.showItem(tabId)
    }
  } catch (re) {
    let text = widgetAction.executeWidgetAction(widgetId, 'getText')
    alert(text + '控件不支持隐藏或显示操作。')
    throw re
  }
}

/**
 * 返回解析公式是否成立
 */
let _parseCondFormulaSucceed = function (condFormula, routeContext) {
  //解释条件
  //alert(condFormula);
  let condition = true
  try {
    if (condFormula) {
      //condition = formulaUtil.evalExpression(condFormula);
      let context = new ExpressionContext()
      context.setRouteContext(routeContext)
      let value = engine.execute({
        expression: condFormula,
        context: context
      })
    }
  } catch (re) {
    alert('规则条件异常，请检查设置是否正确。')
    throw re
  }
  return condition
}

export { main }
