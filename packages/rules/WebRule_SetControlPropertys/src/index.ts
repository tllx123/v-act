import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
/**
 * 规则入口
 */
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
/**
 * 控件属性设置
 */
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as widget from '@v-act/vjs.framework.extension.platform.services.integration.vds.widget'

const vds = { string, widget, exception, expression }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      const inParamsObj = ruleContext.getVplatformInput()
      const conditions = inParamsObj['condition']
      if (!conditions || conditions.length < 1) {
        resolve()
        return
      }
      for (let tmp = 0; tmp < conditions.length; tmp++) {
        const condition = conditions[tmp]
        const formula = condition['name'] //条件
        const items = condition['items']
        let isFormula = false
        try {
          isFormula = vds.expression.execute(formula, {
            ruleContext: ruleContext
          })
        } catch (e) {
          reject(
            vds.exception.newConfigException(
              '表达式' + formula + '不正确，请检查！'
            )
          )
          return
        }
        if (isFormula !== true || !items || items.length < 1) {
          continue
        }
        for (let index = 0; index < items.length; index++) {
          const item = items[index]
          const controlID = item['controlCode'] //控件ID
          const propertyCode = item['propertyCode'] // 要更改的属性ID
          let values = item['values'] //期望值
          const valueType = item['valuetype'] //期望值类型
          //根据属性ID得到属性名PropertyCode
          if (!vds.string.isEmpty(values) && valueType == '1') {
            values = vds.expression.execute(values, {
              ruleContext: ruleContext
            })
          }
          vds.widget.setProperty(controlID, propertyCode, values)
        }
      }
      resolve()
    } catch (err) {
      reject(err)
    }
  })
}
export { main }
