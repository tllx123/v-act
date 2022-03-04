define('./NodeSet', function (require, exports, module) {
  var Node, NodeSetIterator

  /**
   * 树数据源结果集
   * @constructor
   * @alias NodeSet
   * @catalog 数据源/树数据源定义
   */
  function NodeSet(resultset) {
    this.resultset = resultset
  }

  NodeSet.prototype = {
    initModule: function () {
      Node = require('vjs/framework/extension/platform/services/integration/vds/tree/Node')
      NodeSetIterator = require('vjs/framework/extension/platform/services/integration/vds/tree/NodeSetIterator')
    },

    _to: function (node) {
      return !node ? null : new Node(node)
    },
    /**
     * 获取结果集迭代器
     * @returns {@link NodeSetIterator}
     * @example
     * var tree = vds.tree.lookup("tree1", treeStruct);
     * var resultSet = tree.getAllRecords();
     * var iterator = resultSet.interator();
     */
    iterator: function () {
      return new NodeSetIterator(this.resultset.iterator())
    },
    /**
     * 结果集是否为空
     * @returns Boolean
     * @example
     * var tree = vds.tree.lookup("tree1", treeStruct);
     * var resultSet = tree.getAllRecords();
     * var empty = resultSet.isEmpty();
     */
    isEmpty: function () {
      return this.resultset.isEmpty()
    },
    /**
     * 结果集记录数
     * @returns Boolean
     * @example
     * var tree = vds.tree.lookup("tree1", treeStruct);
     * var resultSet = tree.getAllRecords();
     * var size = resultSet.size();
     */
    size: function () {
      return this.resultset.size()
    },
    /**
     * 将结果集转换成原生数组
     * 注意：当记录数多时，此方法会存在性能隐患
     * @returns Array<{@link Node}>
     * @example
     * var tree = vds.tree.lookup("tree1", treeStruct);
     * var resultSet = tree.getAllRecords();
     * var list = resultSet.toArray();
     */
    toArray: function () {
      var list = this.resultset.toArray()
      var rs = []
      for (var i = 0, l = list.length; i < l; i++) {
        rs.push(this._to(list[i]))
      }
      return rs
    },
    /**
     * 获取指定下标的节点
     * @param {Integer} i 记录下标
     * @returns {@link Node}
     * @example
     * var tree = vds.tree.lookup("tree1", treeStruct);
     * var resultSet = tree.getAllRecords();
     * var node = resultSet.index(1);
     */
    index: function (i) {
      return this._to(this.resultset.index(i))
    },

    /**
     * 获取第一条节点
     * @returns {@link Node}
     * @example
     * var tree = vds.tree.lookup("tree1", treeStruct);
     * var resultSet = tree.getAllRecords();
     * var node = resultSet.first();
     */
    first: function () {
      return this._to(this.resulset.first())
    },

    /**
     * 获取最后一条节点
     * @returns {@link Node}
     * @example
     * var tree = vds.tree.lookup("tree1", treeStruct);
     * var resultSet = tree.getAllRecords();
     * var node = resultSet.last();
     */
    last: function () {
      return this._to(this.resulset.last())
    },

    /**
     * 遍历结果集
     * @param {Function} fn 迭代函数，入参定义:1、数据源记录 2、记录下标
     * @example
     * var tree = vds.tree.lookup("tree1", treeStruct);
     * var resultSet = tree.getAllRecords();
     * resultSet.iterate(function(node,index){
     * 		var val = node.get("fieldCode1");
     * });
     */
    iterate: function (fn) {
      var func = (function (f, _t) {
        return function (node, index) {
          return f(_t._to(node), index)
        }
      })(fn, this)
      return this.resultset.iterate(func)
    },
    /**
     * 结果集克隆
     * @returns {@link NodeSet}
     * @example
     * var tree = vds.tree.lookup("tree1", treeStruct);
     * var resultSet = tree.getAllRecords();
     * var rs = resultSet.clone();
     */
    clone: function () {
      var newRes = this.resultset.clone()
      return new NodeSet(newRes)
    }
  }

  module.exports = NodeSet
})
