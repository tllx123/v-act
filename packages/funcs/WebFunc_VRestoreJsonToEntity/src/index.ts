/**
 *
 */
//规则主入口(必须有)
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
const vds = { ds, expression, object, string }

const main = function (json, entityCode) {
  var datasource = GetDataSource(entityCode)

  if (!json) return null

  var configs = vds.object.stringify(json)
  if (!configs || configs.length <= 0) {
    return null
  }

  var records = []
  for (var i = 0; i < configs.length; i++) {
    var config = configs[i]
    var id = vds.string.uuid()
    if (config.id && config.id != '') id = config['id']

    var record = datasource.createRecord()
    for (var field in config) {
      var _val = config[field]
      if (_val instanceof Array) _val = JSON.stringify(_val)
      record.set(field, _val)
    }
    records.push(record)
  }
  //		var datasource = manager.lookup({
  //			"datasourceName": entityCode
  //		});
  var datasource = GetDataSource(entityCode)
  var rs = datasource.insertRecords(records)
  return rs
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
    var exception = vds.exception.newConfigException(
      '找不到函数VRestoreJsonToEntity参数中的实体！'
    )
    throw exception
  }
  return datasource
}

export { main }
