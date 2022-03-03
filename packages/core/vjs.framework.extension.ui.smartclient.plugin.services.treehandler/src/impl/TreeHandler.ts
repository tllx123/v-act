import { DataListHandler as dataListHandler } from '@v-act/vjs.framework.extension.ui.plugin.JGComponent.data'
import { WidgetContext as widgetContext } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.context'
import { ScopeManager as ScopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
import { TreeManager as treeManager } from '@v-act/vjs.framework.extension.platform.services.model.manager.tree'
import { TreeViewUtil as treeViewUtil } from '@v-act/vjs.framework.extension.platform.services.domain.tree'
import { TreeDataTranslator as treeDataTranslator } from '@v-act/vjs.framework.extension.platform.services.domain.tree'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { TreeViewUtil as treeViewUIHelp } from '@v-act/vjs.framework.extension.platform.services.viewmodel.datamodel.tree'
import { TreeDataModelFactory as treeViewModelFactory } from '@v-act/vjs.framework.extension.platform.services.viewmodel.datamodel.tree'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionEngine as formulaEngine } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionEngine as expEngine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionContext as ExpressionContext2 } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
let innerSandBox

exports.initModule = function (sb) {
  let functionExtend = sb.getService(
    'vjs.framework.extension.util.extend.FunctionExtend'
  )
  functionExtend.extend(exports, dataListHandler)
}

const bindEvent = function (element) {
  dataListHandler.bindEvent(element)

  /**
   *节点展开事件
   */
  element.on(
    'expandRecord',
    this.closure(function (record) {
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
    this.closure(function (nodes, folder, index, sourceWidget) {
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

const genLoadAction = function (widgetCode) {
  return function (params) {
    // 如果为覆盖加载时，则先清空树
    let element = widgetContext.get(widgetCode, 'widgetObj')

    element._getSelectionUpdatedStated(false)

    exports.addDynamicFields(widgetCode, params)
    let isCover = !params.isAppend
    let tree = treeViewUtil.getTree(widgetCode)
    if (isCover) {
      //tree.resetLoadInfo();
      element.reset()
      element.removeAll()
    }
    let result = params.resultSet
    if (result.isEmpty()) {
      let rs = tree.getAllRecords()
      if (rs.isEmpty()) {
        element.removeAll()
      }
    } else {
      let datas = result.getOriginalDatas()
      treeDataTranslator.translate(widgetCode, datas, isCover)
      element.linkNodes(datas)
      // 处理默认展开节点
      let _expandLevel = widgetAction.executeWidgetAction(
        widgetCode,
        'getExpandLevel'
      )
      if (_expandLevel && _expandLevel !== '') {
        let expandLevel = formulaEngine.execute({
          expression: _expandLevel,
          context: new ExpressionContext()
        })

        // 判断当前的级别和data的级别是否需要关闭节点
        let _innCodFieldName = element.InnerCodeColumn
        let _biggestLevelInData = _getTreeDataBiggestLevel(
          datas,
          _innCodFieldName
        )
        if (expandLevel) {
          let numReg = new RegExp('^[0-9]*$')
          if (numReg.test(expandLevel) && _biggestLevelInData > expandLevel) {
            let _pidFieldName = element.getParentField()
            let _clickedNodeID = null
            let _newData = _getSeqTreeData(datas, _innCodFieldName)
            if (_newData && _newData.length > 0)
              _clickedNodeID = _newData[0][_pidFieldName]

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

      if (isCover === true) {
        isDefaultFirstRecord(element, widgetCode, params.datasource)
      }
    }
    //element.showLoading(false);
    element.markLoaded()

    element._getSelectionUpdatedStated(true)
  }
}

/*按照InnerCode排序的树数据*/
let _getSeqTreeData = function (data, innCodFieldName) {
  if (data && data.length > 1) {
    return data.sort(function compare(obj1, obj2) {
      return obj1[innCodFieldName] * 1 - obj2[innCodFieldName] * 1
    })
  } else return data
}

/**
 *获取树数据中包含的最大层级
 */
let _getTreeDataBiggestLevel = function (data, innerCodeName) {
  let _biggestInnerCode = ''
  if (data && innerCodeName) {
    for (let i = 0, len = data.length; i < len; i++) {
      let _tmpObj = data[i]
      let _tmpInnerCode = _tmpObj[innerCodeName]
      if (_tmpInnerCode && _biggestInnerCode.length < _tmpInnerCode.length) {
        _biggestInnerCode = _tmpInnerCode
      }
    }
  }
  return _biggestInnerCode.length / 5
}

const genUpdateAction = function (widgetCode) {
  return function (params) {
    let element = widgetContext.get(widgetCode, 'widgetObj')
    element._getSelectionUpdatedStated(false)
    let result = params.resultSet
    let _leafFieldName = widgetContext.get(widgetCode, 'LeafNode')
    let records = result.toArray()
    let values = exports.getChangedDatas(records, _leafFieldName)
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
let _getDynTreeNodeIconData = function (widgetId, records, changedDatas) {
  let widget = widgetContext.get(widgetId, 'widgetObj')
  let properties = {}
  let context = new ExpressionContext2()
  let treeIconsInfo = expEngine.execute({
    expression: 'GenerateTreeIcon("' + widgetId + '")',
    context: context
  })
  let colIconField, expIconField
  if (
    treeIconsInfo &&
    treeIconsInfo.conditionType == '1' &&
    treeIconsInfo.entity
  ) {
    let iconFieldEntity = treeIconsInfo.entity
    colIconField = iconFieldEntity.iconColColumn
    expIconField = iconFieldEntity.iconExpColumn
  }

  if (colIconField && expIconField) {
    let _changedDatas = []
    for (let i = 0, len = changedDatas.length; i < len; i++) {
      let changedData = changedDatas[i]
      let tmpId = changedData.id

      let tmpData
      for (let j = 0, lenJ = records.length; j < lenJ; j++) {
        let tmpRecord = records[j]
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

const genInsertAction = function (widgetCode) {
  return function (params) {
    let element = widgetContext.get(widgetCode, 'widgetObj')

    let isEmptyTree = element._treeData && element._treeData.isEmpty()

    element._getSelectionUpdatedStated(false)
    let result = params.resultSet
    let datas = result.toArray()
    datas = treeDataTranslator.translate(widgetCode, datas, false)
    element.addDatas(datas)

    // 当树节点为空时，需处理展开的节点层级
    if (isEmptyTree) {
      let _expandLevel = widgetAction.executeWidgetAction(
        widgetCode,
        'getExpandLevel'
      )
      if (_expandLevel && _expandLevel !== '') {
        let expandLevel = formulaEngine.execute({
          expression: _expandLevel,
          context: new ExpressionContext()
        })

        // 判断当前的级别和data的级别是否需要关闭节点
        let _biggestLevelInData = _getTreeDataBiggestLevel(
          datas,
          element.InnerCodeColumn
        )
        if (expandLevel) {
          let numReg = new RegExp('^[0-9]*$')
          if (numReg.test(expandLevel) && _biggestLevelInData > expandLevel) {
            let _pidFieldName = element.getParentField()
            let _clickedNodeID = null
            let tree = treeViewUtil.getTree(widgetCode)
            let roots = tree.getRoots()
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

    element._getSelectionUpdatedStated(true)
  }
}

const genDeleteAction = function (widgetCode) {
  return function (params) {
    let element = widgetContext.get(widgetCode, 'widgetObj')
    element._getSelectionUpdatedStated(false)
    let result = params.resultSet
    let datas = result.toArray()
    datas = treeDataTranslator.translate(widgetCode, datas, false, 'del')
    element.removeDatas(datas)
    isDefaultFirstRecord(element, widgetCode, params.datasource)
    element._getSelectionUpdatedStated(true)
  }
}

const genFetchAction = function (widgetCode) {
  return function (params) {
    let element = widgetContext.get(widgetCode, 'widgetObj')
    element._getSelectionUpdatedStated(false)
    let datas = params.datasource.getAllRecords().toArray()
    element.removeDatas(datas)
    element.showLoading(true)
    element._getSelectionUpdatedStated(true)
  }
}

const genFetchedAction = function (widgetCode) {
  return function (params) {
    let element = widgetContext.get(widgetCode, 'widgetObj')
    element._getSelectionUpdatedStated(false)
    let datas = params.datasource.getAllRecords().toArray()
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
let isDefaultFirstRecord = function (element, widgetId, datasource) {
  //增加了是否默认选中第一条的配置
  let isDefault = element['DefaultSelect']
  if (isDefault === true || isDefault === 'True') {
    let children = element.getChildrenNode()
    if (children && children.length > 0) {
      let firstNode = children[0]
      let rootRecord = datasource.getRecordById(firstNode['id'])
      let isMult = datasource.isMultipleSelect()

      let rootRecordSelected = false

      if (isMult) {
        //单选情况下，设置当前行会默认选中，多选需手动调用
        let selected = datasource.getSelectedRecords()
        if (!selected.isEmpty()) {
          let notCasTriEvent =
            (element.CascadeTriggerEvent + '').toLowerCase() === 'false'
          if (notCasTriEvent) {
            //判断是否为取消级联触发事件
            let selectedRecrods = selected.toArray()
            // 当前只有一条数据选中并且是根节点
            if (selectedRecrods.length > 0) {
              let selectedRecord = selectedRecrods[0].toMap()
              let _rootRecord = rootRecord.toMap()
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

export {
  bindEvent,
  genLoadAction,
  genUpdateAction,
  genInsertAction,
  genDeleteAction,
  genFetchAction,
  genFetchedAction
}
