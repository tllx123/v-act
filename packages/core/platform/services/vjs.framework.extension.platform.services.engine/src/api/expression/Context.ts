import { ExpressionContext as Context } from '@v-act/vjs.framework.extension.platform.engine.expression'

/**
 * @class ExpressionContext
 * @desc 表达式引擎上下文<br/>
 * vjs名称：vjs.framework.extension.platform.services.engine<br/>
 * vjs服务名称：vjs.framework.extension.platform.services.engine.expression.ExpressionContext<br/>
 */
let ExpressionContext = function () {
  this.context = new Context()
}

ExpressionContext.prototype = {
  initModule: function (sb) {
    Context.prototype.initModule(sb)
  },

  /**
   * 设置路由上下文
   * @param {RouteContext} ctx 路由上下文
   */
  setRouteContext: function (ctx) {
    this.context.setRouteContext(ctx)
  },
  /**
   * 设置数据源配置信息
   * @param {Arary<{@link Record}>}
   */
  setRecords: function (records) {
    this.context.setRecords(records)
  },

  /**
   * @private
   * 获取表达式引擎上下文
   */
  getExpressionContext: function () {
    return this.context
  },

  /**
   * 设置数据源记录索引
   * @param {Object} params 参数信息
   * {
   * 		"datasourceName" : String  数据源名称
   * 		"index" : Integer 索引
   * }
   */
  setRecordIndex: function (params) {
    this.context.setRecordIndex(params)
  }
}

export default ExpressionContext
