/**
 *
 *
 */
var main = function (param) {
  //获取函数传入的参数
  var args = param.getArgs()

  //判断参数个数
  CheckParamNum('设置状态栏颜色-SetStatusBarColor', args, 1)
  //获取上下文
  var context = new ExpressionContext()
  context.setRouteContext(param.getRouteContext())

  //获取参数
  var param1 = args[0] //获取函数第一个参数

  //判断参数是否为空
  CheckParamEmpty('设置状态栏颜色-SetStatusBarColor', 'colorName', param1)

  //设置状态栏颜色
  colorUtil.changeStatusBarColor(param1)
}
export { main }
