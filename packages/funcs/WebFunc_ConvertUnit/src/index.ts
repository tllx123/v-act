/**
 *
 *Describe 转换单位
 *Author liangzc
 */
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as log from '@v-act/vjs.framework.extension.platform.services.integration.vds.log'
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
const vds = { object, exception, log, math }

const main = function (value: string, now_su: string, target_unit: string) {
  /*获取当前值，并转换成数字*/
  var nowValue = parseFloat(value)
  if (!vds.object.isNumber(nowValue)) {
    throw vds.exception.newBusinessException(
      '第一个参数传入的值为空或者不是数字类型，参数值：[' + value + ']'
    )
  }
  if (now_su == null || now_su == '') {
    throw vds.exception.newBusinessException(
      '第二个参数传入的值为空, 请检查配置'
    )
  }
  var result = ConvertStorageUnit(nowValue, now_su, target_unit)
  return result
}
/**
 * Describe 转换存储单位
 * nowValue 当前值
 * now_su 当前单位
 * target_su 目标单位
 * */
var ConvertStorageUnit = function (
  nowValue: number,
  now_su: string,
  target_su: string
) {
  let resultString = ''
  if (vds.object.isUndefOrNull(now_su)) {
    throw vds.exception.newBusinessException('当前单位不能为空')
  }
  now_su += ''
  /*转换基准数*/
  var convert_base_num_max = 500
  var convert_base_num_min = 0.1
  var base_data = 1024
  /*部分单位必须一致的*/
  var StorageUnitSomeSame = ['b', 'B']
  /*单位全写*/
  var StorageUnitAll = [
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
  var StorageUnitSimpleA = [
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
  var StorageUnitSimpleB = [
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
  var result_dw = ''
  var result = nowValue
  /*保留当前单位下标位置*/
  var now_unit_index = 0
  if (StorageUnitSomeSame.indexOf(now_su) != -1) {
    now_unit_index = StorageUnitSomeSame.indexOf(now_su)
  } else if (StorageUnitAll.indexOf(now_su.toUpperCase()) != -1) {
    now_unit_index = StorageUnitAll.indexOf(now_su.toUpperCase())
  } else if (StorageUnitSimpleA.indexOf(now_su.toUpperCase()) != -1) {
    now_unit_index = StorageUnitSimpleA.indexOf(now_su.toUpperCase())
  } else if (StorageUnitSimpleB.indexOf(now_su.toUpperCase()) != -1) {
    now_unit_index = StorageUnitSimpleB.indexOf(now_su.toUpperCase())
  } else {
    vds.log.log(
      '无法判断识别当前单位:[' +
        now_su +
        ']，当前可识别的单位：\n' +
        StorageUnitAll.toString() +
        '\n' +
        StorageUnitSimpleA.toString() +
        '\n' +
        StorageUnitSimpleB.toString() +
        '\n'
    )
    throw vds.exception.newBusinessException(
      '无法判断识别当前单位:[' + now_su + ']'
    )
  }
  var isConvert = true
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
        vds.log.warn(
          '当前单位为最大，而且大于转换最大基准[' +
            convert_base_num_max +
            ']，不进行转换！'
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
        vds.log.warn(
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
      vds.log.log(
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
    target_su += ''
    result_dw = target_su
    /*保留目标单位下标位置*/
    var target_unit_index = 0
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
    var oper_type = 'Divide'
    /*目标单位比当前单位小，数值放大*/
    if (target_unit_index < now_unit_index) {
      oper_type = 'multiply'
    }
    while (now_unit_index != target_unit_index) {
      result = OperationMain(result, base_data, oper_type)
      if (oper_type == 'multiply') now_unit_index--
      else now_unit_index++
    }
    resultString = result + ''
    if (resultString.indexOf('e') != -1 || resultString.indexOf('E') != -1) {
      return resultString + result_dw
    }
    /*指定单位转换的，有小数位的话，保留一位有效数字。*/
    var reg = /[\d]+[.][0]*[1-9]/
    let rsMatch = resultString.match(reg)
    if (rsMatch !== null) {
      if (
        resultString.indexOf('.') != -1 &&
        resultString.match(reg) &&
        rsMatch.length > 0
      ) {
        resultString = rsMatch[0]
      }
    }
  }
  if (resultString === '') {
    return result + result_dw
  } else {
    return resultString + result_dw
  }
}

/**
 * Describe 操作函数
 * nowValue 当前值
 * base_data 基准数据
 * type 操作类型
 * */
var OperationMain = function (
  nowValue: number,
  base_data: number,
  type: string
): number {
  var result: number = 0
  switch (type) {
    case 'multiply':
      result = vds.math.multiply(nowValue, base_data)
      break
    case 'Divide':
      result = nowValue / base_data
      break
  }
  return result
}
export { main }
