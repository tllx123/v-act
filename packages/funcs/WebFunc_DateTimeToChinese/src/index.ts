/**
 *  日期转换为中文
 *  代码示例:
 *  DateTimeToChinese("2017.12.22 12:23:02:23","yyyy.MM.dd hh:mm:ss:SS EEE q")
 *  返回值为：二〇一七年十二月二十二日十二时二十三分二秒二十三毫秒 星期五 四季
 *  参数数量:2
 *  参数1(字符串类型，必填)
 *  参数2(字符串类型，必填，需要转化的格式类型，必须与给定的字符串对应，周和季度部分可以选填）
 *  格式说明：月(M)、日(d)、12时(h)、24时(H)、分(m)、秒(s)、毫秒(S)、周(E)、季度(q) 
     年(y)可以用 1-4个占位符,周(E)用1-3个占位符,其他单位可以用1-2个占位符
 *  
 *  返回值为字符串类型
 *
 */
import * as math from '@v-act/vjs.framework.extension.platform.services.integration.vds.math'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
const vds = { math, exception }

const main = function (dateStr, formatStr) {
  //获取函数传入的参数
  if (dateStr == null || dateStr == '') {
    var exception = vds.exception.newConfigException('需要转换的日期不能为空！')
    throw exception
  }
  if (formatStr == null || formatStr == '') {
    var exception = vds.exception.newConfigException('需要转换的格式不能为空！')
    throw exception
  }
  //转换格式
  function geneDateStr(dateStr, formatStr) {
    var yearStart = 'start'
    var yearNum = 0
    var monStart = 'start'
    var monNum = 0
    var dayStart = 'start'
    var dayNum = 0
    var hourStart = 'start'
    var hourNum = 0
    var minStart = 'start'
    var minNum = 0
    var secondStart = 'start'
    var secondNum = 0
    var hsecondStart = 'start'
    var hsecondNum = 0
    var quarterStart = 'start'
    var quarterNum = 0
    var weekStart = 'start'
    var weekNum = 0
    for (var i = 0; i < formatStr.length; i++) {
      if (formatStr[i] == 'y') {
        if (yearStart == 'start') {
          yearStart = i
        }
        yearNum++
      }
      if (formatStr[i] == 'M') {
        if (monStart == 'start') {
          monStart = i
        }
        monNum++
      }
      if (formatStr[i] == 'd') {
        if (dayStart == 'start') {
          dayStart = i
        }
        dayNum++
      }

      if (formatStr[i] == 'h' || formatStr[i] == 'H') {
        if (hourStart == 'start') {
          hourStart = i
        }
        hourNum++
      }
      if (formatStr[i] == 'm') {
        if (minStart == 'start') {
          minStart = i
        }
        minNum++
      }
      if (formatStr[i] == 's') {
        if (secondStart == 'start') {
          secondStart = i
        }
        secondNum++
      }
      if (formatStr[i] == 'S') {
        if (hsecondStart == 'start') {
          hsecondStart = i
        }
        hsecondNum++
      }
      if (formatStr[i] == 'q') {
        if (quarterStart == 'start') {
          quarterStart = i
        }
        quarterNum++
      }
      if (formatStr[i] == 'E') {
        if (weekStart == 'start') {
          weekStart = i
        }
        weekNum++
      }
    }
    var newDateStr = ''
    var year = ''
    if (yearStart != 'start') {
      year = dateStr.substr(yearStart, yearNum)
    }
    var mon = ''
    if (monStart != 'start') {
      mon = dateStr.substr(monStart, monNum)
    }
    var day = ''
    if (dayStart != 'start') {
      day = dateStr.substr(dayStart, dayNum)
    }

    var hour = ''
    if (hourStart != 'start') {
      hour = dateStr.substr(hourStart, hourNum)
      var hourUnit = formatStr.substr(hourStart, 1)
      if (hour == '') {
        hour = '0'
      }
      if (hourUnit == 'h') {
        hour = hour % 12 == 0 ? 12 : hour % 12
      }
    }
    var min = ''
    if (minStart != 'start') {
      min = dateStr.substr(minStart, minNum)
      if (min == '') {
        min = '0'
      }
    }
    var second = ''
    if (secondStart != 'start') {
      second = dateStr.substr(secondStart, secondNum)
      if (second == '') {
        second = '0'
      }
    }
    var hsecond = ''
    if (hsecondStart != 'start') {
      hsecond = dateStr.substr(hsecondStart, hsecondNum)
      if (hsecond == '') {
        hsecond = '0'
      }
    }
    var weekStr = ''
    var quarter = ''
    if (quarterStart != 'start' || weekStart != 'start') {
      var yearC = ''
      var monC = ''
      var dayC = ''
      var hourC = ''
      var minC = ''
      if (year != '') {
        yearC = year + '/'
      }
      if (mon != '') {
        monC = mon + '/'
      }
      if (day != '') {
        dayC = day + ' '
      }
      var dateC
      if (year.length == 4) {
        dateC = yearC + monC + dayC
      } else {
        dateC = monC + dayC
      }
      var testDate = new Date(dateC)
      if (quarterStart != 'start') {
        quarter = vds.math.floor((testDate.getMonth() + 3) / 3) //季度
      }
      if (weekStart != 'start') {
        var fmt = formatStr.substr(weekStart, weekNum)
        var week = {
          '0': '日',
          '1': '一',
          '2': '二',
          '3': '三',
          '4': '四',
          '5': '五',
          '6': '六'
        }
        if (/(E+)/.test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            (RegExp.$1.length > 1
              ? RegExp.$1.length > 2
                ? '星期'
                : '周'
              : '') + week[testDate.getDay() + '']
          )
        }
        weekStr = fmt
      }
    }

    if (year != '') {
      year = year + '年'
    }
    if (mon != '') {
      mon = mon + '月'
    }
    if (day != '') {
      day = day + '日'
    }
    if (hour != '') {
      hour = hour + '时'
    }
    if (min != '') {
      min = min + '分'
    }
    if (second != '') {
      second = second + '秒'
    }
    if (hsecond != '') {
      hsecond = hsecond + '毫秒'
    }
    if (quarter != '') {
      quarter = quarter + '季'
    }

    newDateStr =
      year + mon + day + hour + min + second + hsecond + weekStr + quarter
    newDateStr = newDateStr.replace(/\s/g, '')
    return newDateStr
  }

  //转化年
  var cnNums = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']
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
    else return input
  }

  //转化其它
  function getUnitChinese(num) {
    var cnNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    var cnIntUnits = ['', '万', '亿', '万亿']
    var cnIntRadice = ['', '十', '百', '千']
    var chnStr = '',
      intNum = '',
      deciNum = '',
      parts = ''
    var number = Math.abs(num)
    if (num === 0) {
      return cnNums[0]
    }
    if (number > 0 && number < 1) {
      chnStr = cnNums[0]
    }
    number = number.toString()
    if (number.indexOf('.') == -1) {
      intNum = number
      deciNum = ''
    } else {
      parts = number.split('.')
      intNum = parts[0]
      deciNum = parts[1]
    }
    if (intNum == '0') {
      chnStr = cnNums[0]
    }
    if (parseInt(intNum, 10) > 0) {
      var zeroCount = 0
      var IntLen = intNum.length
      for (var i = 0; i < IntLen; i++) {
        var n = intNum.substr(i, 1)
        var p = IntLen - i - 1
        var q = p / 4
        var m = p % 4
        if (n == '0') {
          zeroCount++
        } else {
          if (zeroCount > 0) {
            chnStr += cnNums[0]
          }
          zeroCount = 0
          if (n == 1 && m == 1) {
            chnStr += cnIntRadice[m]
          } else {
            chnStr += cnNums[parseInt(n)] + cnIntRadice[m]
          }
        }
        if (m == 0 && zeroCount < 4) {
          chnStr += cnIntUnits[q]
        }
      }
    }
    return chnStr
  }

  //转换方法
  var str = geneDateStr(dateStr, formatStr)
  var regYear = new RegExp('(\\d+)年', 'g')
  function testYear($1) {
    var yearN = ''
    for (var i = 0; i < $1.length; i++) {
      yearN += getchinese($1[i])
    }
    return yearN
  }
  str = str.replace(regYear, testYear)
  function test($1) {
    var num = $1.substr(0, $1.length - 1)
    var unit = $1.substr($1.length - 1, 1)
    var numBig = getUnitChinese(num)
    return numBig + unit
  }
  function test2($1) {
    var num = $1.substr(0, $1.length - 2)
    var unit = $1.substr($1.length - 2, 2)
    var numBig = getUnitChinese(num)
    return numBig + unit
  }
  // 月，时，分，秒，毫秒的替换
  var reg2 = new RegExp('(\\d+)月', 'g')
  str = str.replace(reg2, test)
  var reg3 = new RegExp('(\\d+)日', 'g')
  str = str.replace(reg3, test)
  var reg4 = new RegExp('(\\d+)时', 'g')
  str = str.replace(reg4, test)
  var reg5 = new RegExp('(\\d+)分', 'g')
  str = str.replace(reg5, test)
  var reg6 = new RegExp('(\\d+)秒', 'g')
  str = str.replace(reg6, test)
  var reg7 = new RegExp('(\\d+)毫秒', 'g')
  str = str.replace(reg7, test2)
  var reg8 = new RegExp('(\\d+)季', 'g')
  str = str.replace(reg8, test)
  return str
}
export { main }
