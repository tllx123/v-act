/**
 * 执行函数/表达式
 */
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
const vds = { expression }

const main = function (ruleContext) {
  return new Promise(function (resolve, reject) {
    try {
      var input = ruleContext.getVplatformInput()
      var expression = input['expression'] // 函数/表达式
      var retValue = vds.expression.execute(expression, {
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
