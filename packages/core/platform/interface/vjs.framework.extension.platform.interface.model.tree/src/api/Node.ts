import NodeSet from './NodeSet'
import { Metadata } from '@v-act/vjs.framework.extension.platform.interface.model.metadata'
import { Record } from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { CollectionUtil as collectionUtil } from '@v-act/vjs.framework.extension.util.collection'
import { ObjectUtil as objectUtil } from '@v-act/vjs.framework.extension.util.object'
import Tree from './Tree'

let primaryKey = 'id'

/**
 * @namespace Node
 * @class Node
 * @desc 树节点定义<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.tree<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.tree.Node<br/>
 * @author xiedh
 * @example
 * 该模块不能直接创建，使用前添加vjs.framework.extension.platform.services.model.manager.tree vjs模块依赖
 * var treeManager = sandbox.getService("vjs.framework.extension.platform.services.model.manager.tree.TreeManager");
 * var tree = treeManager.lookup({"datasourceName":"tree1","treeStruct":treeStruct});
 * var node = tree.createNode();
 */
class Node extends Record {
  /**
   * 枚举项
   * @enum {String}
   */
  static Enum = {
    /**前*/
    ABOVE: 'Above',
    /**后*/
    BELLOW: 'Bellow',
    /**升级*/
    UPGRADE: 'UpGrade',
    /**降级*/
    DOWNGRADE: 'DownGrade'
  }
  tree
  constructor(
    metadata: Metadata,
    orginalData: { [fieldCode: string]: any },
    tree: Tree
  ) {
    super(metadata, orginalData)
    this.tree = tree
  }

  /**
   *获取子节点
   * @return NodeSet
   */
  getChildren() {
    //主要考虑ParentId为“”， 根节点的情况
    let id = this.getSysId()
    let children = this.tree._getChildrenFromDatasource(id).toArray()
    let childrenData: Array<Node> = []
    let orderField = this._getOrderField()
    children.sort(function compare(a: Node, b: Node) {
      return a.get(orderField) - b.get(orderField)
    })
    collectionUtil.each(children, function (record) {
      childrenData.push(record.__recordData__)
    })
    return new NodeSet(this.getMetadata(), childrenData, this.tree)
  }

  /**
   * 是否根节点
   * @return Boolean
   */
  isRoot() {
    let parentField = this._getParentField()
    if (this.get(parentField) == '') {
      return true
    }
    let nodeSet = this.tree.getRoots()
    let isRoot = false
    let iterator = nodeSet.iterator()
    while (iterator.hasNext()) {
      let node = iterator.next()
      if (node.getSysId() == this.getSysId()) {
        isRoot = true
        break
      }
    }
    return isRoot
  }

  /**
   * 获取父节点
   * @return Node
   */
  getParent() {
    if (this.isRoot()) {
      return null
    }
    let parentField = this._getParentField()
    return this.tree.getNodeById(this.get(parentField))
  }
  //获取同代节点
  _getContempor() {
    let nodeSet
    if (this.isRoot()) {
      nodeSet = this.tree.getRoots()
    } else {
      let parent = this.getParent()
      nodeSet = parent ? parent.getChildren() : null
    }
    return nodeSet
  }

  getOlderBrothers() {
    let contempor = this._getContempor()
    let primaryVal = this.getSysId()
    let datas = []
    if (contempor) {
      let iterator = contempor.iterator()
      while (iterator.hasNext()) {
        let data = iterator.nextOriginalData()
        if (primaryVal == data[primaryKey]) {
          break
        }
        datas.push(data)
      }
    }
    return new NodeSet(this.getMetadata(), datas, this.tree)
  }

  _getYoungBrothers() {
    let contempor = this._getContempor()
    let primaryVal = this.getSysId()
    let datas = []
    if (contempor) {
      let iterator = contempor.iterator()
      let flag = false
      while (iterator.hasNext()) {
        let data = iterator.nextOriginalData()
        if (flag) {
          datas.push(data)
        }
        if (primaryVal == data[primaryKey]) {
          flag = true
        }
      }
    }
    return new NodeSet(this.getMetadata(), datas, this.tree)
  }

  /**
   * 获取兄弟节点
   * @return {@link NodeSet}
   */
  getBrother() {
    let primaryVal = this.getSysId()
    let nodeSet
    if (this.isRoot()) {
      nodeSet = this.tree.getRoots()
    } else {
      let parent = this.getParent()
      nodeSet = parent ? parent.getChildren() : null
    }
    if (nodeSet) {
      let origialDatas = nodeSet.getOriginalDatas()
      let datas: Array<{ [fieldCode: string]: any }> = []
      collectionUtil.each(origialDatas, function (data) {
        if (primaryVal != data['id']) {
          datas.push(data)
        }
      })
      return new NodeSet(this.getMetadata(), datas, this.tree)
    }
    return null
  }

  _getOrderField() {
    let treeStruct = this.tree.getTreeStruct()
    return treeStruct['orderField']
  }

  _getParentField() {
    let treeStruct = this.tree.getTreeStruct()
    return treeStruct['pidField']
  }

  _getIsLeafField() {
    return this.tree.getTreeStruct()['isLeafField']
  }

  _getDatasourceName() {
    let metadata = this.getMetadata()
    return metadata.getDatasourceName()
  }

  _moveAbove() {
    let olderBrothers = this.getOlderBrothers()
    if (olderBrothers.isEmpty()) {
      return false
    }
    let node = olderBrothers.last()
    let orderField = this._getOrderField()
    let orderIndex = this.get(orderField)
    if (node) {
      this.set(orderField, node.get(orderField))
      node.set(orderField, orderIndex)
    }
    this.tree.updateRecords({ records: [node, this] })
    return true
  }

  _moveBellow() {
    let youngBrothers = this._getYoungBrothers()
    if (youngBrothers.isEmpty()) {
      return false
    }
    let node = youngBrothers.first()
    let orderField = this._getOrderField()
    let orderIndex = this.get(orderField)
    if (node) {
      this.set(orderField, node.get(orderField))
      node.set(orderField, orderIndex)
    }
    this.tree.updateRecords({ records: [this, node] })
    return true
  }

  _moveUpGrade() {
    if (this.isRoot()) {
      //已经是根节点，无法再升级
      return false
    }
    let toUpdated = []
    toUpdated.push(this)
    let parent = this.getParent()
    if (!parent) return false
    let children = parent.getChildren()
    if (children.size() == 1) {
      parent.set(this._getIsLeafField(), 1)
      toUpdated.push(parent)
    }
    let parentField = this._getParentField()
    let orderField = this._getOrderField()
    this.set(parentField, parent.get(parentField))
    let contempor = parent._getContempor()
    if (!contempor) return false
    let lastContemp = contempor.last()
    if (!lastContemp) return false
    this.set(orderField, lastContemp.get(orderField) + 1)
    this.tree.updateRecords({ records: toUpdated })
    return true
  }

  _moveDownGrade() {
    let olderBrothers = this.getOlderBrothers()
    if (olderBrothers.isEmpty()) {
      return false
    }
    let toUpdated = []
    let node = olderBrothers.last()
    if (!node) return false
    this.set(this._getParentField(), node.getSysId())
    let orderField = this._getOrderField()
    let children = node.getChildren()
    if (children.isEmpty()) {
      this.set(orderField, 1)
      node.set(this._getIsLeafField(), 0)
      toUpdated.push(node)
    } else {
      let last = children.last()
      if (!last) return false
      this.set(orderField, last.get(orderField) + 1)
    }
    toUpdated.push(this)
    this.tree.updateRecords({ records: toUpdated })
    let treeStruct = this.tree.getTreeStruct()
    let refWidgetId = treeStruct.refWidgetId
    if (refWidgetId && this.tree.actionHandler) {
      //如果没有绑定到树控件，则不需要展开节点
      this.tree.actionHandler.executeWidgetAction(
        refWidgetId,
        'openNode',
        node.getSysId()
      )
    }
    return true
  }
  /**
   * 移动树节点
   * @param {Object} params 参数信息
   * {
   * 		operation：{@link Node#Enum|Enum} 移动方式
   * }
   */
  move(params: { operation: string }) {
    let operation = params.operation
    let method = '_move' + operation
    if (this[method]) {
      return this[method].call(this)
    } else {
      throw Error(
        '[Node.prototype.move]未识别树形操作[' + operation + '],请检查！'
      )
    }
  }

  /**
   * 将树节点移动到目标节点下
   * @param {Object} params 参数信息
   * {
   * 		destination : {@link Node} 目标节点
   * }
   */
  moveTo(params: { destination: Node }) {
    let toUpdated = []
    let contempor = this._getContempor()
    if (contempor && contempor.size() == 1) {
      let parent = this.getParent()
      if (parent) {
        parent.set(this._getIsLeafField(), 1)
        toUpdated.push(parent)
      }
    }
    let toNode = params.destination
    this.set(this._getParentField(), toNode.getSysId())
    let children = toNode.getChildren()
    let orderField = this._getOrderField()
    let orderNo
    if (children.isEmpty()) {
      orderNo = 1
      toNode.set(this._getIsLeafField(), 0)
      toUpdated.push(toNode)
    } else {
      const last = children.last()
      orderNo = last ? last.get(orderField) + 1 : 0
    }
    this.set(orderField, orderNo)
    toUpdated.push(this)
    this.tree.updateRecords({ records: toUpdated })
    let treeStruct = this.tree.getTreeStruct()
    let refWidgetId = treeStruct.refWidgetId
    if (refWidgetId && this.tree.actionHandler) {
      //如果没有绑定到树控件，则不需要展开节点
      this.tree.actionHandler.executeWidgetAction(
        refWidgetId,
        'openNode',
        toNode.getSysId()
      )
    }
    return true
  }

  /**
   * 是否为叶子节点
   * @return Boolean
   */
  isLeaf() {
    let isLeafField = this._getIsLeafField()
    return this.get(isLeafField) == '0' || this.get(isLeafField) == false
      ? false
      : true
  }

  /**
   * 克隆树节点
   * @return Node
   */
  clone() {
    let node = new Node(this.metadata, this.__recordData__, this.tree)
    let changeData = this.changedData
    if (changeData) {
      let cloneObj = objectUtil.clone(changeData)
      node.changedData = cloneObj
    }
    return node
  }

  /**
   * 添加子节点
   * @param {Object} params 参数信息
   * {
   * 		"children": Array<{@link Node}> 子节点信息
   * }
   */
  addChildren(params: { children: Array<Node> }) {
    let children = params.children
    if (children.length > 0) {
      let set = this.getChildren()
      let parentId = this.getSysId(),
        orderIndex = 0,
        parentField = this._getParentField(),
        orderField = this._getOrderField()
      if (set.isEmpty()) {
        orderIndex = 1
        this.set(this._getIsLeafField(), 0)
        this.tree.updateRecords({ records: [this] })
      } else {
        let last = set.last()
        orderIndex = last ? last.get(orderField) + 1 : 0
      }
      collectionUtil.each(children, function (child) {
        child.set(parentField, parentId)
        child.set(orderField, orderIndex)
        orderIndex++
      })
      this.tree.insertRecords({ records: children })
    }
  }

  _addAboveBrothers(nodes: Array<Node>) {
    let toAdded = [],
      toUpdated = []
    let parentField = this._getParentField(),
      orderField = this._getOrderField()
    let parentId = this.get(parentField)
    let startOrder = this.get(orderField)
    let len = nodes.length
    for (let i = 0; i < len; i++) {
      let node = nodes[i]
      node.set(parentField, parentId)
      node.set(orderField, startOrder + i)
      toAdded.push(node)
    }
    startOrder = startOrder + len
    this.set(orderField, startOrder)
    toUpdated.push(this)
    let youngBrothers = this._getYoungBrothers()
    if (!youngBrothers.isEmpty()) {
      let iterator = youngBrothers.iterator()
      while (iterator.hasNext()) {
        let n = iterator.next()
        n.set(orderField, ++startOrder)
        toUpdated.push(n)
      }
    }
    if (toAdded.length > 0) {
      this.tree.insertRecords({ records: toAdded })
    }
    if (toUpdated.length > 0) {
      this.tree.updateRecords({ records: toUpdated })
    }
  }

  _addBellowBrothers(nodes: Array<Node>) {
    let toAdded = [],
      toUpdated = []
    let parentField = this._getParentField(),
      orderField = this._getOrderField()
    let parentId = this.get(parentField)
    let startOrder = this.get(orderField)
    let len = nodes.length
    for (let i = 0; i < len; i++) {
      let node = nodes[i]
      node.set(parentField, parentId)
      node.set(orderField, startOrder + i + 1)
      toAdded.push(node)
    }
    startOrder = startOrder + len
    let youngBrothers = this._getYoungBrothers()
    if (!youngBrothers.isEmpty()) {
      let iterator = youngBrothers.iterator()
      while (iterator.hasNext()) {
        let n = iterator.next()
        n.set(orderField, ++startOrder)
        toUpdated.push(n)
      }
    }
    if (toAdded.length > 0) {
      this.tree.insertRecords({ records: toAdded })
    }
    if (toUpdated.length > 0) {
      this.tree.updateRecords({ records: toUpdated })
    }
  }

  /**
   * 添加兄弟节点
   * @param {Object} params 参数信息
   * {
   * 		"brothers": Array<{@link Node}> 节点信息
   * 		"operation" : {@link Node#Enum|Enum} 操作方式
   * }
   */
  addBrothers(params: { brothers: Array<Node>; operation: string }) {
    let brothers = params.brothers
    if (brothers && brothers.length > 0) {
      let operation = params.operation
      let method = '_add' + operation + 'Brothers'
      if (this[method]) {
        this[method].call(this, brothers)
        return true
      } else {
        throw Error(
          '[Node.prototype.move]未识别树形操作[' + operation + '],请检查！'
        )
      }
    }
    return false
  }
}

export default Node
