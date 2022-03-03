import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'

let undefined

exports.initModule = function (sandbox) {}

let invoke = function (
  nativeMethod,
  methodName,
  inputParams,
  config,
  routeContext
) {
  let inParam = null
  let tempParm = {}
  if (inputParams != null) {
    for (let i = 0; i < inputParams.length; i++) {
      inputParam = inputParams[i]
      let parmValue
      let paramCode = inputParam['paramCode']
      let parmTempValue = inputParam['paramValue']
      let paramType = inputParam['paramType']
      if (paramType == 'expression') {
        //parmValue = formulaUtil.evalExpression(parmTempValue);
        let context = new ExpressionContext()
        context.setRouteContext(routeContext)
        parmValue = formulaUtil.execute({
          expression: parmTempValue,
          context: context
        })
      } else {
        parmValue = parmTempValue
      }
      tempParm[paramCode] = parmValue
    }
    inParam = jsonUtil.obj2json(tempParm)
  }

  if (window.vjsBridge) {
    return vjsBridge.method[nativeMethod](methodName, inParam)
  }
}
export { invoke }
