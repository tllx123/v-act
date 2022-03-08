import * as actionHandler from 'module'
import * as dbManager from 'module'
import * as jsTool from 'module'
import * as log from 'module'
import * as rendererUtil from 'module'
import * as viewContext from 'module'
import * as viewModel from 'module'
import * as whereRestrict from 'module'

import { MapUtil as mapUtil } from '@v-act/vjs.framework.extension.util.map'
import { uuid } from '@v-act/vjs.framework.extension.util.uuid'

export function initModule(sBox) {}

/**
 * 移动的状态ss
 */
let Enum_MoveTo = {
  ABOVE: 'ABOVE',
  BELOW: 'BELOW',
  APPEND: 'APPEND'
}
/**
 *  获取treeViewModel 的实例(请通过treeViewModelFactory获取实例)
 *  @param dataSourceName 数据源
 *  @param treeStruct 树结构信息，单条记录。 不接受数组
 *  @return treeViewModel
 */
let getInstance = function (dataSourceName, treeStruct) {
  return new TreeViewModel(dataSourceName, treeStruct)
}
/**
 * 给数据源插入记录的对象
 * @param dataSourceName 数据源
 * @param treeStruct  插入的条数
 */
function TreeViewModel(dataSourceName, treeStruct) {
  this.dataSourceName = dataSourceName
  this.treeStruct = treeStruct
  this.treeType = treeStruct['type']
  this.isLeafRefField = treeStruct['isLeafField']
  this.orderNoRefField = treeStruct['orderField']
  this.parentIdRefField = treeStruct['pidField']
  this.innerCodeField = treeStruct['treeCodeField']
  this.leftField = treeStruct['leftField']
  this.rightField = treeStruct['rightField']
  //设置关联控件id
  if (!treeStruct.hasOwnProperty('refWidgetId')) {
    let metaModule = viewModel.getMetaModule()
    let widgetIds = metaModule.getWidgetIdsByDataSource(dataSourceName)
    if (widgetIds && widgetIds.length > 0) {
      for (let i = 0, widgetId; (widgetId = widgetIds[i]); i++) {
        let widget = viewContext.getRuntimeWidgetObjFromContext(widgetId)
        if (
          widget &&
          widget.getParentField &&
          typeof widget.getParentField == 'function'
        ) {
          let parentField = widget.getParentField()
          if (
            parentField == this.parentIdRefField ||
            parentField.toUpperCase() == this.parentIdRefField.toUpperCase()
          ) {
            this.treeStruct.refWidgetId = widgetId
            break
          }
        }
      }
    }
  }
  //this._init = false;
  //this.nodesLoadInfo = [];
  //this._initNodeLoadInfo(this.dataSourceName);
}

/**
 * 获取父亲节点ID的数据库存储字段
 * @param widgetId 控件ID
 */
TreeViewModel.prototype.getParentIdRefField = function () {
  return this.parentIdRefField
}
/**
 * 获取父亲节点ID的数据库存储字段
 * @param widgetId 控件ID
 */
TreeViewModel.prototype.getOrderNoRefField = function () {
  return this.orderNoRefField
}
/**
 * 获取叶子信息的数据库存储字段
 * @param widgetId 控件ID
 */
TreeViewModel.prototype.getIsLeafRefField = function (widgetId) {
  return this.isLeafRefField
}
/**
 * 获取treeViewModel的数据源
 */
TreeViewModel.prototype.getDataSourceName = function () {
  return this.dataSourceName
}
/**
 * 获取treeViewModel的树形结构
 */
TreeViewModel.prototype.getTreeStruct = function () {
  return this.treeStruct
}
/**
 * 获取根节点
 *  @param sorted 需要排序吗
 * 获取树的根节点， 需要考虑加载了整棵树和子树的两种情况。目前并没有好的办法去判断这两种情况。
 * 所以这里没有使用调用getChildren("")的方法去获取根节点。
 * 采用一种变通的方式处理: 在viewModel中没有父亲节点即为根节点
 */
TreeViewModel.prototype.getRoots = function (sorted) {
  let records = viewModel.getDataModule().getAllRecordsByDS(this.dataSourceName)
  //如果所有节点都没有， 说明没有加载过
  if (records && jsTool.isArray(records) && records.length > 0) {
    roots = this.getRootsInRecords(records, false)
  } else {
    this._loadNodeFromDB('')
    roots = this.getChildrenFromViewModel('')
  }
  if (sorted && sorted !== false) {
    let orderNoRefField = this.orderNoRefField
    if (orderNoRefField) {
      roots.sort(function compare(a, b) {
        return a.get(orderNoRefField) - b.get(orderNoRefField)
      })
    }
  }
  return roots
}
/**
 * 获取records中的顶级节点
 * @param records 记录集
 */
TreeViewModel.prototype.getRootsInRecords = function (records, sorted) {
  let roots = []
  let idMap = {}
  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    idMap[record.getSysId()] = record
  }
  for (let id in idMap) {
    let record = idMap[id]
    let parentId = record.get(this.parentIdRefField)
    if (!idMap[parentId]) {
      //没有找到父节点
      roots.push(record)
    }
  }

  if (sorted && sorted !== false) {
    let orderNoRefField = this.orderNoRefField
    if (orderNoRefField) {
      roots.sort(function compare(a, b) {
        return a.get(orderNoRefField) - b.get(orderNoRefField)
      })
    }
  }
  return roots
}
/**
 * 判断记录是否为根节点
 * @param record
 */
TreeViewModel.prototype._isRoot = function (record) {
  if (!record) {
    throw new Error(
      '\u53c2\u6570\u4f20\u5165\u9519\u8bef\uff0c \u8bf7\u68c0\u67e5\uff01'
    )
  }
  if (
    !record.get(this.parentIdRefField) &&
    record.get(this.parentIdRefField) == ''
  ) {
    return true
  }
  let roots = this.getRoots(false)
  let isRoot = false
  for (let i = 0; i < roots.length; i++) {
    if (roots[i].getSysId() == record.getSysId()) {
      isRoot = true
      break
    }
  }
  return isRoot
}
/**
 * 判断记录是否为根节点
 * @param record
 */
TreeViewModel.prototype.isRoot = function (record, roots) {
  if (!record) {
    throw new Error(
      '\u53c2\u6570\u4f20\u5165\u9519\u8bef\uff0c \u8bf7\u68c0\u67e5\uff01'
    )
  }
  if (
    !record.get(this.parentIdRefField) &&
    record.get(this.parentIdRefField) == ''
  ) {
    return true
  }
  if (!roots || roots.length == 0) {
    roots = this.getRoots(false)
  }
  let isRoot = false
  for (let i = 0; i < roots.length; i++) {
    if (roots[i].getSysId() == record.getSysId()) {
      isRoot = true
      break
    }
  }
  return isRoot
}
/**
 * 获取孩子节点
 * @param parentId 父亲节点记录
 * @param sorted 是否排序
 */
TreeViewModel.prototype.getChildren = function (parentId, sorted) {
  //主要考虑ParentId为“”， 根节点的情况
  let children = this.getChildrenFromViewModel(parentId)
  if (!children || (jsTool.isArray(children) && children.length <= 0)) {
    let parent = this._getRecordValue(parentId)
    if (!parent || parent.get(this.isLeafRefField) == true) {
      return []
    }
    this._loadNodeFromDB(parentId)
    children = this.getChildrenFromViewModel(parentId)
  }
  if (sorted && sorted !== false) {
    let orderNoRefField = this.orderNoRefField
    children.sort(function compare(a, b) {
      return a.get(orderNoRefField) - b.get(orderNoRefField)
    })
  }
  return children
}
/**
 * 获取父亲节点
 * @param nodeId
 */
TreeViewModel.prototype.getParent = function (nodeId) {
  let node = this._getRecordValue(nodeId)
  let parentNode = this.getParentByNode(node)
  return parentNode
}
/**
 * 获取父亲节点
 * @param nodeId
 */
TreeViewModel.prototype.getParentByNode = function (node) {
  let parentNode = null
  if (node) {
    let parentId
    let datas = node.toMap()
    if (datas.hasOwnProperty(this.parentIdRefField)) {
      parentId = node.get(this.parentIdRefField)
    } else {
      record = this._getRecordValue(node.getSysId())
      parentId = record.get(this.parentIdRefField)
    }
    parentNode = this._getRecordValue(parentId)
  }
  return parentNode
}
/**
 * 获取父亲节点ID, 主要用于兼容 bizCodeTree
 * @param nodeId
 */
TreeViewModel.prototype.getParentIdByNode = function (node) {
  let parentId = null
  if (node) {
    parentId = node.get(this.parentIdRefField)
  }
  return parentId
}
/**
 * 删除节点（同时清理子树）
 * @param recordId
 */
TreeViewModel.prototype.deleteNode = function (recordId) {
  let treeStruct = this.getTreeStruct()
  let refWidgetId = treeStruct.refWidgetId
  let dataModule = viewModel.getDataModule()
  let parentToLeaf = false
  let parentId
  if (refWidgetId) {
    let exist = actionHandler.executeWidgetAction(
      refWidgetId,
      'nodeExist',
      recordId
    )
    if (exist) {
      parentId = actionHandler.executeWidgetAction(
        refWidgetId,
        'getParentId',
        recordId
      )
      let descendantIds = actionHandler.executeWidgetAction(
        refWidgetId,
        'getDescendantIds',
        recordId
      )
      this._clearTreeNodes(descendantIds)
      dataModule.removeByDS(this.dataSourceName, [recordId])
      let childrenIds = actionHandler.executeWidgetAction(
        refWidgetId,
        'getChildrenIds',
        parentId
      )
      parentToLeaf = childrenIds.length == 0
    }
  } else {
    //如果没有关联到树控件
    let record = dataModule.getRecordById(this.dataSourceName, recordId)
    if (record) {
      let criteria = {
        fieldName: this.innerCodeField,
        operator: 'startsWith',
        value: record.get(this.innerCodeField)
      }
      let db = dbManager.getDB(this.dataSourceName)
      let descendants = db.queryRecord(criteria)
      if (descendants && descendants.length > 0) {
        let descendantIds = []
        for (let i = 0, descendant; (descendant = descendants[i]); i++) {
          descendantIds.push(descendant.getSysId())
        }
        this._clearTreeNodes(descendantIds)
      }
      parentId = this.getParentIdByNode(record)
      criteria = {}
      criteria[this.parentIdRefField] = parentId
      let children = db.queryRecord(criteria)
      parentToLeaf = children.length == 0
    }
  }
  if (parentToLeaf) {
    let parentNode = this._getRecordValue(parentId)
    if (parentNode) {
      parentNode.set(this.isLeafRefField, 1)
      dataModule.setBaseValueByDS(this.dataSourceName, [parentNode])
    }
  }
}

/**
 * 获取节点的子树节点（不包括record自身）
 * @param record
 */
TreeViewModel.prototype.getSubTreeNodes = function (record) {
  let subNodes = []
  this._getSubTree(record, subNodes)
  return subNodes
}
/**
 * 获取子树节点
 * @param widgetId 控件ID
 * @param nodeId 节点ID
 * @param subNodes 返回值
 */
TreeViewModel.prototype._getSubTree = function (record, subNodes) {
  let children = this.getChildren(record.getSysId(), false)
  for (let i = 0; i < children.length; i++) {
    subNodes.push(children[i])
    this._getSubTree(children[i], subNodes)
  }
}
/**
 * 创建一个带有默认值的节点
 */
TreeViewModel.prototype._createRecordWithDefaultValue = function (
  defaultValue
) {
  let emptyRecord = viewModel
    .getDataModule()
    .createEmptyRecordByDS(this.dataSourceName, false, true)
  emptyRecord.set(this.isLeafRefField, 1)
  if (defaultValue) {
    for (let i = 0; i < defaultValue.length; i++) {
      emptyRecord.set(defaultValue[i]['fieldName'], defaultValue[i]['value'])
    }
  }
  if (!emptyRecord.getSysId()) {
    let newId = uuid.generate()
    emptyRecord.set('id', newId)
  }
  return emptyRecord
}
/**
 * 插入儿子节点
 * @param defaultValue 默认值
 * @param parentNode 父亲节点，parentNode 不允许为Null， 如果为null, 请调用insertBrotherNode
 */
TreeViewModel.prototype.insertSunNode = function (defaultValue, parentNode) {
  if (!parentNode) {
    rendererUtil.propmtDialog(
      '\u7236\u4eb2\u8282\u70b9\u4e3a\u7a7a\uff0c\u8bf7\u68c0\u67e5\uff01',
      false
    )
    return false
  }
  let emptyRecord = this._createRecordWithDefaultValue(defaultValue)
  emptyRecord.set(this.parentIdRefField, parentNode.getSysId())
  //设置新增节点的orderNo
  let brothers = this.getChildren(parentNode.getSysId(), true)
  if (brothers.length == 0) {
    emptyRecord.set(this.orderNoRefField, 1)
  } else {
    emptyRecord.set(
      this.orderNoRefField,
      brothers[brothers.length - 1].get(this.orderNoRefField) + 1
    )
  }
  if (parentNode.get(this.isLeafRefField)) {
    //维护父亲节点的叶子属性
    parentNode.set(this.isLeafRefField, 0)
    viewModel
      .getDataModule()
      .setBaseValueByDS(this.dataSourceName, [parentNode])
  }
  viewModel.getDataModule().insertByDS(this.dataSourceName, [emptyRecord], true)
  return emptyRecord
}
/**
 * 插入树的第一个根节点
 * @param defaultValue 默认值
 */
TreeViewModel.prototype.insertRootNode = function (defaultValue) {
  let emptyRecord = this._createRecordWithDefaultValue(defaultValue)
  let roots = this.getRoots(true)
  if (roots.length > 0) {
    emptyRecord.set(this.parentIdRefField, roots[0].get(this.parentIdRefField))
    emptyRecord.set(
      this.orderNoRefField,
      roots[roots.length - 1].get(this.orderNoRefField) + 1
    )
  } else {
    emptyRecord.set(this.parentIdRefField, '')
    emptyRecord.set(this.orderNoRefField, 1)
  }
  viewModel.getDataModule().insertByDS(this.dataSourceName, [emptyRecord], true)
  return emptyRecord
}
/**
 * 插入树节点
 * @param defaultValue 默认值
 * @param brotherNode 兄弟节点
 * @param position 和兄弟的关系， 是哥哥还是弟弟
 */
TreeViewModel.prototype.insertBrotherNode = function (
  defaultValue,
  brotherNode,
  position
) {
  let emptyRecord = this._createRecordWithDefaultValue(defaultValue)
  emptyRecord.set(this.parentIdRefField, brotherNode.get(this.parentIdRefField))
  let updateNodes = []
  switch (position) {
    case Enum_MoveTo.ABOVE:
      emptyRecord.set(
        this.orderNoRefField,
        brotherNode.get(this.orderNoRefField)
      )
      var yongerBrothers = this._addYoungerBrothersOrder(brotherNode)
      brotherNode.set(
        this.orderNoRefField,
        brotherNode.get(this.orderNoRefField) + 1
      )
      if (yongerBrothers) {
        updateNodes = yongerBrothers
      }
      updateNodes.push(brotherNode)
      break
    case Enum_MoveTo.BELOW:
      emptyRecord.set(
        this.orderNoRefField,
        brotherNode.get(this.orderNoRefField) + 1
      )
      var yongerBrothers = this._addYoungerBrothersOrder(brotherNode)
      if (yongerBrothers) {
        updateNodes = yongerBrothers
      }
      break
    default:
      break
  }
  viewModel.getDataModule().setBaseValueByDS(this.dataSourceName, updateNodes)
  viewModel.getDataModule().insertByDS(this.dataSourceName, [emptyRecord], true)
}
/**
 * 树节点的移动，只限上移、下移
 */
TreeViewModel.prototype.moveup = function (moveNode) {
  let olderBrothers = this._getOlderBrothers(moveNode)
  if (olderBrothers.length == 0) {
    return
  }
  this.moveTo(
    moveNode,
    olderBrothers[olderBrothers.length - 1],
    Enum_MoveTo.ABOVE
  )
}
/**
 * 树节点的移动，只限上移、下移
 */
TreeViewModel.prototype.movedown = function (moveNode) {
  let youngBrothers = this._getYoungBrothers(moveNode)
  if (youngBrothers.length == 0) {
    return
  }
  this.moveTo(moveNode, youngBrothers[0], Enum_MoveTo.BELOW)
}
/**
 * 树节点的移动，只限升级、降级
 */
TreeViewModel.prototype.upgrade = function (moveNode) {
  let root = this.isRoot(moveNode)
  if (root) {
    return
  }
  let moveParentNode = this._getRecordValue(moveNode.get(this.parentIdRefField))
  let toNode = this._getRecordValue(moveParentNode.get(this.parentIdRefField))
  this.moveTo(moveNode, toNode, Enum_MoveTo.APPEND)
}
/**
 * 树节点的移动，只限升级、降级
 */
TreeViewModel.prototype.downgrade = function (moveNode) {
  let olderBrothers = this._getOlderBrothers(moveNode)
  if (olderBrothers.length == 0) {
    return
  }
  let toNode = olderBrothers[olderBrothers.length - 1]
  this.moveTo(moveNode, toNode, Enum_MoveTo.APPEND)
}
/**
 * 移动节点
 * @param moveNode 待转移的节点
 * @param toNode 目标节点，如果目标节点为空，则移动到根节点
 * @param position 转移到目标节点的位置
 * @param isCallObserver 是否通知ui进行同步
 */
TreeViewModel.prototype.moveTo = function (
  moveNode,
  toNode,
  position,
  isCallObserver
) {
  let moveNodeParentId = moveNode.get(this.parentIdRefField)
  let updateNodes = []
  let reloadIds = []
  //更新父亲
  let moveBrothers = this.getChildren(moveNodeParentId)
  if (moveBrothers.length == 1) {
    let moveParentNode = this._getRecordValue(moveNodeParentId)
    moveParentNode.set(this.isLeafRefField, 1)
    updateNodes.push(moveParentNode)
  }
  let callBack
  switch (position) {
    case Enum_MoveTo.ABOVE:
      //上移
      var yongerBrothers = this._addYoungerBrothersOrder(toNode)
      moveNode.set(this.parentIdRefField, toNode.get(this.parentIdRefField))
      moveNode.set(this.orderNoRefField, toNode.get(this.orderNoRefField))
      toNode.set(this.orderNoRefField, toNode.get(this.orderNoRefField) + 1)
      if (yongerBrothers) {
        for (var i = 0, len = yongerBrothers.length; i < len; i++) {
          var brother = yongerBrothers[i]
          if (brother.getSysId() !== moveNode.getSysId()) {
            updateNodes.push(brother)
          }
        }
      }
      updateNodes.push(moveNode)
      updateNodes.push(toNode)
      reloadIds.push(toNode.get(this.parentIdRefField))
      break
    case Enum_MoveTo.BELOW:
      //下载
      var yongerBrothers = this._addYoungerBrothersOrder(toNode)
      if (yongerBrothers) {
        updateNodes = yongerBrothers
      }
      moveNode.set(this.parentIdRefField, toNode.get(this.parentIdRefField))
      moveNode.set(this.orderNoRefField, toNode.get(this.orderNoRefField) + 1)
      updateNodes.push(moveNode)
      reloadIds.push(toNode.get(this.parentIdRefField))
      break
    case Enum_MoveTo.APPEND:
      var parentID
      var orderNo
      //移动到根节点
      if (!toNode) {
        var roots = this.getRoots(true)
        orderNo = roots[roots.length - 1].get(this.orderNoRefField) + 1
        parentID = roots[0].get(this.parentIdRefField)
      } else {
        parentID = toNode.getSysId()
        var children = this.getChildren(toNode.getSysId(), true)
        if (children.length == 0) {
          toNode.set(this.isLeafRefField, 0)
          updateNodes.push(toNode)
          orderNo = 1
        } else {
          orderNo = children[children.length - 1].get(this.orderNoRefField) + 1
        }
      }
      //转移节点属性更改、顺序号更改
      moveNode.set(this.parentIdRefField, parentID)
      moveNode.set(this.orderNoRefField, orderNo)
      updateNodes.push(moveNode)
      reloadIds.push(moveNodeParentId)
      reloadIds.push(parentID)
      var treeStruct = this.getTreeStruct()
      var refWidgetId = treeStruct.refWidgetId
      if (refWidgetId) {
        //如果没有绑定到树控件，则不需要展开节点
        callBack = function () {
          actionHandler.executeWidgetAction(refWidgetId, 'openNode', parentID)
        }
      }
      break
    default:
      break
  }
  if (isCallObserver !== false) {
    //更新前前节点先加载
    this._reloadDataFromModel(reloadIds)
  }
  viewModel
    .getDataModule()
    .setBaseValueByDS(this.dataSourceName, updateNodes.reverse())
  if (callBack) {
    callBack()
  }
  return
}
/**
 * 获取节点路径
 * @param node 节点
 * @param fieldName 节点的属性字段
 */
TreeViewModel.prototype.treeNodePath = function (node, fieldName) {
  let retValue = []
  if (node) {
    let isContain = false
    let isID = false
    let nodeDataMap = node.toMap()
    fieldName = jsTool.getFieldName(fieldName)
    for (let columnName in nodeDataMap) {
      if (columnName == fieldName) {
        isContain = true
      }
    }
    //taoyz增加判断，fieldName为idField时，就取getSysId()的值
    if (fieldName == viewModel.getConstModule().getIDField()) {
      isContain = true
      isID = true
    }
    if (!isContain) {
      log.error(
        '[treeViewModel.treeNodePath]\u83b7\u53d6\u6811\u8282\u70b9\u8def\u5f84\u5931\u8d25,fieldName\u4e0d\u662f\u5f53\u524d\u5bf9\u8c61\u7684\u5c5e\u6027,\u8bf7\u68c0\u67e5\u914d\u7f6e\uff01.'
      )
      return
    }
    let tempNode = node
    while (tempNode) {
      if (isID) {
        retValue.push(tempNode.getSysId())
      } else {
        retValue.push(tempNode.get(fieldName))
      }
      tempNode = this.getParent(tempNode.getSysId())
    }
  }
  return retValue
}
/**
 * 清空加载信息
 */
TreeViewModel.prototype.resetLoadInfo = function () {
  this._init = false
  this.nodesLoadInfo = []
}
/**
 * 获取parentId 节点的子树, 以树状结构展示
 * @param 获取parentId  节点ID.  如果是整树加载，传 -1
 * @param records 数据库记录
 * @param isGenerateIcon 数据库记录(可选), 默认为true
 * @return data; 格式：[{record : xx, children:[{record: xx}]}]
 */
TreeViewModel.prototype.getTreeStructData = function (parentId, records) {
  let childrensMap = this._getChildrensMapWithIdKey(records)
  let data = this._getTreeJsonData(parentId, childrensMap)
  return data
}
/**
 * 判断记录是否为叶子节点
 */
TreeViewModel.prototype.isLeaf = function (record) {
  if (!record) {
    throw new Error(
      '\u4f20\u5165\u8bb0\u5f55\u4e3a\u7a7a\uff0c \u8bf7\u68c0\u67e5\u6570\u636e\u662f\u5426\u6b63\u786e\uff01'
    )
  }
  let isLeaf = true
  if (
    record.get(this.isLeafRefField) == '0' ||
    record.get(this.isLeafRefField) == false
  ) {
    isLeaf = false
  }
  return isLeaf
}
/**
 * 获取parentId 节点的子树
 * @param parentId  节点ID.  如果是整树加载，传 -1
 * @param records 数据库记录
 */
TreeViewModel.prototype._getTreeJsonData = function (parentId, childrensMap) {
  let datas = []
  let childs = childrensMap[parentId]
  if (childs && childs.length > 0) {
    let childCount = childs.length
    for (let i = 0; i < childCount; i++) {
      let child = childs[i]
      let id = child.getSysId()
      let node = {}
      node['record'] = child
      if (
        child.get(this.isLeafRefField) == '0' ||
        child.get(this.isLeafRefField) == false
      ) {
        let isHasChild = this._getIsHasChild(id, childrensMap)
        if (isHasChild) {
          let children = this._getTreeJsonData(id, childrensMap)
          node['children'] = children
        }
      }
      datas.push(node)
    }
  }
  return datas
}
/**
 *  组装成key为id,value为childrens数组的map
 */
TreeViewModel.prototype._getChildrensMapWithIdKey = function (records) {
  let childrensMap = []
  if (records && records.length > 0) {
    let orderNoRefField = this.orderNoRefField
    records.sort(function compare(a, b) {
      return a.get(orderNoRefField) - b.get(orderNoRefField)
    })
    for (let index = 0; index < records.length; index++) {
      let nodeId = records[index].getSysId()
      if (childrensMap[nodeId] == null) {
        childrensMap[nodeId] = []
      }
      let nodeParentId = records[index].get(this.parentIdRefField)
      let parent = this.getParent(records[index].getSysId())
      if (nodeParentId != '' && !parent) {
        log.warn(
          '\u5f53\u524d\u8bb0\u5f55\u7684parentId\u4e0d\u4e3a\u7a7a\uff0c\u4f46\u662f\u524d\u7aef\u6570\u636e\u5e93\u4e2d\u4e0d\u5b58\u5728\u7236\u4eb2\u8282\u70b9\u3002node[id] = ' +
            nodeId
        )
      }
      if (parent) {
        if (childrensMap[nodeParentId] == null) {
          childrensMap[nodeParentId] = []
        }
        childrensMap[nodeParentId].push(records[index])
      } else {
        //若是根结点,则创建一个key为"-1"的虚结点
        if (childrensMap['-1'] == null) {
          childrensMap['-1'] = []
        }
        childrensMap['-1'].push(records[index])
      }
    }
  }
  return childrensMap
}
/**
 *  判断是否有孩子
 */
TreeViewModel.prototype._getIsHasChild = function (nodeId, childrensMap) {
  let rtn = false
  let childrens = childrensMap[nodeId]
  if (childrens && childrens.length > 0) {
    rtn = true
  }
  return rtn
}
/**
 * 获取最年轻哥哥， 兄弟的关系通过orderNo维护
 * @widgetId 控件ID
 */
TreeViewModel.prototype._getYoungestOlderBrother = function (currNode) {
  let brothers = this.getChildren(currNode.get(this.parentIdRefField), true)
  let index = -1
  for (let i = 0; i < brothers.length; i++) {
    if (brothers[i].getSysId() == currNode.getSysId()) {
      index = i
      break
    }
  }
  let youngestBrother = null
  if (index > 0) {
    youngestBrother = brothers[index - 1]
  }
  return youngestBrother
}
/**
 * 获取最大的弟弟， 兄弟的关系通过orderNo维护
 * @widgetId 控件ID
 */
TreeViewModel.prototype._getOldestYoungerBrother = function (
  widgetId,
  currNode
) {
  let brothers = this.getChildren(currNode.get(this.parentIdRefField), true)
  let index = -1
  for (let i = 0; i < brothers.length; i++) {
    if (brothers[i].getSysId() == currNode.getSysId()) {
      index = i
      break
    }
  }
  let youngBrother = null
  if (index < brothers.length) {
    youngBrother = brothers[index + 1]
  }
  return youngBrother
}
/**
 * 重新加载数据， 通知handler触发load事件
 * @param widgetId 控件ID
 * @param nodeIds 需要触发重新加载数据的节点Id
 */
TreeViewModel.prototype._reloadDataFromModel = function (nodeIds) {
  let reloadIds = []
  if (nodeIds && jsTool.isArray(nodeIds) && nodeIds.length > 2) {
    throw new Error(
      '\u53ea\u652f\u6301\u5237\u65b0\u4e24\u4e2a\u8282\u70b9\uff01\u8bf7\u68c0\u67e5\u76f8\u5173\u6570\u636e\uff01'
    )
  }
  let treeNodePathData = []
  if (nodeIds && jsTool.isArray(nodeIds) && nodeIds.length == 2) {
    if (!nodeIds[0] || !nodeIds[1]) {
      reloadIds.push('')
      //刷新根
    } else {
      let node1 = this._getRecordValue(nodeIds[0])
      let node2 = this._getRecordValue(nodeIds[1])
      let treeNodePath1 = this.treeNodePath(
        node1,
        viewModel.getConstModule().getIDField()
      )
      let treeNodePath2 = this.treeNodePath(
        node2,
        viewModel.getConstModule().getIDField()
      )
      let len
      if (treeNodePath1.length >= treeNodePath2.length) {
        len = treeNodePath2.length - 1
      } else {
        len = treeNodePath1.length - 1
      }
      if (treeNodePath2[len] == treeNodePath1[len]) {
        reloadIds.push(treeNodePath2[len])
      } else {
        reloadIds = reloadIds.concat(nodeIds)
      }
    }
  }
  let treeStruct = this.getTreeStruct()
  let refWidgetId = treeStruct.refWidgetId
  for (let i = 0; i < reloadIds.length; i++) {
    let nodeId = reloadIds[i]
    let isLoaded
    if (refWidgetId) {
      isLoaded = actionHandler.executeWidgetAction(
        refWidgetId,
        'isLoad',
        nodeId
      )
    } else {
      let critera = {}
      critera[this.parentIdRefField] = nodeId
      let children = dbManager.getDB(this.dataSourceName).queryRecord(critera)
      isLoaded = children && children.length > 0
    }
    if (isLoaded) {
      continue
    }
    let children = []
    let childs
    if (nodeId) {
      let record = this._getRecordValue(nodeId)
      childs = this.getChildren(record.getSysId())
    } else {
      childs = this.getRoots()
    }
    children = children.concat(childs)
    viewModel.getSysModule().loadDataToObserver(this.dataSourceName, children)
  }
}
/**
 * 当前节点的弟弟顺序号加1
 */
TreeViewModel.prototype._addYoungerBrothersOrder = function (currNode) {
  let youngerBrothers = this._getYoungBrothers(currNode)
  if (youngerBrothers.length == 0) {
    return
  }
  for (let i = 0; i < youngerBrothers.length; i++) {
    youngerBrothers[i].set(
      this.orderNoRefField,
      youngerBrothers[i].get(this.orderNoRefField) + 1
    )
  }
  return youngerBrothers
}
/**
 * 获取哥哥节点
 */
TreeViewModel.prototype._getOlderBrothers = function (currNode) {
  let brothers = this.getChildren(currNode.get(this.parentIdRefField), true)
  let index = -1
  for (let i = 0; i < brothers.length; i++) {
    if (brothers[i].getSysId() == currNode.getSysId()) {
      index = i
      break
    }
  }
  let olderBrothers = []
  if (index > 0) {
    olderBrothers = brothers.slice(0, index)
  }
  return olderBrothers
}
/**
 * 获取弟弟节点
 */
TreeViewModel.prototype._getYoungBrothers = function (currNode) {
  let brothers = this.getChildren(currNode.get(this.parentIdRefField), true)
  let index = -1
  for (let i = 0; i < brothers.length; i++) {
    if (brothers[i].getSysId() == currNode.getSysId()) {
      index = i
      break
    }
  }
  if (index < brothers.length) {
    youngBrothers = brothers.slice(index + 1)
  }
  return youngBrothers
}
/**
 * 加载指定节点数据, 但不通知前端UI进行更新
 * @param nodeID 需要重新加载的节点ID：
 *
 */
TreeViewModel.prototype._loadNodeFromDB = function (nodeId) {
  let isDataSet = viewModel
    .getMetaModule()
    .isDataSetSqlDataSource(this.dataSourceName)
  if (isDataSet) {
    return
  }
  let condition = viewModel
    .getMetaModule()
    .getDataSourceLoadConditionWR(this.dataSourceName)
  condition.andEq(this.parentIdRefField, nodeId)
  let datas = viewModel
    .getDataModule()
    .findByDS(this.dataSourceName, condition, -1, -1, false, false)
  let idField = viewModel.getConstModule().getIDField()
  if (nodeId == '') {
    viewModel
      .getDataModule()
      .loadDataRecords(this.dataSourceName, datas, false, true, true, false)
  } else {
    //解决树表新增下级不能加载的问题
    viewModel
      .getDataModule()
      .loadDataRecords(this.dataSourceName, datas, false, true, true, false)
  }
}
/**
 * 从前端DB中获取一个节点的孩子， 获取根节点， 传 “”空串
 */
TreeViewModel.prototype.getChildrenFromViewModel = function (parentId) {
  parentId = parentId == '' ? undefined : parentId
  let treeStruct = this.getTreeStruct()
  let refWidgetId = treeStruct.refWidgetId
  let db = dbManager.getDB(this.dataSourceName)
  if (refWidgetId) {
    let childrenIds = actionHandler.executeWidgetAction(
      refWidgetId,
      'getChildrenIds',
      parentId
    )
    if (childrenIds && childrenIds.length > 0) {
      return db.getRecordByIds(childrenIds)
    }
    return []
  } else {
    let critera = {}
    critera[this.parentIdRefField] = parentId
    let children = db.queryRecord(critera)
    return children ? children : []
  }
}
/**
 * 从前端数据库中清除相关的记录，
 * @param widgetId 控件ID
 * @param nodeIds  记录数组
 */
TreeViewModel.prototype._clearTreeNodes = function (nodeIds) {
  if (!nodeIds || nodeIds.length <= 0) {
    log.info('[treeViewModel._clearTreeNodes]没有需要清除的记录,不执行清除动作')
    return
  }
  dbManager.getDB(this.dataSourceName).removeRecordByIds(nodeIds, false)
  return true
}
/**
 * 获取记录的值
 * TODO: 主要是viewModel的接口不好用
 */
TreeViewModel.prototype._getRecordValue = function (id) {
  let records = viewModel
    .getDataModule()
    .getBaseValueByDS(this.dataSourceName, [], [id])
  if (!records || !jsTool.isArray(records) || records.length <= 0) {
    return null
  }
  return records[0]
}
/**
 * 获取记录子树的加载条件
 * @param nodes 需要加载子树的节点集 [] -- 数组
 */
TreeViewModel.prototype.getLoadSubTreeNodesCodition = function (nodes) {
  let w2 = whereRestrict.init()
  if (!nodes) {
    return w2
  }
  if (this.treeType == '1') {
    for (let i = 0; i < nodes.length; i++) {
      let value = nodes[i].get(this.innerCodeField)
      w2.or(w2.rightLike(this.innerCodeField, value))
    }
  } else {
    for (let i = 0; i < nodes.length; i++) {
      let leftValue = nodes[i].get(this.leftField)
      let rightValue = nodes[i].get(this.rightField)
      //TODO: 确认格式是否正确
      w2.concat(
        [w2.gt(this.leftField, leftValue), w2.lt(this.rightField, rightValue)],
        w2.LOGIC_OR,
        w2.LOGIC_AND,
        false
      )
    }
  }
  return w2
}
/**
 * 转换为 id -> record 的MAP， 主要考虑多次获取父亲节点的性能问题，
 * 当然最好的解决办法是在treeViewModel中维持一个树形结构，但是对应的树形结构数据没有被情理的机制。
 * 如果在架构上调整treeViewModel 和  viewModel为同一个层次， 在viewModel的使用上增加路由机制，或许办法更好
 * @param {Object} records
 */
TreeViewModel.prototype.toMap = function (records) {
  if (!records) {
    records = viewModel.getDataModule().getAllRecordsByDs(this.dataSourceName)
  }
  let recordsMap = new mapUtil.Map()
  if (records && jsTool.isArray(records)) {
    for (let i = 0; i < records.length; i++) {
      recordsMap.put(records[i].getSysId(), records[i])
    }
  }
  return recordsMap
}

TreeViewModel.prototype._iterator = function (parent, contianer) {
  let children = this.getChildren(parent.getSysId(), true)
  for (let i = 0, len = children.length; i < len; i++) {
    let node = children[i]
    contianer.push(node)
    this._iterator(node, contianer)
  }
}

/**
 * 获取所有树节点
 * @param {Object} params
 * {
 * 		"sorted" : {Boolean} 是否排序
 * }
 */
TreeViewModel.prototype.getAllNodes = function (params) {
  let datas = []
  let roots = this.getRoots(true)
  for (let i = 0, len = roots.length; i < len; i++) {
    let node = roots[i]
    datas.push(node)
    this._iterator(node, datas)
  }
  return datas
}

export { getInstance }
