/**
 * 表达式
 * @desc 提供执行表达式接口，使用前请先import：vds.import("vds.expression.*")
 * @namespace vds/expression
 * @module expression
 * @catalog 工具方法/表达式
 * @example
 * vds.import("vds.expression.*");
 * vds.expression.execute("@var1");
 */
define('./index', function (require, exports, module) {
  window.vds = window.vds || {}
  window.vds.expression = window.vds.expression || {}

  var expression = window.vds.expression

  exports = expression

  var EngineContext, engine, dsFactory, Datasource

  exports.initModule = function (sb) {
    engine = sb.getService(
      'vjs.framework.extension.platform.services.engine.expression.ExpressionEngine'
    )
    EngineContext = sb.getService(
      'vjs.framework.extension.platform.services.engine.expression.ExpressionContext'
    )
    dsFactory = sb.getService(
      'vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
    )
    Datasource = require('vjs/framework/extension/platform/services/integration/vds/ds/Datasource')
  }

  /**
   * 执行表达式
   * @param {String} expression 表达式
   * @param {Object} context 上下文信息
   * {
   *  "ruleContext": {@link RuleContext=} 规则上下文
   *  "records": Array<{@link Record=}> 实体记录列表
   *  "variables":{Object} 上下文变量，注：只解析可识别的指定格式，不建议使用
   * }
   * @returns any
   * @example
   * vds.expression.execute("1+1");//2
   * vds.expression.execute("");
   */
  exports.execute = function (expression, context) {
    var ctx = new EngineContext()
    if (ctx && context) {
      var ruleContext = context.ruleContext
      if (ruleContext) {
        var methodCtx = ruleContext.getMethodContext()
        ctx.setRouteContext(methodCtx._getRouteContext())
      }
      var records = context.records
      if (records && records instanceof Array) {
        var newRecords = []
        for (var i = 0, len = records.length; i < len; i++) {
          newRecords.push(records[i]._get())
        }
        ctx.setRecords(newRecords)
      }
      var variables = context.variables
      if (variables && typeof variables == 'object') {
        var source_context = ctx.getExpressionContext()
        for (var key in variables) {
          if (variables.hasOwnProperty) source_context.put(key, variables[key])
        }
      }
    }
    var value = engine.execute({
      expression: expression,
      context: ctx
    })
    if (value && dsFactory.isDatasource(value)) {
      //表达式执行非界面实体的实体变量
      value = vds.ds._genDatasourceByDs(value)
    }
    return value
  }

  return exports
})
