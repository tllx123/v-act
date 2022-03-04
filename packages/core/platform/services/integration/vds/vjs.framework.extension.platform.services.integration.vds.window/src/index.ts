/**
 * 窗体定义
 * @desc 提供与日志相关的一系列接口，使用前请先import：vds.import("vds.window.*")
 * @namespace vds/window
 * @module window
 * @catalog 基础定义/窗体定义
 * @example
 * vds.import("vds.window.*");
 * vds.window.getInput("var1");
 */
define('./index', function (require, exports, module) {
  window.vds = window.vds || {}
  window.vds.window = window.vds.window || {}

  var win = window.vds.window

  exports = win

  var windowParam,
    dispose,
    scopeManager,
    datasourceFactory,
    windowContainerManager,
    Modal,
    widgetContext

  exports.initModule = function (sandbox) {
    windowParam = sandbox.getService(
      'vjs.framework.extension.platform.services.param.manager.WindowParam'
    )
    dispose = sandbox.getService(
      'vjs.framework.extension.platform.services.view.window.dispose.Mode'
    )
    scopeManager = sandbox.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    datasourceFactory = sandbox.getService(
      'vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
    )
    windowContainerManager = sandbox.getService(
      'vjs.framework.extension.platform.services.view.relation.WindowContainerManager'
    )
    Modal = sandbox.getService(
      'vjs.framework.extension.platform.services.view.modal.Modal'
    )
    widgetContext = sandbox.getService(
      'vjs.framework.extension.platform.services.view.widget.common.context.WidgetContext'
    )
  }

  var gelEl = function () {
    var windowScope = scopeManager.getWindowScope()
    var series = windowScope.getSeries()
    var windowCode = windowScope.getWindowCode()
    var widgetObj, bodyId, el
    if (series == 'smartclient') {
      widgetObj = widgetContext.get(windowCode, 'widgetObj')
      bodyId = widgetObj.htmlElement
      el = $('#' + bodyId).parents('.v-modal-dialog')
    }
    if (series == 'bootstrap') {
      widgetObj = widgetContext.getAll(windowCode)
      bodyId = widgetObj._ParentContainerInfo.containerCode
      el = $('#' + bodyId).parents('.v-modal-dialog')
    }
    return el
  }

  /**
   * 获取窗体输入
   * @param {String} code 窗体输入编号
   * @returns {Any}
   * @example
   * vds.window.getInput("var1");
   */
  exports.getInput = function (code) {
    var value = windowParam.getInput({
      code: code
    })
    if (value && datasourceFactory.isDatasource(value)) {
      //平台数据源需要封装成vds数据源
      value = vds.ds._genDatasourceByDs(value)
    }
    return value
  }
  /**
   * 获取窗体输出
   * @param {String} code 窗体输出编号
   * @returns {Any}
   * @example
   * vds.window.getOutput("var1");
   */
  exports.getOutput = function (code) {
    var value = windowParam.getOutput({
      code: code
    })
    if (value && datasourceFactory.isDatasource(value)) {
      //平台数据源需要封装成vds数据源
      value = vds.ds._genDatasourceByDs(value)
    }
    return value
  }
  /**
   * 设置窗体输出
   * @param {String} code 窗体输出编号
   * @param {String} value 值
   * @example
   * vds.window.setOutput("var1", "value1");
   */
  exports.setOutput = function (code, value) {
    if (!code) {
      return null
    }
    if (value && vds.ds.isDatasource(value)) {
      value = value._get()
    }
    windowParam.setOutput({
      code: code,
      value: value
    })
  }

  /**
   * 设置窗体输入
   * @param {String} code 窗体输入编号
   * @param {String} value 值
   * @example
   * vds.window.setInput("var1", "value1");
   */
  exports.setInput = function (code, value) {
    if (!code) {
      return
    }
    if (value && vds.ds.isDatasource(value)) {
      value = value._get()
    }
    windowParam.setInput({
      code: code,
      value: value
    })
  }
  /**
   * 获取窗体变量
   * @param {String} code 变量编码
   * @returns {Any}
   * @example
   * var value = vds.window.getVariable("code1");
   * */
  exports.getVariable = function (code) {
    var scope = scopeManager.getWindowScope()
    if (scope) {
      var value = scope.get(code)
      if (value && datasourceFactory.isDatasource(value)) {
        //平台数据源需要封装成vds数据源
        value = vds.ds._genDatasourceByDs(value)
      }
      return value
    }
    return null
  }

  /**
   * 退出窗体
   * @param {RuleContext} 规则上下文
   * @example
   * vds.window.dispose(ruleContext);
   * */
  exports.dispose = function (ruleContext) {
    if (!ruleContext) {
      return
    }
    var routeContext = ruleContext.getMethodContext()._getRouteContext()
    var scopeId
    if (routeContext) {
      scopeId = routeContext.getScopeId()
    }
    scopeManager.createScopeHandler({
      scopeId: scopeId,
      handler: function (context) {
        dispose.dispose(context)
      }
    })(ruleContext.ruleCtx)
  }

  /**
   * 获取当前窗体编码
   * @returns {String}
   * @example
   * vds.window.getCode();
   * */
  exports.getCode = function () {
    var windowScope = scopeManager.getWindowScope()
    if (windowScope) {
      return windowScope.getWindowCode()
    }
    return null
  }
  /**
   * 取消关闭当前窗口（仅在窗体关闭前事件内执行有效）
   * @example
   * vds.window.cancelClose();
   * */
  exports.cancelClose = function () {
    var windowScope = scopeManager.getWindowScope() //获取窗体域
    windowScope.cancelClose()
  }
  /**
   * 获取窗体输入变量类型，若变量不存在，则返回null
   * @param {String} code 窗体输入编码
   * @returns {String}
   * @example
   * var type = vds.window.getInputType("code1");
   * */
  exports.getInputType = function (code) {
    var input = windowParam.getInputDefine({
      code: code
    })
    if (input) {
      return input.getType()
    }
    return null
  }
  /**
   * 获取窗体输出变量类型，若变量不存在，则返回null
   * @param {String} code 窗体输出编码
   * @returns {String}
   * @example
   * var type = vds.window.getOutputType("code1");
   * */
  exports.getOutputType = function (code) {
    var output = windowParam.getOutputDefine({
      code: code
    })
    if (output) {
      return output.getType()
    }
    return null
  }
  //    /**
  //     * 渲染类型
  //     * */
  exports.RenderType = {
    current: 'currentWindow',
    dialog: 'dialogWindow',
    container: 'windowContainer',
    divContainer: 'divWindowContainer',
    newWindow: 'newWindow',
    appoint: 'appointWindow',
    browser: 'currentWindowRedirection',
    homeTab: 'iemsHomeTab'
  }
  //    /**
  //     * 渲染窗体
  //     * */
  exports.render = function () {}
  /**
   * 判断窗体实例id是否存在
   * @params {String} instanceId 窗体实例id
   * @returns {Boolean}
   * @example
   * vds.window.exist("facedbf6edc9fc63679d830af4b60e13");
   * */
  exports.exist = function (instanceId) {
    if (scopeManager.isWindowScope(instanceId)) {
      return true
    }
    return false
  }
  /**
   * 设置当前窗体标题
   * @param {String} title 窗体标题
   * @example
   * vds.window.setTitle("新窗体标题");
   * */
  exports.setTitle = function (title) {
    var scope = scopeManager.getWindowScope()
    if (scope) {
      windowContainerManager.updateTitleByScopeId(scope.getInstanceId(), title)
    }
  }
  /**
   * 窗体状态
   * @enum
   * */
  exports.State = {
    /**
     * 最大化
     * */
    Maximized: 'Maximized',
    /**
     * 正常-还原成最大化前的状态
     * */
    Normal: 'Normal'
  }
  /**
   * 设置当前窗体状态,仅支持模态方式打开的窗体
   * @param {@link State} 窗体状态
   * @example
   * vds.window.setState(vds.window.state.Maximized);
   * */
  exports.setState = function (state) {
    switch (state) {
      case exports.State.Maximized:
      case exports.State.Normal:
        var el = gelEl()
        Modal.setModalWindowState(state, el)
        break
    }
  }
  /**
   * 获取当前窗体实例
   * @returns {String}
   * @example
   * vds.window.getInstanceId();
   * */
  exports.getInstanceId = function () {
    var scope = scopeManager.getWindowScope()
    if (scope) {
      return scope.getInstanceId()
    }
    return null
  }
  /**
   * 获取实体货币字段数据
   * @returns {Object}
   * @example
   * vds.window.getCurrencyField();
   * */
  exports.getCurrencyField = function () {
    var currencyField = null
    var windowScope = scopeManager.getWindowScope()
    if (windowScope) {
      currencyField = windowScope.getCurrencyField()
    }
    return currencyField
  }

  /**
   * 判断当前是否属于移动窗体
   * @returns {Boolean}
   * @deprecated
   * @example
   * vds.window.isMobile();
   * */
  exports.isMobile = function () {
    var winScope = scopeManager.getWindowScope()
    if (winScope) {
      if (winScope.getSeries && winScope.getSeries() == 'bootstrap_mobile') {
        return true
      }
    } else if (
      navigator.userAgent &&
      navigator.userAgent.indexOf('ydgApp') != -1
    ) {
      //触发起源不是平台窗体，如第三方页面
      return true
    }
    return false
  }

  return exports
})
