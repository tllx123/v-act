define('./WidgetMock', function (require, exports, module) {
  var functionEngine, FunctionContext, BaseMock, jsonUtils, scopeManager

  /**
   * 控件本地测试定义，继承自{@link BaseMock}
   * @constructor
   * @alias WidgetMock
   * @catalog 本地测试/基础定义
   * @example
   * vds.import(vds.mock.*);
   * vds.mock.init(manifest,function(mock){
   * 	mock.get("widgetCode").then(function(widgetMock){//widgetCode为控件编号
   * 		widgetMock.mockProperty("Top",50);
   * 		widgetMock.exec();
   * 	});
   * });
   */
  var WidgetMock = function (metadata, scopeId, code) {
    BaseMock.call(this, metadata, scopeId, code, '控件')
  }

  WidgetMock.prototype = {
    initModule: function (sb) {
      BaseMock = require('vjs/framework/extension/platform/services/integration/vds/mock/impl/BaseMock')
      var Extend = require('vjs/framework/extension/platform/services/integration/vds/mock/util/Extend')
      Extend.extend(WidgetMock, BaseMock, sb)
      scopeManager = sb.getService(
        'vjs.framework.extension.platform.interface.scope.ScopeManager'
      )
      jsonUtils = sb.getService('vjs.framework.extension.util.JsonUtil')
    },

    /*
     * 获取所有前端函数编号
     * @return Array
     */
    _getWidgetCodes: function () {
      var codes = this._getFrontendPluginCodes('function')
      return codes
    },

    _getPluginInputCfg: function (code) {
      var plugin = this._getPluginCfg()
      var inputs = plugin.inputs
      if (inputs) {
        return inputs[code]
      }
      return null
    },

    _getWidgetInputCfg: function (code) {
      return this._getPluginInputCfg(code)
    },

    mockInputs: function () {
      for (var i = 0, l = arguments.length; i < l; i++) {
        this.inputs[i] = arguments[i]
      }
    },

    /**
     * mock控件属性
     * @param {String} code 属性编号
     * @param {Any} value 属性值
     */
    mockProperty: function (code, value) {
      this.mockInput(code, value)
    },

    /**
     * 获取属性值
     * @param {String} code 属性编号
     * @returns Any
     */
    getProperty: function (code) {
      return this._getInput(code)
    },
    _getPluginInputCfg: function (code) {
      var pluginCfg = this._getPluginCfg()
      var properties = pluginCfg.properties
      var props = {}
      if (properties) {
        for (var i = 0, len = properties.length; i < len; i++) {
          var prop = properties[i]
          if (prop.code == code) {
            return prop
          }
        }
      }
      return null
    },
    /**
     * 创建控件，如果callback没有传递，则将控件渲染到body下，否则执行callback，callback入参为控件属性
     * @param {Function=} callback
     * @example
     * vds.import(vds.mock.*);
     * vds.mock.init(manifest,function(mock){
     * 	mock.get("widgetCode").then(function(widgetMock){//widgetCode为控件编号
     * 		widgetMock.mockProperty("Top",50);
     * 		widgetMock.exec(function(pros){
     * 			isc["widgetCode"].create(pros);
     * 		});
     * 	});
     * });
     */
    exec: function (callback) {
      var code = this.code
      var pluginCfg = this._getPluginCfg()
      var properties = pluginCfg.properties
      var props = {}
      if (properties) {
        for (var i = 0, len = properties.length; i < len; i++) {
          var prop = properties[i]
          var code = prop.code
          var value = this.getProperty(code)
          props[code] = value
        }
      }
      if (typeof callback == 'function') {
        return callback(props)
      } else {
        var widget = isc[this.code].create(props)
        widget.show()
      }
    }
  }

  //	module.exports = FunctionMock;
  return WidgetMock
})
