/**
 * 二次开发的规则上下文
 * */

var VObject, dsFactory

var RuleContext = function (ruleCfg, mock) {
  this._ruleCfg = ruleCfg
  this._cacheDatas = {}
  this._vObject = new VObject(mock)
}

RuleContext.prototype = {
  initModule: function (sBox) {
    dsFactory = sBox.getService(
      'vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
    )
    VObject = require('vjs/framework/extension/platform/services/integration/vds/mock/context/VObject')
  },

  getInput: function (code) {
    if (this._cacheDatas.hasOwnProperty(code)) {
      return this._cacheDatas[code]
    }
    var value = this._vObject.getInput(code)
    if (value && vds.ds.isDatasource(value)) {
      var resultSet = value.getAllRecords()
      var datas = []
      resultSet.iterate(function (record) {
        datas.push(record.toMap())
      })
      value = datas
    }
    this._cacheDatas[code] = value
    return value
  },

  setOutput: function (code, value) {
    var mock = this._vObject.mock
    mock._putOutput(code, value)
  },

  getVObject: function () {
    return this._vObject
  },

  getInputSize: function () {
    var mock = this._vObject.mock
    return mock.inpus ? mock.inpus.length : 0
  },

  _getRuleCfg: function () {
    return this._ruleCfg
  },

  _isMock: function () {
    return true
  },

  /**
   * 获取规则上下文的数据容器
   * */
  newOutput: function () {
    return this._vObject.mock.container
  }
}

exports.RuleContext = RuleContext
return RuleContext
