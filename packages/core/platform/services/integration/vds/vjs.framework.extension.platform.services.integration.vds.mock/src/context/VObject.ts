/**
 * 二次开发使用的V对象
 * */

var datasourceFactory, manager

var VObject = function (mock) {
  this.mock = mock
  this._cacheVObject = {} //缓存v对象，VObject取的输入值
}

VObject.prototype = {
  initModule: function (sBox) {
    datasourceFactory = sBox.getService(
      'vjs.framework.extension.platform.interface.model.datasource.DatasourceFactory'
    )
    manager = sBox.getService(
      'vjs.framework.extension.platform.services.model.manager.datasource.DatasourceManager'
    )
  },

  getInput: function (code) {
    var mock = this.mock
    if (this._cacheVObject.hasOwnProperty(code)) {
      return this._cacheVObject[code]
    }
    if (!this.mock || !mock._existInput(code)) {
      return null
    }
    var value = mock._getInput(code)
    if (value && mock._isEntityByInputCode(code)) {
      //如果之前给的输入值不是数据源对象，那就取一下数据源对象
      if (
        !datasourceFactory.isDatasource(value) &&
        !vds.ds.isDatasource(value)
      ) {
        value = manager.lookup({
          datasourceName: value
        })
        value = vds.ds.mock(value)
      }
    }
    this._cacheVObject[code] = value
    return value
  },

  putOutput: function (code, value) {
    var mock = this.mock
    this.mock.putOutput(code, value)
  }
}

return VObject
