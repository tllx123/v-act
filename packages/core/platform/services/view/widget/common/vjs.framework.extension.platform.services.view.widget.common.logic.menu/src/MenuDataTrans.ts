import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import {
  ExpressionContext,
  ExpressionEngine as expressionEngine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { WidgetRenderer as widgetRenderer } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

let sandbox

export function initModule(sb) {
  sandbox = sb
}

let getMenuDataByRuleSet = function (widgetId) {
  let isAsync = false
  let isInRuleChainTransaction = false
  let widget = widgetContext.get(widgetId, 'widgetObj')
  let params = widget.Param && widget.Param.invokeParams
  let componentCode = scopeManager.getWindowScope().getComponentCode()
  let backVal = {}
  for (let i = 0, num = params.length; i < num; i++) {
    let param = params[i]
    if (param['paramType'] == 'expression') {
      let value = ''
      if (param['paramValue'] != '' && param['paramValue'] != null) {
        value = expressionEngine.execute({
          expression: param['paramValue'],
          context: new ExpressionContext()
        })
      }
      backVal[param['paramCode']] = value
    } else if (param['paramType'] == 'returnEntity') {
    }
  }

  // TODO
  let result = operationLib.executeRuleSet(
    {
      ruleSetCode: widget.ActivityAttribute,
      params: backVal
    },
    function (ruleSetResult) {
      if (ruleSetResult.data.result.menuJson != null) {
        let data = eval(ruleSetResult.data.result.menuJson.value)
        if (data && data.length > 0 && data[0].submenu) {
          widgetRenderer.executeWidgetRenderAction(
            widgetId,
            'setDataToMenu',
            data[0].submenu,
            data[1]
          )
        }
      }
    }
  )
}

export { getMenuDataByRuleSet }
