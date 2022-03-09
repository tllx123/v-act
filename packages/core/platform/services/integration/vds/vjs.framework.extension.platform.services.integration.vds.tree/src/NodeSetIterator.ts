var Node
/**
 * 树数据源节点迭代器定义
 * @constructor
 * @alias NodeSetIterator
 * @catalog 数据源/树数据源定义
 */
var NodeSetIterator = function (nodeSetIterator) {
  this.nodeSetIterator = nodeSetIterator
}

NodeSetIterator.prototype = {
  initModule: function () {
    Node = require('vjs/framework/extension/platform/services/integration/vds/tree/Node')
  },

  /**
   *  是否含有下一条记录
   * @return Boolean
   */
  hasNext: function () {
    return this.nodeSetIterator.hasNext()
  },

  /**
   *获取下一条记录
   * @return {@link Node}
   */
  next: function () {
    var node = this.nodeSetIterator.next()
    if (node) {
      return new Node(node)
    }
    return null
  }
}

return NodeSetIterator
