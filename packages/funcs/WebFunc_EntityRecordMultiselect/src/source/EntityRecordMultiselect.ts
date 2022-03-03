import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { DatasourceFactory as DBFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
let undefined
let ERRORNAME
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  ERRORNAME = '函数[实体记录多选]'
  //获取函数传入的参数
  let args = param.getArgs()

  //判断参数个数
  //		CheckParamNum(args,4);
  if (args.length != 3 && args.length != 4 && args.length != 5)
    HandleException('需要3至5个参数，当前参数个数：' + args.length)

  //获取参数
  let param1 = args[0] //获取函数第一个参数
  let param2 = args[1] //获取函数第二个参数
  let param3 = args[2] //获取函数第三个参数
  let param4 = args.length >= 4 ? args[3] : '' //获取函数第四个参数
  let param5 = args.length == 5 ? args[4] : 'select' //参数5：操作类型，select：选中匹配的记录，unselect：取消选中匹配的记录，该参数忽略时，默认值为select（字符串类型）；

  if (param2 == null || param2 == '') {
    log.warn(ERRORNAME + '需要选中的记录为空，所以不作任何处理！')
    return null
  } else {
    //判断参数是否为空
    CheckParamEmpty('第一个参数', param1)
    CheckParamEmpty('第三个参数', param3)

    //此方法支持获取不同类型的数据源
    //			var routeContext = param.getRouteContext();
    //			var datasource = GetDataSource(param1,param);

    //函数目前只支持界面实体
    let datasource = manager.lookup({
      datasourceName: param1
    })
    if (!datasource) HandleException('找不到界面实体-[' + param1 + ']')
    if (
      datasource &&
      datasource.getAllRecords().toArray() &&
      datasource.getAllRecords().toArray().length > 0
    ) {
      let selectRecodeArray = []
      if (param4 != null && param4 != '') {
        selectRecodeArray = param2.split(param4)
      } else {
        selectRecodeArray.push(param2)
      }
      let sourceRecordArray = datasource.getAllRecords().toArray()
      if (selectRecodeArray) {
        if (selectRecodeArray.length > 1) datasource.markMultipleSelect(true) //设置数据源为多选
        let needRecords = [] //保存需要选中的记录
        let recordIndex = 0 //记录数，做下标用
        for (let i = 0; i < sourceRecordArray.length; i++) {
          let targetFileValue = sourceRecordArray[i].get(param3)
          if (targetFileValue == null || targetFileValue == '') {
            log.log(
              ERRORNAME +
                '匹配的数据为空，不作处理。该数据id：' +
                sourceRecordArray[i].getSysId()
            )
          } else {
            if (selectRecodeArray.indexOf(targetFileValue) != -1) {
              needRecords[recordIndex] = sourceRecordArray[i]
              recordIndex++
            }
          }
        }
        let resultParam = {}
        resultParam['records'] = needRecords
        resultParam['isSelect'] = param5 == 'select'
        datasource.selectRecords(resultParam)
      }
    } else {
      log.warn(ERRORNAME + '实体没有记录,不做处理！')
      return null
    }
  }
  return null
}
/*
 * 判断参数个数
 * name 参数名称
 * paramArray 参数值
 * */
function CheckParamNum(paramArray, targetNum) {
  if (paramArray.length != targetNum) {
    HandleException(
      '需要' + targetNum + '个参数，当前参数个数：' + paramArray.length
    )
    return false
  }
  return true
}
/*
 * 判断参数是否为空
 * paramName 参数名称
 * paramValue 参数值
 * */
function CheckParamEmpty(paramName, paramValue) {
  if (paramValue == null || paramValue == '') {
    HandleException('参数[' + paramName + ']不能为空！')
    return false
  }
  return true
}
/**
 * desc 非回调中抛异常
 * @ruleContext 规则上下文
 * @error_msg 提示信息
 * vjs: 可省略
 * services:
 * 		factory = sandbox.getService("vjs.framework.extension.platform.interface.exception.ExceptionFactory");
 * */
function HandleException(error_msg) {
  error_msg = ERRORNAME + error_msg
  let exception = factory.create({
    type: factory.TYPES.Business,
    message: error_msg
  })
  throw exception
}
//获取数据源
function GetDataSource(ds, routeContext) {
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
      log.warn(ERRORNAME + '只支持界面实体。')
      datasource = engine.execute({
        expression: dsName,
        context: context
      })
    }
  }
  return datasource
}
export { main }
