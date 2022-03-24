import { ArrayUtil as arrayUtils } from '@v-act/vjs.framework.extension.util.array'
import ResultSet from './ResultSet'

/**
 * @namespace ResultSetIterator
 * @class ResultSetIterator
 * @catalog 前端实体/普通实体/结果集迭代
 * @desc 结果集迭代器
 */

export default class ResultSetIterator {
  constructor(public resultSet: ResultSet, public index = 0) {
    return this
  }

  initModule(sb: any) {}

  /**
   *  是否含有下一条记录
   * @return Boolean
   */
  hasNext() {
    if (this.resultSet.datas) {
      return this.index < this.resultSet.datas.length
    }
    return this.index < this.resultSet.datas.length
  }

  /**
   *获取下一条记录
   * @return {@link Record}
   */
  next() {
    let datas = this.resultSet.datas
    if (this.index < datas.length) {
      let record = this.resultSet._toRd(datas[this.index])
      this.index++
      return record
    }
    throw Error('[ResultSet.Iterator.next]数组下标越界，请检查！')
  }

  remove() {
    let datas = this.resultSet.datas
    this.index--
    arrayUtils.remove(datas, datas[this.index])
  }
}
