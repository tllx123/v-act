let VObject = function () {
  this._cacheVObject = {} //缓存v对象，VObject取的输入值
  this._inputDatas = {} //前端缓存
}

VObject.prototype = {
  initModule: function (sBox) {},

  getInput: function (code) {
    if (this._cacheVObject.hasOwnProperty(code)) {
      return this._cacheVObject[code]
    }
    let value = this._inputDatas[code]
    this._cacheVObject[code] = value
    return this._inputDatas[code]
  },

  __setMockInput: function (code, value) {
    this._inputDatas[code] = value
  }
}

export default VObject
