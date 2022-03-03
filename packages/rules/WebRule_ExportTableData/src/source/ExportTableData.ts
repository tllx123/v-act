import {
  ExpressionContext,
  ExpressionEngine as formulaUtil
} from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { TreeViewUtil as treeViewModel } from '@v-act/vjs.framework.extension.platform.services.domain.tree'
import { DatasourceManager as datasourceManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import {
  WidgetAction as widgetAction,
  WidgetProperty as widgetProperty
} from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { MapUtil as mapUtil } from '@v-act/vjs.framework.extension.util'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util.json'

let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sBox) {}

let main = function (ruleContext) {
  //当任何一条匹配数据不满足比较条件时，返回false，否则返回true(包括两种情况：不存在匹配数据或所有匹配数据都满足比较条件)；
  let bussinessReturnValue = true
  let ruleCfg = ruleContext.getRuleCfg()
  let paramsValue = ruleCfg['inParams']
  let ruleInstId = ruleCfg['ruleInstId'] //规则ID
  let scope = scopeManager.getWindowScope()
  let moduleId = scope.getWindowCode()
  let params = jsonUtil.json2obj(paramsValue)
  let gridWidgetId = params['gridId']

  if (!params['gridId']) {
    gridWidgetId = params['gridDsName']
  }
  let dsNames = windowVmManager.getDatasourceNamesByWidgetCode({
    widgetCode: gridWidgetId
  })
  let dataSource = dsNames[0]
  let exportColumns = params['exportColumns']
  if (gridWidgetId == null || gridWidgetId == '') {
    throw new Error('导出的表格控件不能为空')
  }
  if (dataSource == null || dataSource == '') {
    throw new Error('导出的表格控件数据源不能为空')
  }

  let entity = datasourceManager.lookup({
    datasourceName: dataSource
  })

  let isFreeDB = false
  if (exportColumns == null || exportColumns.length == 0) {
    // 处理动态列表，对应实体为游离DB
    let entityFiels = entity ? entity.getMetadata().getFields() : null
    if (entityFiels && entityFiels.length > 0) isFreeDB = true
    else if (exportColumns == null || exportColumns.length == 0)
      throw new Error('导出的列不能为空')
  }

  let records = entity.getAllRecords().toArray()
  //如果是树表或编码树表，则需要对数据按树结构排序
  let widgetType = widgetContext.getType(gridWidgetId)
  if (records.length > 0 && 'JGTreeGrid' == widgetType) {
    let idRecordMap = new mapUtil.Map()
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      let id = record.getSysId()
      idRecordMap.put(id, record)
    }
    let treeStructData = null

    //树表的实现方式，父子节点：层级码树表，左右编码：左右树表，业务编码：业务编码树表
    let realizeWay = widgetProperty.get(gridWidgetId, 'RealizeWay')
    let pidColumn = widgetProperty.get(gridWidgetId, 'PIDColumn')
    let innerCodeColumn = widgetProperty.get(gridWidgetId, 'InnerCodeColumn')
    let leftCodeColumn = widgetProperty.get(gridWidgetId, 'LeftCodeColumn')
    let rightCodeColumn = widgetProperty.get(gridWidgetId, 'RightCodeColumn')
    let orderNoColumn = widgetProperty.get(gridWidgetId, 'OrderNoColumn')
    let leafColumn = widgetProperty.get(gridWidgetId, 'LeafNode')

    //业务编码字段
    let bizCodeColumn = widgetProperty.get(gridWidgetId, 'CodeColumn')
    let bizCodeFormat = widgetProperty.get(gridWidgetId, 'CodeFormat')

    //树表
    if ('JGTreeGrid' == widgetType) {
      let treeStructCfg = {
        tableID: null,
        tableName: dataSource,
        type: '1',
        pidField: pidColumn,
        treeCodeField: innerCodeColumn,
        orderField: orderNoColumn,
        isLeafField: leafColumn
      }
      if (realizeWay == '左右编码') {
        treeStructCfg = {
          tableID: null,
          tableName: dataSource,
          type: '2',
          pidField: pidColumn,
          leftField: leftCodeColumn,
          rightField: rightCodeColumn
        }
      }

      treeStructData = treeViewModel.getTreeStructData({
        parentId: '-1',
        records: records,
        treeStruct: treeStructCfg
      })
    }
    records = getSortedTreeRecords(idRecordMap, treeStructData)
  }

  let resultData = []
  if (records && records.length > 0) {
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      resultData.push(record.toMap())
    }
  }

  let columnDefineObjs = findGridFields(gridWidgetId, dataSource)
  let finalExportColumns = filterExportColumns(
    columnDefineObjs,
    exportColumns,
    isFreeDB
  )

  params.exportColumns = finalExportColumns
  params.datas = resultData
  params.dsName = dataSource
  if (params.exportFileName != null && params.exportFileName != '') {
    let context = new ExpressionContext()
    context.setRouteContext(ruleContext.getRouteContext())
    params.exportFileName = formulaUtil.execute({
      expression: params.exportFileName,
      context: context
    })
  }

  let paramObj = params
  if (paramObj != null) {
    for (let i = 0; i < paramObj.datas.length; i++) {
      if (paramObj.datas[i].children != undefined) {
        delete paramObj.datas[i].children
      }
      if (paramObj.datas[i]._parent_isc_Tree_0 != undefined) {
        delete paramObj.datas[i]._parent_isc_Tree_0
      }
    }
  }

  let token = {
    data: paramObj
  }
  let tokenJson = jsonUtil.obj2json(token)
  let tokenEncode = encodeURIComponent(tokenJson)

  //因为参数中需要传递大量数据，所以不能用ajax提交，只能使用隐藏form提交来解决
  let url =
    'module-operation!executeOperation?moduleId=' +
    scope.getWindowCode() +
    '&operation=ExportTableData'

  let iframeId = 'file_down_iframe'
  let formId = 'iframeDownForm'

  createIFrame(iframeId, '')
  let formObj = createForm(formId, iframeId, url, tokenEncode)
  formObj.submit()

  return true
}

function createForm(formId, iframeId, actionUrl, tokenId) {
  let formObj = document.getElementById(formId)
  if (formObj == null) {
    formObj = document.createElement('form')
    formObj.setAttribute('id', formId)
    formObj.setAttribute('method', 'post')
    formObj.setAttribute('target', iframeId)
    formObj.setAttribute('style', 'display:none')
    document.body.appendChild(formObj)
  }
  formObj.setAttribute('action', actionUrl)
  formObj.innerHTML =
    "<input id='tokenId' type='hidden' name='token' value=\"" + tokenId + '">'
  return formObj
}

function createIFrame(iframeId, url) {
  let iframeObj = document.getElementById(iframeId)
  if (iframeObj == null) {
    iframeObj = document.createElement('iframe')
    iframeObj.setAttribute('id', iframeId)
    iframeObj.setAttribute('style', 'display:none')
    document.body.appendChild(iframeObj)
  }
  iframeObj.setAttribute('src', url)
}

function setBusinessRuleResult(ruleContext, result) {
  if (ruleContext.setBusinessRuleResult) {
    ruleContext.setBusinessRuleResult({
      isMatchCompare: result
    })
  }
}

let getFieldName = function (fieldName) {
  if (fieldName == null) throw new Error('字段名不能为空!')
  let pos = fieldName.indexOf('.')
  if (pos > 0) {
    return fieldName.substring(pos + 1)
  }
  return fieldName
}

let getSortedTreeRecords = function (idRecordMap, treeStructDatas) {
  let retSortedTreeDatas = []
  for (let i = 0; i < treeStructDatas.length; i++) {
    _getSortedTreeRecords(idRecordMap, retSortedTreeDatas, treeStructDatas[i])
  }
  idRecordMap.clear()
  return retSortedTreeDatas
}

let _getSortedTreeRecords = function (
  idRecordMap,
  retSortedRecords,
  curTreeNode
) {
  if (curTreeNode == null) return
  let record = idRecordMap.get(curTreeNode.record.getSysId())
  if (record == null) return
  retSortedRecords.push(record)

  if (curTreeNode.children == null || curTreeNode.children.length == 0) return
  for (let i = 0; i < curTreeNode.children.length; i++) {
    let childNode = curTreeNode.children[i]
    _getSortedTreeRecords(idRecordMap, retSortedRecords, childNode)
  }
}

let findGridFields = function (widgetId, dataSourceName) {
  let datasource = datasourceManager.lookup({
    datasourceName: dataSourceName
  })
  let metadata = datasource.getMetadata()
  let metaFields = metadata.getFields()
  let widget = widgetContext.getAll(widgetId)
  //var rowsFixedCount = widget["RowsFixedCount"];

  let headerSpans = widget.widgetObj._headerSpans
  let rowsFixedCount = widget.widgetObj._getHeaderRowNum(headerSpans)
  // 是否单行表头
  let isSingleHeadRows = rowsFixedCount == 1
  let propertiesList = widgetAction.executeWidgetAction(widgetId, 'getFields')
  // 表格列定义列表
  let columns = []

  // TODO: 新方案处理多行列表头
  let spanMap = widget.widgetObj._widget.spanMap
  let getSpanName = function (headerIndex, tarColumnName, spansMap, seq) {
    if (!spansMap) return

    if (seq == null) seq = 1

    // 判断当前列是否存在
    let spanObj = spansMap[tarColumnName]

    let getTitle = function (spanObj, seq) {
      if (spanObj) {
        seq++

        let _parentSpan = spanObj['parentSpan']

        if (!_parentSpan || seq >= headerIndex) {
          let columnCfg = {
            id: spanObj.liveObject && spanObj.liveObject.ID, // 用于后台判断是否允许合并相同 cell
            title: spanObj.title
          }

          return columnCfg
        } else if (_parentSpan && seq < headerIndex) {
          return getTitle(_parentSpan, seq)
        }
      }
    }

    return getTitle(spanObj, seq)
  }

  // 旧版本写死宽度 未知原因
  let cellWidth = 100

  let _headRowInfo = []
  for (let j = 0; j < rowsFixedCount; j++) {
    // 遍历N次，N 为标题行数
    let curHeadRowInfo = []
    for (let i = 0; i < propertiesList.length; i++) {
      let properties = propertiesList[i]

      if (properties._isRowNumberField) continue

      // 如果为最后一行，则按照原有数据properties中获取内容
      if (j === rowsFixedCount - 1) {
        let columnCfg = {
          id: properties.columnId,
          field: properties.name,
          title: properties.title,
          width: cellWidth,
          isFieldColumn: true,
          AllowMerge: properties.AllowMerge, //允许合并
          MergeColumnNames: properties.MergeColumnNames //合并条件字段
        }

        curHeadRowInfo.push(columnCfg)
        continue
      }

      let tarColumnName = properties['name']
      // 根据 index 获取当前Cell的名字
      let curColName = getSpanName(rowsFixedCount - j, tarColumnName, spanMap)
      curHeadRowInfo.push(curColName)
    }

    _headRowInfo.push(curHeadRowInfo)
  }

  return _headRowInfo
}

/**
 * 获取列标题的文字部分
 * */
let getColumnTitleText = function (title) {
  let result = title
  if (title) {
    let dom = $('<div>' + title + '</div>')[0]
    let text = dom.innerText
    let len = dom.children.length
    if (len > 0) {
      let childText = dom.children[0].innerText
      result = text.substring(childText.length, text.length)
    }
  }
  return result
}

let filterExportColumns = function (allColumns, exportColumns, isFreeDB) {
  if ((exportColumns == null || exportColumns.length == 0) && !isFreeDB)
    return null

  let retColumns = []
  //allColumns为二维数组，最后一行索引
  let lastRowIndex = allColumns.length - 1

  let tmpColumnIndexs = []
  let columns = allColumns[lastRowIndex]
  for (let i = 0; i < columns.length; i++) {
    let curFieldName = columns[i].id
    if (columns[i].isDynamic) {
      let tmps = curFieldName.split('||')
      curFieldName = tmps[tmps.length - 1]
    }
    let match = false
    // 处理列表实体为游离DB,导出表中所有字段
    if (isFreeDB) match = true
    else {
      for (let j = 0; j < exportColumns.length; j++) {
        let tmpFieldName = getFieldName(exportColumns[j].fieldName)
        if (tmpFieldName == curFieldName) {
          match = true
          break
        }
      }
    }
    if (match) {
      //复制出导出的列
      for (let m = 0; m < allColumns.length; m++) {
        let rowColumns = allColumns[m]
        if (retColumns[m] == null) retColumns[m] = []
        let rowColumn = rowColumns[i]
        if (rowColumn && rowColumn.title) {
          rowColumn.title = getColumnTitleText(rowColumn.title)
        }
        retColumns[m].push(rowColumn)
      }
    }
  }

  return retColumns
}

export { main }
