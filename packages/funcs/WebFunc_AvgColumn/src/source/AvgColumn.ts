import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { StringUtil as stringUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
let undefined
let undefined
let sandbox
let undefined
let undefined
let undefined

exports.initModule = function (sb) {
  sandbox = sb
}
let main = function (param) {
  // 从DB中取值
  let args = param.getArgs()
  let dsName = args[0]
  let columnName = args[1]
  let datasource = null
  //		var datasource = manager.lookup({
  //			"datasourceName" : tableName
  //		});
  if (dsName == null) throw new Error('实体名称不允许为空，请检查')
  if (columnName == null) throw new Error('实体字段名称不允许为空，请检查')
  let routeContext = param.getRouteContext()
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

  let records = datasource.getAllRecords().toArray()
  let resultValue = 0.0
  let avgNum = 1
  if (null != records && records.length > 0) {
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let temValue = record.get(columnName)
      if (stringUtil.isEmpty(temValue)) {
        temValue = 0
      }
      temValue = temValue * 1
      if (mathUtil.judgeNumExt(temValue)) {
        resultValue = resultValue + temValue
      } else {
        throw new Error('平均值列不是数字，请检查')
      }
    }
    avgNum = records.length
  }
  return mathUtil.divide(resultValue, avgNum)
}

export { main }
