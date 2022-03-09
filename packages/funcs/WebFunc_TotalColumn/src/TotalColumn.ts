import { Math as mathUtil } from '@v-act/vjs.framework.extension.util.math'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'

let main = function (param: FunctionContext) {
  let args = param.getArgs(),
    routeContext = param.getRouteContext(),
    argsLen = args ? args.length : 0,
    dsName = argsLen >= 1 ? args[0] : null,
    columnName = argsLen >= 2 ? args[1] : null
  if (dsName == null) throw new Error('实体名称不允许为空，请检查')
  if (columnName == null) throw new Error('实体字段名称不允许为空，请检查')
  let context = new ExpressionContext()
  context.setRouteContext(routeContext)
  let datasource = null
  if (DBFactory.isDatasource(dsName)) {
    datasource = dsName
  } else {
    let context = new ExpressionContext()
    context.setRouteContext(routeContext)
    if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
      datasource = manager.lookup({
        datasourceName: dsName
      })
    } else {
      datasource = engine.execute({
        expression: dsName,
        context: context
      })
    }
  }
  if (!datasource) throw new Error('实体变量无法识别！')
  let records = datasource.getAllRecords()
  let resultValue = 0.0
  if (null != records && records.toArray().length > 0) {
    records = records.toArray()
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let temValue = record.get(columnName) * 1
      //var reg = /^(-?)[0-9]+(.[0-9]*)?$/;
      if (mathUtil.judgeNumExt(temValue)) {
        // 处理js浮点问题
        resultValue = calculatorSum(resultValue, temValue)
      } else {
        //不是数字型值的不处理
        continue
      }
    }
  }
  return resultValue
}

let calculatorSum = function (num1: number, num2: number) {
  let multiplier1 = parseFloat(multiplier(num1)),
    multiplier2 = parseFloat(multiplier(num2)),
    multiplierTmp = multiplier1 > multiplier2 ? multiplier1 : multiplier2

  return (num1 * multiplierTmp + num2 * multiplierTmp) / multiplierTmp
}

let multiplier = function (num: number | string) {
  num = Number(num) + ''
  let position = num.indexOf('.') + 1,
    len = num.length
  let result = '1'
  for (let tmpLen = len - position, i = 0; i < tmpLen; i++) {
    result += '0'
  }
  return result
}

export { main }
