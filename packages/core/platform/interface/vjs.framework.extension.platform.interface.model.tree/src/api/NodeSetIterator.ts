import * as Node from './api/Node'

let undefined

/**
 * @namespace NodeSetIterator
 * @class NodeSetIterator
 * @desc 结果集迭代器
 */
let NodeSetIterator = function (resultSet) {
  this.resultSet = resultSet
  this.index = 0
}

NodeSetIterator.prototype = {
  initModule: function () {},

  /**
   *  是否含有下一条记录
   * @return Boolean
   */
  hasNext: function () {
    return this.index < this.resultSet.datas.length
  },

  nextOriginalData: function () {
    let datas = this.resultSet.datas
    if (this.index < datas.length) {
      let data = datas[this.index]
      this.index++
      return data
    } else {
      throw Error('[NodeSetIterator.next]数组下标越界，请检查！')
    }
  },

  /**
   *获取下一条记录
   * @return {@link Node}
   */
  next: function () {
    return new Node(
      this.resultSet.metadata,
      this.nextOriginalData(),
      this.resultSet.tree
    )
  }
}

return NodeSetIterator
