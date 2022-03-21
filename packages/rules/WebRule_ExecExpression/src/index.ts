/**
 * 执行函数/表达式
 */
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'

const vds = { expression }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      var input: Record<string, any> = ruleContext.getVplatformInput()
      var expression: string = input['expression'] // 函数/表达式
      var retValue: string = vds.expression.execute(expression, {
        ruleContext: ruleContext
      })
      ruleContext.setResult('retValue', retValue + '')
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}

export { main }
