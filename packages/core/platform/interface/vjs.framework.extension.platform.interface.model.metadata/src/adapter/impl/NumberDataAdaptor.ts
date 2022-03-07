let sandbox

export function initModule(sb) {
  if (sb) sandbox = sb
}

const adapt = function (value, field, callback) {
  //值如果为null则退出
  if (value == null) {
    return value
  }
  let temp = value
  let fieldCode = field.getCode()
  if (isNaN(value) || value == '') {
    //空字符串时,isNaN为false
    let log = sandbox.getService('vjs.framework.extension.util.log')
    log.warn(
      '[DataValidator.__fixFieldValueDecimal__]' +
        '名字为' +
        fieldCode +
        '的字段值为' +
        value +
        ',不是一个合法的数值型,自动适配成null值'
    )
    temp = null
  }
  if (temp != null) {
    let precision = field.getPrecision()
    temp = parseFloat(temp)
    let n = Math.pow(10, precision)
    temp = Math.round(temp * n) / n
  }
  if (typeof callback == 'function') {
    callback(fieldCode, temp, value)
  }
  return temp
}

export { getDataValidator, adapt, adapt }
