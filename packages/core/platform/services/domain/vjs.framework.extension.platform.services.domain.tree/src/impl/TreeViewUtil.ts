import { DatasourceEnums } from '@v-act/vjs.framework.extension.platform.interface.enum'
import { TreeManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.tree'
import { object as DataAccessObject } from '@v-act/vjs.framework.extension.platform.services.repository.data'
import { WidgetProperty } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as WindowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { Log as log } from '@v-act/vjs.framework.extension.util.logutil'

export function initModule(sBox) {}

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

const getTree = function (widgetId) {
  let dataSourceNames = WindowVmManager.getDatasourceNamesByWidgetCode({
    widgetCode: widgetId
  })
  let treeStruct = getTreeStruct(widgetId)
  return TreeManager.lookup({
    datasourceName: dataSourceNames[0],
    treeStruct: treeStruct
  })
}

/**
 * 获取父亲节点ID的数据库存储字段
 * @param widgetId 控件ID
 */
let getParentIdRefField = function (widgetId) {
  let obj = WindowVmManager.getFieldCodeByPropertyCode({
    widgetCode: widgetId,
    propertyCode: widgetId + '_parentId'
  })
  return obj
}
/**
 * 获取父亲节点ID的数据库存储字段
 * @param widgetId 控件ID
 */
let getTextRefField = function (widgetId) {
  let obj = WindowVmManager.getFieldCodeByPropertyCode({
    widgetCode: widgetId,
    propertyCode: widgetId + '_text'
  })
  return obj
}
/**
 * 获取父亲节点ID的数据库存储字段
 * @param widgetId 控件ID
 */
let getOrderNoRefField = function (widgetId) {
  let obj = WindowVmManager.getFieldCodeByPropertyCode({
    widgetCode: widgetId,
    propertyCode: widgetId + '_orderNo'
  })
  return obj
}

let getBusinessCodeFormat = function (widgetId) {
  //TODO
  let gridProperties = WidgetContext.getAll(widgetId)
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
  let obj = WindowVmManager.getFieldCodeByPropertyCode({
    widgetCode: widgetId,
    propertyCode: widgetId + '_CodeColumn'
  })
  return obj
}
/**
 * 获取左节点信息的数据库存储字段
 * @param widgetId 控件ID
 */
let getLeftRefField = function (widgetId) {
  let obj = WindowVmManager.getFieldCodeByPropertyCode({
    widgetCode: widgetId,
    propertyCode: widgetId + '_left'
  })
  return obj
}
/**
 * 获取右节点信息的数据库存储字段
 * @param widgetId 控件ID
 */
let getRightRefField = function (widgetId) {
  let obj = WindowVmManager.getFieldCodeByPropertyCode({
    widgetCode: widgetId,
    propertyCode: widgetId + '_right'
  })
  return obj
}
/**
 * 获取叶子信息的数据库存储字段
 * @param widgetId 控件ID
 */
let getIsLeafRefField = function (widgetId) {
  let obj = WindowVmManager.getFieldCodeByPropertyCode({
    widgetCode: widgetId,
    propertyCode: widgetId + '_isLeaf'
  })
  return obj
}
/**
 * 获取层级编码信息的数据库存储字段
 * @param widgetId 控件ID
 */
let getInnerCodeRefField = function (widgetId) {
  let obj = WindowVmManager.getFieldCodeByPropertyCode({
    widgetCode: widgetId,
    propertyCode: widgetId + '_innerCode'
  })
  return obj
}

let getImplementType = function (widgetId) {
  let value = WidgetProperty.get(widgetId, 'RealizeWay')
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

const getTreeStructData = function (param) {
  let parentId = param.parentId
  let records = param.records
  let treeStruct = param.treeStruct
  let childrensMap = _getChildrensMapWithIdKey(records, treeStruct)
  let data = _getTreeJsonData(parentId, childrensMap, treeStruct)
  return data
}

let _getChildrensMapWithIdKey = function (records, treeStruct) {
  let childrensMap = []
  if (records && records.length > 0) {
    let orderNoRefField = treeStruct.orderField
    records.sort(function compare(a, b) {
      return a.get(orderNoRefField) - b.get(orderNoRefField)
    })
    for (let index = 0; index < records.length; index++) {
      let nodeId = records[index].getSysId()
      if (childrensMap[nodeId] == null) {
        childrensMap[nodeId] = []
      }
      let nodeParentId = records[index].get(treeStruct.pidField)
      let parent = getParent(records, nodeParentId)
      if (nodeParentId != '' && !parent) {
        log.warn(
          '当前记录的parentId不为空，但是前端数据库中不存在父亲节点。node[id] = ' +
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

let getParent = function (records, nodeId) {
  for (let index = 0; index < records.length; index++) {
    if (records[index].getSysId() == nodeId) {
      return records[index]
    }
  }
  return null
}

let _getTreeJsonData = function (parentId, childrensMap, treeStruct) {
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
        child.get(treeStruct.isLeafField) == '0' ||
        child.get(treeStruct.isLeafField) == false
      ) {
        let isHasChild = _getIsHasChild(id, childrensMap)
        if (isHasChild) {
          let children = _getTreeJsonData(id, childrensMap, treeStruct)
          node['children'] = children
        }
      }
      datas.push(node)
    }
  }
  return datas
}
let _getIsHasChild = function (nodeId, childrensMap) {
  let rtn = false
  let childrens = childrensMap[nodeId]
  if (childrens && childrens.length > 0) {
    rtn = true
  }
  return rtn
}
let _getTreeJsonData = function (parentId, childrensMap, treeStruct) {
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
        child.get(treeStruct.isLeafField) == '0' ||
        child.get(treeStruct.isLeafField) == false
      ) {
        let isHasChild = _getIsHasChild(id, childrensMap, treeStruct)
        if (isHasChild) {
          let children = _getTreeJsonData(id, childrensMap, treeStruct)
          node['children'] = children
        }
      }
      datas.push(node)
    }
  }
  return datas
}

const genLoadSubTreeAccerror = function (params) {
  let tree = params.tree,
    nodes = params.nodes
  let dataAccessObject = tree.getDataAccessor()
  if (dataAccessObject && nodes.length > 0) {
    let oriConditionsToWhere = dataAccessObject.getCommand().config.whereToWhere
    let newWhereRestrict =
      dataAccessObject.getCommand().config.whereRestrictNoDepthFilter
    let callbackNewWhereRestrict = newWhereRestrict.clone()
    let treeStruct = tree.getTreeStruct()
    let innerCodeName = treeStruct['treeCodeField']
    let conditionScript = []
    for (let i = 0, l = nodes.length; i < l; i++) {
      let node = nodes[i]
      conditionScript.push(
        innerCodeName + " LIKE '" + node.get(innerCodeName) + "%'"
      )
    }
    let dynamicCondition = conditionScript.join(' OR ')
    callbackNewWhereRestrict.andConditionString('(' + dynamicCondition + ')')
    let cd = dataAccessObject.getCommand()
    let command = {
      config: {
        where: newWhereRestrict,
        pageSize: -1,
        recordStart: -1,
        filterFields: null
      },
      type: cd.type
    }

    return new DataAccessObject(
      dataAccessObject.getDataProvider(),
      dataAccessObject.getModelSchema(),
      command
    )
  }
  return null
}

let getFieldName = function (fieldName) {
  let retvalue = fieldName
  if (fieldName.indexOf('.') != -1) {
    retvalue = fieldName.split('.')[1]
  }
  return retvalue
}

const getTreeNodePath = function (params) {
  let node = params.node,
    fieldName = params.fieldCode
  let retValue = []
  if (node) {
    let isID = false
    fieldName = getFieldName(fieldName)
    let metadata = node.getMetadata()
    let isContain = metadata.isContainField(fieldName)
    if (fieldName == DatasourceEnums.IDFIELD) {
      isContain = true
      isID = true
    }
    if (!isContain) {
      log.error(
        '[TreeViewUtil.getTreeNodePath]获取树节点路径失败,字段编号不存在,请检查配置！fieldCode:' +
          fieldName
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
      tempNode = tempNode.getParent()
    }
  }
  return retValue
}

export {
  genLoadSubTreeAccerror,
  getTree,
  getTreeNodePath,
  getTreeStructData,
  translate
}
