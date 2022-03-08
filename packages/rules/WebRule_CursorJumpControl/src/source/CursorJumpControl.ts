import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sb) {}

const main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamObj = jsonUtil.json2obj(inParams)
  let widgetId = inParamObj['ControlCode']

  if (!widgetId) {
    throw new Error(
      '[CursorJumpControl.main]光标跳转规则中配置参数控件ID不能为空！ 。'
    )
  }

  widgetAction.executeWidgetAction(widgetId, 'setFocus', widgetId)
}

export { main }
