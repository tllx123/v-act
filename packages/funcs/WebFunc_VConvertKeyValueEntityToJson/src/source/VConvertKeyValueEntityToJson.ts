import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'

let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sb) {}

let main = function (param) {
  let args = param.getArgs()
  // 参数1：实体名称
  let entityCode = args[0]
  // 参数2：作为key的字段名
  let keyColumn = args[1]
  // 参数3：作为value的字段名
  let valueColumn = args[2]
  // 参数4：获取记录的方式0所有行/1选中行，默认为0
  let recordType = args[3]
  // 参数5：需要使用对象方式的key列表，逗号分隔
  let objKeyString = args[4]

  let records = []
  let routeContext = param.getRouteContext()
  let datasource = GetDataSource(entityCode, routeContext) //获取对应的数据源

  if (1 == recordType) records = datasource.getSelectedRecords().toArray()
  // 注意返回值对象有改变
  else records = datasource.getAllRecords().toArray()

  let objKeys = []
  if (objKeyString) objKeys = objKeyString.split(',')

  let object = {}
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    let key = record.get(keyColumn)
    let value = record.get(valueColumn)
    if (value && objKeys && objKeys.length > 0) {
      for (let j = 0; j < objKeys.length; j++) {
        let objKey = objKeys[j]
        if (objKey == key) value = jsonUtil.json2obj(value)
      }
    }
    object[key] = value
  }

  return jsonUtil.obj2json(object)
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
    throw new Error('找不到函数VConvertKeyValueEntityToJson参数中的实体！')
  return datasource
}
export { main }
