/**
 * 执行表达式
 */
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'

const vds = { expression }

const main = function (expressionSrc: string) {
  var value = vds.expression.execute(expressionSrc)
  return value
}
export { main }
