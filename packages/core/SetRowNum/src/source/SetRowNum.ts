import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
//初始化vjs模块，如果规则逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
let undefined
let undefined
let undefined
exports.initModule = function (sb) {}

//规则主入口(必须有)
let main = function (param) {
  let args = param.getArgs()
  //var routeContext = param.getRouteContext(); //获取路由上下文，函数里想执行一些表达式逻辑需要用到
  //获取参数示例：
  if (args.length != 2) {
    throw new Error('参数个数不正确')
  }
  let dsName = args[0] //获取函数第一个参数
  let columnName = args[1] //获取函数第二个参数
  //...
  //根据参数实现函数处理逻辑
  //todo:
  let records
  let datasource = null

  let routeContext = param.getRouteContext()
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
  if (!datasource) throw new Error('实体变量无法识别！')
  records = datasource.getAllRecords()
  let fields = records.getMetadata().getFields()
  let isExists = false
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i]
    if (columnName == field['code']) {
      isExists = true
    }
  }
  if (isExists) {
    if (null != records && records.toArray().length > 0) {
      records = records.toArray()
      for (let i = 0; i < records.length; i++) {
        let record = records[i]
        //				var id = record.get("id");
        //				var rownum = datasource.getIndexById(id);
        let rownum = i
        record.set(columnName, rownum + 1)
      }
    }
    datasource.updateRecords({
      records: records
    })
  }
}

export { main }
