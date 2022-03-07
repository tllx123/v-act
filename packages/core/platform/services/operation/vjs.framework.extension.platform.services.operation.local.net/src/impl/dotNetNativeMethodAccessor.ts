import {
  ExpressionContext,
  ExpressionEngine as formulaUtil
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sandbox) {}

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
