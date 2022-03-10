import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

let sandbox

export function initModule(sb) {
  sandbox = sb
}

let regex = /(^\s*)|(\s*$)/g

/**
 * 去除字符串左右两侧的空格
 */
let _trim = function (str) {
  return str.replace(regex, '')
}

const adapt = function (params) {
  let value = params.value
  //值如果不存在或是布尔类型则退出
  if (
    value == null ||
    typeof value == 'undefined' ||
    typeof value == 'boolean'
  ) {
    return value
  }
  let temp = _trim(value + '').toLowerCase()
  if (temp == 'true' || temp == '1') {
    temp = true
  } else if (temp == 'false' || temp == '0') {
    temp = false
  } else {
    log.warn(
      '无法将指定值转换为布尔类型！值：' + value + ',值类型：' + typeof value
    )
    return null
  }
  return temp
}

export { adapt, init }
