import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
//加载模块
let jsonUtil

exports.initModule = function (sBox) {}

//主入口(必须有)
let main = function (param) {
  let sourcedata = param.getArgs()
  let _result = ChangeToChinese(sourcedata)
  return _result
}
function ChangeToChinese(money) {
  let cnNums = new Array(
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
  let cnIntRadice = new Array('', '拾', '佰', '仟')
  let cnIntUnits = new Array('', '万', '亿', '兆')
  let cnDecUnits = new Array('角', '分', '厘', '毫')
  let cnInteger = '整'
  let cnIntLast = '元'
  let maxNum = 999999999999999.9999

  let IntegerNum
  let DecimalNum
  let ChineseStr = ''
  let parts

  if (money == null || money == '') {
    DWException('函数ChangeMoneyToChinese传入的参数为空！')
    return ''
  }
  money = parseFloat(money)
  if (isNaN(money)) {
    DWException('函数ChangeMoneyToChinese 参数[' + money + ']数据格式错误')
    return ''
  }
  //alert(money);
  if (money >= maxNum) {
    DWException(
      '函数ChangeMoneyToChinese 参数[' + money + ']超出最大处理范围: ' + maxNum
    )
    return ''
  }
  if (money < 0) {
    DWException('函数ChangeMoneyToChinese暂不支持转换负数')
    return ''
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
    zeroCount = 0
    IntLen = IntegerNum.length
    for (i = 0; i < IntLen; i++) {
      n = IntegerNum.substr(i, 1)
      p = IntLen - i - 1
      q = p / 4
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
    decLen = DecimalNum.length
    for (i = 0; i < decLen; i++) {
      n = DecimalNum.substr(i, 1)
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
//异常处理方法
function DWException(tmpvar) {
  //		var exception = factory.create({"type":factory.TYPES.Business, "message":tmpvar});
  //    	exception.handle();
  throw new Error(tmpvar)
}
export { main }
