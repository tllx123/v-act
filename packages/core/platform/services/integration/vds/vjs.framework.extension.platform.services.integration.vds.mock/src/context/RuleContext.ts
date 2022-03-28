/**
 * 二次开发的规则上下文
 * */

import VObject from './VObject'

class RuleContext {
  _ruleCfg: any
  _cacheDatas: Record<string, any>
  _vObject: any

  constructor(ruleCfg: any, mock: any) {
    this._ruleCfg = ruleCfg
    this._cacheDatas = {}
    this._vObject = new VObject(mock)
  }
  getInput(code: any) {
    if (this._cacheDatas.hasOwnProperty(code)) {
      return this._cacheDatas[code]
    }
    var value = this._vObject.getInput(code)
    if (value && vds.ds.isDatasource(value)) {
      var resultSet = value.getAllRecords()
      var datas: any[] = []
      resultSet.iterate(function (record: { toMap: () => any }) {
        datas.push(record.toMap())
      })
      value = datas
    }
    this._cacheDatas[code] = value
    return value
  }

  setOutput(code: any, value: any) {
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
