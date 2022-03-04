import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'
import { Math as mathUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceUtil as datasourceUtil } from '@v-act/vjs.framework.extension.platform.services.view.logic.datasource'
import { ArrayUtil as util } from '@v-act/vjs.framework.extension.util'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { TreeManager as treeManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.tree'
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}

let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let tableName = inParamsObj['tableName']
  let fieldNames = inParamsObj['fieldNames']
  let treeStruct = inParamsObj['treeStruct']
  let ruleArgs = ruleContext.getRouteContext().getParams()
  let isSummaryAllNodes = inParamsObj['isSummaryAllNodes'] === 'true'
  if (!isSummaryAllNodes) {
    if (undefined == ruleArgs[0] || null == ruleArgs[0]) {
      throw new Error('参数传入错误！请检查配置！')
    }
    let operator = ruleArgs[0]['type']
    let newResult = ruleArgs[0]['newRecord']
    let oldResult = ruleArgs[0]['oldRecord']
    if (newResult) {
      newResult.iterate(function (record) {
        let oldRecord
        if (oldResult) {
          oldResult.iterate(function (oRecord) {
            if (record.getSysId() == oRecord.getSysId()) {
              _newFuntion(
                oRecord,
                record,
                operator,
                tableName,
                fieldNames,
                treeStruct
              )
            }
          })
        } else {
          _newFuntion(null, record, operator, tableName, fieldNames, treeStruct)
        }
      })
    } else if ('delete' == operator) {
      oldResult.iterate(function (record) {
        _newFuntion(record, null, operator, tableName, fieldNames, treeStruct)
      })
    }
  } else {
    let tree = treeManager.lookup({
      datasourceName: tableName,
      treeStruct: treeStruct[0]
    })
    let all = tree.getAllRecords()
    let allMap = {}
    let insertedMap = {}
    let deletedMap = {}
    for (let i = 0; i < all.datas.length; i++) {
      let id = all.datas[i]['id']
      let PID = all.datas[i]['PID']
      let node = tree.getNodeById(id)
      if (PID != null && PID != '') {
        if (node.getChildren().datas.length == 0) {
          allMap[PID] = node
        }
      }
    }
    for (let prop in allMap) {
      if (allMap.hasOwnProperty(prop)) {
        let node = allMap[prop]
        summary(node, fieldNames, tableName)
      }
    }
  }

  //  treeStruct = {"orderField":"OrderNo","pidField":"PID","isLeafField":"IsLeaf","treeCodeField":"InnerCode" };
}

function summary(node, fieldNames, tableName) {
  let parNode = node.getParent()
  if (parNode == null) return
  let broNodes = parNode.getChildren()
  let zongji = {}
  broNodes.iterate(function (node) {
    let broNode = node.__recordData__
    for (let j = 0; j < fieldNames.length; j++) {
      let column = fieldNames[j]
      let isexist = false
      if (broNode.hasOwnProperty(column)) {
        isexist = true
      } else {
        column = column.substring(column.indexOf('.') + 1, column.length)
        if (broNode.hasOwnProperty(column)) {
          isexist = true
        }
      }
      if (isexist) {
        let b = broNode[column]
        let z = zongji[column]
        if (b == null || b == '') b = 0
        if (z == null || z == '') z = 0
        if (zongji[column] != null) {
          zongji[column] = Number(z) + Number(b)
        } else {
          zongji[column] = Number(b)
        }
      }
    }
  })
  for (let prop in zongji) {
    if (zongji.hasOwnProperty(prop)) {
      parNode.set(prop, zongji[prop])
    }
  }
  datasourceUtil.setBaseValue(tableName, [parNode])
  summary(parNode, fieldNames, tableName)
}

let _newFuntion = function (
  oldRecord,
  newRecord,
  operator,
  tableName,
  fieldNames,
  treeStruct
) {
  let record
  if (!('delete' == operator || 'insert' == operator || 'update' == operator)) {
    throw new Error('[TreeGridStatistics]参数传入错误！请检查配置！')
  }
  if ('delete' == operator) {
    record = oldRecord
    if (!oldRecord) {
      throw new Error(
        '[TreeGridStatistics]系统内部错误，事件没有传入删除的记录。'
      )
    }
  } else if ('insert' == operator) {
    record = newRecord
    if (!newRecord) {
      throw new Error(
        '[TreeGridStatistics]系统内部错误，事件没有传入新增的记录。'
      )
    }
  } else if ('update' == operator) {
    record = newRecord
    if (!newRecord || !oldRecord) {
      throw new Error(
        '[TreeGridStatistics]系统内部错误，事件没有传入更新的记录。'
      )
    }
  }
  let statisticsColumns = fieldNames
  let dataSource = tableName
  let changedColumnsValue = _getChangedColumnsValue(
    statisticsColumns,
    newRecord ? newRecord.toMap() : null,
    oldRecord ? oldRecord.toMap() : null
  )
  let parent = _getParentNode(dataSource, record, treeStruct)
  if (parent == null) {
    return
  }
  //TODO: 如果一次行更改所有的父亲、父亲的父亲就好了
  for (let i = 0; i < changedColumnsValue.length; i++) {
    let column = _getFieldName(changedColumnsValue[i]['changeColumn'])
    let value = Number(changedColumnsValue[i]['changeValue'])
    if (undefined == value || isNaN(value)) {
      continue
    }
    //父亲节点当前列不为null的情况
    if (!isNaN(parent.get(column))) {
      value = Number(parent.get(column)) + value
    }
    parent.set(column, value)
  }
  datasourceUtil.setBaseValue(dataSource, [parent])
}

/**
 * 获取值变化的对象
 */
let _getChangedColumnsValue = function (
  statisticsColumns,
  newRecord,
  oldRecord
) {
  let changedColumnsValue = []
  let isContainPrefix = false
  //记录的属性是否 tablename.fieldName格式，还是fieldname
  if (
    (newRecord && newRecord.hasOwnProperty(statisticsColumns[0])) ||
    (oldRecord && oldRecord.hasOwnProperty(statisticsColumns[0]))
  ) {
    isContainPrefix = true
  }
  for (let i = 0; i < statisticsColumns.length; i++) {
    let changeColumn = {}
    let newValue = 0
    let oldValue = 0
    let columnName = ''
    if (isContainPrefix) {
      columnName = statisticsColumns[i]
    } else {
      columnName = statisticsColumns[i].substring(
        statisticsColumns[i].indexOf('.') + 1,
        statisticsColumns[i].length
      )
    }
    //如果更新记录中不存在，则代表值无修改
    if (newRecord && !newRecord.hasOwnProperty(columnName)) {
      continue
    }
    changeColumn['changeColumn'] = columnName
    if (
      !(
        newRecord == null ||
        undefined == newRecord[columnName] ||
        isNaN(newRecord[columnName])
      )
    ) {
      newValue = Number(newRecord[columnName])
    }
    if (
      !(
        oldRecord == null ||
        undefined == oldRecord[columnName] ||
        isNaN(oldRecord[columnName])
      )
    ) {
      oldValue = Number(oldRecord[columnName])
    }
    changeColumn['changeValue'] = mathUtil.subtract(newValue, oldValue)
    changedColumnsValue.push(changeColumn)
  }
  return changedColumnsValue
}

/**
 *  获取父亲节点
 */
let _getParentNode = function (dataSource, record, treeStruct) {
  let parentNode

  if (
    !util.isArray(treeStruct) ||
    (util.isArray(treeStruct) && treeStruct.length != 1)
  ) {
    throw new Error('参数传入错误，treeStruct接收长度为1的数据')
  }

  if (record) {
    let tree = treeManager.lookup({
      datasourceName: dataSource,
      treeStruct: treeStruct[0]
    })
    // var node = tree.getNodeById(record.getSysId());
    // parentNode = node.getParent();
    parentNode = tree.getNodeById(record.get(treeStruct[0].pidField))
  }

  return parentNode
}

let _getFieldName = function (fieldName) {
  if (fieldName != null && fieldName.indexOf('.') > 0) {
    let fieldNames = fieldName.split('.')
    let FNLength = fieldNames.length
    return fieldNames[FNLength - 1]
  }
  return fieldName
}

export { main, _getChangedColumnsValue, _getParentNode }
