/**
 *  移除头尾或者全部空格
 *  代码示例:Trim('  sdfsd ',false) 返回值为 '  sdfsd'
 *         Trim('  sdfsd ',true)  返回值为 'sdfsd'
 *  参数数量:2
 *  参数1(字符串类型)
 *  参数2(布尔类型，是否去除所有空格 可选填，是否去除所有空格 ，不填默认为false
 *  false:只去除头尾空格;true：去除所有空格)
 *  返回值为字符串类型
 *
 */
var main = function (param1, param2) {
  if (!param2) {
    param2 = ''
  }

  var isAll = false
  var newStr = ''
  if (param1 == null || param1 == undefined || param1 == 'NaN') {
    return
  }
  if (param2 == true || param2 == 'true') {
    isAll = true
  }
  newStr = param1.replace(/(^\s*)|(\s*$)/g, '')
  if (isAll) {
    newStr = newStr.replace(/\s/g, '')
  }
  return newStr
}
export { main }
