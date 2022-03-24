/**
 *	给循环变量赋值
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
/**
 * 规则入口
 */
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'

const vds = { exception, expression }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      const inParamObj = ruleContext.getVplatformInput()
      const varCode = inParamObj.LoopVar
      const entity = inParamObj.LoopEntity
      const fields = inParamObj.Fields
      const datasource = ruleContext.getForEachObj(varCode)
      if (datasource) {
        const record = ruleContext.getForEachVar(varCode)
        if (fields && fields.length > 0) {
          for (let i = 0, l = fields.length; i < l; i++) {
            const fieldInfo = fields[i]
            const value = vds.expression.execute(fieldInfo.Source, {
              ruleContext: ruleContext
            })
            record.set(fieldInfo.LoopVarField, value)
          }
          datasource.updateRecords([record])
        }
        resolve()
      } else {
        reject(vds.exception.newConfigException('实体[' + entity + ']不存在'))
        return
      }
    } catch (err) {
      reject(err)
    }
  })
}
export { main }
