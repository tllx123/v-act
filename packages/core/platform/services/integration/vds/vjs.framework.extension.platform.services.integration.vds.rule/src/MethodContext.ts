import {
  DatasourceFactory as dsFactory,
  ResultSet
} from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { RouteContext } from '@v-act/vjs.framework.extension.platform.interface.route'

/**
 * 方法上下文定义
 * @constructor
 * @alias MethodContext
 * @catalog 二次开发/方法上下文定义
 */

class MethodContext {
  routeContext: any
  constructor(routeContext: RouteContext) {
    this.routeContext = routeContext
  }

  /**
   * 中断类型
   * @enum {Integer}
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.markInterrupt(methodContext.InterruptType.Current);
   */
  InterruptType:
    | {
        /**
         * 中断当前方法
         */
        Current: 0
        /**
         * 中断所有方法
         */
        Global: 3
      }
    | undefined

  /**
   * 循环中断类型
   * @enum {String}
   *
   */
  LoopInterruptType:
    | {
        /**
         * 中断整个循环执行
         */
        Break: 'break'
        /**
         * 中断本次循环执行
         */
        Continue: 'continue'
      }
    | undefined

  /**
   * 中断方法执行
   * @param {MethodContext#InterruptType} type 中断类型
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.markInterrupt(methodContext.InterruptType.Current);
   */
  markInterrupt(type: any) {
    this.routeContext.markForInterrupt(type)
  }

  /**
   * 中断循环执行
   * @param {MethodContext#LoopInterruptType} type 循环中断类型
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.markLoopInterrupt(methodContext.LoopInterruptType.Break);
   */
  markLoopInterrupt(type: any) {
    this.routeContext.setExecuteType(type)
  }

  /**
   * 获取平台内部路由上下文,供表达式引擎使用
   * @ignore
   */
  _getRouteContext() {
    return this.routeContext
  }
  /**
   * 给方法输入变量赋值
   * @param {String} code 变量编码
   * @param {Any} value 变量值
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.setInput("code1",12.1);
   * */
  setInput(code: string, value: any) {
    if (value && vds.ds.isDatasource(value)) {
      value = value._get()
    }
    this._getRouteContext().setInputParam(code, value)
  }

  /**
   * 给方法输出变量赋值
   * @param {String} code 变量编码
   * @param {Any} value 变量值
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.setOutput("code1",12.1);
   * */
  setOutput(code: string, value: any) {
    if (value && vds.ds.isDatasource(value)) {
      value = value._get()
    }
    this._getRouteContext().setOutputParam(code, value)
  }

  /**
   * 给方法变量赋值
   * @param {String} code 变量编码
   * @param {Any} value 变量值
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.setVariable("code1",12.1);
   * */
  setVariable(code: string, value: any) {
    if (value && vds.ds.isDatasource(value)) {
      value = value._get()
    }
    this._getRouteContext().setVariable(code, value)
  }
  /**
   * 获取方法输入变量
   * @param {String} code 变量编码
   * @returns {Any}
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * var value = methodContext.getInput("code1")
   * */
  getInput(code: string) {
    var value = this._getRouteContext().getInputParam(code)
    if (value && dsFactory.isDatasource(value)) {
      value = vds.ds._genDatasourceByDs(value)
    }
    return value
  }
  /**
   * 获取方法输出变量
   * @param {String} code 变量编码
   * @returns {Any}
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * var value = methodContext.getOutput("code1")
   * */
  getOutput(code: string) {
    var value = this._getRouteContext().getOutPutParam(code)
    if (value && dsFactory.isDatasource(value)) {
      value = vds.ds._genDatasourceByDs(value)
    }
    return value
  }
  /**
   * 获取方法变量
   * @param {String} code 变量编码
   * @returns {Any}
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * var value = methodContext.getVariable("code1")
   * */
  getVariable(code: string) {
    var value = this._getRouteContext().getVariable(code)
    if (value && dsFactory.isDatasource(value)) {
      value = vds.ds._genDatasourceByDs(value)
    }
    return value
  }
  /**
   * 获取方法输入变量类型，若变量不存在，则返回null
   * @param {String} code 方法输入编码
   * @returns {String}
   * @example
   * var type = ruleContext.getMethodContext().getInputType("code1");
   * */
  getInputType(code: string) {
    return this._getRouteContext().getInputParamType(code)
  }
  /**
   * 获取方法输出变量类型，若变量不存在，则返回null
   * @param {String} code 方法输出编码
   * @returns {String}
   * @example
   * var type = ruleContext.getMethodContext().getOutputType("code1");
   * */
  getOutputType(code: string) {
    return this._getRouteContext().getOutPutParamType(code)
  }
  /**
   * 获取方法变量类型，若变量不存在，则返回null
   * @param {String} code 方法变量编码
   * @returns {String}
   * @example
   * var type = ruleContext.getMethodContext().getVariableType("code1");
   * */
  getVariableType(code: string) {
    return this._getRouteContext().getVariableType(code)
  }
  /**
   * 获取全部事件参数
   * */
  getEventParams() {
    var params = this._getRouteContext().getParams()
    if (params && params instanceof Array && params.length > 0) {
      var newParams = []
      for (var i = 0, len = params.length; i < len; i++) {
        var param = params[i]
        if (param && !(param instanceof Array) && param instanceof Object) {
          for (var key in param) {
            var value = param[key]
            if (value && value instanceof ResultSet) {
              param[key] = vds.ds._genResultSet(value)
            }
          }
        }
      }
    }
    return params
  }
}

export default MethodContext
