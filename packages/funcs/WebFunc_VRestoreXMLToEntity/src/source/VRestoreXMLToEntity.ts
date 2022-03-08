import { FunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { RemoteOperation as operation } from '@v-act/vjs.framework.extension.platform.services.domain.operation'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

const main = function (param: FunctionContext) {
  let args = param.getArgs(),
    argsLen = args ? args.length : 0,
    actionXML = argsLen >= 1 ? args[0] : null

  if (!actionXML || actionXML == '')
    throw new Error(
      '[VRestoreXMLToEntity.main]执行失败，参数1:流程动作XML配置信息为空'
    )

  actionXML = encodeURIComponent(actionXML)

  let expression = 'VRestoreXMLToEntity("' + actionXML + '")'
  let scope = scopeManager.getWindowScope()
  let windowCode = scope.getWindowCode()

  let result = operation.evalExpression({
    windowCode: windowCode,
    expression: expression
  })
  let tableDataMap = null
  if (result && result.success == true) tableDataMap = result.data.result
  else
    throw new Error(
      '[VRestoreXMLToEntity.main]解析实体数据失败，result=' + result
    )

  if (null != tableDataMap) {
    for (let tableName in tableDataMap) {
      let routeContext = param.getRouteContext()
      let exists = GetDataSource(tableName, routeContext)
      if (!exists) {
        log.warn(
          '[VRestoreXMLToEntity.main]需要还原的表' + tableName + '不存在'
        )
        continue
      }
      let tableDatas = tableDataMap[tableName]
      let routeContext = param.getRouteContext()

      //获取记录
      let loadRecords = createRecords(
        {
          datasourceName: tableName,
          datas: tableDatas
        },
        routeContext
      )
      // 加载数据
      loadRecordsToEntity(
        {
          datasourceName: tableName,
          records: loadRecords
        },
        routeContext
      )
    }
  }
}
//根据xml信息去生成记录数组
function createRecords(params, routeContext) {
  let datas = params.datas
  if (datas && datas.length > 0) {
    let datasource = GetDataSource(params.datasourceName, routeContext) //获取对应的数据源
    if (!datasource) {
      return []
    }
    let rs = []
    for (let i = 0, l = datas.length; i < l; i++) {
      let data = datas[i]
      let record = datasource.createRecord()
      record.setDatas(data)
      rs.push(record)
    }
    return rs
  }
  return []
}
//将记录加载到实体里面
function loadRecordsToEntity(params, routeContext) {
  let records = params.records
  if (records && records.length > 0) {
    let datas = []
    let isAppend = params.hasOwnProperty('isAppend') ? params.isAppend : false
    let datasource = GetDataSource(params.datasourceName, routeContext) //获取对应的数据源
    if (!datasource) {
      return
    }
    for (let i = 0, l = records.length; i < l; i++) {
      datas.push(records[i].toMap())
    }
    datasource.load({
      datas: datas,
      isAppend: isAppend
    })
  }
}
//获取数据源
function GetDataSource(ds, routeContext) {
  let dsName = ds
  let datasource = null
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
  if (!datasource) {
    //	throw new Error("找不到函数VRestoreXMLToEntity参数中的实体！");
    //	忽略不存在的实体，无需报错
    return null
  }
  return datasource
}
export { main }
