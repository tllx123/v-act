import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

let undefined
let undefined
let undefined
let undefined
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  let args = param.getArgs()
  if (args.length != 4)
    throw new Error(
      '函数[SetRecordValue]个数需要4个参数，当前参数个数：' + args.length
    )
  //获取路由上下文，函数里想执行一些表达式逻辑需要用到
  let routeContext = param.getRouteContext()

  let context = new ExpressionContext()
  context.setRouteContext(routeContext)

  //获取函数参数
  let tableName = args[0]
  let index = args[1]
  let fields = args[2]
  let values = args[3]

  if (tableName == null || tableName == '')
    throw new Error('函数[SetRecordValue]：第一个参数不能为空')
  if (index == null || index == '')
    throw new Error('函数[SetRecordValue]：第二个参数不能为空')
  if (fields == null)
    throw new Error('函数[SetRecordValue]：第三个参数不能为空')
  if (values == null)
    throw new Error('函数[SetRecordValue]：第四个参数不能为空')
  if (fields.length != values.length)
    throw new Error(
      '函数[SetRecordValue]：第三个参数的长度和第四个参数的长度不一致。\n第三个参数的长度：' +
        fields.length +
        ',第四个参数的长度：' +
        values.length
    )

  //获取数据源
  let datasource = GetDataSource(tableName, routeContext)
  //获取指定行记录
  let record = datasource.getRecordById(index)

  //给指定行赋值
  if (undefined != record && null != record) {
    for (let columnIndex = 0; columnIndex < fields.length; columnIndex++) {
      let destFieldName = fields[columnIndex]
      let srcVal = values[columnIndex]
      record.set(destFieldName, srcVal)
    }
    datasource.updateRecords({
      records: [record]
    })
  }
  return null
}
/*
 * 获取对应数据源
 * ds 实体表名称
 * routeContext 路由上下文
 * */
function GetDataSource(ds, routeContext) {
  //获取数据源
  let dsName = ds
  let datasource = null
  if (DBFactory.isDatasource(dsName)) {
    datasource = dsName
  } else {
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
  }
  if (!datasource) throw new Error('找不到函数[SetRecordValue]参数中的实体！')
  return datasource
}
export { main }
