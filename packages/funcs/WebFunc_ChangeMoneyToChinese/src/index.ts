/**
 *
 *
 */
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'
const vds = { exception, object }

var main = function (money) {
  var cnNums = new Array(
    '零',
    '壹',
    '贰',
    '叁',
    '肆',
    '伍',
    '陆',
    '柒',
    '捌',
    '玖'
  )
  var cnIntRadice = new Array('', '拾', '佰', '仟')
  var cnIntUnits = new Array('', '万', '亿', '兆')
  var cnDecUnits = new Array('角', '分', '厘', '毫')
  var cnInteger = '整'
  var cnIntLast = '元'
  var maxNum = 999999999999999.9999

  var IntegerNum
  var DecimalNum
  var ChineseStr = ''
  var parts

  if (vds.object.isUndefOrNull(money)) {
    throw vds.exception.newConfigException(
      '函数ChangeMoneyToChinese传入的参数为空！'
    )
  }
  money = parseFloat(money)
  if (isNaN(money)) {
    throw vds.exception.newConfigException(
      '函数ChangeMoneyToChinese 参数[' + money + ']数据格式错误'
    )
  }
  //alert(money);
  if (money >= maxNum) {
    throw vds.exception.newConfigException(
      '函数ChangeMoneyToChinese 参数[' + money + ']超出最大处理范围: ' + maxNum
    )
  }
  if (money < 0) {
    throw vds.exception.newConfigException(
      '函数ChangeMoneyToChinese暂不支持转换负数'
    )
  }
  if (money == 0) {
    ChineseStr = cnNums[0] + cnIntLast + cnInteger
    return ChineseStr
  }
  money = money.toString() //转换为字符串
  if (money.indexOf('.') == -1) {
    IntegerNum = money
    DecimalNum = ''
  } else {
    parts = money.split('.')
    IntegerNum = parts[0]
    DecimalNum = parts[1].substr(0, 4)
  }
  if (parseInt(IntegerNum, 10) > 0) {
    //获取整型部分转换
    var zeroCount = 0
    var IntLen = IntegerNum.length
    for (var i = 0; i < IntLen; i++) {
      var n = IntegerNum.substr(i, 1),
        p = IntLen - i - 1,
        q = p / 4,
        m = p % 4
      if (n == '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          ChineseStr += cnNums[0]
        }
        zeroCount = 0 //归零
        ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m == 0 && zeroCount < 4) {
        ChineseStr += cnIntUnits[q]
      }
    }
    ChineseStr += cnIntLast
    //整型部分处理完毕
  }
  if (DecimalNum != '') {
    //小数部分
    var decLen = DecimalNum.length
    for (var i = 0; i < decLen; i++) {
      var n = DecimalNum.substr(i, 1)
      if (n != '0') {
        ChineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (ChineseStr == '') {
    ChineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (DecimalNum == '') {
    ChineseStr += cnInteger
  }
  return ChineseStr
}
export { main }
