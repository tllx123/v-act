/**
 *
 *
 */
const main = function (param1) {
  //获取函数传入的参数
  //var routeContext = param.getRouteContext(); //获取路由上下文，函数里想执行一些表达式逻辑需要用到
  //获取参数示例：
  //var param1 = args[0];//获取函数第一个参数
  var value = parseFloat(param1)
  if (value == null || value.toString() == 'NaN') {
    throw vds.exception.newConfigException('参数传入的值为空或者不是数字类型！')
  }
  if (value >= 0) return value
  else return -value
}
export { main }
