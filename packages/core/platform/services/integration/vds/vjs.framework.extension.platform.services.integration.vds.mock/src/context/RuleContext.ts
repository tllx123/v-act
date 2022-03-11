/**
 * 二次开发的规则上下文
 * */

import VObject from './VObject'

class RuleContext {
  constructor(ruleCfg, mock) {
    this._ruleCfg = ruleCfg
    this._cacheDatas = {}
    this._vObject = new VObject(mock)
  }
  getInput(code) {
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
  }

  setOutput(code, value) {
    var mock = this._vObject.mock
    mock._putOutput(code, value)
  }

  getVObject() {
    return this._vObject
  }

  getInputSize() {
    var mock = this._vObject.mock
    return mock.inpus ? mock.inpus.length : 0
  }

  _getRuleCfg() {
    return this._ruleCfg
  }

  _isMock() {
    return true
  }

  /**
   * 获取规则上下文的数据容器
   * */
  newOutput() {
    return this._vObject.mock.container
  }
}
export default RuleContext
