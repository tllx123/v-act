/**
 *
 */
//规则主入口(必须有)
vds.import('vds.ds.*', 'vds.exception.*', 'vds.object.*')
var main = function (
  entityCode,
  keyColumn,
  valueColumn,
  recordType,
  objKeyString
) {
  var records = []
  var datasource = GetDataSource(entityCode) //获取对应的数据源

  if (1 == recordType) records = datasource.getSelectedRecords().toArray()
  // 注意返回值对象有改变
  else records = datasource.getAllRecords().toArray()

  var objKeys = []
  if (objKeyString) objKeys = objKeyString.split(',')

  var object = {}
  for (var i = 0; i < records.length; i++) {
    var record = records[i]
    var key = record.get(keyColumn)
    var value = record.get(valueColumn)
    if (value && objKeys && objKeys.length > 0) {
      for (var j = 0; j < objKeys.length; j++) {
        var objKey = objKeys[j]
        if (objKey == key) value = vds.object.stringify(value)
      }
    }
    object[key] = value
  }

  return vds.string.toJson(object)
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
      '找不到函数VConvertKeyValueEntityToJson参数中的实体！'
    )
  }

  return datasource
}

export { main }
