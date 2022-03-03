import * as Record from './api/Record'
import { ArrayUtil as arrayUtils } from '@v-act/vjs.framework.extension.util'

let undefined

/**
 * @namespace ResultSetIterator
 * @class ResultSetIterator
 * @catalog 前端实体/普通实体/结果集迭代
 * @desc 结果集迭代器
 */
let ResultSetIterator = function (resultSet) {
  this.resultSet = resultSet
  this.index = 0
}

ResultSetIterator.prototype = {
  initModule: function (sb) {},

  /**
   *  是否含有下一条记录
   * @return Boolean
   */
  hasNext: function () {
    if (this.resultSet._records) {
      return this.index < this.resultSet._records.length
    }
    return this.index < this.resultSet.datas.length
  },

  /**
   *获取下一条记录
   * @return {@link Record}
   */
  next: function () {
    let datas = this.resultSet.datas
    if (this.index < datas.length) {
      let record = this.resultSet._toRd(datas[this.index])
      this.index++
      return record
    }
    throw Error('[ResultSet.Iterator.next]数组下标越界，请检查！')
  },

  remove: function () {
    let datas = this.resultSet.datas
    this.index--
    arrayUtils.remove(datas, datas[this.index])
  }
}

return ResultSetIterator

export { create, unSerialize, isDatasource, _getDatasourceConstructor }
