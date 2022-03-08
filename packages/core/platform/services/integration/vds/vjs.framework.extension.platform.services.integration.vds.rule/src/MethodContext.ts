var ResultSet, sandbox, dsFactory
/**
 * 方法上下文定义
 * @constructor
 * @alias MethodContext
 * @catalog 二次开发/方法上下文定义
 */
var MethodContext = function (routeContext) {
  this.routeContext = routeContext
}

MethodContext.prototype = {
  initModule: function (sBox) {
    sandbox = sBox
    ResultSet = sandbox.getService(
      'vjs.framework.extension.platform.interface.model.datasource.ResultSet'
    )
    dsFactory = sandbox.getService(
      'vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
    )
    if (window && window.vds) {
      /**
       * vds里面改造了原生Promise对象，Promise的then可能存在异步，所以需要封装域方法
       * 如果vds不是通过script标签加载时，不会初始化vjs，所以需要给vds添加sandbox
       * */
      window.vds.sandbox = sandbox
    }
  },

  /**
   * 中断类型
   * @enum {Integer}
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.markInterrupt(methodContext.InterruptType.Current);
   */
  InterruptType: {
    /**
     * 中断当前方法
     */
    Current: 0,
    /**
     * 中断所有方法
     */
    Global: 3
  },

  /**
   * 循环中断类型
   * @enum {String}
   *
   */
  LoopInterruptType: {
    /**
     * 中断整个循环执行
     */
    Break: 'break',
    /**
     * 中断本次循环执行
     */
    Continue: 'continue'
  },

  /**
   * 中断方法执行
   * @param {MethodContext#InterruptType} type 中断类型
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.markInterrupt(methodContext.InterruptType.Current);
   */
  markInterrupt: function (type) {
    this.routeContext.markForInterrupt(type)
  },

  /**
   * 中断循环执行
   * @param {MethodContext#LoopInterruptType} type 循环中断类型
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.markLoopInterrupt(methodContext.LoopInterruptType.Break);
   */
  markLoopInterrupt: function (type) {
    this.routeContext.setExecuteType(type)
  },

  /**
   * 获取平台内部路由上下文,供表达式引擎使用
   * @ignore
   */
  _getRouteContext: function () {
    return this.routeContext
  },
  /**
   * 给方法输入变量赋值
   * @param {String} code 变量编码
   * @param {Any} value 变量值
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.setInput("code1",12.1);
   * */
  setInput: function (code: string, value: any) {
    if (value && vds.ds.isDatasource(value)) {
      value = value._get()
    }
    this._getRouteContext().setInputParam(code, value)
  },

  /**
   * 给方法输出变量赋值
   * @param {String} code 变量编码
   * @param {Any} value 变量值
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.setOutput("code1",12.1);
   * */
  setOutput: function (code: string, value: any) {
    if (value && vds.ds.isDatasource(value)) {
      value = value._get()
    }
    this._getRouteContext().setOutputParam(code, value)
  },

  /**
   * 给方法变量赋值
   * @param {String} code 变量编码
   * @param {Any} value 变量值
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * methodContext.setVariable("code1",12.1);
   * */
  setVariable: function (code: string, value: any) {
    if (value && vds.ds.isDatasource(value)) {
      value = value._get()
    }
    this._getRouteContext().setVariable(code, value)
  },
  /**
   * 获取方法输入变量
   * @param {String} code 变量编码
   * @returns {Any}
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * var value = methodContext.getInput("code1")
   * */
  getInput: function (code: string) {
    var value = this._getRouteContext().getInputParam(code)
    if (value && dsFactory.isDatasource(value)) {
      value = vds.ds._genDatasourceByDs(value)
    }
    return value
  },
  /**
   * 获取方法输出变量
   * @param {String} code 变量编码
   * @returns {Any}
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * var value = methodContext.getOutput("code1")
   * */
  getOutput: function (code: string) {
    var value = this._getRouteContext().getOutPutParam(code)
    if (value && dsFactory.isDatasource(value)) {
      value = vds.ds._genDatasourceByDs(value)
    }
    return value
  },
  /**
   * 获取方法变量
   * @param {String} code 变量编码
   * @returns {Any}
   * @example
   * var methodContext = ruleContext.getMethodContext();
   * var value = methodContext.getVariable("code1")
   * */
  getVariable: function (code: string) {
    var value = this._getRouteContext().getVariable(code)
    if (value && dsFactory.isDatasource(value)) {
      value = vds.ds._genDatasourceByDs(value)
    }
    return value
  },
  /**
   * 获取方法输入变量类型，若变量不存在，则返回null
   * @param {String} code 方法输入编码
   * @returns {String}
   * @example
   * var type = ruleContext.getMethodContext().getInputType("code1");
   * */
  getInputType: function (code: string) {
    return this._getRouteContext().getInputParamType(code)
  },
  /**
   * 获取方法输出变量类型，若变量不存在，则返回null
   * @param {String} code 方法输出编码
   * @returns {String}
   * @example
   * var type = ruleContext.getMethodContext().getOutputType("code1");
   * */
  getOutputType: function (code: string) {
    return this._getRouteContext().getOutPutParamType(code)
  },
  /**
   * 获取方法变量类型，若变量不存在，则返回null
   * @param {String} code 方法变量编码
   * @returns {String}
   * @example
   * var type = ruleContext.getMethodContext().getVariableType("code1");
   * */
  getVariableType: function (code: string) {
    return this._getRouteContext().getVariableType(code)
  },
  /**
   * 获取全部事件参数
   * */
  getEventParams: function () {
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
