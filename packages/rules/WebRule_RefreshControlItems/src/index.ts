/**
 * 刷新控件候选项的值
 */
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
const vds = { expression, widget }

/**
 * 规则入口
 */
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      var inParamsObj = ruleContext.getVplatformInput()
      var widgetIds = inParamsObj['ControlCodes'] // 赋值字段的fieldName
      if (widgetIds != null && widgetIds != undefined && widgetIds.length > 0) {
        for (var i = 0; i < widgetIds.length; i++) {
          var widgetId = widgetIds[i]
          var value = vds.expression.execute(
            'GetDropDownData("' + widgetId + '", true)',
            {
              ruleContext: ruleContext
            }
          )
          vds.widget.execute(widgetId, 'loadData', [value])
        }
      }
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
export { main }
