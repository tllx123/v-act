import Node from './Node'
import NodeSet from './NodeSet'

/**
 * @namespace NodeSetIterator
 * @class NodeSetIterator
 * @desc 结果集迭代器
 */
class NodeSetIterator {
  resultSet
  index = 0
  constructor(resultSet: NodeSet) {
    this.resultSet = resultSet
    this.index = 0
  }
  /**
   *  是否含有下一条记录
   * @return Boolean
   */
  hasNext() {
    return this.index < this.resultSet.datas.length
  }

  nextOriginalData() {
    let datas = this.resultSet.datas
    if (this.index < datas.length) {
      let data = datas[this.index]
      this.index++
      return data
    } else {
      throw Error('[NodeSetIterator.next]数组下标越界，请检查！')
    }
  }

  /**
   *获取下一条记录
   * @return {@link Node}
   */
  next() {
    return new Node(
      this.resultSet.metadata,
      this.nextOriginalData(),
      this.resultSet.tree
    )
  }
}

export default NodeSetIterator
