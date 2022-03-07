let sandbox

export function initModule(sb) {
  if (sb) sandbox = sb
}

let regex = /(^\s*)|(\s*$)/g

/**
 * 去除字符串左右两侧的空格
 */
let _trim = function (str) {
  return str.replace(regex, '')
}

const adapt = function (value, field, callback) {
  //值如果不存在或是布尔类型则退出
  if (
    value == null ||
    typeof value == 'undefined' ||
    typeof value == 'boolean'
  ) {
    return value
  }
  let temp = _trim(value + '').toLowerCase()
  let fieldCode = field.getCode()
  if (temp == 'true' || temp == '1') {
    temp = true
  } else if (temp == 'false' || temp == '0') {
    temp = false
  } else {
    let log = sandbox.getService('vjs.framework.extension.util.log')
    log.warn(
      '[BooleanDataAdaptor.validate]名字为' +
        fieldCode +
        '的字段值为' +
        value +
        ',不是一个合法的布尔型,自动适配成null值'
    )
    temp = null
  }
  if (typeof callback == 'function') {
    callback(fieldCode, temp, value)
  }
  return temp
}

export { getDataValidator, adapt }
