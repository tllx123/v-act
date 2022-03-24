/**
 *
 */
//规则主入口(必须有)
vds.import('vds.ds.*', 'vds.exception.*', 'vds.object.*')
const main = function (
  entityCode: string,
  keyColumn: string,
  valueColumn: string,
  recordType: number,
  objKeyString: string
) {
  let records = []
  const datasource = GetDataSource(entityCode) //获取对应的数据源

  if (1 == recordType) records = datasource.getSelectedRecords().toArray()
  // 注意返回值对象有改变
  else records = datasource.getAllRecords().toArray()

  let objKeys: string[] = []
  if (objKeyString) objKeys = objKeyString.split(',')

  const object = {}
  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    const key = record.get(keyColumn)
    let value = record.get(valueColumn)
    if (value && objKeys && objKeys.length > 0) {
      for (let j = 0; j < objKeys.length; j++) {
        const objKey = objKeys[j]
        if (objKey == key) value = vds.object.stringify(value)
      }
    }
    object[key] = value
  }

  return vds.string.toJson(object)
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
      '找不到函数VConvertKeyValueEntityToJson参数中的实体！'
    )
  }

  return datasource
}

export { main }
