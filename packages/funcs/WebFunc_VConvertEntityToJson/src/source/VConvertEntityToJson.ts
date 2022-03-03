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
  // 参数2：获取记录的方式0所有行/1选中行，默认为0
  let recordType = args[1]
  // 参数3：需要变成对象的字段列表，逗号隔开
  let objFieldString = args[2]

  let records = []
  let routeContext = param.getRouteContext()
  //获取数据源
  let datasource = GetDataSource(entityCode, routeContext)

  if (1 == recordType) records = datasource.getSelectedRecords().toArray()
  // 注意返回值对象有改变
  else records = datasource.getAllRecords().toArray()

  let objFields = []
  if (objFieldString) objFields = objFieldString.split(',')

  let dataMaps = []

  let metadata = datasource.getMetadata()
  let metaFields = metadata.getFields()

  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    let dataMap = {}
    for (let j = 0; j < metaFields.length; j++) {
      let metaField = metaFields[j]
      let fieldCode = metaField.getCode()
      let fieldValue = record.get(fieldCode)
      // 存在对象字段的配置，对照字段并将值转换成obj
      if (fieldValue && objFields && objFields.length > 0) {
        for (let h = 0; h < objFields.length; h++) {
          let objField = objFields[h]
          if (objField == fieldCode) {
            fieldValue = jsonUtil.json2obj(fieldValue)
            dataMap[fieldCode] = fieldValue
            break
          }
        }
      }
      // 无对象字段配置，输出全部字段
      dataMap[fieldCode] = fieldValue
    }
    dataMaps.push(dataMap)
  }

  let json = jsonUtil.obj2json(dataMaps)
  return json
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
    throw new Error('找不到函数VConvertEntityToJson参数中的实体！')
  return datasource
}

export { main }
