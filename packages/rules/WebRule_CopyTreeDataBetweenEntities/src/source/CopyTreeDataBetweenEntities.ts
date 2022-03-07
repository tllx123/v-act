import { ExceptionFactory as factory } from '@v-act/vjs.framework.extension.platform.interface.exception'
import {
  ExpressionContext,
  ExpressionEngine as engine
} from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { TreeManager as treeManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.tree'
import { jsonUtil } from '@v-act/vjs.framework.extension.util.jsonutil'

export function initModule(sb) {}

// 字段映射关系中的源数据来源类型
let SOURCE_TYPE = {
  ENTITY: '1', // 实体字段
  SYSTEMVAR: '2', // 系统变量
  COMPONENTVAR: '3', // 组件变量
  EXPRESSION: '4' // 表达式
}

const main = function (ruleContext) {
  let inParams = jsonUtil.json2obj(ruleContext.getRuleCfg().inParams)
  // 复制数据来源实体
  let sourceName = inParams.sourceTable
  // 复制类型：选中行/所有行
  let sourceDataType = inParams.sourceDataType
  //目标表
  let destTable = inParams.destTable
  //字段映射关系
  let mappingItems = inParams.mappingItems
  // 目标表的树形结构
  let treeStruct = inParams.treeStruct
  // 是否插入到当前节点下面
  let isCurrNode = inParams.isCurrNode

  let routeContext = ruleContext.getRouteContext()
  let records = null
  let datasource = manager.lookup({
    datasourceName: sourceName
  })

  let destDatasource = manager.lookup({
    datasourceName: destTable
  })
  if (sourceDataType == 'all') {
    records = datasource.getAllRecords()
  } else {
    records = datasource.getSelectedRecords()
  }
  if (records) records = records.toArray()

  let destTreeStruct = getTreeStructByDataSource(destTable, treeStruct)
  let destTree = treeManager.lookup({
    datasourceName: destTable,
    treeStruct: destTreeStruct
  })
  let pidField = destTreeStruct.pidField
  let curDestRecord = destDatasource.getCurrentRecord(),
    curDestNode = curDestRecord
      ? destTree.createNodeFromRecord(curDestRecord)
      : null

  //如果当前节点为空并且是选中了插入当前节点 则提示“目标实体中没有当前节点，请检查目标实体数据是否为空！”
  if (curDestRecord == null && isCurrNode) {
    HandleException('目标实体中没有当前节点，请检查目标实体数据是否为空！')
    return null
  }

  let sourceTreeStruct = getTreeStructByDataSource(sourceName, treeStruct)
  if (sourceTreeStruct != null) {
    let orderNoRefField = sourceTreeStruct.orderField
    if (orderNoRefField) {
      records.sort(function compare(a, b) {
        return a.get(orderNoRefField) - b.get(orderNoRefField)
      })
    }
    let sourcePidField = sourceTreeStruct.pidField
    let roots = []
    let idMap = {}
    let idChildren = {}
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      idMap[record.getSysId()] = record
    }
    for (let id in idMap) {
      let record = idMap[id]
      let parentId = record.get(sourcePidField)
      if (!idMap[parentId]) {
        //没有找到父节点
        roots.push(record)
      } else {
        let children = idChildren[parentId]
        if (!children) {
          children = []
          idChildren[parentId] = children
        }
        children.push(record)
      }
    }
    let parentNode = null
    if (isCurrNode) {
      parentNode = [curDestNode]
    }
    insertTree(
      destTree,
      parentNode,
      roots,
      idChildren,
      mappingItems,
      routeContext
    )
  } else {
    for (let i = 0; i < records.length; i++) {
      let sourceRecord = records[i]
      let defaultValue = _getDefaultValue(
        sourceRecord,
        mappingItems,
        routeContext
      )
      let node = destTree.createNode()

      for (let j = 0, len = defaultValue.length; j < len; j++) {
        let tmpTreeValue = defaultValue[j]
        node.set(tmpTreeValue.fieldName, tmpTreeValue.value, null)
      }
      if (isCurrNode) {
        curDestNode.addChildren({
          children: [node]
        })
      } else {
        destTree.insertRoots({
          nodes: [node]
        })
      }
    }
  }
}

/**
 * 插入一颗树或树枝， 也可能树枝是不连续的
 */
let insertTree = function (
  tree,
  parentNode,
  roots,
  idChildren,
  mappingItems,
  routeContext
) {
  for (let i = 0; i < roots.length; i++) {
    let root = roots[i]
    insertSubTree(parentNode, root, routeContext)
  }

  /**
   * 插入一颗子树
   */
  function insertSubTree(parentNode, sourceRecord, routeContext) {
    let children = idChildren[sourceRecord.getSysId()]
    let insertRecord
    let defaultValue = _getDefaultValue(
      sourceRecord,
      mappingItems,
      routeContext
    )
    let node = tree.createNode()

    for (let i = 0, len = defaultValue.length; i < len; i++) {
      let tmpTreeValue = defaultValue[i]
      node.set(tmpTreeValue.fieldName, tmpTreeValue.value, null)
    }
    if (parentNode && parentNode[0]) {
      parentNode[0].addChildren({
        children: [node]
      })
      insertRecord = [node]
    } else {
      insertRecord = tree.insertRoots({
        nodes: [node]
      })
    }
    if (children) {
      for (let i = 0; i < children.length; i++) {
        insertSubTree(insertRecord, children[i], routeContext)
      }
    }
  }
}

/**
 * 通过映射关系，获取新增记录的默认值
 * @param mappings 映射信息
 * @param editor 当前树对象
 * @return 结构为json格式：
 * 如：[{"fieldName": tablename.fieldName1, "value":value2}]
 */
let _getDefaultValue = function (sourceRecord, mappingItems, routeContext) {
  let returnValue = []
  if (!mappingItems || mappingItems.length <= 0) {
    return returnValue
  } else {
    for (let i = 0; i < mappingItems.length; i++) {
      let fieldValue = {}
      let destField = mappingItems[i].destField
      fieldValue['fieldName'] = destField
      let value = getMappingValue(sourceRecord, mappingItems[i], routeContext)
      fieldValue['value'] = value
      returnValue.push(fieldValue)
    }
  }
  return returnValue
}

let getMappingValue = function (sourceRecord, mappingItem, routeContext) {
  let sourceField = mappingItem.sourceField
  let sourceType = mappingItem.operType
  let value = null
  switch ('' + sourceType) {
    case 'entityField':
      // 来源实体
      value = sourceRecord.get(sourceField)
      break
    case 'expression':
      // 来源表达式
      var context = new ExpressionContext()
      context.setRecords([sourceRecord])
      context.setRouteContext(routeContext)
      value = engine.execute({
        expression: sourceField,
        context: context
      })
      break
    default:
      throw new Error(
        '配置错误！字段映射关系中类型无效：fieldMapping.type=' + sourceType
      )
  }
  return value
}

/**
 * 是不是树形模型
 * @param dataSource 数据源名称， 如果数据源绑定有树形控件，就当作树形模型
 * @return
 */
let getTreeStructByDataSource = function (dataSource, treeStruct) {
  let sourceTreeStruct = null
  for (let i = 0; i < treeStruct.length; i++) {
    if (treeStruct[i]['tableName'] == dataSource) {
      sourceTreeStruct = treeStruct[i]
      break
    }
  }
  return sourceTreeStruct
}
//异常处理方法 - 弹窗提示
function HandleException(tmpvar) {
  let exception = factory.create({
    type: factory.TYPES.Business,
    message: tmpvar
  })
  exception.handle()
}
export { main }
