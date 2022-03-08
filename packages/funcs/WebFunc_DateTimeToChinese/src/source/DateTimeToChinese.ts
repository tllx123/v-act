import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'

export function initModule(sb) {
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  //获取函数传入的参数
  let args = param.getArgs()
  //获取参数示例：
  let dateStr = args[0]
  let formatStr = args[1]
  if (dateStr == null || dateStr == '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '需要转换的日期不能为空！'
    })
    throw exception
  }
  if (formatStr == null || formatStr == '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '需要转换的格式不能为空！'
    })
    throw exception
  }
  //转换格式
  function geneDateStr(dateStr, formatStr) {
    let yearStart = 'start'
    let yearNum = 0
    let monStart = 'start'
    let monNum = 0
    let dayStart = 'start'
    let dayNum = 0
    let hourStart = 'start'
    let hourNum = 0
    let minStart = 'start'
    let minNum = 0
    let secondStart = 'start'
    let secondNum = 0
    let hsecondStart = 'start'
    let hsecondNum = 0
    let quarterStart = 'start'
    let quarterNum = 0
    let weekStart = 'start'
    let weekNum = 0
    for (let i = 0; i < formatStr.length; i++) {
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
    let newDateStr = ''
    let year = ''
    if (yearStart != 'start') {
      year = dateStr.substr(yearStart, yearNum)
    }
    let mon = ''
    if (monStart != 'start') {
      mon = dateStr.substr(monStart, monNum)
    }
    let day = ''
    if (dayStart != 'start') {
      day = dateStr.substr(dayStart, dayNum)
    }

    let hour = ''
    if (hourStart != 'start') {
      hour = dateStr.substr(hourStart, hourNum)
      hourUnit = formatStr.substr(hourStart, 1)
      if (hour == '') {
        hour = '0'
      }
      if (hourUnit == 'h') {
        hour = hour % 12 == 0 ? 12 : hour % 12
      }
    }
    let min = ''
    if (minStart != 'start') {
      min = dateStr.substr(minStart, minNum)
      if (min == '') {
        min = '0'
      }
    }
    let second = ''
    if (secondStart != 'start') {
      second = dateStr.substr(secondStart, secondNum)
      if (second == '') {
        second = '0'
      }
    }
    let hsecond = ''
    if (hsecondStart != 'start') {
      hsecond = dateStr.substr(hsecondStart, hsecondNum)
      if (hsecond == '') {
        hsecond = '0'
      }
    }
    let weekStr = ''
    let quarter = ''
    if (quarterStart != 'start' || weekStart != 'start') {
      let yearC = ''
      let monC = ''
      let dayC = ''
      let hourC = ''
      let minC = ''
      if (year != '') {
        yearC = year + '/'
      }
      if (mon != '') {
        monC = mon + '/'
      }
      if (day != '') {
        dayC = day + ' '
      }
      if (year.length == 4) {
        dateC = yearC + monC + dayC
      } else {
        dateC = monC + dayC
      }
      let testDate = new Date(dateC)
      if (quarterStart != 'start') {
        quarter = Math.floor((testDate.getMonth() + 3) / 3) //季度
      }
      if (weekStart != 'start') {
        fmt = formatStr.substr(weekStart, weekNum)
        let week = {
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
  let cnNums = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  function getchinese(p) {
    let input = p
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
    let cnNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
    let cnIntUnits = ['', '万', '亿', '万亿']
    let cnIntRadice = ['', '十', '百', '千']
    let chnStr = '',
      intNum = '',
      deciNum = '',
      parts = ''
    let number = Math.abs(num)
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
      let zeroCount = 0
      let IntLen = intNum.length
      for (let i = 0; i < IntLen; i++) {
        let n = intNum.substr(i, 1)
        let p = IntLen - i - 1
        let q = p / 4
        let m = p % 4
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
  let str = geneDateStr(dateStr, formatStr)
  let result = ''
  let regYear = new RegExp('(\\d+)年', 'g')
  function testYear($1) {
    let yearN = ''
    for (let i = 0; i < $1.length; i++) {
      yearN += getchinese($1[i])
    }
    return yearN
  }
  str = str.replace(regYear, testYear)
  function test($1) {
    let num = $1.substr(0, $1.length - 1)
    let unit = $1.substr($1.length - 1, 1)
    let numBig = getUnitChinese(num)
    return numBig + unit
  }
  function test2($1) {
    let num = $1.substr(0, $1.length - 2)
    let unit = $1.substr($1.length - 2, 2)
    let numBig = getUnitChinese(num)
    return numBig + unit
  }
  // 月，时，分，秒，毫秒的替换
  let reg2 = new RegExp('(\\d+)月', 'g')
  str = str.replace(reg2, test)
  let reg3 = new RegExp('(\\d+)日', 'g')
  str = str.replace(reg3, test)
  let reg4 = new RegExp('(\\d+)时', 'g')
  str = str.replace(reg4, test)
  let reg5 = new RegExp('(\\d+)分', 'g')
  str = str.replace(reg5, test)
  let reg6 = new RegExp('(\\d+)秒', 'g')
  str = str.replace(reg6, test)
  let reg7 = new RegExp('(\\d+)毫秒', 'g')
  str = str.replace(reg7, test2)
  let reg8 = new RegExp('(\\d+)季', 'g')
  str = str.replace(reg8, test)
  return str
}

export { main }
