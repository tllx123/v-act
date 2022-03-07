var functionEngine, FunctionContext, BaseMock, jsonUtils, scopeManager, strUtils

/**
 * 函数本地测试定义，继承自{@link BaseMock}
 * @constructor
 * @alias FunctionMock
 * @catalog 本地测试/基础定义
 * @example
 * vds.import(vds.mock.*);
 * vds.mock.init(manifest,function(mock){
 * 	mock.get("funcCode").then(function(functionMock){//funcCode为函数编号
 * 		functionMock.mockInput("input1",1);
 * 		var result = functionMock.exec();
 * 		console.log(result);
 * 	});
 * });
 */
var FunctionMock = function (metadata, scopeId, code) {
  BaseMock.call(this, metadata, scopeId, code, '函数')
}

FunctionMock.prototype = {
  initModule: function (sb) {
    FunctionContext = require('vjs/framework/extension/platform/services/integration/vds/mock/context/FunctionContext')
    BaseMock = require('vjs/framework/extension/platform/services/integration/vds/mock/impl/BaseMock')
    var Extend = require('vjs/framework/extension/platform/services/integration/vds/mock/util/Extend')
    Extend.extend(FunctionMock, BaseMock, sb)
    functionEngine = sb.getService(
      'vjs.framework.extension.platform.services.engine.function.FunctionEngine'
    )
    scopeManager = sb.getService(
      'vjs.framework.extension.platform.interface.scope.ScopeManager'
    )
    jsonUtils = sb.getService('vjs.framework.extension.util.JsonUtil')
    strUtils = sb.getService('vjs.framework.extension.util.StringUtil')
  },

  /**
   * 获取所有前端函数编号
   * @ignore
   * @return Array
   */
  _getFunctionCodes: function () {
    var codes = this._getFrontendPluginCodes('function')
    return codes
  },

  _getPluginInputCfg: function (index) {
    var plugin = this._getPluginCfg()
    var inputs = plugin.inputs
    if (inputs) {
      return inputs[index]
    }
    return null
  },

  _getFunctionInputCfg: function (index) {
    return this._getPluginInputCfg(index)
  },

  mockInputs: function () {
    for (var i = 0, l = arguments.length; i < l; i++) {
      this.inputs[i] = arguments[i]
    }
  },
  /**
   * 解析区间
   */
  _parseRange: function (str) {
    str = strUtils.trim(str)
    var pair = str.split(',')
    var leftRange = pair[0]
    var startNum = parseInt(leftRange.substring(1))
    if (isNaN(startNum) || startNum < 0) {
      throw Error('参数下标区间起始值配置错误，须为非负整数！配置为：' + str)
    }
    var startChar = leftRange.charAt(0)
    if (startChar == '(') {
      startNum++
    } else if (startChar != '[') {
      throw Error('参数下标区间配置有误，起始符号须为[或（，配置为：' + str)
    }
    var rightRange = pair[1]
    var endNumStr = strUtils.trim(
      rightRange.substring(0, rightRange.length - 1)
    )
    var endNum
    if (endNumStr == '+∞') {
      endNum = startNum + parseInt(10 * Math.random()) + 1
    }
    var endChar = rightRange.charAt(rightRange.length - 1)
    if (endChar == ')') {
      endNum--
    } else if (endChar != ']') {
      throw Error('参数下标区间配置有误，结束符号须为]或)，配置为：' + str)
    }
    return [startNum, endNum]
  },
  _getInputsCfg: function () {
    var map = {}
    var pluginCfg = this._getPluginCfg()
    var inputs = pluginCfg.inputs
    for (var i = 0, l = inputs.length; i < l; i++) {
      var input = inputs[i]
      var index = input.index
      if (index) {
        var range = this._parseRange(index)
        var start = range[0],
          end = range[1]
        for (var j = start; j <= end; j++) {
          map[j] = input
        }
      } else {
        map[i] = input
      }
    }
    var res = []
    for (var i in map) {
      if (map.hasOwnProperty(i)) {
        res[i] = map[i]
      }
    }
    return res
  },
  _getInputs: function () {
    if (!this._dealedInputs) {
      this._dealedInputs = []
      var inputs = this._getInputsCfg()
      for (var i = 0, len = inputs.length; i < len; i++) {
        this._dealedInputs.push(this._getInput(i, inputs[i]))
      }
    }
    return this._dealedInputs
  },
  getInputs: function () {
    var inputs = this._getInputs()
    var res = {}
    for (var i = 0, l = inputs.length; i < l; i++) {
      res[i] = inputs[i]
    }
    return res
  },
  /**
   * 执行函数
   * @returns Any
   */
  exec: function () {
    var pluginCfg = this._getPluginCfg()
    var funcInputParams = this._getInputs()
    var functionContext = new FunctionContext(funcInputParams, this)
    //执行函数
    var value = functionEngine.exeExtFunc({
      funcContext: functionContext,
      mainFunc: pluginCfg.entry
    })
    return value
  }
}

//	module.exports = FunctionMock;
return FunctionMock
