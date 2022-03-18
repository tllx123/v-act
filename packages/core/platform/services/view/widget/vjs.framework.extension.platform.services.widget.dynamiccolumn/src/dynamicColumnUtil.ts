import * as viewContext from '@v-act/vjs.framework.extension.platform.init.view'
import { WindowVMMappingManager as vmMappingManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
const vds = { viewContext }
export function initModule() {}

// vmmapping动态列标识
let VM_FIELD_DYNAMIC_MARK = '__dynamic__'
// metaField中动态列名使用的判断标识
let FIELD_DYNAMIC_MARK = '##'
// 字段划分使用标识
let FIELD_SPLIT_MARK = '||'

// 清除由动态列生成的vmmapping信息
let cleanDynamicMappingItems = function (
  widgetId: string,
  dataSourceName: string
) {
  let mappingInfos = vmMappingManager.getMappingInfoArray(
    widgetId,
    dataSourceName
  )
  for (let index = 0; index < mappingInfos.length; index++) {
    let mappingItems = mappingInfos[index].mappingItems
    for (let itemIndex = 0; itemIndex < mappingItems.length; itemIndex++) {
      let field = mappingItems[itemIndex].field
      let refField = mappingItems[itemIndex].refField
      if (field.indexOf(widgetId + VM_FIELD_DYNAMIC_MARK) != 0) {
        continue
      }
      vmMappingManager.delItemFromWidgetMappingInfo({
        widgetId: widgetId, //控件实例ID
        dataSourceName: dataSourceName, //数据源名称
        field: field //field属性(描述ui控件自身的属性)(必填)
      })
    }
  }
}

/**
 * 判断当前字段是否动态列名格式(包含##字段并且可以使用||进行拆分)
 * @param field 字段名
 */
let _isDynamicField = function (field: string) {
  return (
    field.indexOf(FIELD_DYNAMIC_MARK) != -1 &&
    field.split(FIELD_SPLIT_MARK).length > 1
  )
}

/**
 * 获取当前表格中，所有字段对应列定义Map，如果字段为动态列名，则取最终字段标识进行对应
 * @param widgetId 表格控件ID
 */
let getGridField2DefineMap = function (
  widgetId: string,
  mappingItemCfg: any,
  columnsInfo: any
) {
  let fieldColumnCfgMap = {}
  let gridRows = columnsInfo
  let widgetType = viewContext.getWidgetTypeFromContext(widgetId)
  for (let rowIndex = 0; rowIndex < gridRows.length; rowIndex++) {
    let gridCols = gridRows[rowIndex]
    for (let colIndex = 0; colIndex < gridCols.length; colIndex++) {
      let gridCol = gridCols[colIndex]
      let field = gridCol['field']
      if (!field || field == '') {
        continue
      }
      if (_isDynamicField(field)) {
        let _fields = field.split('||')
        field = _fields[_fields.length - 1]
      }

      if (typeof mappingItemCfg[field] != 'undefined') {
        field = mappingItemCfg[field]
      }

      if (typeof fieldColumnCfgMap[field] == 'undefined') {
        let columnCfg: { [code: string]: any } = {}
        columnCfg.field = field
        columnCfg.title = gridCol['title']
        //特殊处理列表的列宽
        if (widgetType && widgetType == 'JGDataGrid') {
          columnCfg.width = gridCol['width'] + 4 //修改taoyz,要加上边框的宽度,不然每次加载时列宽都会变小4
        } else {
          columnCfg.width = gridCol['width']
        }
        columnCfg.colStyle = gridCol['colStyle']
        columnCfg.editor = gridCol['editor']
        columnCfg.headStyle = gridCol['headStyle']
        fieldColumnCfgMap[field] = columnCfg
      }
    }
  }
  return fieldColumnCfgMap
}

/**
 * 生成表格列定义工具方法
 * @param widgetId 表格ID
 * @param fieldColumnCfgMap 字段对应样式Map
 * @param columnIdMap 冻结列及非冻结列对应的列 IdMap
 */
let genGridColumnDefines = function (
  widgetId: string,
  metaFields: any,
  fieldColumnCfgMap: any,
  columnIdMap: any
) {
  let rowsFixedCount =
    viewContext.getWidgetPropertyFromContext(widgetId)['RowsFixedCount']
  let frozenColumnSize = 0

  // 是否单行表头
  let isSingleHeadRows = rowsFixedCount == 1

  let frozenColumnPropertiesIds = columnIdMap.frozenColumnIds
  let columnPropertiesIds = columnIdMap.columnIds

  // 表格冻结列定义列表
  let frozenColumns = []
  // 表格列定义列表
  let columns = []

  // 循环所有列定义，按照RowsFixedCount的定义构建表头单元格信息
  for (
    let colPropIndex = 0;
    colPropIndex < columnPropertiesIds.length;
    colPropIndex++
  ) {
    let properties = viewContext.getWidgetPropertyFromContext(
      columnPropertiesIds[colPropIndex]
    )

    // oriField为原定义字段名，dynamicField为动态列实际需要映射的字段名
    let dynamicField = (oriField = properties['ColumnName'])
    // oriTitle为原定义列名，dynamicTitle为动态列实际的列名
    let style = fieldColumnCfgMap[oriField]
    let dynamicTitle = (oriTitle = properties['SimpleChineseTitle'])
    // 列是否动态列
    let isDynamic =
      properties['IsDynamicColumn'].toLowerCase() == 'true' ? true : false
    // 动态列名配置
    let dynamicColumnName = properties['DynamicColumnName']

    if (!isSingleHeadRows) {
      // 按照是否有“动态列名称”进行分组，每出现一次“动态列名称”，将后继的动态列统一分析作为一组。所以如果当列是动态列，但没有列名配置，直接跳过不处理
      if (isDynamic && (!dynamicColumnName || dynamicColumnName == '')) {
        continue
      }
    }

    // 收集分组动态列配置信息
    let leftFields: { [code: string]: any } = {}
    if (isDynamic) {
      leftFields[oriField] = {
        title: oriTitle
      }
      if (colPropIndex != columnPropertiesIds.length - 1) {
        for (
          let nextColIndex = colPropIndex + 1;
          nextColIndex < columnPropertiesIds.length;
          nextColIndex++
        ) {
          let nextProperties = viewContext.getWidgetPropertyFromContext(
            columnPropertiesIds[nextColIndex]
          )
          let nextIsDynamic =
            nextProperties['IsDynamicColumn'].toLowerCase() == 'true'
              ? true
              : false
          let nextDynamicColumnName = nextProperties['DynamicColumnName']
          let nextTitle = nextProperties['SimpleChineseTitle']
          if (
            !nextIsDynamic ||
            (nextDynamicColumnName && nextDynamicColumnName != '')
          ) {
            // 下一列已经不是动态列，或者是动态但是有配置动态列名称
            break
          }
          let nextField = nextProperties['ColumnName']
          leftFields[nextField] = {
            title: nextTitle
          }
        }
      }
    }

    if (!isDynamic) {
      // 固定列
      for (let rowIndex = 0; rowIndex < rowsFixedCount; rowIndex++) {
        if (typeof columns[rowIndex] === 'undefined') {
          columns[rowIndex] = []
        }

        let factTitle = oriTitle
        // 解析实际的标题,如果存在|则按照|进行划分
        if (
          factTitle.indexOf('|') != -1 &&
          rowsFixedCount == factTitle.split('|').length
        ) {
          factTitle = factTitle.split('|')[rowIndex]
        }

        // 非动态列，直接构建信息
        let columnCfg = new DynamicColumnConfig().config({
          title: factTitle,
          width: style.width,
          isFieldColumn: false
        })

        if (rowIndex == rowsFixedCount - 1) {
          // 最后一行时，补充必要的信息
          columnCfg.config({
            field: oriField,
            colStyle: style.colStyle,
            headStyle: style.headStyle,
            editor: style.editor,
            isCreateVmmapping: true,
            isFieldColumn: true
          })
        }
        columns[rowIndex].push(columnCfg)
      }
    } else {
      // 动态列，使用工具类进行解析
      let columnTreeAnaly = this.newColumnTreeAnalyInstance({
        structs: dynamicColumnName,
        leafFields: leftFields,
        metadataFields: metaFields
      })

      let columnTreeArrays = this.toArrays4Wooui(columnTreeAnaly)
      for (let _level = 0; _level < columnTreeArrays.length; _level++) {
        if (typeof columns[_level] === 'undefined') {
          columns[_level] = []
        }
        let _row = columnTreeArrays[_level]
        for (let _colIndex = 0; _colIndex < _row.length; _colIndex++) {
          let _col = _row[_colIndex]

          // 基本信息
          let columnObj = new DynamicColumnConfig().config({
            title: _col.title,
            width: style.width,
            isCreateVmmapping: false,
            isFieldColumn: false
          })

          // 补充样式
          if (typeof fieldColumnCfgMap[_col.structId] != 'undefined') {
            let subStyle = fieldColumnCfgMap[_col.structId]
            columnObj.config({
              colStyle: subStyle.colStyle,
              headStyle: subStyle.headStyle,
              editor: subStyle.editor
            })
          }

          // 补充映射字段
          if (_level == rowsFixedCount - 1) {
            columnObj.config({
              field: _col.field,
              isCreateVmmapping: true,
              isFieldColumn: true
            })
          }

          columns[_level].push(columnObj)
        }
      }
    }
  }

  // 返回表格冻结列定义及普通列定义
  return {
    frozenColumns: frozenColumns,
    columns: columns
  }
}

/**
 * 生成表格需要使用的列定义
 * @param columnDefine {"frozenColumns" : frozenColumns, "columns" : columns}信息
 */
let genRefreshColumn = function (
  widgetId: string,
  dataSourceName: string,
  columnDefine: any
) {
  // 将columns转换成表格需要使用的格式
  let gridForzenColumns = []
  let gridColumns = []
  for (let index = 0; index < columnDefine.columns.length; index++) {
    let columnCfgs = []
    let _columnCfgs = columnDefine.columns[index]
    for (let cIndex = 0; cIndex < _columnCfgs.length; cIndex++) {
      let _columnCfg = _columnCfgs[cIndex]
      let columnCfg: { [code: string]: any } = {}
      columnCfgs.push(columnCfg)
      columnCfg.title = _columnCfg.title
      if (_columnCfg.isFieldColumn) {
        columnCfg.field = _columnCfg.field
        columnCfg.colStyle = _columnCfg.colStyle
        columnCfg.editor = _columnCfg.editor
        // columnCfg.headStyle = _columnCfg.headStyle;
        columnCfg.width = _columnCfg.width

        if (_columnCfg.isCreateVmmapping == true) {
          let uiField = widgetId + VM_FIELD_DYNAMIC_MARK + columnCfg.field
          // 构建vmmapping信息
          vmMappingManager.addItemToWidgetMappingInfo({
            widgetId: widgetId, //控件实例ID
            dataSourceName: dataSourceName, //数据源名称
            field: uiField, //field属性(描述ui控件自身的属性)
            refField: columnCfg.field //refField属性，关联数据源的字段
          })
        }
      }
    }
    gridColumns.push(columnCfgs)
  }

  return {
    frozenColumns: gridForzenColumns,
    columns: gridColumns
  }
}

/**
 * 动态列使用的标识对象，按照该对象的定义，可生成表格实际需要的表头定义格式
 */
function DynamicColumnConfig() {
  this.field
  this.title = null
  this.width = 100
  this.colStyle = null
  this.editor = null
  this.headStyle = null
  this.isCreateVmmapping = false
  this.isFieldColumn = false

  this.config = function (params) {
    if (params) {
      for (let attr in params) {
        this[attr] = params[attr]
      }
    }
    return this
  }
}

// ======== 动态列解析 ============
/**
 * 表格列树解析器
 */
function ColumnTreeAnaly(configurationParams: any) {
  // parentId标识
  let MARK_PARENT_ID = '-1'
  // 层级结构划分标识
  let MARK_STRUCT_SPLIT = '||'
  // 标题划分标识
  let MARK_TITLE_SPLIT = '##||'
  // 是否动态字段标识
  let MARK_FIELD_CELL = '##'

  // 列树叶子节点字段定义列表
  let _columnTreeLeafFields = []
  let _columnTreeLeafTitleMap: { [code: string]: any } = {}
  let getColumnTreeLeafFields = function () {
    return _columnTreeLeafFields
  }
  // 设置列树叶子节点字段定义
  let setColumnTreeLeafFields = function (leafFieldMap) {
    for (let field in leafFieldMap) {
      // 设置叶子节点列表
      _columnTreeLeafFields.push(field)
      let fieldCfg = leafFieldMap[field]
      // 设置叶子对应标题Map
      if (!fieldCfg) {
        continue
      }
      _columnTreeLeafTitleMap[field] = fieldCfg.title
    }
  }

  // 列树层级结构定义图
  let _columnTreeStruct = {}
  let getColumnTreeStruct = function () {
    return _columnTreeStruct
  }

  // 获取结构层级定义
  let getStructById = function (id: string) {
    return _columnTreeStruct[id] || null
  }

  // 获取列树首层级
  let COLUMN_TREE_TOP_NODE = '__column_tree_top_node__'
  let getColumnTreeTopNode = function () {
    return _columnTreeStruct[COLUMN_TREE_TOP_NODE] || null
  }

  // 获取列树低层级（非叶子）
  let COLUMN_TREE_BOTTOM_NODE = '__column_tree_bottom_node__'
  let getColumnTreeBottomNode = function () {
    return _columnTreeStruct[COLUMN_TREE_BOTTOM_NODE] || null
  }

  // 解析后，每结构层级ID关联的树节点ID列表
  let _columnTreeStructRefNodeIds = {}
  let getColumnTreeStructRefNodeIds = function () {
    return _columnTreeStructRefNodeIds
  }
  let putStructIdRefNodeIds = function (structId: string, nodeIds: any) {
    if (typeof _columnTreeStructRefNodeIds[structId] == 'undefined') {
      _columnTreeStructRefNodeIds[structId] = []
    }
    for (let _i = 0; _i < nodeIds.length; _i++) {
      _columnTreeStructRefNodeIds[structId].push(nodeIds[_i])
    }
  }

  // 列树动态节点标题定义
  let _dynamicColumnTitleMap = {}
  let getDynamicColumnTitleMap = function () {
    return _dynamicColumnTitleMap
  }

  // 列树对象
  let _columnTree = []
  let getColumnTree = function () {
    return _columnTree
  }
  // 列树节点池
  let _columnTreeNodePool = {}
  // 检索列树节点
  let getNodeById = function (nodeId: string) {
    return _columnTreeNodePool[nodeId] || null
  }

  /**
   * 判断当前字段是否动态列名格式(包含##字段并且可以使用||进行拆分)
   * @param field 字段名
   */
  let isDynamicField = function (field: string) {
    return (
      field.indexOf(MARK_FIELD_CELL) != -1 &&
      field.split(MARK_STRUCT_SPLIT).length > 1
    )
  }

  /**
   * 生成当前节点的父节点ID
   * @param curNodeId 当前节点ID
   * @param structId 当前结构层级ID
   */
  let genTreeNodeParentId = function (curNodeId: string, structId: string) {
    let struct = getStructById(structId)
    if (null == struct) {
      throw new Error(
        '[ColumnTreeAnaly.genTreeNodeParentId] structId: ' +
          structId +
          ' 在层级定义中不存在，无法生成父节点ID'
      )
    }
    if (MARK_PARENT_ID === struct.parentId) {
      return MARK_PARENT_ID
    }

    // 父级结构节点ID
    let parentStruct = getStructById(struct.parentId)
    let parentStructId = parentStruct.id

    // 父级数据节点ID，拆分curNodeId并验证每级父数据节点是否存在，不存在的筛除
    let dataParentId =
      curNodeId.lastIndexOf(MARK_STRUCT_SPLIT) == -1
        ? ''
        : curNodeId.substring(0, curNodeId.lastIndexOf(MARK_STRUCT_SPLIT))
    while (dataParentId != '') {
      let _dataParents = dataParentId.split(MARK_STRUCT_SPLIT)
      let _curDataParent = _dataParents[_dataParents.length - 1]
      let _curDataParentStructId = _curDataParent.substring(
        0,
        _curDataParent.lastIndexOf(MARK_FIELD_CELL)
      )
      if (_curDataParentStructId == '') {
        break
      }
      if (null != getStructById(_curDataParentStructId)) {
        break
      } else {
        dataParentId = dataParentId.substring(
          0,
          dataParentId.lastIndexOf(MARK_STRUCT_SPLIT)
        )
      }
    }
    let parentId
    // 按照父结构层级的类型进行组装
    if (parentStruct.type === 'dynamic') {
      parentId = dataParentId
    } else if (parentStruct.type === 'static') {
      parentId =
        ('' !== dataParentId ? dataParentId + MARK_STRUCT_SPLIT : '') +
        parentStructId
    }

    return parentId
  }

  /**
   * 生成新的树节点
   * @param nodeId 需要生成的节点ID
   * @param structId 生成节点所属的结构层级ID
   */
  let createNode = function (nodeId: string, structId: string) {
    let struct = getStructById(structId)
    if (null == struct) {
      throw new Error(
        '[ColumnTreeAnaly.createNode] 结构层级ID: ' +
          structId +
          ' 未定义，无法创建新节点'
      )
    }
    let node: { [code: string]: any } = {}
    node.id = nodeId
    node.type = struct.type
    node.title = struct.staticTitle || _dynamicColumnTitleMap[nodeId]
    node.structId = structId
    node.items = []
    return node
  }

  /**
   * 插入新的树节点
   * @param nodeId 树节点ID
   * @param structId 结构层级ID
   */
  let insert = function (nodeId, structId) {
    if (null != getNodeById(nodeId)) {
      return
    }

    let struct = getStructById(structId)
    if (null == struct) {
      throw new Error(
        '[ColumnTreeAnaly.insert] 结构层级ID:' +
          structId +
          ' 未在结构层级中定义，无法新增节点'
      )
    }
    let parentStructId = struct.parentId
    let parentNode = null
    if (parentStructId && MARK_PARENT_ID !== parentStructId) {
      let parentNodeId = genTreeNodeParentId(nodeId, structId)
      parentNode = getNodeById(parentNodeId)
      if (null == parentNode) {
        parentNode = insert(parentNodeId, parentStructId)
      }
    }

    let newNode = createNode(nodeId, structId)
    let newNodeParentId = ''
    if (null != parentNode) {
      newNodeParentId = parentNode.id
    }
    return appendColumnTreeNode(newNodeParentId, newNode)
  }

  /**
   * 增加列树节点
   * @param parentId 父节点
   * @parent
   */
  let appendColumnTreeNode = function (parentId, newNode) {
    let parentNode = getNodeById(parentId)
    if (null == parentNode) {
      newNode.parentId = MARK_PARENT_ID
      _columnTree.push(newNode)
    } else {
      newNode.parentId = parentNode.id
      parentNode.items.push(newNode)
    }
    // 注入记录缓存池
    _columnTreeNodePool[newNode.id] = newNode
    // 注入结构层级与节点关联信息
    putStructIdRefNodeIds(newNode.structId, [newNode.id])
    return newNode
  }

  /**
   * 解析元数据字段编号成树节点信息
   * @param fieldCode 元数据字段编号
   */
  let analyFieldCode = function (fieldCode) {
    let fieldCodeCells = fieldCode.split(MARK_STRUCT_SPLIT)

    let nodeId = ''
    for (let _i = 0; _i < fieldCodeCells.length; _i++) {
      let fieldCell = fieldCodeCells[_i]

      // 节点ID
      nodeId += (nodeId == '' ? '' : MARK_STRUCT_SPLIT) + fieldCell

      // 动态字段获取层级机构ID
      let structId =
        fieldCell.indexOf(MARK_FIELD_CELL) != -1
          ? fieldCell.substring(0, fieldCell.lastIndexOf(MARK_FIELD_CELL))
          : fieldCell

      // 没有定义的层级ID则跳过
      if (null == getStructById(structId)) {
        continue
      }

      // 正常插入节点
      insert(nodeId, structId)
    }
  }

  let isSingleTitle = false
  /**
   * 节点结构层级定义
   * @param headConfigStr 表头结构层级定义字符串
   */
  let analyColumnTreeStruct = function (headConfigStr) {
    if (!headConfigStr || headConfigStr == '') {
      isSingleTitle = true
      analyLeafFields()
      return
    }
    if (headConfigStr.split('|').length % 3 != 0) {
      throw new Error(
        '[ColumnTreeAnaly.analyColumnTreeStruct] 表头结构层级定义字符串必须以3项数据为一组，否则无法解析'
      )
    }

    // 生成UUID
    let S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    _columnTreeStruct = {}
    let headConfigCell = headConfigStr.split('|')
    let parentId = MARK_PARENT_ID
    for (let _i = 0; _i < headConfigCell.length; _i += 3) {
      let level = headConfigCell[_i]
      let title = headConfigCell[_i + 1]
      let field = headConfigCell[_i + 2]

      let id = field
      let type = 'dynamic'
      let staticTitle = undefined

      if (MARK_PARENT_ID == id) {
        id = 'StaticColumn' + S4() + S4() + '_' + title
        type = 'static'
        staticTitle = title
      }

      let isTop = _i == 0
      let isBottom = _i >= headConfigCell.length - 3

      // 层级类型
      let columnTreeStruct = {
        id: id,
        parentId: parentId,
        staticTitle: staticTitle,
        field: field,
        type: type,
        isTop: isTop,
        isBottom: isBottom,
        level: parseInt(level)
      }

      _columnTreeStruct[id] = columnTreeStruct

      // 顶级节点定义
      if (isTop) {
        _columnTreeStruct[COLUMN_TREE_TOP_NODE] = columnTreeStruct
      }

      // 低级节点定义
      if (isBottom) {
        _columnTreeStruct[COLUMN_TREE_BOTTOM_NODE] = columnTreeStruct
      }

      if (columnTreeStruct.parentId != MARK_PARENT_ID) {
        let parentStruct = getStructById(columnTreeStruct.parentId)
        parentStruct.childId = columnTreeStruct.id
      }

      parentId = id
    }

    analyLeafFields()
  }

  /**
   * 解析结构层级叶子节点，并补充在结构树的底层下
   */
  let analyLeafFields = function () {
    let parentId = MARK_PARENT_ID
    let parentLevel = 0
    if (!isSingleTitle) {
      let bottomNode = getColumnTreeBottomNode()
      parentId = bottomNode.id
      parentLevel = bottomNode.level
    }

    let leafFields = getColumnTreeLeafFields()
    if (leafFields.length <= 0) {
      throw new Error(
        '[ColumnTreeAnaly.analyColumnTreeStruct] 结构层级叶子节点未定义'
      )
    }
    for (let _i = 0; _i < leafFields.length; _i++) {
      let field = leafFields[_i]
      let columnTreeStruct = {
        id: field,
        parentId: parentId,
        field: field,
        type: 'field',
        level: parentLevel + 1
      }
      _columnTreeStruct[field] = columnTreeStruct
    }
  }

  /**
   * 解析metadata中的fields定义，生成列树
   * @param metaFields resultData中metadata的fields定义
   */
  let analyDynamicColumn = function (metaFields) {
    for (let index = 0; index < metaFields.length; index++) {
      let metaField = metaFields[index]
      if (isDynamicField(metaField.code)) {
        analyFieldCode(metaField.code)
      }
    }
  }

  /**
   * 解析metadata中的fields定义，生成各层级字段对应的列名Map
   * @param metaFields resultData中metadata的fields定义
   */
  let analyDynamicColumnTitle = function (metaFields) {
    for (let index = 0; index < metaFields.length; index++) {
      let metaField = metaFields[index]
      if (isDynamicField(metaField.code)) {
        let prefix = ''
        let fieldCodes = metaField.code.split(MARK_STRUCT_SPLIT)
        for (let fieldIndex = 0; fieldIndex < fieldCodes.length; fieldIndex++) {
          let fieldCell = fieldCodes[fieldIndex]
          let fieldCode =
            prefix +
            (prefix == '' ? '' : MARK_STRUCT_SPLIT) +
            fieldCodes[fieldIndex]
          let title = ''
          if (fieldCode == metaField.code) {
            // 如果为叶子节点.标题按照leafFieldsTitleMap中的定义
            if (typeof _columnTreeLeafTitleMap[fieldCell] != 'undefined') {
              title = _columnTreeLeafTitleMap[fieldCell]
            } else {
              title = '#error:' + fieldCode + ' undefined'
            }
          } else {
            // 如果为非叶子节点.标题按照meteField中的name进行截取
            let fieldName = metaField.name.split(MARK_TITLE_SPLIT)[fieldIndex]
            if (typeof _dynamicColumnTitleMap[fieldName] == 'undefined') {
              title = fieldName
            }
          }

          _dynamicColumnTitleMap[fieldCode] = title
          prefix = fieldCode
        }
      }
      // 补充合计列
      if (metaField.code.indexOf('rowssum##') == 0) {
        _dynamicColumnTitleMap[metaField.code] = metaField.name
      }
    }
  }

  /**
   * 按照节点ID获取下级field类型节点的集合
   * @param 列树节点ID
   */
  let getColumnTreeSubFieldNodeById = function (id) {
    let treeNode = getNodeById(id)
    if (null == treeNode) {
      throw new Error(
        '[ColumnTreeAnaly.getColumnTreeSubFieldNodeById]按照ID获取列树节点失败:' +
          id
      )
    }
    let getSubFieldNodes = function (_items) {
      let returnNodes = []
      for (let _i = 0; _i < _items.length; _i++) {
        let _item = _items[_i]
        let _fieldFields = getSubFieldNodes(_item.items)
        for (let _j = 0; _j < _fieldFields.length; _j++) {
          returnNodes.push(_fieldFields[_j])
        }
        if (_item.type === 'field') {
          returnNodes.push(_item)
        }
      }
      return returnNodes
    }

    return getSubFieldNodes(treeNode.items)
  }

  /**
   * 插入统计列
   * @param structId 节点ID
   * @param cellMark 统计字段的标识
   * @param title 统计列标题
   */
  let appendCountColumn = function (id, cellMark, title) {
    let node = getNodeById(id)
    if (null == node) {
      throw new Error(
        '[ColumnTreeAnaly.insertCount]插入统计信息的节点不存在:' + id
      )
    }

    let _appendSubNodeCountColumn = function (curNode) {
      // 当前节点的层级结构信息
      let curStructId = curNode.structId
      let curStruct = getStructById(curStructId)

      if (typeof curStruct.childId === 'undefined') {
        // 到达底层，并将该节点输出
        return curNode
      }
      // 孩子节点的层级结构信息
      let childStructId = curStruct.childId
      let childStruct = getStructById(childStructId)

      let countNodeId = cellMark + id + '_$COUNT$_' + childStructId
      let countNode = createNode(countNodeId, childStructId)
      countNode.title = title
      countNode.type = 'count'
      countNode.parentId = curNode.id
      appendColumnTreeNode(curNode.id, countNode)
      return _appendSubNodeCountColumn(countNode)
    }

    let fieldCountNodeParent = _appendSubNodeCountColumn(node)
    // 增加最终统计叶子节点
    let defineLeafNodes = getColumnTreeLeafFields()
    let referStructId = defineLeafNodes[defineLeafNodes.length - 1]
    let fieldCountNodeId = cellMark + id
    let fieldCountNode = createNode(fieldCountNodeId, referStructId)
    fieldCountNode.title = title
    fieldCountNode.type = 'field'
    fieldCountNode.parentId = fieldCountNodeParent.id
    appendColumnTreeNode(fieldCountNodeParent.id, fieldCountNode)
  }

  /**
   * 按照层级结构ID添加统计字段信息
   * @param structId 层级结构ID
   * @param cellMark 统计字段的标识
   * @param title 统计列标题
   */
  let appendCountColumnByStructId = function (structId, cellMark, title) {
    let nodeIds = getColumnTreeStructRefNodeIds()[structId]
    if (nodeIds && nodeIds.length > 0) {
      for (let _i = 0; _i < nodeIds.length; _i++) {
        let nodeId = nodeIds[_i]
        appendCountColumn(nodeId, cellMark, title)
      }
    }
  }

  /**
   * 解析器初始化
   */
  let configuration = function () {
    setColumnTreeLeafFields(configurationParams['leafFields'])
    analyDynamicColumnTitle(configurationParams['metadataFields'])
    analyColumnTreeStruct(configurationParams['structs'])
    analyDynamicColumn(configurationParams['metadataFields'])
  }
  configuration()

  // 对外接口
  this.MARK_PARENT_ID = MARK_PARENT_ID
  this.MARK_STRUCT_SPLIT = MARK_STRUCT_SPLIT
  this.MARK_TITLE_SPLIT = MARK_TITLE_SPLIT
  this.MARK_FIELD_CELL = MARK_FIELD_CELL

  this.getColumnTree = getColumnTree
  this.getColumnTreeStruct = getColumnTreeStruct
  this.getNodeById = getNodeById
  this.getStructById = getStructById
  this.getColumnTreeStructRefNodeIds = getColumnTreeStructRefNodeIds
  this.getDynamicColumnTitleMap = getDynamicColumnTitleMap
  this.getColumnTreeSubFieldNodeById = getColumnTreeSubFieldNodeById
  this.appendCountColumnByStructId = appendCountColumnByStructId
}

/**
 * 列树配置工厂类
 */
//var ColumnTreeAnalyFactory = {};

/**
 * 实例化列树解析器
 * @param params.LeafFieldConfig 列树叶子节点配置:{"billAmount":{"title":"数量"}, "billMoney":{"title":"金额"}}
 * @param params.MetadataFields 元数据字段
 * @param params.StructConfig 层级结构配置："1|XXX台帐|-1|2|类型|billType|3|项目|refProjCode"
 */
let newColumnTreeAnalyInstance = function (params) {
  // 检查属性
  if (typeof params['leafFields'] == 'undefined') {
    throw new Error('[ColumnTreeAnalyFactory.newInstance]参数leafFields未定义')
  }
  if (typeof params['metadataFields'] == 'undefined') {
    throw new Error(
      '[ColumnTreeAnalyFactory.newInstance]参数metadataFields未定义'
    )
  }
  if (typeof params['structs'] == 'undefined') {
    throw new Error('[ColumnTreeAnalyFactory.newInstance]参数structs未定义')
  }

  let columnTreeAnaly = new ColumnTreeAnaly(params)
  return columnTreeAnaly
}

/**
 * 列树转换工具
 */
//var ColumnTreeConvertUtil = {};

// 生成列后的分割信息
//ColumnTreeConvertUtil.titleSplitMark = "|&&|\n";

/**
 * 将列树转换成二维列表对象(单纯的二维数组，不会对标题进行合并)
 * @param columnTreeAnaly 列树对象解析器
 */
let toArrays = function (columnTreeAnaly) {
  let arrays = []
  // 递归生成二维数组方法对象
  let genArray = function (treeNodes) {
    for (let _i = 0; _i < treeNodes.length; _i++) {
      let treeNode = treeNodes[_i]
      let items = treeNode.items
      let struct = columnTreeAnaly.getStructById(treeNode.structId)
      let level = struct.level - 1
      if (typeof arrays[level] === 'undefined') {
        arrays[level] = []
      }

      // 列元信息
      let columnObj = {
        title: treeNode.title,
        field: treeNode.id,
        structId: treeNode.structId,
        type: treeNode.type,
        parentId: treeNode.parentId
      }

      // 克隆列信息
      let columnObjClone = function () {
        let _columnObj = {}
        for (let _key in columnObj) {
          _columnObj[_key] = columnObj[_key]
        }
        return _columnObj
      }

      if (treeNode.type === 'field') {
        // field类型的节点，直接放入二维数组
        arrays[level].push(columnObjClone())
      } else {
        // 非field类型的节点，算出下级共有多少个field节点，以此为数量放入二维数组
        let refLeafFieldIds = columnTreeAnaly.getColumnTreeSubFieldNodeById(
          treeNode.id
        )
        for (
          let _fieldIndex = 0;
          _fieldIndex < refLeafFieldIds.length;
          _fieldIndex++
        ) {
          arrays[level].push(columnObjClone())
        }
      }
      genArray(items)
    }
  }

  //生成二维列表
  genArray(columnTreeAnaly.getColumnTree())
  return arrays
}

/**
 * 将列树转换成二维列表对象(Wooui格式，按层级会加上必要的标识进行区分，以防止多行表头时，由于不同层级下的标题刚好相同而被合并)
 * @param columnTreeAnaly 列树对象解析器
 */
let toArrays4Wooui = function (columnTreeAnaly) {
  let columnTreeArrays = this.toArrays(columnTreeAnaly)
  let levelSize = columnTreeArrays.length
  let titleMap = columnTreeAnaly.getDynamicColumnTitleMap()
  let MARK_STRUCT_SPLIT = columnTreeAnaly.MARK_STRUCT_SPLIT

  for (let _rowIndex = 0; _rowIndex < columnTreeArrays.length; _rowIndex++) {
    let _row = columnTreeArrays[_rowIndex]
    for (let _colIndex = 0; _colIndex < _row.length; _colIndex++) {
      let _col = _row[_colIndex]
      // 重构title信息
      if ('-1' != _col.parentId) {
        //_col.title = (_col.parentId + this.titleSplitMark + _col.title);
      }
      // 单只有一行表头的时候
      if (levelSize === 1) {
        let nodeId = _col.field
        let newTitle = ''
        if (nodeId.indexOf(MARK_STRUCT_SPLIT) != -1) {
          let nodeIdCells = nodeId.split(MARK_STRUCT_SPLIT)
          let _subId = ''
          for (
            let _cellIndex = 0;
            _cellIndex < nodeIdCells.length - 1;
            _cellIndex++
          ) {
            let nodeIdCell = nodeIdCells[_cellIndex]
            _subId += (newTitle !== '' ? MARK_STRUCT_SPLIT : '') + nodeIdCell
            let _subTitle = titleMap[_subId]
            if ('' !== _subTitle) {
              newTitle += (newTitle !== '' ? '-' : '') + _subTitle
            }
          }
        }
        if (newTitle !== '') {
          _col.title = newTitle
        }
      }
    }
  }
  return columnTreeArrays
}

/**
 * 将列树转换成二维列表对象(HTML格式,带rowSpan、colSpan属性)
 * @param columnTreeAnaly 列树对象解析器
 */
let toArrays4HTML = function (columnTreeAnaly) {
  throw new Error('[ColumnTreeConvertUtil.toArraysWithRowColSpan]方法未实现')
}

export {
  cleanDynamicMappingItems,
  genGridColumnDefines,
  genRefreshColumn,
  getGridField2DefineMap,
  newColumnTreeAnalyInstance,
  toArrays,
  toArrays4HTML,
  toArrays4Wooui
}
