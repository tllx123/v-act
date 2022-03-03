/**
 * 二次开发的函数上下文
 * */
define('./FunctionContext', function (require, exports, module) {
  var VObject, dsFactory, baseFunctionContext

  var FunctionContext = function (args, mock) {
    this._args = args
    this._cacheDatas = {}
    this._vObject = new VObject(mock)
    this.routeContext = mock
  }

  exports.initModule = function () {}

  FunctionContext.prototype = {
    initModule: function (sBox) {
      dsFactory = sBox.getService(
        'vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
      )
      VObject = require('vjs/framework/extension/platform/services/integration/vds/mock/context/VObject')
      baseFunctionContext = sBox.getService(
        'vjs.framework.extension.platform.interface.function.FunctionContext'
      )
      var Extend = require('vjs/framework/extension/platform/services/integration/vds/mock/util/Extend')
      Extend.extend(FunctionContext, baseFunctionContext, sBox)
    },

    getInput: function (code) {
      if (this._cacheDatas.hasOwnProperty(code)) {
        return this._cacheDatas[code]
      }
      var value = this._vObject.getInput(code)
      if (value && dsFactory.isDatasource(value)) {
        //平台数据源对象
        value = vds.ds.mock(value)
      }
      this._cacheDatas[code] = value
      return value
    },

    getVObject: function () {
      return this._vObject
    },

    getInputSize: function () {
      var mock = this._vObject.mock
      return mock.inpus ? mock.inpus.length : 0
    },

    getArgs: function () {
      return this._args
    }
  }

  exports.FunctionContext = FunctionContext

  return FunctionContext
})
