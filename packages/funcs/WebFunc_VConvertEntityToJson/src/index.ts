//规则主入口(必须有)
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'

const vds = { ds, expression, exception, string, object }

const main = function (
  entityCode: string,
  recordType: number,
  objFieldString: string
) {
  let records = []
  //获取数据源
  const datasource = GetDataSource(entityCode)

  if (1 == recordType) records = datasource.getSelectedRecords().toArray()
  // 注意返回值对象有改变
  else records = datasource.getAllRecords().toArray()

  let objFields: string[] = []
  if (objFieldString) objFields = objFieldString.split(',')

  const dataMaps = []

  const metadata = datasource.getMetadata()
  const metaFields = metadata.getFields()

  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const dataMap = {}
    for (let j = 0; j < metaFields.length; j++) {
      const metaField = metaFields[j]
      const fieldCode = metaField.getCode()
      let fieldValue = record.get(fieldCode)
      // 存在对象字段的配置，对照字段并将值转换成obj
      if (fieldValue && objFields && objFields.length > 0) {
        for (let h = 0; h < objFields.length; h++) {
          const objField = objFields[h]
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

  const json = vds.string.toJson(dataMaps)
  return json
}

const GetDataSource = function (ds: string) {
  //获取数据源
  const dsName = ds
  let datasource = null
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
