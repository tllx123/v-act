var NodeSet

/**
 * 树数据源节点定义
 * @constructor
 * @alias Node
 * @catalog 数据源/树数据源定义
 */
var Node = function (node) {
  this.node = node
}
/**
 * 将封装的节点列表转成原生的node列表
 * @param {Array<Node>} nodes 节点列表
 * @ignore
 * */
var _toNode = function (nodes) {
  if (!vds.object.isArray(nodes) || nodes.length < 1) {
    return []
  }
  var newNodes = []
  for (var i = 0, len = nodes.length; i < len; i++) {
    newNodes.push(nodes[i]._get())
  }
  return newNodes
}

Node.prototype = {
  initModule: function () {
    NodeSet = require('vjs/framework/extension/platform/services/integration/vds/tree/NodeSet')
  },

  _get: function () {
    return this.node
  },

  /**
   * 操作类型枚举
   * @enum {String}
   * @example
   * var tree = vds.tree.lookup("tree1", treeStruct);
   * var node = tree.getCurrentNode();
   * node.move(node.Operation.BELLOW);
   */
  Operation: {
    /**上移*/
    ABOVE: 'ABOVE',
    /**下移*/
    BELLOW: 'BELLOW',
    /**升级*/
    UPGRADE: 'UPGRADE',
    /**降级*/
    DOWNGRADE: 'DOWNGRADE'
  },
  /**
   * 移动当前节点
   * @param {Node#Operation=} operation 操作类型
   * @return {Boolean} 是否移动成功
   * */
  move: function (operation) {
    var node = this._get()
    switch (operation) {
      case this.Operation.ABOVE:
        var result = node.move({
          operation: node.Enum[operation]
        })
        return result == true
      case this.Operation.BELLOW:
        var result = node.move({
          operation: node.Enum[operation]
        })
        return result === true
      case this.Operation.UPGRADE:
        node.move({
          operation: node.Enum[operation]
        })
        return true
      case this.Operation.DOWNGRADE:
        node.move({
          operation: node.Enum[operation]
        })
        return true
    }
    return false
  },
  /**
   * 添加子节点
   * @param {Array<Node>} nodes 新增的子节点列表
   * @param {Boolean=} [resetCurrent=true] 是否重置当前行
   * */
  addChilds: function (nodes, resetCurrent) {
    var newNodes = _toNode(nodes)
    if (newNodes.length < 1) {
      return
    }
    this._get().addChildren({
      children: newNodes,
      resetCurrent: resetCurrent
    })
  },
  /**
   * 判断是否属于根节点
   * @returns {Boolean}
   * */
  isRoot: function () {
    return this._get().isRoot()
  },
  /**
   * 判断是否叶子节点
   * @returns {Boolean}
   * */
  isLeaf: function () {
    return this._get().isLeaf()
  },
  /**
   * 在当前节点前面添加兄弟节点
   * @param {Array<Node>} nodes 需要添加的节点列表
   * */
  addOlderBrothers: function (nodes) {
    var newNodes = _toNode(nodes)
    if (newNodes.length < 1) {
      return
    }
    var node = this._get()
    node.addBrothers({
      brothers: newNodes,
      operation: node.Enum.ABOVE
    })
  },
  /**
   * 在当前节点后面添加兄弟节点
   * @param {Array<Node>} nodes 需要添加的节点列表
   * */
  addYoungBrothers: function (nodes) {
    var newNodes = _toNode(nodes)
    if (newNodes.length < 1) {
      return false
    }
    var node = this._get()
    return node.addBrothers({
      brothers: newNodes,
      operation: node.Enum.BELLOW
    })
  },
  /**
   * 获取当前节点前面的兄弟节点
   * @return {NodeSet} 节点集
   * @example
   * var tree = vds.tree.looukup("tree1", treeStruct)
   * var currentNode = tree.getCurrentNode();
   * var nodeset = currentNode.getOlderBrothers();
   * */
  getOlderBrothers: function () {
    var nodeset = this._get().getOlderBrothers()
    return new NodeSet(nodeset)
  },
  //        /**
  //         * 获取当前节点后面的兄弟节点
  //         * @return {NodeSet} 节点集
  //         * @example
  //         * var tree = vds.tree.looukup("tree1")
  //         * var currentNode = tree.getCurrentNode();
  //         * currentNode.getYoungBrothers();
  //         * */
  //        getYoungBrothers:function(){
  //        },
  /**
   * 给字段赋值
   * @param {String} code 字段编码
   * @param {Any} value 值
   * */
  set: function (code, value) {
    this._get().set(code, value)
  },
  /**
   * 获取子节点
   * @returns {@link NodeSet}
   * */
  getChildren: function () {
    var nodeset = this._get().getChildren()
    return new NodeSet(nodeset)
  },
  /**
   * 获取父级节点
   * @returns {@link Node}
   * */
  getParent: function () {
    var node = this._get().getParent()
    if (node) {
      return new Node(node)
    }
    return null
  },
  /**
   * 将数据源记录转换成原生Object
   * @returns Object
   * @example
   * var tree = vds.tree.looukup("tree1", treeStruct)
   * var currentNode = tree.getCurrentNode();
   * var map = currentNode.toMap();
   */
  toMap: function () {
    return this.node.toMap()
  },

  /**
   * 获取字段值
   * @param {String} fieldCode 字段编号
   * @returns Any
   * @example
   * var tree = vds.tree.lookup("tree1");
   * var node = tree.getCurrentNode();
   * var val = node.get("fieldCode1");
   */
  get: function (fieldCode) {
    return this.node.get(fieldCode)
  },
  /**
   * 设置字段值
   * @param {String} fieldCode 字段编号
   * @param {Any} value 字段值
   * @example
   * var tree = vds.tree.lookup("tree1");
   * var node = tree.getCurrentNode();
   * node.set("fieldCode1", 120);
   */
  set: function (fieldCode, value) {
    return this.node.set(fieldCode, value)
  },

  /**
   * 获取主键值
   * @returns String
   * @example
   * var tree = vds.tree.lookup("tree1");
   * var node = tree.getCurrentNode();
   * var id = node.getSysId();
   */
  getSysId: function () {
    return this.node.getSysId()
  }
}

module.exports = Node
