import * as NodeSet from './api/NodeSet'

let Record,
  collectionUtil,
  objectUtil,
  primaryKey = 'id'

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
let Node = function (metadata, orginalData, tree) {
  this.tree = tree
  Record.call(this, metadata, orginalData)
}

Node.prototype.initModule = function (sb) {
  if (sb) {
    Record = sb.getService(
      'vjs.framework.extension.platform.interface.model.datasource.Record'
    )
    collectionUtil = sb.util.collections //sb.getService("vjs.framework.extension.util.collectionUtil");
    objectUtil = sb.util.object //sb.getService("vjs.framework.extension.util.ObjectUtil");
    let initFunc = Record.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    let prototype = Object.create(Record.prototype)
    prototype.constructor = Node
    objectUtil.extend(prototype, Node.prototype)
    Node.prototype = prototype
  }
}
/**
 * 枚举项
 * @enum {String}
 */
Node.prototype.Enum = {
  /**前*/
  ABOVE: 'Above',
  /**后*/
  BELLOW: 'Bellow',
  /**升级*/
  UPGRADE: 'UpGrade',
  /**降级*/
  DOWNGRADE: 'DownGrade'
}

/**
 *获取子节点
 * @return NodeSet
 */
Node.prototype.getChildren = function () {
  //主要考虑ParentId为“”， 根节点的情况
  let id = this.getSysId()
  let children = this.tree._getChildrenFromDatasource(id).toArray()
  let childrenData = []
  let orderField = this._getOrderField()
  children.sort(function compare(a, b) {
    return a.get(orderField) - b.get(orderField)
  })
  collectionUtil.each(children, function (record) {
    childrenData.push(record.__recordData__)
  })
  return new NodeSet(this.getMetadata(), childrenData, this.tree)
}

Node._putWidgetAction = function (widgetHandler) {
  Node.prototype.actionHandler = widgetHandler
}

/**
 * 是否根节点
 * @return Boolean
 */
Node.prototype.isRoot = function () {
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
Node.prototype.getParent = function () {
  if (this.isRoot()) {
    return null
  }
  let parentField = this._getParentField()
  return this.tree.getNodeById(this.get(parentField))
}
//获取同代节点
Node.prototype._getContempor = function () {
  let primaryVal = this.getSysId()
  let nodeSet
  if (this.isRoot()) {
    nodeSet = this.tree.getRoots()
  } else {
    let parent = this.getParent()
    nodeSet = parent.getChildren()
  }
  return nodeSet
}

Node.prototype.getOlderBrothers = function () {
  let contempor = this._getContempor()
  let primaryVal = this.getSysId()
  let datas = []
  let iterator = contempor.iterator()
  while (iterator.hasNext()) {
    let data = iterator.nextOriginalData()
    if (primaryVal == data[primaryKey]) {
      break
    }
    datas.push(data)
  }
  return new NodeSet(this.getMetadata(), datas, this.tree)
}

Node.prototype._getYoungBrothers = function () {
  let contempor = this._getContempor()
  let primaryVal = this.getSysId()
  let datas = []
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
  return new NodeSet(this.getMetadata(), datas, this.tree)
}

/**
 * 获取兄弟节点
 * @return {@link NodeSet}
 */
Node.prototype.getBrother = function () {
  let primaryVal = this.getSysId()
  let nodeSet
  if (this.isRoot()) {
    nodeSet = this.tree.getRoots()
  } else {
    let parent = this.getParent()
    nodeSet = parent.getChildren()
  }
  let origialDatas = nodeSet.getOriginalDatas()
  let datas = []
  collectionUtil.each(origialDatas, function (data) {
    if (primaryVal != data['id']) {
      datas.push(data)
    }
  })
  return new NodeSet(this.getMetadata(), datas, this.tree)
}

Node.prototype._getOrderField = function () {
  let treeStruct = this.tree.getTreeStruct()
  return treeStruct['orderField']
}

Node.prototype._getParentField = function () {
  let treeStruct = this.tree.getTreeStruct()
  return treeStruct['pidField']
}

Node.prototype._getIsLeafField = function () {
  return this.tree.getTreeStruct()['isLeafField']
}

Node.prototype._getDatasourceName = function () {
  let metadata = this.getMetadata()
  return metadata.getDatasourceName()
}

Node.prototype._moveAbove = function () {
  let olderBrothers = this.getOlderBrothers()
  if (olderBrothers.isEmpty()) {
    return false
  }
  let node = olderBrothers.last()
  let orderField = this._getOrderField()
  let orderIndex = this.get(orderField)
  this.set(orderField, node.get(orderField))
  node.set(orderField, orderIndex)
  this.tree.updateRecords({ records: [node, this] })
  return true
}

Node.prototype._moveBellow = function () {
  let youngBrothers = this._getYoungBrothers()
  if (youngBrothers.isEmpty()) {
    return false
  }
  let node = youngBrothers.first()
  let orderField = this._getOrderField()
  let orderIndex = this.get(orderField)
  this.set(orderField, node.get(orderField))
  node.set(orderField, orderIndex)
  this.tree.updateRecords({ records: [this, node] })
  return true
}

Node.prototype._moveUpGrade = function () {
  if (this.isRoot()) {
    //已经是根节点，无法再升级
    return false
  }
  let toUpdated = []
  toUpdated.push(this)
  let parent = this.getParent()
  let children = parent.getChildren()
  if (children.size() == 1) {
    parent.set(this._getIsLeafField(), 1)
    toUpdated.push(parent)
  }
  let parentField = this._getParentField()
  let orderField = this._getOrderField()
  this.set(parentField, parent.get(parentField))
  let contempor = parent._getContempor()
  let lastContemp = contempor.last()
  this.set(orderField, lastContemp.get(orderField) + 1)
  this.tree.updateRecords({ records: toUpdated })
  return true
}

Node.prototype._moveDownGrade = function () {
  let olderBrothers = this.getOlderBrothers()
  if (olderBrothers.isEmpty()) {
    return false
  }
  let toUpdated = []
  let node = olderBrothers.last()
  this.set(this._getParentField(), node.getSysId())
  let orderField = this._getOrderField()
  let children = node.getChildren()
  if (children.isEmpty()) {
    this.set(orderField, 1)
    node.set(this._getIsLeafField(), 0)
    toUpdated.push(node)
  } else {
    let last = children.last()
    this.set(orderField, last.get(orderField) + 1)
  }
  toUpdated.push(this)
  this.tree.updateRecords({ records: toUpdated })
  let treeStruct = this.tree.getTreeStruct()
  let refWidgetId = treeStruct.refWidgetId
  if (refWidgetId && this.actionHandler) {
    //如果没有绑定到树控件，则不需要展开节点
    this.actionHandler.executeWidgetAction(
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
Node.prototype.move = function (params) {
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
Node.prototype.moveTo = function (params) {
  let toUpdated = []
  let contempor = this._getContempor()
  if (contempor.size() == 1) {
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
    orderNo = children.last().get(orderField) + 1
  }
  this.set(orderField, orderNo)
  toUpdated.push(this)
  this.tree.updateRecords({ records: toUpdated })
  let treeStruct = this.tree.getTreeStruct()
  let refWidgetId = treeStruct.refWidgetId
  if (refWidgetId && this.actionHandler) {
    //如果没有绑定到树控件，则不需要展开节点
    this.actionHandler.executeWidgetAction(
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
Node.prototype.isLeaf = function () {
  let isLeafField = this._getIsLeafField()
  return this.get(isLeafField) == '0' || this.get(isLeafField) == false
    ? false
    : true
}

/**
 * 克隆树节点
 * @return Node
 */
Node.prototype.clone = function () {
  let node = new Node(this.metadata, this.__recordData__, this.tree)
  let changeData = this.changedData
  if (changeData) {
    let cloneObj = objectUtil.clone(changeData)
    cloneRecord.changedData = cloneObj
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
Node.prototype.addChildren = function (params) {
  let children = params.children
  if (children.length > 0) {
    let set = this.getChildren()
    let parentId = this.getSysId(),
      orderIndex,
      parentField = this._getParentField(),
      orderField = this._getOrderField()
    if (set.isEmpty()) {
      orderIndex = 1
      this.set(this._getIsLeafField(), 0)
      this.tree.updateRecords({ records: [this] })
    } else {
      let last = set.last()
      orderIndex = last.get(orderField) + 1
    }
    collectionUtil.each(children, function (child) {
      child.set(parentField, parentId).set(orderField, orderIndex)
      orderIndex++
    })
    this.tree.insertRecords({ records: children })
  }
}

Node.prototype._addAboveBrothers = function (nodes) {
  let toAdded = [],
    toUpdated = []
  let parentField = this._getParentField(),
    orderField = this._getOrderField()
  let parentId = this.get(parentField)
  let startOrder = this.get(orderField)
  let len = nodes.length
  for (let i = 0; i < len; i++) {
    let node = nodes[i]
    node.set(parentField, parentId).set(orderField, startOrder + i)
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

Node.prototype._addBellowBrothers = function (nodes) {
  let toAdded = [],
    toUpdated = []
  let parentField = this._getParentField(),
    orderField = this._getOrderField()
  let parentId = this.get(parentField)
  let startOrder = this.get(orderField)
  let len = nodes.length
  for (let i = 0; i < len; i++) {
    let node = nodes[i]
    node.set(parentField, parentId).set(orderField, startOrder + i + 1)
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
Node.prototype.addBrothers = function (params) {
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

return Node
