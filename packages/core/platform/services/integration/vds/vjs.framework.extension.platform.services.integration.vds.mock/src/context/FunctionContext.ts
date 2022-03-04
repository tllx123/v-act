/**
 * 二次开发的函数上下文
 * */

import { dsFactory } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import VObject from './context/VObject'
import { baseFunctionContext } from '@v-act/vjs.framework.extension.platform.interface.function'
var Extend = require('vjs/framework/extension/platform/services/integration/vds/mock/util/Extend')
Extend.extend(FunctionContext, baseFunctionContext, sBox)
var VObject, dsFactory, baseFunctionContext

var FunctionContext = function (args, mock) {
  this._args = args
  this._cacheDatas = {}
  this._vObject = new VObject(mock)
  this.routeContext = mock
}

FunctionContext.prototype = {
  initModule: function (sBox) {},

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

export default FunctionContext
