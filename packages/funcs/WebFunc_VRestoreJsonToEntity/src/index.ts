/**
 *
 */
//规则主入口(必须有)
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'

const vds = { ds, expression, object, string, exception }

const main = function (json: string, entityCode: string) {
  const datasource = GetDataSource(entityCode)

  if (!json) return null

  const configs = vds.object.stringify(json)
  if (!configs || configs.length <= 0) {
    return null
  }

  const records = []
  for (let i = 0; i < configs.length; i++) {
    const config = configs[i]
    let id = vds.string.uuid()
    if (config.id && config.id != '') id = config['id']

    const record = datasource.createRecord()
    for (const field in config) {
      let _val = config[field]
      if (_val instanceof Array) _val = JSON.stringify(_val)
      record.set(field, _val)
    }
    records.push(record)
  }
  //		const datasource = manager.lookup({
  //			"datasourceName": entityCode
  //		});
  //const datasource = GetDataSource(entityCode)
  const rs = datasource.insertRecords(records)
  return rs
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
    const exception = vds.exception.newConfigException(
      '找不到函数VRestoreJsonToEntity参数中的实体！'
    )
    throw exception
  }
  return datasource
}

export { main }
