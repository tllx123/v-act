import { Datasource } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'

let Snapshot = function (datasource) {
  this.datasource = datasource
  this.currentId = null
  let record = datasource.getCurrentRecord()
  if (record) {
    this.currentId = record.getSysId()
  }
}

let _dispatcher = function (funcName) {
  return function () {
    let ds = this._getDatasource()
    return ds[funcName].apply(ds, arguments)
  }
}

Snapshot.prototype = {
  initModule: function (sb) {
    Datasource.prototype.initModule.call(this, sb)
    var proto = Datasource.prototype
    var snapshotPro = Snapshot.prototype
    for (var attr in proto) {
      var val = proto[attr]
      if (!snapshotPro.hasOwnProperty(attr)) {
        if (typeof val == 'function') {
          val = _dispatcher(attr)
        }
        snapshotPro[attr] = val
      }
    }
  },

  _getDatasource: function () {
    return this.datasource
  },

  /**
   * 清除当前行
   */
  clearCurrentRecord: function () {
    this.currentId = null
  },

  /**
   * 获取数据源中当前行记录
   * @return {@link Record}
   */
  getCurrentRecord: function () {
    return this.getRecordById(this.currentId)
  },

  /**
   * 是否为已当前行记录
   * @param {Object} params 参数信息
   * {
   * 		record : {@link Record} 记录
   * }
   * @return Boolean
   * @see
   * Record 请参考vjs.framework.extension.platform.interface.model.datasource模块中Record定义
   */
  isCurrentRecord: function (params) {
    let record = params.record
    if (record) {
      let id = this.currentId
      return id == record.get('id')
    }
    return false
  },

  /**
   *设置当前行
   * @param {Object} params 参数信息
   * {
   * 		record : {@link Record} 记录
   * }
   */
  setCurrentRecord: function (params) {
    let record = params.record
    this.currentId = record.getSysId()
  }
}

return Snapshot
