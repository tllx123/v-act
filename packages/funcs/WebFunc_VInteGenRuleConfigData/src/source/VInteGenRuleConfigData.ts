import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as expressionEngine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'

import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'

//主入口(必须有)
let main = function (param: FunctionContext) {
  let args = param.getArgs()
  let ruleCode = args.length > 0 ? args[0] : null

  let expression = 'VInteGetRuleConfigDataDefine("' + ruleCode + '")'
  let scope = scopeManager.getWindowScope()
  let currentWindowCode = scope.getWindowCode()
  let result = operation.evalExpression({
    windowCode: currentWindowCode,
    expression: expression
  })
  let defines = null
  if (result && result.success == true) {
    defines = result.data.result
  } else {
    throw new Error(
      '[VInteGenRuleConfigData.main]获取规则定义数据失败，result=' + result
    )
  }

  if (!defines) {
    return null
  }

  let entityCodes = []
  for (let i = 0; i < defines.length; i++) {
    let define = defines[i]
    let entityCode = define.entityCode
    let entityName = define.entityName

    entityCodes.push(entityCode)
  }

  //
  let expression = 'VConvertEntityToXML('
  for (let i = 0; i < entityCodes.length; i++) {
    let entityCode = entityCodes[i]
    let entityCodeStr = '"' + entityCode + '"'

    if (i != entityCodes.length - 1) {
      entityCodeStr += ','
    }
    expression += entityCodeStr
  }
  expression += ')'

  let formulaContext = new ExpressionContext()
  let xml = expressionEngine.execute({
    expression: expression,
    context: formulaContext
  })
  return xml
}
export { main }
