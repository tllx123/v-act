import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'

//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空

export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  /*
   * 先根据参数获取数据眼
   * 再调用数据源的getSelectedRecords方法获取选中行
   * 最后调用选中行的getSysId方法获取Id的值
   * */
  let result = ''
  //获取函数传入的参数
  let args = param.getArgs()
  if (args.length != 1) {
    HandleException(
      '函数[GetCurrentRecordIndex]个数需要1个参数，当前参数个数：' + args.length
    )
    return ''
  }
  let routeContext = param.getRouteContext() //获取路由上下文，函数里想执行一些表达式逻辑需要用到
  let tableName = args[0] //获取函数第一个参数
  if (tableName == null || tableName == '') {
    HandleException('函数[GetCurrentRecordIndex]参数不能为空')
    return ''
  }

  //获取数据源
  let datasource = GetDataSource(tableName, routeContext)
  if (datasource == null) return ''
  //获取选中行记录
  let records = datasource.getSelectedRecords().toArray()

  if (records.length > 0) {
    result = records[0].getSysId()
  } else {
    HandleException(
      '函数[GetCurrentRecordIndex]获取不到选中记录，选中记录行数：' +
        records.length
    )
    return ''
  }
  return result
}
/*
 * 获取对应数据源
 * ds 实体表名称
 * routeContext 路由上下文
 * */
function GetDataSource(ds, routeContext) {
  //获取数据源
  /*
   * 先根据名称直接判断是不是属于数据源对象
   * 再判断是否是活动集实体
   * 一般实体使用DatasourceManager服务的lookup方法
   * 活动集实体使用ExpressionEngine的execute方法。
   * */
  let dsName = ds
  let datasource = null
  if (DBFactory.isDatasource(dsName)) {
    //判断是否已经属于数据源对象
    datasource = dsName
  } else {
    let context = new ExpressionContext()
    context.setRouteContext(routeContext)
    if (dsName.indexOf('.') == -1 && dsName.indexOf('@') == -1) {
      //不是活动集实体
      datasource = manager.lookup({
        datasourceName: dsName
      })
    } else {
      //是活动集实体
      datasource = engine.execute({
        expression: dsName,
        context: context
      })
    }
  }
  if (!datasource) {
    HandleException('找不到函数[GetCurrentRecordIndex]参数中的实体！')
    return null
  }
  return datasource
}
/*
 * 异常处理方法
 * tmpvar：异常信息
 * */
function HandleException(tmpvar) {
  let exception = factory.create({
    type: factory.TYPES.Business,
    message: tmpvar
  })
  exception.handle()
}
export { main }
