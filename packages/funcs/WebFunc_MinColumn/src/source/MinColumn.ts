import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    tableName = argsLen >= 1 ? args[0] : null,
    columnName = argsLen >= 2 ? args[1] : null

  //		var datasource = manager.lookup({
  //			"datasourceName": tableName
  //		});
  //获取数据源
  let routeContext = param.getRouteContext()
  let datasource = GetDataSource(tableName, routeContext)

  let records = datasource.getAllRecords()
  let resultValue = 0.0
  if (null != records && records.toArray().length > 0) {
    records = records.toArray()
    resultValue = records[0].get(columnName) * 1
    for (let i = 1; i < records.length; i++) {
      let record = records[i]
      let temValue = record.get(columnName) * 1
      let reg = /^(-?)[0-9]+(.[0-9]*)?$/
      if (reg.test(temValue)) {
        if (temValue * 1 < resultValue * 1) resultValue = temValue
      } else throw new Error('返回最小值列不是数字，请检查')
    }
  }
  return resultValue
}
function GetDataSource(ds, routeContext) {
  //获取数据源
  let dsName = ds
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
  if (!datasource) throw new Error('函数[MaxColumn]：找不到参数中的实体！')
  return datasource
}
export { main }
