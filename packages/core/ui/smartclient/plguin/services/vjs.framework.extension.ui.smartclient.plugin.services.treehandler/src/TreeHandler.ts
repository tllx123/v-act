import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'

import { ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'

import { TreeViewUtil as treeViewUtil } from '@v-act/vjs.framework.extension.platform.services.domain.tree'

import { TreeDataTranslator as treeDataTranslator } from '@v-act/vjs.framework.extension.platform.services.domain.tree'

import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'

import { TreeViewUtil as treeViewUIHelp } from '@v-act/vjs.framework.extension.platform.services.viewmodel.datamodel.tree'
import { TreeDataModelFactory as treeViewModelFactory } from '@v-act/vjs.framework.extension.platform.services.viewmodel.datamodel.tree'

import { ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'

import { ExpressionEngine as formulaEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'

import { ExpressionEngine as expEngine } from '@v-act/vjs.framework.extension.platform.services.engine'

import { ExpressionContext as ExpressionContext2 } from '@v-act/vjs.framework.extension.platform.services.engine'

var transformPlatformDatasource = function (params) {
  if (!params) {
    return params
  }
  var newObj = {}
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      newObj[key] = params[key]
    }
  }
  var dsObj = newObj.datasource
  if (dsObj && dsObj.v3Datasource) {
    dsObj = dsObj.v3Datasource
  }
  return newObj
}

var closure = function (fn) {
  var scopeId = ScopeManager.getCurrentScopeId()
  return function () {
    ScopeManager.openScope(scopeId)
    fn.apply(this, arguments)
    ScopeManager.closeScope()
  }
}

var _$getChangedData = function (record) {
  var changedData =
    typeof record.getChangedData == 'function'
      ? record.getChangedData()
      : record
  if (changedData) {
    var result = {}
    for (var key in changedData) {
      if (changedData.hasOwnProperty(key)) {
        result[key] = changedData[key]
      }
    }
    return result
  }
  return {}
}

var getChangedDatas = function (records, leafFieldName) {
  var flag = Array.isArray(records)
  var newRecords = records
  if (!flag) {
    newRecords = [records]
  }
  var rs = []
  for (var i = 0, record; (record = newRecords[i]); i++) {
    //复制，避免引用导致多次触发值改变事件
    var changedData = _$getChangedData(record)
    changedData['id'] = record.getSysId ? record.getSysId() : record['id']

    // 处理树节点图标问题
    if (leafFieldName) {
      changedData[leafFieldName] = record.get(leafFieldName)
    }
    rs.push(changedData)
  }
  if (flag) {
    return rs
  } else {
    return rs[0]
  }
}

/**
 * 将record对象原生js对象
 * @param 前端db数据集
 */
var toOrginalData = function (dataSet) {
  var flag = Array.isArray(dataSet)
  var resultSet
  if (flag) {
    resultSet = []
    for (var i = 0, len = dataSet.length; i < len; i++) {
      var record = dataSet[i]
      var data = record.toMap ? record.toMap() : record //兼容二次开发数据
      resultSet.push(data)
    }
  } else {
    resultSet = dataSet.toMap ? dataSet.toMap() : dataSet //兼容二次开发数据
  }
  return resultSet
}

dataListHandlerBindEvent = function (element) {
  element.on(
    'rowSelected',
    closure(function (record, state) {
      element._getSelectionUpdatedStated(false)
      var widgetId = element.getId()
      var ds = widgetDatasource.getBindDatasource(widgetId)
      var rd = ds.getRecordById(record['id'])
      if (rd) {
        ds.selectRecords({
          records: [rd],
          isSelect: state
        })
      }
      element._getSelectionUpdatedStated(true)
    })
  )

  element.on(
    'rowsSelected',
    closure(function (ids, state) {
      var widgetId = element.getId()
      var ds = widgetDatasource.getBindDatasource(widgetId)

      var records = []
      var dbRecords = ds.getSelectedRecords().toArray()
      if (ids.length > dbRecords.length) {
        state = true
        for (var i = 0, len = ids.length; i < len; i++) {
          var rd = ds.getRecordById(ids[i])
          if (rd) records.push(rd)
        }
      } else if (ids.length > 0) {
        // 判断数据中哪个节点需要取消选中数据
        for (var i = 0, len = dbRecords.length; i < len; i++) {
          var tmpDbRecord = dbRecords[i],
            tmpDbId = tmpDbRecord.toMap()['id']

          for (var j = 0, lenJ = ids.length; j < lenJ; j++) {
            var tmpId = ids[j]
            if (tmpId === tmpDbId) break
            else if (j === lenJ - 1 && tmpId !== tmpDbId) {
              records.push(tmpDbRecord)
            }
          }
        }

        state = false
      } else if (ids.length === 0) {
        records = dbRecords
        state = false
      }

      if (records.length > 0)
        ds.selectRecords({
          records: records,
          isSelect: state
        })
    })
  )

  //当前行事件绑定
  element.on(
    'currentRowClick',
    closure(function (record) {
      var id = record['id']
      var widgetId = element.getId()
      var ds = widgetDatasource.getBindDatasource(widgetId)
      var rd = ds.getRecordById(record['id'])
      ds.setCurrentRecord({
        record: rd
      })
    })
  )
}
/**
 * 记录选中动作
 * @param {Object} element
 * @param {Object} values
 * @param {Object} valueObj
 */
export function genSelectAction(widgetCode) {
  return function (params) {
    var isSelect = params.isSelect
    var result = params.resultSet
    var values
    if (result instanceof Array) {
      //兼容二次开发控件的数组数据
      values = result
    } else {
      var datas = result.toArray()
      values = toOrginalData(datas)
    }
    var element = widgetContext.get(widgetCode, 'widgetObj')
    element.selectRecords(values, isSelect)
  }
}
/**
 *当前行动作
 * @param {Object} element
 * @param {Object} values
 * @param {Object} valueObj
 */
export function genCurrentAction(widgetCode) {
  return function (params) {
    var currentRecord = params.currentRecord
    var record = toOrginalData(currentRecord)
    if (record) {
      var element = widgetContext.get(widgetCode, 'widgetObj')
      element.setCurrentRecord(record)
    }
  }
}
/**
 *当前行动作
 * @param {Object} actionType
 * @param {Object} element
 * @param {Object} values
 * @param {Object} valueObj
 */
export function genDefaultAction(widgetCode) {
  return function (params) {
    var element = widgetContext.get(widgetCode, 'widgetObj')
    element.markForRedraw()
  }
}
/**
 * 刷新控件
 * @param widgetId 控件Id
 * @param dsName 控件绑定数据源名称
 * @param metafields vmmappinginfo列信息
 * @param values 数据源数据
 */
var _reFreshWidget = function (widgetId, dsName, metafields, values) {
  var fields = []
  var widgetObj = widgetContext.get(widgetId, 'widgetObj')
  var multiHeaders = widgetObj.getRowsFixedCount() > 1
  var oFields = widgetObj.getOrginalFields()
  var dynamicFieldNotAdded = true
  var dynamicFieldCfg = widgetObj._getDynamicFieldCfg(oFields)
  var result = _analyseDynamicFields(
    metafields,
    dynamicFieldCfg,
    multiHeaders,
    widgetObj
  )
  for (var i = 0, len = oFields.length; i < len; i++) {
    var field = oFields[i]
    var columnId = field.columnId
    if (typeof columnId == 'undefined') continue
    var isDynamic = field['IsDynamicColumn']
    if (isDynamic) {
      if (dynamicFieldNotAdded) {
        dynamicFieldNotAdded = false
        for (var j = 0, f; (f = result.fields[j]); j++) {
          fields.push(f)
        }
      }
    } else fields.push(field)
  }
  var ds = _reBuildSCDataSource(dsName, metafields)
  ds.setCacheData(values)
  if (!widgetObj.ShowDynamicColumnTitle) {
    var fieldsFormat = $.extend(true, [], fields)
    var headerSpanFormat = $.extend(true, [], result.headerSpan)
    var recursionHeaderSpan = function (data) {
      for (var k = 0; k < data.length; k++) {
        if (data[k] && data[k].spans && data[k].spans.length) {
          if (data[k].spans[0] && data[k].spans[0].fields) {
            data[k].fields = $.extend(true, [], data[k].spans)
            delete data[k].spans
            recursionHeaderSpan(data[k].fields)
          } else {
            if (data[k].spans) {
              recursionHeaderSpan(data[k].spans)
            }
          }
        } else {
          if (data[0] && data[0].fields) {
            for (var m = 0; m < data.length; m++) {
              for (var j = 0; j < fieldsFormat.length; j++) {
                if (
                  fieldsFormat[j].name === data[m].fields[0] &&
                  !fieldsFormat[j].simpleChineseTitle
                ) {
                  fieldsFormat[j].title = data[m].title
                  fieldsFormat[j].simpleChineseTitle = data[m].title
                }
              }
              data[m] = data[m].fields[0]
            }
          }
        }
      }
    }
    var headerSpanFormatHide = $.extend(true, [], result.headerSpan)
    var recursionHeaderHide = function (data) {
      for (var k = 0; k < data.length; k++) {
        if (data[k] && data[k].spans && data[k].spans.length) {
          if (data[k].spans[0] && data[k].spans[0].fields) {
            data[k].fields = data[k].spans.map(function (p) {
              return p.fields[0]
            })
            delete data[k].spans
          } else {
            if (data[k].spans) {
              recursionHeaderSpan(data[k].spans)
            }
          }
        }
      }
    }
    recursionHeaderSpan(headerSpanFormat)
    recursionHeaderHide(headerSpanFormatHide)
    // if (headerSpanFormat && headerSpanFormat.length) {

    // }
    //清空现有的标题，原因：setFields会遍历headerSpans会导致顺序出错的问题Task20201221066
    widgetObj._widget.headerSpans = []
    widgetObj.setDataSource(ds, fieldsFormat)
    widgetObj.setData(this.getData(widgetObj, ds))
    if (typeof headerSpanFormat[0] == 'object') {
      widgetObj.setHeaderSpans(headerSpanFormat)
    } else {
      widgetObj.setHeaderSpans(headerSpanFormatHide)
    }
  } else {
    //清空现有的标题，原因：setFields会遍历headerSpans会导致顺序出错的问题Task20201221066
    widgetObj._widget.headerSpans = []
    widgetObj.setDataSource(ds, fields)
    widgetObj.setData(this.getData(widgetObj, ds))
    widgetObj.setHeaderSpans(result.headerSpan)
  }
}
/**
 *获取控件data
 */
var getData = function (widgetObj, ds) {
  return ds.getCacheData()
}

/**
 *添加动态列
 */
var addDynamicFields = function (widgetId, valueObj, values) {
  // 根据树加载调整逻辑
  if (hasDynamicFields(widgetId))
    _reFreshWidget.call(
      this,
      widgetId,
      valueObj.dataSource,
      valueObj.resultSet.metadata.fields,
      values
    )
}

/**
 * 重新构建sc数据源
 * @param dsName 数据源名称
 * @param metaFields 字段元数据
 */
var _reBuildSCDataSource = function (dsName, metaFields) {
  var ds = isc.DataSource.get(dsName)
  if (ds) {
    //销毁
    ds.destroy()
  }
  var fields = []
  if (metaFields && metaFields.length > 0) {
    for (var i = 0, len = metaFields.length; i < len; i++) {
      var fieldCfg = metaFields[i]
      var field = createDataSourceField(fieldCfg)
      fields.push(field)
    }
  }

  //动态列未生成id字段，导致数据同步会弹出sc的警告信息，clientOnly updte......Task20200701001
  var hasIdField = fields.findIndex(function (field) {
    return field.name == 'id'
  })
  if (hasIdField < 0) {
    fields.push({
      type: 'text',
      title: 'Id',
      name: 'id',
      primaryKey: true,
      length: 64
    })
  }

  var scopeId = scopeManager.getCurrentScopeId()
  return isc.VDataSource.create({
    dbName: dsName,
    scopeId: scopeId,
    clientOnly: true,
    fields: fields
  })
}
//    /**
//     * 获取动态列配置
//     * @param 列表列配置信息
//     */
//    var _getDynamicFieldCfg = function(columnCfg) {
//        var fieldCfg = {};
//        for (var i = 0, len = columnCfg.length; i < len; i++) {
//            var field = columnCfg[i];
//            var columnId = field.columnId;
//            if (typeof(columnId) == 'undefined') {
//                continue;
//            }
//            var isDynamic = field["IsDynamicColumn"];
//            if (isDynamic) {
//                fieldCfg[field.name] = field;
//            }
//        }
//        return fieldCfg;
//    };

var split_operator = '_075_'

var split_operator1 = '_076_'

var regex = new RegExp(split_operator + '\\d?$')

/**
 * 根据vmppinginfo列配置信息生成sc列信息
 *
 * @param fieldCfg
 *            vmppinginfo列配置
 */
var createDataSourceField = function (fieldCfg) {
  var field = {
    name: fieldCfg.code,
    type: _fieldTypeMapping[fieldCfg.type],
    length: fieldCfg.length == undefined ? 255 : parseInt(fieldCfg.length)
  }
  if (fieldCfg.code == 'id') {
    field.primaryKey = true
  }
  return field
}

var _fieldTypeMapping = {
  char: 'text',
  text: 'text',
  number: 'float',
  boolean: 'boolean',
  date: 'text',
  longDate: 'text',
  integer: 'integer',
  1: 'text',
  2: 'text',
  3: 'float',
  4: 'boolean',
  5: 'text',
  6: 'text',
  7: 'integer'
}

//2020-09-08 添加minWidth属性，解决动态列因列表宽度过小显示不全问题 Task20200908091
var _dynamicFieldCopyAttrs = [
  'disabled',
  'hasClick',
  'recordClick',
  'formatCellValue',
  'width',
  'ID',
  'columnId',
  'align',
  'required',
  'title',
  'showIf',
  'canSort',
  'canEdit',
  'cellAlign',
  'editorType',
  '_displayFormatCfg',
  'minWidth'
]

/**
 * 分析动态列信息
 */
var _analyseDynamicFields = function (
  metafields,
  dynamicFieldCfg,
  multiHeaders,
  widget
) {
  var fields = []
  var headFields = []
  var headerSpanCfg = {}
  for (var i = 0, len = metafields.length; i < len; i++) {
    var field = metafields[i]
    var code = field.code
    if (code.indexOf(split_operator) != -1) {
      var names
      var scField = createDataSourceField(field) //actionHandler.executeComponentAction("createDataSourceField",field);
      if (code.indexOf(split_operator1) != -1) {
        names = field.name.split(split_operator1)
        scField.title = names[names.length - 1]
      } else {
        var temp = code.split(split_operator)
        names = [field.name, temp[temp.length - 1]]
        scField.title = field.name
      }
      if (field.remark) {
        scField.remark = field.remark
        scField.isSummaryCol = field.remark.isSummaryCol
      }
      if (multiHeaders) {
        //多表头才生成合并标题信息
        _genHeaderSpan(headerSpanCfg, names, field)
      }
      for (var fieldName in dynamicFieldCfg) {
        if (endWith(code, fieldName)) {
          var fieldCfg = dynamicFieldCfg[fieldName]
          for (var ii = 0, l = _dynamicFieldCopyAttrs.length; ii < l; ii++) {
            var attr = _dynamicFieldCopyAttrs[ii]
            scField[attr] = fieldCfg[attr]
          }
          if (!multiHeaders) {
            scField.title = names[0] ? names[0].replace(regex, '') : ''
          }
          if (fieldCfg['editorProperties']['length']) {
            scField.length = fieldCfg['editorProperties']['length']
          }
          if (scField.isSummaryCol && widget.AheadSumCol) {
            headFields.push(scField)
          } else {
            fields.push(scField)
          }
          break
        }
      }

      //                fields.push(scField);
    }
  }
  fields = headFields.concat(fields)
  return {
    fields: fields,
    headerSpan: _toSCHeaderSpans(headerSpanCfg)
  }
}
/**
 * 判断str是否以compare结尾
 */
var endWith = function (str, compare) {
  var reg = new RegExp(compare + '$')
  return reg.test(str)
}
/**
 *转换成sc多行表头配置
 */
var _toSCHeaderSpans = function (headerSpanCfg) {
  var headerSpans = []
  for (var attr in headerSpanCfg) {
    var cfg = headerSpanCfg[attr]
    if (cfg.isSpan === true) {
      delete cfg.isSpan
    } else {
      cfg = {
        title: attr,
        spans: _toSCHeaderSpans(cfg)
      }
    }
    headerSpans.push(cfg)
  }
  return headerSpans
}
/**
 *生成多行表头配置
 */
var _genHeaderSpan = function (headerSpan, names, field) {
  var len = names.length
  if (len < 2) return
  var parent = headerSpan
  for (var i = 0; i < len - 1; i++) {
    var name = names[i].replace(regex, '')
    var span = parent[name]
    var isSpans = i + 2 < len
    if (!span) {
      span = isSpans
        ? {}
        : {
            title: name,
            fields: [],
            isSpan: true
          }
      parent[name] = span
    }
    parent = span
  }
  parent.fields.push(field.code)
}
/**
 * 是否包含动态列
 * @param {Object} widgetId
 */
var hasDynamicFields = function (widgetId) {
  var widget = widgetContext.get(widgetId, 'widgetObj')
  var columnIds = widget.getFields()
  if (columnIds) {
    for (var index = 0; index < columnIds.length; index++) {
      var isContrainDynamic = columnIds[index]['IsDynamicColumn']
      if (isContrainDynamic) {
        return true
      }
    }
  }
  return false
}
export { addDynamicFields, getData }

export function bindEvent(element) {
  dataListHandlerBindEvent(element)

  /**
   *节点展开事件
   */
  element.on(
    'expandRecord',
    closure(function (record) {
      var treeData = element.getTreeData()
      if (treeData.isLoaded(record)) {
        return
      }
      var widgetId = element.getId()
      var id = record.id
      var tree = treeViewUtil.getTree(widgetId)
      var node = tree.getNodeById(id)
      node.getChildren()
    })
  )

  /**
   *拖拽事件
   */
  element.on(
    'drop',
    closure(function (nodes, folder, index, sourceWidget) {
      var widgetId = element.getId()
      var tree = treeViewUtil.getTree(widgetId)
      var moveNode = tree.getNodeById(node.id)
      for (var i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i]
        var parent = element.getParent(node)
        var moveState
        if (parent === folder) {
          //如果父节点相等，代表上、下移操作
          var children = element.getChildren(parent)
          var position = children.indexOf(node)
          var length = children.length
          if (index == length) {
            //toNode = tree.getNodeById(children[length-1]["id"]);
            moveNode.move({
              operation: moveNode.Enum.BELLOW
            })
            //moveState = treeViewModelFactory.Enum_MoveTo.BELOW;
          } else {
            //toNode = tree.getNodeById(children[index]["id"]);
            //moveState = treeViewModelFactory.Enum_MoveTo.ABOVE;
            moveNode.move({
              operation: moveNode.Enum.ABOVE
            })
          }
        } else {
          var toNode = tree.getNodeById(folder.id)
          moveNode.moveTo({
            destination: toNode
          })
        }
      }
    })
  )
}

/**
 * 加载动作
 * @param {Object} element
 * @param {Object} values
 * @param {Object} valueObj
 */
export function genLoadAction(widgetCode) {
  return function (tempParams) {
    var params = transformPlatformDatasource(tempParams)
    // 如果为覆盖加载时，则先清空树
    var element = widgetContext.get(widgetCode, 'widgetObj')

    element._getSelectionUpdatedStated(false)

    addDynamicFields(widgetCode, params)
    var isCover = !params.isAppend
    var tree = treeViewUtil.getTree(widgetCode)
    if (isCover) {
      //tree.resetLoadInfo();
      element.reset()
      element.removeAll()
    }
    var result = params.resultSet
    if (result.isEmpty()) {
      var rs = tree.getAllRecords()
      if (rs.isEmpty()) {
        element.removeAll()
      }
    } else {
      var datas
      if (result instanceof Array) {
        //兼容二次开发的数组数据
        datas = result
      } else if (typeof result.getOriginalDatas == 'function') {
        //兼容平台内部数据集合对象
        datas = result.getOriginalDatas()
      } else {
        datas = []
      }
      treeDataTranslator.translate(widgetCode, datas, isCover)
      element.linkNodes(datas)
      // 处理默认展开节点
      var _expandLevel = widgetAction.executeWidgetAction(
        widgetCode,
        'getExpandLevel'
      )
      if (_expandLevel && _expandLevel !== '') {
        var expandLevel = formulaEngine.execute({
          expression: _expandLevel,
          context: new ExpressionContext()
        })

        // 判断当前的级别和data的级别是否需要关闭节点
        var _innCodFieldName = element.InnerCodeColumn
        var _biggestLevelInData = _getTreeDataBiggestLevel(
          datas,
          _innCodFieldName
        )
        if (expandLevel) {
          var numReg = new RegExp('^[0-9]*$')
          if (numReg.test(expandLevel) && _biggestLevelInData > expandLevel) {
            var _pidFieldName = element.getParentField()
            var _clickedNodeID = null
            var _newData = _getSeqTreeData(datas, _innCodFieldName)
            //                            if (_newData && _newData.length > 0)
            //                                _clickedNodeID = _newData[0][_pidFieldName];
            //
            //                            widgetAction.executeWidgetAction(widgetCode, "expandTreeByDepth", expandLevel, true, _clickedNodeID);
            if (_newData && _newData.length > 0) {
              //可能数据只是某个树的子树，所以使用排序后根节点处理层级即可Task20200901095
              widgetAction.executeWidgetAction(
                widgetCode,
                'expandTreeByDepth',
                expandLevel,
                true,
                ''
              )
              //                            	var innCodeLen = _newData[0][_innCodFieldName].length;
              //                            	var idCo = element.IDColumn;
              //                            	for(var i = 0,len = _newData.length;i<len;i++){
              //                            		if(_newData[i][_innCodFieldName].length == innCodeLen){
              //                            			widgetAction.executeWidgetAction(widgetCode, "expandTreeByDepth", expandLevel, true, "");
              //                            		}else{
              //                            			break;
              //                            		}
              //                            	}
            }
          }
        }
      }

      if (isCover === true) {
        var dsObj = params.datasource
        if (dsObj.v3Datasource) {
          dsObj = dsObj.v3Datasource
        }
        isDefaultFirstRecord(element, widgetCode, dsObj)
      }
    }
    //element.showLoading(false);
    element.markLoaded()

    element._getSelectionUpdatedStated(true)
  }
}

/*按照InnerCode排序的树数据*/
var _getSeqTreeData = function (data, innCodFieldName) {
  if (data && data.length > 1) {
    return data.sort(function compare(obj1, obj2) {
      return obj1[innCodFieldName] * 1 - obj2[innCodFieldName] * 1
    })
  } else return data
}

/**
 *获取树数据中包含的最大层级
 */
var _getTreeDataBiggestLevel = function (data, innerCodeName) {
  var _biggestInnerCode = ''
  if (data && innerCodeName) {
    for (var i = 0, len = data.length; i < len; i++) {
      var _tmpObj = data[i]
      var _tmpInnerCode = _tmpObj[innerCodeName]
      if (_tmpInnerCode && _biggestInnerCode.length < _tmpInnerCode.length) {
        _biggestInnerCode = _tmpInnerCode
      }
    }
  }
  return _biggestInnerCode.length / 5
}

/**
 * 更新行动作
 * @param {String} widgetCode 控件编号
 */
export function genUpdateAction(widgetCode) {
  return function (tempParams) {
    var params = transformPlatformDatasource(tempParams)
    var element = widgetContext.get(widgetCode, 'widgetObj')
    element._getSelectionUpdatedStated(false)
    var result = params.resultSet
    var _leafFieldName = widgetContext.get(widgetCode, 'LeafNode')
    var records
    if (result instanceof Array) {
      //兼容二次开发控件的数组数据
      records = result
    } else {
      records = result.toArray()
    }
    var values = getChangedDatas(records, _leafFieldName)
    // 需要获取对应node图标字段信息，否则更新图标时无法获取到对应图标节点信息
    _getDynTreeNodeIconData(widgetCode, records, values)
    values = treeDataTranslator.translate(widgetCode, values, false)
    element.updateDatas(values)
    element._getSelectionUpdatedStated(true)
  }
}

/**
 * 获取节点图标信息，用于节点展开时处理图标变化
 */
var _getDynTreeNodeIconData = function (widgetId, records, changedDatas) {
  var widget = widgetContext.get(widgetId, 'widgetObj')
  var properties = {}
  var context = new ExpressionContext2()
  var treeIconsInfo = expEngine.execute({
    expression: 'GenerateTreeIcon("' + widgetId + '")',
    context: context
  })
  var colIconField, expIconField
  if (
    treeIconsInfo &&
    treeIconsInfo.conditionType == '1' &&
    treeIconsInfo.entity
  ) {
    var iconFieldEntity = treeIconsInfo.entity
    colIconField = iconFieldEntity.iconColColumn
    expIconField = iconFieldEntity.iconExpColumn
  }

  if (colIconField && expIconField) {
    var _changedDatas = []
    for (var i = 0, len = changedDatas.length; i < len; i++) {
      var changedData = changedDatas[i]
      var tmpId = changedData.id

      var tmpData
      for (var j = 0, lenJ = records.length; j < lenJ; j++) {
        var tmpRecord = records[j]
        if (tmpRecord) {
          tmpData = tmpRecord.getOriginalData()
          if (tmpData.id + '' === tmpId) {
            break
          }
        }
      }

      changedData[colIconField] = tmpData[colIconField]
      changedData[expIconField] = tmpData[expIconField]

      _changedDatas.push(changedData)
    }
  }

  return _changedDatas
}

/**
 * 新增行动作
 * @param {String} widgetCode 控件编号
 */
export function genInsertAction(widgetCode) {
  return function (tempParams) {
    var params = transformPlatformDatasource(tempParams)
    var element = widgetContext.get(widgetCode, 'widgetObj')

    var isEmptyTree = element._treeData && element._treeData.isEmpty()

    element._getSelectionUpdatedStated(false)
    var result = params.resultSet
    var datas
    if (result instanceof Array) {
      //兼容二次开发控件的数组数据
      datas = result
    } else {
      datas = result.toArray()
    }
    datas = treeDataTranslator.translate(widgetCode, datas, false)
    //datas数据是无序的，addDatas要求有顺序，否则渲染层级错误.
    //element.addDatas(datas);
    element.linkNodes(datas)

    // 当树节点为空时，需处理展开的节点层级
    if (isEmptyTree) {
      var _expandLevel = widgetAction.executeWidgetAction(
        widgetCode,
        'getExpandLevel'
      )
      if (_expandLevel && _expandLevel !== '') {
        var expandLevel = formulaEngine.execute({
          expression: _expandLevel,
          context: new ExpressionContext()
        })

        // 判断当前的级别和data的级别是否需要关闭节点
        var _biggestLevelInData = _getTreeDataBiggestLevel(
          datas,
          element.InnerCodeColumn
        )
        if (expandLevel) {
          var numReg = new RegExp('^[0-9]*$')
          if (numReg.test(expandLevel) && _biggestLevelInData > expandLevel) {
            var _pidFieldName = element.getParentField()
            var _clickedNodeID = null
            var tree = treeViewUtil.getTree(widgetCode)
            var roots = tree.getRoots()
            if (roots && roots.size() > 0)
              _clickedNodeID = roots.toArray()[0].get(_pidFieldName)

            widgetAction.executeWidgetAction(
              widgetCode,
              'expandTreeByDepth',
              expandLevel,
              true,
              _clickedNodeID
            )
          }
        }
      }
    }
    var widget = element._widget
    if (widget.isRowNumberField(widget.fields[0]) && widget.resetRowNumberField)
      widget.resetRowNumberField.apply(widget)
    element._getSelectionUpdatedStated(true)
  }
}

export function genDeleteAction(widgetCode) {
  return function (tempParams) {
    var params = transformPlatformDatasource(tempParams)
    var element = widgetContext.get(widgetCode, 'widgetObj')
    element._getSelectionUpdatedStated(false)
    var result = params.resultSet
    var datas
    if (result instanceof Array) {
      //兼容二次开发控件的数组数据
      datas = result
    } else {
      datas = result.toArray()
    }
    datas = treeDataTranslator.translate(widgetCode, datas, false, 'del')
    if (params.isClear === true && typeof element.clearAll == 'function') {
      element.clearAll()
    } else {
      element.removeDatas(datas)
    }
    var dsObj = params.datasource
    if (dsObj.v3Datasource) {
      dsObj = dsObj.v3Datasource
    }
    isDefaultFirstRecord(element, widgetCode, dsObj)
    element._getSelectionUpdatedStated(true)
  }
}

export function genFetchAction(widgetCode) {
  return function (tempParams) {
    var params = transformPlatformDatasource(tempParams)
    var element = widgetContext.get(widgetCode, 'widgetObj')
    element._getSelectionUpdatedStated(false)
    var datas = params.datasource.getAllRecords().toArray()
    element.removeDatas(datas)
    element.showLoading(true)
    element._getSelectionUpdatedStated(true)
  }
}

export function genFetchedAction(widgetCode) {
  return function (tempParams) {
    var params = transformPlatformDatasource(tempParams)
    var element = widgetContext.get(widgetCode, 'widgetObj')
    element._getSelectionUpdatedStated(false)
    var dsObj = params.datasource
    if (dsObj.v3Datasource) {
      dsObj = dsObj.v3Datasource
    }
    var datas = params.datasource.getAllRecords().toArray()
    element.removeDatas(datas)
    element.showLoading(false)
    element._getSelectionUpdatedStated(true)
  }
}

/**
 * 默认选中第一行
 * @param {Object} element
 * @param {Object} widgetId
 */
var isDefaultFirstRecord = function (element, widgetId, datasource) {
  //增加了是否默认选中第一条的配置
  var isDefault = element['DefaultSelect']
  if (isDefault === true || isDefault === 'True') {
    var children = element.getChildrenNode()
    if (children && children.length > 0) {
      var firstNode = children[0]
      var rootRecord = datasource.getRecordById(firstNode['id'])
      var isMult = datasource.isMultipleSelect()

      var rootRecordSelected = false

      if (isMult) {
        //单选情况下，设置当前行会默认选中，多选需手动调用
        var selected = datasource.getSelectedRecords()
        if (!selected.isEmpty()) {
          var notCasTriEvent =
            (element.CascadeTriggerEvent + '').toLowerCase() === 'false'
          if (notCasTriEvent) {
            //判断是否为取消级联触发事件
            var selectedRecrods = selected.toArray()
            // 当前只有一条数据选中并且是根节点
            if (selectedRecrods.length > 0) {
              var selectedRecord = selectedRecrods[0].toMap()
              var _rootRecord = rootRecord.toMap()
              if (selectedRecord.id === _rootRecord.id)
                rootRecordSelected = true
            }
          }

          if (!rootRecordSelected)
            datasource.selectRecords({
              records: selected.toArray(),
              isSelect: false
            })
        }
        if (!rootRecordSelected)
          datasource.selectRecords({
            records: [rootRecord],
            isSelect: true
          })
      }

      //如果DB中没有当前行，则把根结点做为当前行
      datasource.setCurrentRecord({
        record: rootRecord
      })
    }
  }
}
