import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { DatasourceManager as manager } from '@v-act/vjs.framework.extension.platform.services.model.manager.datasource'
import { ComponentParam as componentParam } from '@v-act/vjs.framework.extension.platform.data.storage.runtime.param'
import { WindowParam as windowParam } from '@v-act/vjs.framework.extension.platform.services.param.manager'
import { ErrorUtil as errorUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.error'
import { DialogUtil as dialogUtil } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.dialog'
import { ArrayUtil as util } from '@v-act/vjs.framework.extension.util'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
import { ExpressionEngine as engine } from '@v-act/vjs.framework.extension.platform.services.engine.expression'
let undefined
let formulaUtil
let objectUtil
let sandbox
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined
let undefined

exports.initModule = function (sb) {
  sandbox = sb
  objectUtil = sb.util.object
}

let _respCallBack = function (result) {
  if (result.success == false) {
    errorUtil.handleError('保存失败！' + result.msg)
  }
}

/**
 * 给数据源插入记录的对象
 * @param {String} datasourceName 数据源名称
 * @param {Object} treeStruct 树形结构
 */
function TreeNodeEditor(datasourceName, treeStruct) {
  if (
    !util.isArray(treeStruct) ||
    (util.isArray(treeStruct) && treeStruct.length != 1)
  ) {
    throw new Error('参数传入错误，treeStruct接收长度为1的数据')
  }
  let treeManager = sandbox.getService(
    'vjs.framework.extension.platform.services.model.manager.tree.TreeManager'
  )
  this.tree = treeManager.lookup({
    datasourceName: datasourceName,
    treeStruct: treeStruct[0]
  })
  this.datasourceName = datasourceName
  this.isSupportMultiRoots = true
}

/**
 * 插入根节点的方法
 * @param defaultValue 插入记录的默认值，结构为json格式：
 * 如：[{"fieldName": tablename.fieldName1, "value":value2}]
 */
TreeNodeEditor.prototype.insertRootNode = function (defaultValue) {
  if (!this.isSupportMultiRoots) {
    let roots = this.tree.getRoots()
    if (roots && roots.length > 0) {
      dialogUtil.propmtDialog('暂不支持多个根节点的树形结构', null, false)
      return false
    }
  }
  let node = this.tree.createNode()
  this.fillField(node, defaultValue)
  let params = {
    nodes: [node]
  }
  this.tree.insertRoots(params)
  return true
}

/**
 * 填充树节点字段值
 */
TreeNodeEditor.prototype.fillField = function (node, values) {
  if (values && values.length > 0) {
    sandbox.util.collections.each(values, function (value) {
      node.set(value.fieldName, value.value)
    })
  }
}

/**
 * 插入孩子节点的方法
 * @param defaultValue 插入记录的默认值，结构为json格式：
 * 如：[{"fieldName": value}]
 *
 */
TreeNodeEditor.prototype.insertSunNode = function (defaultValue) {
  let roots = this.tree.getRoots()
  if (roots.isEmpty()) {
    return this.insertRootNode(defaultValue)
  }
  let record = this.tree.getCurrentRecord()
  if (!record) {
    dialogUtil.propmtDialog('请选择你要操作的节点!', null, false)
    return false
  }
  let primaryVal = record.getSysId()
  let parent = this.tree.getNodeById(primaryVal)
  let node = this.tree.createNode()
  this.fillField(node, defaultValue)
  parent.addChildren({
    children: [node]
  })
}

/**
 * 插入兄弟节点的方法
 * @param defaultValue 插入记录的默认值，结构为json格式：
 * 如：[{"fieldName": tablename.fieldName1, "value":value2}]
 * @param position 插入节点的位置，相对于选中的节点
 */
TreeNodeEditor.prototype.insertBrotherNode = function (defaultValue, position) {
  let roots = this.tree.getRoots()
  if (roots.isEmpty()) {
    return this.insertRootNode(defaultValue)
  }
  let currNode = this._getCurrentNode()
  if (!currNode) return false
  if (!this.isSupportMultiRoots) {
    // 不支持多个根节点
    let isSelectRoot = false
    let iterator = roots.iterator()
    while (iterator.hasNext()) {
      let root = iterator.next()
      if (root.getSysId() == currNode.getSysId()) {
        isSelectRoot = true
        break
      }
    }
    if (isSelectRoot) {
      dialogUtil.propmtDialog('不支持多个根节点的树形结构!', null, false)
      return false
    }
  }
  let toNode
  let move_position = currNode.Enum.ABOVE
  switch (position) {
    case 'First':
      //增加到兄弟节点的老大
      //var nodes = this.getChildren(selectedNode.get(this.parentIdRefField));
      //toNode = nodes[0];
      break
    case 'Last':
      //增加到兄弟节点的老小, 系统算法自动添加到最后
      break
    case 'Before':
      //增加到兄弟节点的最小哥哥
      break
    case 'After':
      //增加到兄弟节点的最大的弟弟
      move_position = currNode.Enum.BELLOW
      break
    default:
      //rendererUtil.errorDialog("传入参数错误，请检查！", false);
      errorUtil.handleError('传入参数错误，请检查！')
      break
  }
  let node = this.tree.createNode()
  this.fillField(node, defaultValue)
  currNode.addBrothers({
    brothers: [node],
    operation: move_position
  })
}

/**
 * 上移节点
 *
 */
TreeNodeEditor.prototype.moveupTreeNode = function () {
  let currNode = this._getCurrentNode()
  if (currNode) {
    let result = currNode.move({
      operation: currNode.Enum.ABOVE
    })
    if (!result) {
      dialogUtil.propmtDialog('已经是最上节点不能再向上移动!', null, false)
      return false
    }
  }
}

/**
 * 下移节点
 *
 */
TreeNodeEditor.prototype.movedownTreeNode = function () {
  let currNode = this._getCurrentNode()
  if (currNode) {
    let result = currNode.move({
      operation: currNode.Enum.BELLOW
    })
    if (!result) {
      dialogUtil.propmtDialog('已经是最下节点不能再向下移动!', null, false)
      return false
    }
  }
}

TreeNodeEditor.prototype._getCurrentNode = function () {
  let currRecord = this.tree.getCurrentRecord()
  if (!currRecord) {
    dialogUtil.propmtDialog('请选择你要操作的节点!', null, false)
    return null
  }
  let primaryVal = currRecord.getSysId()
  return this.tree.getNodeById(primaryVal)
}

/**
 * 升级节点
 *
 */
TreeNodeEditor.prototype.upgradeTreeNode = function () {
  let currNode = this._getCurrentNode()
  if (currNode) {
    if (currNode.isRoot()) {
      dialogUtil.propmtDialog('根节点不允许升级!', null, false)
      return false
    }
    currNode.move({
      operation: currNode.Enum.UPGRADE
    })
  }
}

//降级节点
TreeNodeEditor.prototype.downgradeTreeNode = function () {
  let currNode = this._getCurrentNode()
  if (currNode) {
    let brother = currNode.getOlderBrothers()
    if (brother.isEmpty()) {
      dialogUtil.propmtDialog('上面无同级节点，不能降级!', null, false)
      return false
    }
    currNode.move({
      operation: currNode.Enum.DOWNGRADE
    })
  }
}

//移除树节点 add by xiedh 2014-12-26
TreeNodeEditor.prototype.removeTreeNode = function () {
  let resultSet = this.tree.getSelectedRecords()
  let removeIds = []
  if (resultSet.isEmpty()) {
    //多选模式下不能够获取当前行作为删除的记录
    if (!this.tree.isMultipleSelect()) {
      let record = this.tree.getCurrentRecord()
      if (record) removeIds.push(record.getSysId())
    }
  } else {
    let iterator = resultSet.iterator()
    while (iterator.hasNext()) {
      let node = iterator.next()
      removeIds.push(node.getSysId())
    }
  }
  this.tree.removeNodeByIds({
    ids: removeIds
  })
}

/**
 * 通过映射关系，获取新增记录的默认值
 * @param mappings 映射信息
 * @param editor 当前树对象
 * @return 结构为json格式：
 * 如：[{"fieldName": tablename.fieldName1, "value":value2}]
 */
let _getDefaultValue = function (mappings, editor, routeContext) {
  let returnValue = []
  let filterColumns = ['InnerCode', 'NodeLevel']
  //TODO: 把所有的过滤列都通过获取的方式
  filterColumns.push(editor.parentIdRefField)
  filterColumns.push(editor.orderNoRefField)
  filterColumns.push(editor.isLeafRefField)

  if (!mappings || mappings.length <= 0) {
    return returnValue
  } else {
    for (let i = 0; i < mappings.length; i++) {
      let fieldValue = {}
      let destColumn = getFieldName(mappings[i]['destColumn'])
      let isFilter = false
      for (let column in filterColumns) {
        if (destColumn == filterColumns[column]) {
          isFilter = true
          break
        }
      }
      if (isFilter) continue
      fieldValue['fieldName'] = destColumn
      let srcField = mappings[i]['fieldValue']
      let fieldType = mappings[i]['type']
      if (fieldType === '1') {
        let dataSourceName = srcField.substring(0, srcField.indexOf('.'))
        let datasource = manager.lookup({
          datasourceName: dataSourceName
        })
        let selected = datasource.getCurrentRecord()
        if (selected) {
          srcField = getFieldName(srcField)
          fieldValue['value'] = selected.get(srcField)
        }
      } else if (fieldType === '2') {
        //如果是系统变量
        fieldValue['value'] = componentParam.getVariant({
          code: srcField
        })
      } else if (fieldType === '3') {
        //如果是组件变量
        fieldValue['value'] = windowParam.getInput({
          code: srcField
        })
      } else if (fieldType === '4' || fieldType === 'expression') {
        //如果是表达式
        let context = new ExpressionContext()
        context.setRouteContext(routeContext)
        fieldValue['value'] = engine.execute({
          expression: srcField,
          context: context
        })
      }
      returnValue.push(fieldValue)
    }
  }
  return returnValue
}

let getFieldName = function (fieldName) {
  let retvalue = fieldName
  if (fieldName.indexOf('.') != -1) {
    let fieldNames = fieldName.split('.')
    retvalue = fieldName.split('.')[fieldNames.length - 1]
  }
  return retvalue
}

let main = function (ruleContext) {
  let ruleCfgValue = ruleContext.getRuleCfg()
  let inParams = ruleCfgValue['inParams']
  let inParamsObj = jsonUtil.json2obj(inParams)
  let dataSourceName = inParamsObj['dataSourceName']
  let treeStruct = inParamsObj['treeStruct']
  let operation = inParamsObj['controlType']
  let mappings = inParamsObj['mapping']
  let editor = new TreeNodeEditor(dataSourceName, treeStruct)
  let defaultValue = _getDefaultValue(
    mappings,
    editor,
    ruleContext.getRouteContext()
  )
  switch (operation) {
    case '1':
      //增加到兄弟节点的老大
      editor.insertBrotherNode(defaultValue, 'First')
      break
    case '2':
      //增加到兄弟节点的老小
      editor.insertBrotherNode(defaultValue, 'Last')
      break
    case '3':
      //增加到兄弟节点的最小哥哥
      editor.insertBrotherNode(defaultValue, 'Before')
      break
    case '4':
      //增加到兄弟节点的最大的弟弟
      editor.insertBrotherNode(defaultValue, 'After')
      break
    case '5':
      //增加孩子节点，默认最小的孩子
      editor.insertSunNode(defaultValue)
      break
    case '6':
      editor.moveupTreeNode()
      break
    case '7':
      editor.movedownTreeNode()
      break
    case '8':
      editor.upgradeTreeNode()
      break
    case '9':
      editor.downgradeTreeNode()
      break
    case '10':
      //插入根节点
      editor.insertRootNode(defaultValue)
      break
    case '11':
      //删除树节点 add by xiedh 2014-12-26
      editor.removeTreeNode()
      break
    default:
      break
  }
}

export { main, _getDefaultValue, TreeNodeEditor }
