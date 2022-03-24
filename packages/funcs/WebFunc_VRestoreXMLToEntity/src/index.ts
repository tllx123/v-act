/**
 *
 */
//规则主入口(必须有)
vds.import(
  'vds.exception.*',
  'vds.ds.*',
  'vds.expression.*',
  'vds.log.*',
  'vds.rpc.*'
)
const main = function (actionXML: string) {
  if (vds.object.isUndefOrNull(actionXML) || actionXML == '') {
    const exception = vds.exception.newConfigException(
      '[VRestoreXMLToEntity.main]执行失败，参数1:流程动作XML配置信息为空'
    )
    throw exception
  }
  actionXML = encodeURIComponent(actionXML)

  const expression = 'VRestoreXMLToEntity("' + actionXML + '")'

  let result = { success: false, data: { result: {} } }
  vds.rpc.callCommandSync('WebExecuteFormulaExpression', null, {
    isOperation: true,
    operationParam: {
      expression: expression
    },
    success: function (rs: { success: boolean; data: { result: any } }) {
      result = rs
    }
  })

  let tableDataMap = null
  if (result && result.success == true) {
    tableDataMap = result.data.result
  } else {
    const exception = vds.exception.newConfigException(
      '[VRestoreXMLToEntity.main]解析实体数据失败，result=' + result
    )
    throw exception
  }

  if (null != tableDataMap) {
    for (const tableName in tableDataMap) {
      const exists = GetDataSource(tableName)
      if (!exists) {
        vds.log.warn(
          '[VRestoreXMLToEntity.main]需要还原的表' + tableName + '不存在'
        )
        continue
      }
      const tableDatas = tableDataMap[tableName]

      //获取记录
      const loadRecords = createRecords({
        datasourceName: tableName,
        datas: tableDatas
      })
      // 加载数据
      loadRecordsToEntity({
        datasourceName: tableName,
        records: loadRecords
      })
    }
  }
}
//根据xml信息去生成记录数组
const createRecords = function (params: {
  datas: any[]
  datasourceName: string
}) {
  const datas = params.datas
  if (datas && datas.length > 0) {
    const datasource = GetDataSource(params.datasourceName) //获取对应的数据源
    if (!datasource) {
      return []
    }
    const rs = []
    for (let i = 0, l = datas.length; i < l; i++) {
      const data = datas[i]
      const record = datasource.createRecord()
      record.setData(data)
      rs.push(record)
    }
    return rs
  }
  return []
}

//将记录加载到实体里面
const loadRecordsToEntity = function (params: {
  records: any[]
  isAppend?: boolean
  datasourceName: string
}) {
  const records = params.records
  if (records && records.length > 0) {
    const datas = []
    const isAppend = params.hasOwnProperty('isAppend') ? params.isAppend : false
    const datasource = GetDataSource(params.datasourceName) //获取对应的数据源
    if (!datasource) {
      return
    }
    for (let i = 0, l = records.length; i < l; i++) {
      datas.push(records[i])
    }
    datasource.loadRecords(datas, {
      isAppend: isAppend
    })
  }
}
//获取数据源
const GetDataSource = function (ds: string) {
  const dsName = ds
  let datasource = null
  if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
    datasource = vds.ds.lookup(dsName)
  } else {
    datasource = vds.expression.execute(dsName)
  }

  if (!datasource) {
    //	throw new Error("找不到函数VRestoreXMLToEntity参数中的实体！");
    //	忽略不存在的实体，无需报错
    return null
  }
  return datasource
}

export { main }
