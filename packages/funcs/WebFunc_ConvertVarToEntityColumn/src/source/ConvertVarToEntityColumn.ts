import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空

export function initModule(sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  let FUNCANME = '前台函数[ConvertVarToEntityColumn]:'
  //获取函数传入的参数
  let args = param.getArgs()
  if (!CheckParamNum(FUNCANME, args, 4)) return false
  let routeContext = param.getRouteContext() //获取路由上下文，函数里想执行一些表达式逻辑需要用到
  //获取参数示例：
  let sourceValue = args[0] //获取函数第一个参数
  let entityCode = args[1] //获取函数第二个参数
  let fieldCode = args[2] //获取函数第三个参数
  let separate = args[3] //获取函数第四个参数
  if (undefined == sourceValue || null == sourceValue || sourceValue == '') {
    log.log(
      FUNCANME + '来源字符串为空，不做处理！sourceValue：[' + sourceValue + ']'
    )
    return false
  }
  //获取实体对象
  let datasource = GetDataSource(entityCode, routeContext)
  if (!datasource) {
    DWException(FUNCANME + '找不到实体[' + ds + ']')
    return false
  }
  let records = []
  let singleItem = sourceValue.split(separate)
  for (let i = 0; i < singleItem.length; i++) {
    let emptyRecord = datasource.createRecord()
    emptyRecord.set(fieldCode, singleItem[i])
    records.push(emptyRecord)
  }
  datasource.insertRecords({
    records: records,
    position: null
  })
}
//异常处理方法
function DWException(tmpvar) {
  let exception = factory.create({
    type: factory.TYPES.Business,
    message: tmpvar
  })
  exception.handle()
  //    	throw new Error(tmpvar);
}
/*
 * 判断参数个数
 * name 参数名称
 * paramArray 参数值
 * */
function CheckParamNum(funName, paramArray, targetNum) {
  if (paramArray.length != targetNum) {
    DWException(
      funName +
        '需要' +
        targetNum +
        '个参数，当前参数个数：' +
        paramArray.length
    )
    return false
    //			throw new Error(funName+"需要"+targetNum+"个参数，当前参数个数："+paramArray.length);
  }
  return true
}
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
  return datasource
}
export { main }
