/**
 *
 */
//规则主入口(必须有)
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as string from '@v-act/vjs.framework.extension.platform.services.integration.vds.string'
import * as rpc from '@v-act/vjs.framework.extension.platform.services.integration.vds.rpc'
const vds = { object, ds, exception, string, rpc }

const main = function () {
  if (vds.object.isUndefOrNull(arguments) || arguments.length <= 0) {
    var exception = vds.exception.newConfigException(
      '[VConvertEntityToXML.main]执行失败，必须配置至少一个参数作为表名'
    )
    throw exception
  }

  var tableDataMap = {}
  for (var i = 0; i < arguments.length; i++) {
    var tableName = arguments[i]
    var db = GetDataSource(tableName) //获取对应的数据源

    var dbSeriallize = db.serialize()
    tableDataMap[tableName] = dbSeriallize
  }

  var jsonStr = vds.string.toJson(tableDataMap)
  jsonStr = encodeURIComponent(jsonStr)

  var expression = 'VConvertEntityToXML("' + jsonStr + '")'
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
  if (result && result.success == true) {
    return result.data.result
  } else {
    var exception = vds.exception.newConfigException(
      '[VConvertEntityToXML.main]解析实体数据失败，result=' + result
    )
    throw exception
  }
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
      '找不到函数VConvertEntityToXML参数中的实体！'
    )
    throw exception
  }
  return datasource
}

export { main }
