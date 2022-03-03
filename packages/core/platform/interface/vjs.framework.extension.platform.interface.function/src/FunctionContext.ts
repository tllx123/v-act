/**
 *  @class FunctionContext
 * @desc 函数上下文<br/>
 * vjs名称：vjs.framework.extension.platform.interface.function<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.function.FunctionContext<br/>
 * @param {Array} args 函数参数列表，如：Constr("a","b","c") => args = ["a","b","c"];
 * @param {RouteConfig} routeContext 活动集上下文
 */
let FunctionContext = function (args, routeContext) {
  this.args = args
  this.routeContext = routeContext
}

FunctionContext.prototype.initModule = function (sandbox) {}
/**
 * 获取函数参数
 * @return Array
 */
FunctionContext.prototype.getArgs = function () {
  return this.args
}

/**
 * 设置函数参数
 * @param {Array} args 函数参数
 */
FunctionContext.prototype.setArgs = function (args) {
  this.args = args
}

/**
 * 获取活动集上下文
 * @return {@link RouteContext}
 */
FunctionContext.prototype.getRouteContext = function () {
  return this.routeContext
}

/**
 *  设置活动集上下文
 * @param {RouteContext} routeContext 活动集上下文
 */
FunctionContext.prototype.setRouteContext = function (routeContext) {
  this.routeContext = routeContext
}

return FunctionContext
