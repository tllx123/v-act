/**
 * 树形结构实体间数据复制, 从实体中复制记录到树形实体（源表实体可以是任意类型，比如说二维表、业务树表等， 目标实体只支持普通的树和树表）
 *
 */

import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as exception from '@v-act/vjs.framework.extension.platform.services.integration.vds.exception'
import * as expression from '@v-act/vjs.framework.extension.platform.services.integration.vds.expression'
import { RuleContext } from '@v-act/vjs.framework.extension.platform.services.integration.vds.rule'
import * as tree from '@v-act/vjs.framework.extension.platform.services.integration.vds.tree'

const vds = { ds, exception, expression, tree }

const main = function (ruleContext: RuleContext) {
  return new Promise<void>(function (resolve, reject) {
    try {
      //#region 解析规则参数
      let inParams = ruleContext.getVplatformInput()
      //来源实体名称
      let srcName = inParams.sourceTable
      //复制类型：选中行/所有行
      let sourceDataType = inParams.sourceDataType
      //目标实体名称
      let destName = inParams.destTable
      //字段映射关系
      let mappingItems = inParams.mappingItems
      //树形结构集合
      let treeStruct = inParams.treeStruct
      //是否插入到当前节点下面
      let isCurrNode = inParams.isCurrNode
      //是否重置当前行
      let resetCurrent = inParams.resetCurrent
      //#endregion

      //#region 获取目标实体及目标树信息
      let destDatasource = vds.ds.lookup(destName)
      let destCurrentRecord = destDatasource.getCurrentRecord()
      //如果当前节点为空并且是选中了插入当前节点，抛出异常信息
      if (destCurrentRecord == null && isCurrNode) {
        throw vds.exception.newBusinessException(
          '目标实体中没有当前节点，请检查目标实体数据是否为空！'
        )
      }
      let destTreeStruct = getTreeStructByDataSource(destName, treeStruct)
      let destTree = vds.tree.lookup(destName, destTreeStruct)
      let destCurrentNode = destTree.getCurrentNode()
      //#endregion

      //#region 获取来源实体记录
      let srcRecords = null
      let srcDatasource = vds.ds.lookup(srcName)
      if (sourceDataType == 'all') {
        srcRecords = srcDatasource.getAllRecords()
      } else {
        srcRecords = srcDatasource.getSelectedRecords()
      }
      if (srcRecords) {
        srcRecords = srcRecords.toArray()
      }
      //#endregion

      let srcTreeStruct = getTreeStructByDataSource(srcName, treeStruct)
      if (srcTreeStruct != null) {
        //来源实体为树形结构
        //#region 来源实体记录排序
        let orderNoRefField = srcTreeStruct.orderField
        if (orderNoRefField) {
          srcRecords.sort(function compare(
            a: Record<string, any>,
            b: Record<string, any>
          ) {
            return a.get(orderNoRefField) - b.get(orderNoRefField)
          })
        }
        //#endregion

        //#region 来源实体记录生成树形结构
        let srcPidField = srcTreeStruct.pidField
        let roots = []
        let idMap: Record<string, any> = {}
        let idChildren: Record<string, any> = {}
        for (let i = 0; i < srcRecords.length; i++) {
          let srcRecord = srcRecords[i]
          idMap[srcRecord.getSysId()] = srcRecord
        }
        for (let id in idMap) {
          let srcRecord = idMap[id]
          let srcParentId = srcRecord.get(srcPidField)
          if (!idMap[srcParentId]) {
            //没有找到父节点
            roots.push(srcRecord)
          } else {
            let children = idChildren[srcParentId]
            if (!children) {
              children = []
              idChildren[srcParentId] = children
            }
            children.push(srcRecord)
          }
        }
        //#endregion

        //#region 目标树插入节点
        let parentNode: Array<Record<string, any>> = []
        if (isCurrNode) {
          parentNode = [destCurrentNode]
        }
        insertTree(
          destTree,
          parentNode,
          roots,
          idChildren,
          mappingItems,
          ruleContext,
          resetCurrent
        )
        //#endregion
      } else {
        //#region 目标树插入节点

        for (let i = 0; i < srcRecords.length; i++) {
          let srcRecord = srcRecords[i]
          let defaultValue = _getDefaultValue(
            srcRecord,
            mappingItems,
            ruleContext
          )
          let node = destTree.createNode()

          for (let j = 0, len = defaultValue.length; j < len; j++) {
            let tmpTreeValue = defaultValue[j]
            node.set(tmpTreeValue.fieldName, tmpTreeValue.value, null)
          }
          if (isCurrNode) {
            destCurrentNode.addChilds([node], resetCurrent)
          } else {
            destTree.addRootNodes([node], resetCurrent)
          }
        }
        //#endregion
      }
      resolve()
    } catch (ex) {
      reject(ex)
    }
  })
}

/**
 * 插入一颗树或树枝， 也可能树枝是不连续的
 */
let insertTree = function (
  tree: Record<string, any>,
  parentNode: Array<Record<string, any>>,
  roots: Array<Record<string, any>>,
  idChildren: Record<string, any>,
  mappingItems: Array<Record<string, any>>,
  ruleContext: RuleContext,
  resetCurrent: any
) {
  for (let i = 0; i < roots.length; i++) {
    let root = roots[i]
    insertSubTree(parentNode, root, ruleContext, resetCurrent)
  }

  /**
   * 插入一颗子树
   */
  function insertSubTree(
    parentNode: Array<Record<string, any>>,
    srcRecord: Record<string, any>,
    ruleContext: RuleContext,
    resetCurrent: any
  ) {
    let children = idChildren[srcRecord.getSysId()]
    let insertRecord
    let defaultValue = _getDefaultValue(srcRecord, mappingItems, ruleContext)
    let node = tree.createNode()

    for (let i = 0, len = defaultValue.length; i < len; i++) {
      let tmpTreeValue = defaultValue[i]
      node.set(tmpTreeValue.fieldName, tmpTreeValue.value, null)
    }
    if (parentNode && parentNode[0]) {
      parentNode[0].addChilds([node])
      insertRecord = [node]
    } else {
      insertRecord = tree.addRootNodes([node], resetCurrent)
    }
    if (children) {
      for (let i = 0; i < children.length; i++) {
        insertSubTree(insertRecord, children[i], ruleContext, resetCurrent)
      }
    }
  }
}

/**
 * 通过映射关系，获取新增记录的默认值
 * @param srcRecord 来源记录
 * @param mappingItems 字段映射信息
 * @param ruleContext 规则上下文
 * @return 结构为json格式：
 * 如：[{"fieldName": tablename.fieldName1, "value":value2}]
 */
let _getDefaultValue = function (
  srcRecord: Record<string, any>,
  mappingItems: Array<Record<string, any>>,
  ruleContext: RuleContext
) {
  let returnValue: Array<Record<string, any>> = []
  if (!mappingItems || mappingItems.length <= 0) {
    return returnValue
  } else {
    for (let i = 0; i < mappingItems.length; i++) {
      let destField = mappingItems[i].destField
      let value = getMappingValue(srcRecord, mappingItems[i], ruleContext)

      returnValue.push({ fieldName: destField, value: value })
    }
  }
  return returnValue
}

let getMappingValue = function (
  srcRecord: Record<string, any>,
  mappingItem: Record<string, any>,
  ruleContext: RuleContext
) {
  let sourceField = mappingItem.sourceField
  let sourceType = mappingItem.operType
  let value = null
  switch ('' + sourceType) {
    case 'entityField':
      // 来源实体
      value = srcRecord.get(sourceField)
      break
    case 'expression':
      // 来源表达式
      value = vds.expression.execute(sourceField, {
        ruleContext: ruleContext,
        records: [srcRecord]
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
 * 根据数据源名称，获取树形实体结构
 * @param dsName 数据源名称
 * @param treeStruct 树形实体结构集合
 * @return
 */
let getTreeStructByDataSource = function (
  dsName: string,
  treeStruct: Array<Record<string, any>>
) {
  let result = null
  for (let i = 0; i < treeStruct.length; i++) {
    if (treeStruct[i]['tableName'] == dsName) {
      result = treeStruct[i]
      break
    }
  }
  return result
}
export { main }
