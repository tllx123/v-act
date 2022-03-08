import * as Record from './api/Record'
import * as ResultSetIterator from './api/ResultSetIterator'

/**
 *	@namespace ResultSet
 *  @class ResultSet
 *  @catalog 前端实体/普通实体/结果集
 *  @desc 结果集定义<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.datasource<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.datasource.ResultSet<br/>
 *  @author xiedh
 */
let ResultSet = function (metadata, datas) {
  this.metadata = metadata
  this.datas = datas
}

ResultSet.prototype = {
  initModule: function (sBox) {},

  _isRd: function (data) {
    return data instanceof Record
  },

  _toRd: function (data) {
    return this._isRd(data) ? data : new Record(this.metadata, data)
  },

  /**
   *获取迭代器
   * @return ResultSetIterator
   */
  iterator: function () {
    return new ResultSetIterator(this)
  },

  /**
   *结果集是否包含记录
   * @return Boolean
   */
  isEmpty: function () {
    let size = this.size()
    return size < 1
  },

  /**
   * 结果集记录数量
   * @return Integer
   */
  size: function () {
    return this.datas ? this.datas.length : 0
  },

  /**
   *获取原始数据
   * @return Array
   */
  getOriginalDatas: function () {
    let datas = []
    for (let i = 0, len = this.datas.length; i < len; i++) {
      let data = this.datas[i]
      data = this._isRd(data) ? data.__recordData__ : data
      datas.push(data)
    }
    return datas
  },

  /**
   * 将结果集转换成数组
   * @return Array
   */
  toArray: function () {
    let records = []
    for (let i = 0, len = this.datas.length; i < len; i++) {
      records.push(this._toRd(this.datas[i]))
    }
    return records
  },

  /**
   *获取元数据
   * @return Metadata
   */
  getMetadata: function () {
    return this.metadata
  },

  /**
   * 获取指定下标中的节点值
   * @reuturn Record
   */
  index: function (index) {
    return index < this.size() ? this._toRd(this.datas[index]) : null
  },

  /**
   * 获取第一个树节点
   * @reuturn Record
   */
  first: function () {
    return this.isEmpty() ? null : this.index(0)
  },

  /**
   * 获取最后一个树节点
   * @reuturn Record
   */
  last: function () {
    return this.isEmpty() ? null : this.index(this.datas.length - 1)
  },

  /**
   * 遍历记录
   * @param {Function} fn 函数
   * 参数列表：1、record 记录
   * 					2、index 记录在ResultSet中的下标
   */
  iterate: function (fn) {
    for (let i = 0, len = this.datas.length; i < len; i++) {
      let rs = fn.call(this, this._toRd(this.datas[i]), i)
      if (rs === false) break
    }
  },
  /**
   * 添加记录
   * @param {Record} record 记录
   */
  addRecord: function (record) {
    this.datas.push(record)
  },

  removeByIndexs: function (indexs) {
    let array = indexs.sort(function (item, next) {
      return item - next
    })
    while (array.length > 0) {
      let i = array.pop()
      this.datas.splice(i, 1)
    }
  },

  /**
   * 结果集合并
   */
  combine: function (resultSet) {
    this.datas = this.datas.concat(resultSet.datas)
  },

  /**
   * 克隆
   */
  clone: function () {
    return new ResultSet(this.metadata, [].concat(this.datas))
  }
}

return ResultSet

export { _getDatasourceConstructor, create, isDatasource, unSerialize }
