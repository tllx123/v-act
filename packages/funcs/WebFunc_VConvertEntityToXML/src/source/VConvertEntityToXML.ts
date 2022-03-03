import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import { DatasourceManager as dbManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0

  if (argsLen <= 0)
    throw new Error(
      '[VConvertEntityToXML.main]执行失败，必须配置至少一个参数作为表名'
    )

  let tableDataMap = {}
  for (let i = 0; i < argsLen; i++) {
    let tableName = args[i]
    let routeContext = param.getRouteContext()
    let db = GetDataSource(tableName, routeContext) //获取对应的数据源

    let dbSeriallize = db.serialize()
    tableDataMap[tableName] = dbSeriallize
  }

  let jsonStr = jsonUtil.obj2json(tableDataMap)
  jsonStr = encodeURIComponent(jsonStr)

  let expression = 'VConvertEntityToXML("' + jsonStr + '")'
  let scope = scopeManager.getWindowScope()
  let windowCode = scope.getWindowCode()
  let result = operation.evalExpression({
    windowCode: windowCode,
    expression: expression
  })
  if (result && result.success == true) return result.data.result
  else
    throw new Error(
      '[VConvertEntityToXML.main]解析实体数据失败，result=' + result
    )
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
      datasource = dbManager.lookup({
        datasourceName: dsName
      })
    } else {
      datasource = engine.execute({
        expression: dsName,
        context: context
      })
    }
  }
  if (!datasource)
    throw new Error('找不到函数VConvertEntityToXML参数中的实体！')
  return datasource
}

export { main }
