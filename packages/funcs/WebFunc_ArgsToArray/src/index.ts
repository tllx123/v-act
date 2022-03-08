/**
 *
 *
 */
var main = function () {
  if (arguments.length == 0) {
    throw new Error('函数[ArgsToArray]：至少要有一个参数！当前参数个数为0')
  }
  var result = []
  for (var index = 0; index < arguments.length; index++) {
    result.push(arguments[index])
  }
  return result
}
export { main }
