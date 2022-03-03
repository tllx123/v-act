import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    routeContext = param.getRouteContext(),
    dsName = args && args.length == 2 ? args[0] : null,
    columnCode = args && args.length == 2 ? args[1] : null

  if (!dsName) {
    throw new Error('参数1实体变量表达式不能为空')
  }
  if (!columnCode) {
    throw new Error('参数2字段名称不能为空')
  }
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

  if (!records || records.length <= 0) return null

  let firstRow = records[0]
  let columnValue = firstRow.get(columnCode)

  return columnValue
}

export { main }
