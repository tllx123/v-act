import Node from './Node'

/**
 * 树数据源节点迭代器定义
 * @constructor
 * @alias NodeSetIterator
 * @catalog 数据源/树数据源定义
 */
class NodeSetIterator {
  nodeSetIterator: any

  constructor(nodeSetIterator: any) {
    this.nodeSetIterator = nodeSetIterator
  }

  /**
   *  是否含有下一条记录
   * @return Boolean
   */
  hasNext() {
    return this.nodeSetIterator.hasNext()
  }

  /**
   *获取下一条记录
   * @return {@link Node}
   */
  next() {
    var node = this.nodeSetIterator.next()
    if (node) {
      return new Node(node)
    }
    return null
  }
}

export default NodeSetIterator
