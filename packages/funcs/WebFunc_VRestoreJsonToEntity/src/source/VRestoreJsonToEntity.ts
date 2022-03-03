import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { UUID as uuid } from '@v-act/vjs.framework.extension.util'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
let datasource
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs()
  // 参数1：Json字符串
  let json = args[0]
  // 参数2：还原实体名称
  let entityCode = args[1]
  let routeContext = param.getRouteContext()
  let datasource = GetDataSource(entityCode, routeContext)

  if (!json) return null

  let configs = jsonUtil.json2obj(json)
  if (!configs || configs.length <= 0) {
    return null
  }

  let records = []
  for (let i = 0; i < configs.length; i++) {
    let config = configs[i]
    let id = uuid.generate()
    if (config.id && config.id != '') id = config['id']

    let record = datasource.createRecord()
    for (let field in config) {
      let _val = config[field]
      if (_val instanceof Array) _val = JSON.stringify(_val)
      record.set(field, _val)
    }
    records.push(record)
  }
  //		var datasource = manager.lookup({
  //			"datasourceName": entityCode
  //		});
  let datasource = GetDataSource(entityCode, routeContext)
  let rs = datasource.insertRecords({
    records: records
  })
  return rs
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
  if (!datasource)
    throw new Error('找不到函数VRestoreJsonToEntity参数中的实体！')
  return datasource
}
export { main }
