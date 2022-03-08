/**
 *  数字转换为中文
 *  代码示例:
 *  NumiceToChinese("这是第0123号文件","〇","壹,贰,叁,肆,伍,陆,柒,捌,玖")
 *  返回值为：这是第〇壹贰叁号文件
 *  参数数量:3
 *  参数1(字符串类型，必填)
 *  参数2(字符串类型，可选填，数字0的转换值  不填默认为零)
 *  参数3(字符串类型，可选填，转化的格式（包含1-9的转换字符,用","分隔） 如壹,贰,叁,肆,伍,陆,柒,捌,玖)
 *  返回值为字符串类型
 *
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { exception }

var main = function (num, zeroType, formatStr) {
  //获取函数传入的参数
  var num
  var zeroType
  var formatStr
  if (num == undefined || num === '') {
    var exception =
      vds.exception.newConfigException('需要转换为中文的字符串不能为空！')
    throw exception
  }
  var cnNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  if (zeroType != null && zeroType != '') {
    cnNums.splice(0, 1, zeroType)
  }
  if (formatStr != null && formatStr != '') {
    var formatArr = formatStr.split(',')
    if (formatArr.length == 9) {
      for (var i = 0; i < formatArr.length; i++) {
        cnNums.splice(i + 1, 1, formatArr[i])
      }
    }
  }
  var result = ''
  for (var i = 0; i < num.length; i++) {
    result += getchinese(num[i])
  }

  function getchinese(p) {
    var input = p
    if (input == '0') return cnNums[0]
    else if (input == '1') return cnNums[1]
    else if (input == '2') return cnNums[2]
    else if (input == '3') return cnNums[3]
    else if (input == '4') return cnNums[4]
    else if (input == '5') return cnNums[5]
    else if (input == '6') return cnNums[6]
    else if (input == '7') return cnNums[7]
    else if (input == '8') return cnNums[8]
    else if (input == '9') return cnNums[9]
    else if (input == '.') return '点'
    else return input
  }
  return result
}
export { main }
