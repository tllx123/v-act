import { log as log } from '@v-act/vjs.framework.extension.util'

let sandbox

exports.initModule = function (sb) {
  sandbox = sb
}

const adapt = function (params) {
  let value = params.value,
    precision = params.precision
  //值如果为null则退出
  if (value == null) {
    return value
  }
  let temp = value
  if (isNaN(value) || value === '') {
    //空字符串时,isNaN为false
    log.warn(
      '无法将指定值转换为数值类型！值：' + value + ',值类型：' + typeof value
    )
    return null
  }
  if (typeof precision == 'undefine' || precision == -1 || precision == null) {
    return parseFloat(temp)
  }
  if (temp != null) {
    temp = parseFloat(temp)
    let n = Math.pow(10, precision)
    temp = Math.round(temp * n) / n
  }
  return temp
}

export { adapt, init, init, adapt, adapt }
