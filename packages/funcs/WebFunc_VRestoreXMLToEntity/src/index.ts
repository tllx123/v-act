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
var main = function (actionXML) {
  if (vds.object.isUndefOrNull(actionXML) || actionXML == '') {
    var exception = vds.exception.newConfigException(
      '[VRestoreXMLToEntity.main]执行失败，参数1:流程动作XML配置信息为空'
    )
    throw exception
  }
  actionXML = encodeURIComponent(actionXML)

  var expression = 'VRestoreXMLToEntity("' + actionXML + '")'

  var result
  vds.rpc.callCommandSync('WebExecuteFormulaExpression', null, {
    isOperation: true,
    operationParam: {
      expression: expression
    },
    success: function (rs) {
      result = rs
    }
  })

  var tableDataMap = null
  if (result && result.success == true) {
    tableDataMap = result.data.result
  } else {
    var exception = vds.exception.newConfigException(
      '[VRestoreXMLToEntity.main]解析实体数据失败，result=' + result
    )
    throw exception
  }

  if (null != tableDataMap) {
    for (var tableName in tableDataMap) {
      var exists = GetDataSource(tableName)
      if (!exists) {
        vds.log.warn(
          '[VRestoreXMLToEntity.main]需要还原的表' + tableName + '不存在'
        )
        continue
      }
      var tableDatas = tableDataMap[tableName]

      //获取记录
      var loadRecords = createRecords({
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
var createRecords = function (params) {
  var datas = params.datas
  if (datas && datas.length > 0) {
    var datasource = GetDataSource(params.datasourceName) //获取对应的数据源
    if (!datasource) {
      return []
    }
    var rs = []
    for (var i = 0, l = datas.length; i < l; i++) {
      var data = datas[i]
      var record = datasource.createRecord()
      record.setData(data)
      rs.push(record)
    }
    return rs
  }
  return []
}

//将记录加载到实体里面
var loadRecordsToEntity = function (params) {
  var records = params.records
  if (records && records.length > 0) {
    var datas = []
    var isAppend = params.hasOwnProperty('isAppend') ? params.isAppend : false
    var datasource = GetDataSource(params.datasourceName) //获取对应的数据源
    if (!datasource) {
      return
    }
    for (var i = 0, l = records.length; i < l; i++) {
      datas.push(records[i])
    }
    datasource.loadRecords(datas, {
      isAppend: isAppend
    })
  }
}
//获取数据源
var GetDataSource = function (ds) {
  var dsName = ds
  var datasource = null
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
