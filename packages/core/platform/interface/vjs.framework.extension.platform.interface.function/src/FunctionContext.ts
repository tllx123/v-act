import { RouteContext } from '@v-act/vjs.framework.extension.platform.interface.route'

/**
 *  @class FunctionContext
 * @desc 函数上下文<br/>
 * vjs名称：vjs.framework.extension.platform.interface.function<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.function.FunctionContext<br/>
 * @param {Array} args 函数参数列表，如：Constr("a","b","c") => args = ["a","b","c"];
 * @param {RouteConfig} routeContext 活动集上下文
 */
class FunctionContext {
  args: Array<any>
  routeContext?: RouteContext
  constructor(args?: Array<any>, routeContext?: RouteContext) {
    this.args = args || []
    this.routeContext = routeContext
  }
  /**
   * 获取函数参数
   * @return Array
   */
  getArgs() {
    return this.args
  }

  /**
   * 设置函数参数
   * @param {Array} args 函数参数
   */
  setArgs(args: Array<any>) {
    this.args = args
  }

  /**
   * 获取活动集上下文
   * @return {@link RouteContext}
   */
  getRouteContext() {
    return this.routeContext
  }

  /**
   *  设置活动集上下文
   * @param {RouteContext} routeContext 活动集上下文
   */
  setRouteContext(routeContext: RouteContext) {
    this.routeContext = routeContext
  }
}

export default FunctionContext
