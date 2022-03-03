import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import { log as log } from '@v-act/vjs.framework.extension.util'
import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
let undefined
let ERRORNAME
//初始化vjs模块，如果函数逻辑需要引用相关vjs服务，则初始化相关vjs模块；如果不需要初始化逻辑可以为空
exports.initModule = function (sb) {
  //sb：前台vjs的沙箱（容器/上下文），可以用它根据vjs名称，获取到相应vjs服务
  sandbox = sb
}

//主入口(必须有)
let main = function (param) {
  ERRORNAME = '函数[ConvertUnit]：'
  /*获取参数*/
  let args = param.getArgs()
  /*判断参数个数*/
  if (args.length < 2 || args.length > 3) {
    HandleException('需要2个或3个参数！当前参数个数：' + args.length)
  }
  /*获取当前值，并转换成数字*/
  let nowValue = parseFloat(args[0])
  if (nowValue == null || nowValue.toString() == 'NaN') {
    OutPutLog('转换后的值：[' + nowValue + ']', 'error')
    HandleException(
      '请检查配置，错误原因：第一个参数传入的值为空或者不是数字类型！当前值：[' +
        args[0] +
        ']'
    )
  }
  /*获取当前存储单位*/
  let now_su = args[1]
  if (now_su == null || now_su == '') {
    HandleException('请检查配置，错误原因：第二个参数传入的值为空！')
  }
  let target_unit = null
  if (args.length == 3) {
    target_unit = args[2] != '' ? args[2] : null
  }
  let result = ConvertStorageUnit(nowValue, now_su, target_unit, true)
  return result
}
/**
 * desc 异常处理方法
 * error_msg 提示信息
 * vjs: 可省略
 * services:
 * 		factory = sandbox.getService("vjs.framework.extension.platform.interface.exception.ExceptionFactory");
 * */
function HandleException(error_msg) {
  error_msg = ERRORNAME + error_msg
  let exception = factory.create({
    type: factory.TYPES.Dialog,
    message: error_msg
  })
  throw exception
}
/**
 * Describe 转换存储单位
 * nowValue 当前值
 * now_su 当前单位
 * target_su 目标单位
 * isContaintUnit 结果是否包含单位
 * */
function ConvertStorageUnit(nowValue, now_su, target_su, isContaintUnit) {
  /*转换基准数*/
  let convert_base_num_max = 500
  let convert_base_num_min = 0.1
  let base_data = 1024
  /*部分单位必须一致的*/
  let StorageUnitSomeSame = ['b', 'B']
  /*单位全写*/
  let StorageUnitAll = [
    'BIT',
    'BYTE',
    'KILO BYTE',
    'MEGA BYTE',
    'GIGA BYTE',
    'TRILLION BYTE',
    'PETA BYTE',
    'EXA BYTE',
    'ZETTA BYTE',
    'YOTTA BYTE',
    'BRONT BYTE',
    'NONA BYTE',
    'DOGGA BYTE',
    'CORYDON BYTE'
  ]
  /*单位最简写*/
  let StorageUnitSimpleA = [
    'b',
    'B',
    'K',
    'M',
    'G',
    'T',
    'P',
    'E',
    'Z',
    'Y',
    'BB',
    'N',
    'D',
    'C'
  ]
  /*单位简写,也用于最后单位输出*/
  let StorageUnitSimpleB = [
    'b',
    'B',
    'KB',
    'MB',
    'GB',
    'TB',
    'PB',
    'EB',
    'ZB',
    'YB',
    'BB',
    'NB',
    'DB',
    'CB'
  ]
  /*结果的单位*/
  let result_dw = ''
  let result = nowValue
  /*保留当前单位下标位置*/
  let now_unit_index = 0
  if (StorageUnitSomeSame.indexOf(now_su) != -1) {
    now_unit_index = StorageUnitSomeSame.indexOf(now_su)
  } else if (StorageUnitAll.indexOf(now_su.toUpperCase()) != -1) {
    now_unit_index = StorageUnitAll.indexOf(now_su.toUpperCase())
  } else if (StorageUnitSimpleA.indexOf(now_su.toUpperCase()) != -1) {
    now_unit_index = StorageUnitSimpleA.indexOf(now_su.toUpperCase())
  } else if (StorageUnitSimpleB.indexOf(now_su.toUpperCase()) != -1) {
    now_unit_index = StorageUnitSimpleB.indexOf(now_su.toUpperCase())
  } else {
    OutPutLog(
      '无法判断识别当前单位:[' +
        now_su +
        ']，当前可识别的单位：\n' +
        StorageUnitAll.toString() +
        '\n' +
        StorageUnitSimpleA.toString() +
        '\n' +
        StorageUnitSimpleB.toString() +
        '\n',
      'error'
    )
    HandleException('无法判断识别当前单位:[' + now_su + ']')
  }
  let isConvert = true
  /*没有设置目标单位*/
  if (!target_su) {
    if (nowValue > convert_base_num_max) {
      /*当前数值大于最大转换基准*/
      /*如果当前数值的单位是最大的，就不再转换。*/
      if (now_unit_index < 13) {
        while (result > convert_base_num_max && now_unit_index < 13) {
          result = OperationMain(result, base_data, 'Divide')
          now_unit_index++
        }
      } else {
        OutPutLog(
          '当前单位为最大，而且大于转换最大基准[' +
            convert_base_num_max +
            ']，不进行转换！',
          'warn'
        )
        isConvert = false
      }
      result_dw = StorageUnitSimpleB[now_unit_index]
    } else if (nowValue < convert_base_num_min) {
      /*当前数值小于最小转换基准*/
      /*如果当前数值的单位是最小的，就不再转换。*/
      if (now_unit_index > 0) {
        result_dw = StorageUnitSimpleB[now_unit_index]
        while (result < convert_base_num_min && now_unit_index > 0) {
          result = OperationMain(result, base_data, 'multiply')
          now_unit_index--
        }
      } else {
        OutPutLog(
          '当前单位为最小，而且小于转换最小基准[' +
            convert_base_num_min +
            ']，不进行转换！',
          'warn'
        )
        isConvert = false
      }
      result_dw = StorageUnitSimpleB[now_unit_index]
    } else {
      isConvert = false
      result_dw = now_su
      result = nowValue
      OutPutLog(
        '输入的数据在[' +
          convert_base_num_min +
          ',' +
          convert_base_num_max +
          ']之间，不需要单位的换算!',
        'log'
      )
    }
    if (isConvert) result = Math.round(result * 10) / 10
  } else {
    result_dw = target_su
    /*保留目标单位下标位置*/
    let target_unit_index = 0
    if (StorageUnitSomeSame.indexOf(target_su) != -1) {
      target_unit_index = StorageUnitSomeSame.indexOf(target_su)
    } else if (StorageUnitAll.indexOf(target_su.toUpperCase()) != -1) {
      target_unit_index = StorageUnitAll.indexOf(target_su.toUpperCase())
    } else if (StorageUnitSimpleA.indexOf(target_su.toUpperCase()) != -1) {
      target_unit_index = StorageUnitSimpleA.indexOf(target_su.toUpperCase())
    } else if (StorageUnitSimpleB.indexOf(target_su.toUpperCase()) != -1) {
      target_unit_index = StorageUnitSimpleB.indexOf(target_su.toUpperCase())
    } else {
      OutPutLog(
        '无法判断识别目标单位:[' +
          target_su +
          ']，当前可识别的单位：\n' +
          StorageUnitAll.toString() +
          '\n' +
          StorageUnitSimpleA.toString() +
          '\n' +
          StorageUnitSimpleB.toString() +
          '\n',
        'error'
      )
      HandleException('无法判断识别目标单位:[' + target_su + ']')
    }
    let oper_type = 'Divide'
    /*目标单位比当前单位小，数值放大*/
    if (target_unit_index < now_unit_index) {
      oper_type = 'multiply'
    }
    while (now_unit_index != target_unit_index) {
      result = OperationMain(result, base_data, oper_type)
      if (oper_type == 'multiply') now_unit_index--
      else now_unit_index++
    }
    result = result + ''
    if (result.indexOf('e') != -1 || result.indexOf('E') != -1) {
      //				if(result.indexOf("-")!=-1){
      ////					var reg_1 = /[e,E][-][\d]+/;
      ////					var matchArray = result.match(reg_1);
      ////					if(matchArray!=null && result.indexOf(".")!=-1){
      ////						result = result.substring(0,3)+matchArray[0];
      ////					}
      ////					OutPutLog("最后结果小数部分大于12位，返回值用科学计数法表示!","warn");
      //				}else if(result.indexOf("+")!=-1){
      ////					var reg_1 = /[e,E][+][\d]+/;
      ////					var matchArray = result.match(reg_1);
      ////					if(matchArray!=null && result.indexOf(".")!=-1){
      ////						result = result.substring(0,3)+matchArray[0];
      ////					}
      ////					OutPutLog("最后结果整数部分大于21位，返回值用科学计数法表示!","warn");
      //				}
      return result + result_dw
    }
    //			if(result<0.1 && (result+"").indexOf("e")!=-1){
    //				result = result.toFixed(14);
    //			}
    /*指定单位转换的，有小数位的话，保留一位有效数字。*/
    let reg = /[\d]+[.][0]*[1-9]/
    if (
      result.indexOf('.') != -1 &&
      result.match(reg) &&
      result.match(reg).length > 0
    ) {
      result = result.match(reg)[0]
    }
  }
  return result + result_dw
}
/**
 * desc 打印日志
 * content 需要打印的内容
 * type 打印的类型，log、warn、error
 * vjs
 * 		"vjs.framework.extension.util.log":null
 * services
 * 		log = sandbox.getService("vjs.framework.extension.util.log");
 * */
function OutPutLog(content, type) {
  let o_type = 'warn'
  if (undefined != type) o_type = type
  if (log == null) return
  /*打印log类型的日志*/
  if (o_type == 'log') {
    log.log(ERRORNAME + content)
    return
  }
  /*打印warn类型的日志*/
  if (o_type == 'warn') {
    log.warn(ERRORNAME + content)
    return
  }
  /*打印error类型的日志*/
  if (o_type == 'error') {
    log.error(ERRORNAME + content)
    return
  }
}
/**
 * Describe 操作函数
 * nowValue 当前值
 * base_data 基准数据
 * type 操作类型
 * */
function OperationMain(nowValue, base_data, type) {
  if (type == 'multiply') {
    return mathUtil.multiply(nowValue, base_data)
  } else if ((type = 'Divide')) {
    return nowValue / base_data
    //			return mathUtil.divide(nowValue,base_data,1);
  } else {
    HandleException('OperationMain调用错误！')
  }
}
export { main }
