import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'

export function initModule(sb) {
  sandbox = sb
}

//主入口(必须有)
const main = function (param) {
  //获取函数传入的参数
  let num
  let zeroType
  let formatStr
  let args = param.getArgs()
  num = args[0]
  if (args.length > 1) {
    zeroType = args[1]
  }
  if (args.length > 2) {
    formatStr = args[2]
  }
  if (num == undefined || num === '') {
    let exception = factory.create({
      type: factory.TYPES.Dialog,
      message: '需要转换为中文的字符串不能为空！'
    })
    throw exception
  }
  let cnNums = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  if (zeroType != null && zeroType != '') {
    cnNums.splice(0, 1, zeroType)
  }
  if (formatStr != null && formatStr != '') {
    let formatArr = formatStr.split(',')
    if (formatArr.length == 9) {
      for (let i = 0; i < formatArr.length; i++) {
        cnNums.splice(i + 1, 1, formatArr[i])
      }
    }
  }
  let result = ''
  for (let i = 0; i < num.length; i++) {
    result += getchinese(num[i])
  }

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
    else if (input == '.') return '点'
    else return input
  }
  return result
}

export { main }
