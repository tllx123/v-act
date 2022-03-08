const adapt = function (value, field, callback) {
  //值如果为null则退出
  if (value == null) {
    return value
  }
  let temp = value
  if (typeof value != 'string') temp += ''
  if (typeof callback == 'function') {
    callback(field.getCode(), temp, value)
  }
  return temp
}

export { getDataValidator, adapt, adapt, adapt }
