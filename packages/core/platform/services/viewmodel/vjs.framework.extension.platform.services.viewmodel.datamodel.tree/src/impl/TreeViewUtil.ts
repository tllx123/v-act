import * as formulaUtil from 'module'
import * as propertyHandler from 'module'
import * as Record from 'module'
import * as viewContext from 'module'
import * as viewModel from 'module'
import * as vmMappingManager from 'module'

import { WindowVMMappingManager as vmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { FileUtil as fileUtil } from '@v-act/vjs.framework.extension.util.file'
import { MapUtil as mapUtil } from '@v-act/vjs.framework.extension.util.map'

export function initModule(sBox) {
  treeManager = sBox.getService('')
}

/**
 * @param widgetId 控件id
 * 通过一个控件id获取一个treeStruct对象
 */
let getTreeStruct = function (widgetId) {
  let treeStruct = {}
  treeStruct['type'] = getImplementType(widgetId)
  treeStruct['refWidgetId'] = widgetId
  if (treeStruct['type'] == '3') {
    treeStruct['bizCodeField'] = getBusinessCodeRefField(widgetId)
    treeStruct['bizCodeFormat'] = getBusinessCodeFormat(widgetId)
    treeStruct['orderField'] = getBusinessCodeRefField(widgetId)
  } else {
    treeStruct['isLeafField'] = getIsLeafRefField(widgetId)
    treeStruct['orderField'] = getOrderNoRefField(widgetId)
    treeStruct['pidField'] = getParentIdRefField(widgetId)
    treeStruct['treeCodeField'] = getInnerCodeRefField(widgetId)
    treeStruct['leftField'] = getLeftRefField(widgetId)
    treeStruct['rightField'] = getRightRefField(widgetId)
  }
  return treeStruct
}

/**
 * @param widgetId 控
 * 通过控件ID 获取一个treeviewModel实例
 */
let getTreeViewModel = function (widgetId) {
  let dsNames = vmManager.getDatasourceNamesByWidgetCode({
    widgetCode: widgetId
  })
  let treeStruct = getTreeStruct(widgetId)
  return treeManager.lookup({
    dataSourceName: dsNames[0],
    treeStruct: treeStruct
  })
}

/**
 * 获取父亲节点ID的数据库存储字段
 * @param widgetId 控件ID
 */
let getParentIdRefField = function (widgetId) {
  let ret
  let obj = viewModel.getMetaModule().getMappingInfo(widgetId + '_parentId')
  if (obj) {
    ret = obj.refField
  }
  return ret
}
/**
 * 获取父亲节点ID的数据库存储字段
 * @param widgetId 控件ID
 */
let getTextRefField = function (widgetId) {
  let ret
  let obj = viewModel.getMetaModule().getMappingInfo(widgetId + '_text')
  if (obj) {
    ret = obj.refField
  }
  return ret
}
/**
 * 获取父亲节点ID的数据库存储字段
 * @param widgetId 控件ID
 */
let getOrderNoRefField = function (widgetId) {
  let ret
  let obj = viewModel.getMetaModule().getMappingInfo(widgetId + '_orderNo')
  if (obj) {
    ret = obj.refField
  }
  return ret
}

let getBusinessCodeFormat = function (widgetId) {
  let gridProperties = viewContext.getWidgetPropertyFromContext(widgetId)
  let value = gridProperties['CodeFormat']
  if (!value) {
    return null
  }
  if (typeof value != 'string') {
    value = new String(value)
  }
  let reg = /^[1-9]+\d*\s*([\,]{1}\s*[1-9]+\d*)*([\,]{1}\s*\*{1}\s*)?$/
  let isLegal = reg.test(value)
  if (!isLegal) {
    throw new Error(
      '编码格式配置不合法，标准的格式类似于: [2，2，3，*]、或[2, 3]、或[2]的格式。'
    )
  }
  value = value.replace(/\s*/g, '')
  return value
}

let getBusinessCodeRefField = function (widgetId) {
  let ret
  let obj = viewModel.getMetaModule().getMappingInfo(widgetId + '_CodeColumn')
  if (obj) {
    ret = obj.refField
  }
  return ret
}
/**
 * 获取左节点信息的数据库存储字段
 * @param widgetId 控件ID
 */
let getLeftRefField = function (widgetId) {
  let ret
  let obj = viewModel.getMetaModule().getMappingInfo(widgetId + '_left')
  if (obj) {
    ret = obj.refField
  }
  return ret
}
/**
 * 获取右节点信息的数据库存储字段
 * @param widgetId 控件ID
 */
let getRightRefField = function (widgetId) {
  let ret
  let obj = viewModel.getMetaModule().getMappingInfo(widgetId + '_right')
  if (obj) {
    ret = obj.refField
  }
  return ret
}
/**
 * 获取叶子信息的数据库存储字段
 * @param widgetId 控件ID
 */
let getIsLeafRefField = function (widgetId) {
  let ret
  let obj = viewModel.getMetaModule().getMappingInfo(widgetId + '_isLeaf')
  if (obj) {
    ret = obj.refField
  }
  return ret
}
/**
 * 获取层级编码信息的数据库存储字段
 * @param widgetId 控件ID
 */
let getInnerCodeRefField = function (widgetId) {
  let ret
  let obj = viewModel.getMetaModule().getMappingInfo(widgetId + '_innerCode')
  if (obj) {
    ret = obj.refField
  }
  return ret
}

let getImplementType = function (widgetId) {
  let value = propertyHandler.getProperty(widgetId, 'RealizeWay')
  if (value == '父子节点') {
    value = '1'
  } else if (value == '左右编码') {
    value = '2'
  } else if (value == '业务编码') {
    value = '3'
  } else {
    throw new Error('不支持的树类型！')
  }
  return value
}

/**
 * 获取parentId 节点的子树
 * @param 获取parentId  节点ID.  如果是整树加载，传 -1
 * @param records 数据库记录
 * @param isGenerateIcon 数据库记录(可选), 默认为true
 */
let getTreeStructData2UI = function (
  widgetId,
  parentId,
  records,
  isGenerateIcon
) {
  let childrensMap = getChildrensMapWithIdKey(widgetId, records)
  let treeIcons
  if (isGenerateIcon == null || isGenerateIcon == true) {
    //设置的图标集 TODO: 这个widgetId去不掉
    treeIcons = formulaUtil.evalExpression(
      'GenerateTreeIcon("' + widgetId + '")'
    )
  }
  let data = _getTreeJsonData2UI(widgetId, parentId, childrensMap, treeIcons)
  return data
}

/**
 *  组装成key为id,value为childrens数组的map
 */
let getChildrensMapWithIdKey = function (widgetId, records) {
  let childrensMap = []
  if (records && records.length > 0) {
    let type = getImplementType(widgetId)
    let orderNoRefField = getOrderNoRefField(widgetId)
    if (type == '3') {
      orderNoRefField = getBusinessCodeRefField(widgetId)
    }
    if (orderNoRefField) {
      records.sort(function compare(a, b) {
        return a.get(orderNoRefField) - b.get(orderNoRefField)
      })
    }
    let treeViewModel = getTreeViewModel(widgetId)
    let roots = treeViewModel.getRoots(false)
    for (let index = 0; index < records.length; index++) {
      let nodeId = records[index].getSysId()
      if (childrensMap[nodeId] == null) {
        childrensMap[nodeId] = []
      }

      let record = records[index]
      let isroot = treeViewModel.isRoot(record, roots)
      if (isroot) {
        //若是根结点,则创建一个key为"-1"的虚结点
        if (childrensMap['-1'] == null) {
          childrensMap['-1'] = []
        }
        childrensMap['-1'].push(records[index])
      } else {
        let nodeParentId = treeViewModel.getParentIdByNode(records[index])
        if (nodeParentId) {
          if (childrensMap[nodeParentId] == null) {
            childrensMap[nodeParentId] = []
          }
          childrensMap[nodeParentId].push(records[index])
        }
      }
    }
  }
  return childrensMap
}

/**
 *  组装成key为parentId,value为childrens数组
 *  return {parentId:[children]}
 *
 *
 var getParentIdChildrensMap = function(widgetId, records) {
 var childrensMap = new mapUtil.Map();
 if (records && records.length > 0) {
 var treeViewModel = getTreeViewModel(widgetId);
 var roots = treeViewModel.getRoots(false);
 var parentIdRefField = getParentIdRefField(widgetId);
 for (var index = 0; index < records.length; index++) {
 var record = records[index];
 var nodeParentId = record.get(parentIdRefField);
 if (nodeParentId && nodeParentId != "") {
 if (childrensMap.get(nodeParentId) == null) {
 childrensMap.put(nodeParentId, []);
 }
 childrensMap.get(nodeParentId).push(record);
 } else {
 //若是根结点,则创建一个key为"-1"的虚结点
 if (childrensMap.get("-1") == null) {
 childrensMap.put("-1", []);
 }
 childrensMap.get("-1").push(record);
 }
 }
 }
 return childrensMap;
 };*/

/**
 *  判断是否有孩子
 */
let _getIsHasChild = function (nodeId, childrensMap) {
  let rtn = false
  let childrens = childrensMap[nodeId]
  if (childrens && childrens.length > 0) {
    rtn = true
  }
  return rtn
}

/**
 * 获取parentId 节点的子树
 * @param parentId  节点ID.  如果是整树加载，传 -1
 * @param records 数据库记录
 */
let _getTreeJsonData2UI = function (
  widgetId,
  parentId,
  childrensMap,
  treeIcons
) {
  let datas = []
  let childs = childrensMap[parentId]
  if (childs && childs.length > 0) {
    let childCount = childs.length
    let textRefField = getTextRefField(widgetId)
    let isLeafRefField = getIsLeafRefField(widgetId)
    for (let i = 0; i < childCount; i++) {
      let child = childs[i]
      let id = child.getSysId()
      //TODO: 这个字段不能少
      let text = child.get(textRefField)
      let node = {}
      node = child.toMap()
      //设置图标
      if (treeIcons) {
        _setTreeNodeIcon(node, treeIcons)
      }
      if (
        isLeafRefField &&
        child.get(isLeafRefField) &&
        (child.get(isLeafRefField) == '1' || child.get(isLeafRefField) == true)
      ) {
        node.id = id
        node.text = text
        let attributes = {}
        attributes.loaded = true
        node.attributes = attributes
        node.leaf = true
        node.state = 'open'
      } else {
        node.id = id
        node.text = text
        node.leaf = false
        let isHasChild = _getIsHasChild(id, childrensMap)
        let attributes = {}
        if (isHasChild) {
          attributes.loaded = true
          node.attributes = attributes
          node.state = 'open'
          let children = _getTreeJsonData2UI(
            widgetId,
            id,
            childrensMap,
            treeIcons
          )
          node.children = children
        } else {
          attributes.loaded = false
          node.attributes = attributes
          node.state = 'closed'
        }
      }
      datas.push(node)
    }
  }
  return datas
}

/**
 * 将数据库记录转变为wooui的前端节点的格式
 * @param widgetId 控件ID
 * @param records 数据库记录数组
 *
 */
//TODO: 只有JGbizcodetreeviewhandler使用 ， 后续重构
let changeDBRecord2TreeNode = function (widgetId, records) {
  if (!records || records.length <= 0) {
    return []
  }
  let treeNodes = []
  let textRefField = getTextRefField(widgetId)
  //设置的图标集
  let treeIcons = formulaUtil.evalExpression(
    'GenerateTreeIcon("' + widgetId + '")'
  )

  for (let i = 0; i < records.length; i++) {
    let record = records[i]
    let treeNode = {}
    treeNode = record.toMap()
    treeNode.id = record.getSysId()
    treeNode.text = record.get(textRefField)
    treeNode.leaf = false
    treeNode.state = 'closed'
    let attributes = {}
    attributes.loaded = false
    //设置图标
    if (treeIcons) {
      let treeIconField = treeIcons['_refField_']
      let treeIconFieldValue =
        record.get(treeIconField) == null
          ? ''
          : record.get(treeIconField).toString()
      if (treeIcons[treeIconFieldValue]) {
        let treeNodeIcon = treeIcons[treeIconFieldValue]
        //收起的图标
        //if (treeNodeIcon["ImgID"]) {
        if (treeNodeIcon['ImgName']) {
          treeNode.closeIcon = {
            src: getImageByName(treeNodeIcon['ImgName']), //getImage(treeNodeIcon["ImgID"]),
            width: '',
            height: ''
          }
        }
        //展开的图标
        //if (treeNodeIcon["ExpandImgID"]) {
        if (treeNodeIcon['ExpandImgName']) {
          treeNode.openIcon = {
            src: getImageByName(treeNodeIcon['ExpandImgName']), //getImage(treeNodeIcon["ExpandImgID"]),
            width: '',
            height: ''
          }
        } else if (treeNodeIcon['ImgID']) {
          //如果没有设置展开的图标,则设置二个图标一样
          treeNode.openIcon = treeNode.closeIcon
        }
      }
    }
    treeNodes.push(treeNode)
  }
  return treeNodes
}

/**
 * 获取图片文件服务
 * @param imageObjId 图标ID
 */
let getImage = function (imageObjId) {
  return fileUtil.getImageById(imageObjId)
}

let getImageByName = function (imageName) {
  return fileUtil.getImageByName(imageName)
}

/**
 * 获取  records 节点的子树 并转化为wooui需要的结构数据
 * @param records  节点记录，childrensMap里面的值全是records的子树节点
 * @param depth 需要展开的深度
 * @param childrensMap map类型的数据集， 格式{parentId: [children]}
 * @return map , 格式：{id:[subTreeNodes]}
 */
let changeRecordsTreeStructData = function (
  widgetId,
  records,
  depth,
  childrensMap
) {
  let defDepth = 1
  let map = new mapUtil.Map()
  let widgetType = viewContext.getWidgetContext(widgetId, 'widgetType')
  let dataSource = viewModel.getMetaModule().getDataSourceName(widgetId)
  let vir_datasourceName = 'virtual_' + widgetId
  let treeIcons = formulaUtil.evalExpression(
    'GenerateTreeIcon("' + widgetId + '")'
  )
  let virtual_records = []
  for (let i = 0; i < records.length; i++) {
    let treeDatas = []
    let id = records[i].getSysId()
    treeDatas = changeTreeStructData(id, defDepth)
    map.put(id, treeDatas)
  }
  if (
    widgetType &&
    ('JGTreeGrid' == widgetType || 'JGBizCodeTreeGrid' == widgetType)
  ) {
    viewModel
      .getDataModule()
      .insertByDS(vir_datasourceName, virtual_records, false, false, null)
  }
  return map

  /**
   * 获取parentId节点的子树 并转化为wooui需要的结构数据
   * @param parentId  节点ID.
   * @param depth 需要展开的深度
   * @param childrensMap map类型的数据集， 格式{parentId: [children]}
   */
  function changeTreeStructData(parentId, currDepth) {
    let datas = []
    let childs = childrensMap[parentId]
    if (childs && childs.length > 0) {
      let childCount = childs.length
      let isLeafRefField = getIsLeafRefField(widgetId)
      let nodeState = 'open'
      let mappingInfo = vmMappingManager.getMappingInfo(widgetId)
      for (let i = 0; i < childCount; i++) {
        let child = childs[i]
        let id = child.getSysId()
        let textRefField = getTextRefField(widgetId)
        let text = child.get(textRefField)
        let node = child.toMap()
        //设置图标
        if (treeIcons) {
          _setTreeNodeIcon(node, treeIcons)
        }
        if (currDepth && currDepth >= depth) {
          nodeState = 'closed'
        }
        if (
          widgetType &&
          ('JGTreeGrid' == widgetType || 'JGBizCodeTreeGrid' == widgetType)
        ) {
          //把动态列的数据加到
          //整理mapping映射，把model的数据转变为合乎格式的view数据
          //values入参为：从viewModel出来的Record对象数组
          let virtual_record = _vmDataChange(
            widgetId,
            dataSource,
            child,
            node,
            mappingInfo
          )
          virtual_records.push(virtual_record)
          if (
            isLeafRefField &&
            child.get(isLeafRefField) &&
            (child.get(isLeafRefField) == '1' ||
              child.get(isLeafRefField) == true)
          ) {
            node.leaf = true
            node.state = 'open'
          } else {
            node.leaf = false
            let isHasChild = _getIsHasChild(id, childrensMap)
            if (isHasChild) {
              node.state = nodeState
              let children = changeTreeStructData(id, currDepth + 1)
              node.children = children
            } else {
              node.state = 'closed'
            }
          }
        } else if (
          widgetType &&
          ('JGTreeView' == widgetType || 'JGBizCodeTreeView' == widgetType)
        ) {
          if (
            isLeafRefField &&
            child.get(isLeafRefField) &&
            (child.get(isLeafRefField) == '1' ||
              child.get(isLeafRefField) == true)
          ) {
            node.id = id
            node.text = text
            node.leaf = true
            node.state = 'open'
          } else {
            node.id = id
            node.text = text
            node.leaf = false
            let isHasChild = _getIsHasChild(id, childrensMap)
            if (isHasChild) {
              node.state = nodeState
              let children = changeTreeStructData(id, currDepth + 1)
              node.children = children
            } else {
              node.state = 'closed'
            }
          }
        }
        datas.push(node)
      }
    }
    return datas
  }
}

let _vmDataChange = function (widgetId, dataSource, record, node, mappingInfo) {
  if (
    mappingInfo &&
    mappingInfo.mappingItems &&
    mappingInfo.mappingItems.length > 0
  ) {
    let mpItems = mappingInfo.mappingItems
    for (let i = 0; i < mpItems.length; i++) {
      let mpItem = mpItems[i]
      if (!record.getMetadata().isContainField(mpItem.refField)) {
        continue
      }
      if (
        record.get(mpItem.refField) != null &&
        record.get(mpItem.refField) != undefined
      ) {
        node[mpItem.field] = record.get(mpItem.refField)
      }
    }
  }
  let id = record.getSysId()
  node[viewModel.getConstModule().getIDField()] = id
  //把动态列的数据加到{fieldkey:value}map对象中
  let originRecord = viewModel.getDataModule().getRecordById(dataSource, id)
  if (originRecord) {
    let originRecordDataMap = originRecord.toMap()
    for (let key in originRecordDataMap) {
      if (typeof node[key] == 'undefined') {
        node[key] = originRecordDataMap[key]
      }
    }
  }

  //转换为虚拟的Records
  let vir_datasourceName = 'virtual_' + widgetId
  let virtualDbRecord = Record.create(vir_datasourceName)
  for (let field in node) {
    if (virtualDbRecord.getMetadata().isContainField(field)) {
      // 有对应的字段
      virtualDbRecord.set(field, node[field])
    }
  }
  let rs = cloneJSON(node)
  let leafRefField = getIsLeafRefField(widgetId)
  rs.leaf = record.get(leafRefField)
  //虚拟的Records扩展的字段
  virtualDbRecord.set('leaf', rs.leaf)
  virtualDbRecord.set('checked', rs['checked'])
  virtualDbRecord.set('selected', rs['selected'])
  virtualDbRecord.set('state', rs['state'])
  virtualDbRecord.set('childsload', rs['childsload'])
  virtualDbRecord.set('drag', rs['drag'])
  return virtualDbRecord
}

/**简单的克隆*/
function cloneJSON(js) {
  let rs = {
    checked: false,
    selected: false,
    leaf: false,
    childsload: false,
    state: 'closed',
    drag: false
  }
  for (let p in js) {
    rs[p] = js[p]
  }
  return rs
}

let _setTreeNodeIcon = function (node, treeIcons) {
  let treeIconField = treeIcons['_refField_']
  let treeIconFieldValue =
    node[treeIconField] == null ? '' : node[treeIconField].toString()
  if (treeIcons[treeIconFieldValue]) {
    let treeNodeIcon = treeIcons[treeIconFieldValue]
    //收起的图标
    //if (treeNodeIcon["ImgID"]) {
    if (treeNodeIcon['ImgName']) {
      node.closeIcon = {
        src: getImageByName(treeNodeIcon['ImgName']), //getImage(treeNodeIcon["ImgID"]),
        width: '',
        height: ''
      }
    }
    //展开的图标
    //if (treeNodeIcon["ExpandImgID"]) {
    if (treeNodeIcon['ExpandImgName']) {
      node.openIcon = {
        src: getImageByName(treeNodeIcon['ExpandImgName']), //getImage(treeNodeIcon["ExpandImgID"]),
        width: '',
        height: ''
      }
    } else if (treeNodeIcon['ImgID']) {
      //如果没有设置展开的图标,则设置二个图标一样
      node.openIcon = node.closeIcon
    }
  }
}

export {
  changeDBRecord2TreeNode,
  changeRecordsTreeStructData,
  destroy,
  Enum_MoveTo,
  getBusinessCodeFormat,
  getBusinessCodeRefField,
  getChildrensMapWithIdKey,
  getImplementType,
  getInnerCodeRefField,
  getInstance,
  getIsLeafRefField,
  getOrderNoRefField,
  getParentIdRefField,
  getTextRefField,
  getTreeStruct,
  getTreeStructData2UI,
  getTreeViewModel,
  translate
}
