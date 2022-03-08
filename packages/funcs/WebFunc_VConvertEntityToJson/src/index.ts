//规则主入口(必须有)
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
const vds = { ds, expression, exception, string, object }

const main = function (entityCode, recordType, objFieldString) {
  var records = []
  //获取数据源
  var datasource = GetDataSource(entityCode)

  if (1 == recordType) records = datasource.getSelectedRecords().toArray()
  // 注意返回值对象有改变
  else records = datasource.getAllRecords().toArray()

  var objFields = []
  if (objFieldString) objFields = objFieldString.split(',')

  var dataMaps = []

  var metadata = datasource.getMetadata()
  var metaFields = metadata.getFields()

  for (var i = 0; i < records.length; i++) {
    var record = records[i]
    var dataMap = {}
    for (var j = 0; j < metaFields.length; j++) {
      var metaField = metaFields[j]
      var fieldCode = metaField.getCode()
      var fieldValue = record.get(fieldCode)
      // 存在对象字段的配置，对照字段并将值转换成obj
      if (fieldValue && objFields && objFields.length > 0) {
        for (var h = 0; h < objFields.length; h++) {
          var objField = objFields[h]
          if (objField == fieldCode) {
            fieldValue = vds.object.stringify(fieldValue)
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

  var json = vds.string.toJson(dataMaps)
  return json
}

var GetDataSource = function (ds) {
  //获取数据源
  var dsName = ds
  var datasource = null
  if (vds.ds.isDatasource(dsName)) {
    datasource = dsName
  } else {
    if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
      datasource = vds.ds.lookup(dsName)
    } else {
      datasource = vds.expression.execute(dsName)
    }
  }

  if (!datasource) {
    throw vds.exception.newConfigException(
      '找不到函数VConvertEntityToJson参数中的实体！'
    )
  }

  return datasource
}

export { main }
