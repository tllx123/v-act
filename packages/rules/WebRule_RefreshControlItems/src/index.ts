/**
 * 刷新控件候选项的值
 */
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'
const vds = { expression, widget }

/**
 * 规则入口
 */
const main = function (ruleContext) {
  return new Promise(function (resolve, reject) {
    try {
      var inParamsObj = ruleContext.getVplatformInput()
      var widgetIds = inParamsObj['ControlCodes'] // 赋值字段的fieldName
      if (widgetIds != null && widgetIds != undefined && widgetIds.length > 0) {
        for (var i = 0; i < widgetIds.length; i++) {
          var widgetId = widgetIds[i]
          var value = vds.expression.execute(
            'GetDropDownData("' + widgetId + '", true)',
            {
              context: ruleContext
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
