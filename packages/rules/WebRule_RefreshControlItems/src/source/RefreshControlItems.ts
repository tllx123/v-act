import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sBox) {}

const main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let widgetIds = inParamsObj['ControlCodes'] // 赋值字段的fieldName
  if (widgetIds != null && widgetIds != undefined && widgetIds.length > 0) {
    for (let i = 0; i < widgetIds.length; i++) {
      let widgetId = widgetIds[i]
      let context = new ExpressionContext()
      context.setRouteContext(ruleContext.getRouteContext())
      let value = engine.execute({
        expression: 'GetDropDownData("' + widgetId + '", true)',
        context: context
      })
      widgetAction.executeWidgetAction(widgetId, 'loadData', value)
    }
  }
}

export { main }
