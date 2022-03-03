import { ExpressionEngine as formulaUtil } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { ExpressionContext as ExpressionContext } from '@v-act/vjs.framework.extension.platform.engine.expression'
import { JsonUtil as jsonUtil } from '@v-act/vjs.framework.extension.util'
import { WindowVMMappingManager as windowVmManager } from '@v-act/vjs.framework.extension.platform.services.vmmapping.manager'
import { WidgetAction as widgetAction } from '@v-act/vjs.framework.extension.platform.services.view.widget.common.action'
import { TreeViewUtil as treeViewUtil } from '@v-act/vjs.framework.extension.platform.services.domain.tree'
import { DataAdapter as dataAdapter } from '@v-act/vjs.framework.extension.platform.services.viewmodel.dataadapter'
import { ScopeManager as scopeManager } from '@v-act/vjs.framework.extension.platform.interface.scope'
let undefined
let undefined
let undefined
exports.initModule = function (sb) {}

let callback = function (ruleContext) {
  let sId = scopeManager.getCurrentScopeId()
  return function () {
    scopeManager.openScope(sId)
    let ruleCfgValue = ruleContext.getRuleCfg()
    let ruleInstId = ruleCfgValue['ruleInstId']
    let inParams = ruleCfgValue['inParams']
    let inParamsObj = jsonUtil.json2obj(inParams)
    let operType = inParamsObj['operType']
    let widgetId = inParamsObj['widgetId']
    let dataSourceName = windowVmManager.getDatasourceNamesByWidgetCode({
      widgetCode: widgetId
    })
    switch (operType) {
      //折叠当前节点
      case 'fold':
        var tree = treeViewUtil.getTree(widgetId)
        var currRecord = tree.getCurrentRecord()
        if (currRecord) {
          collapseNode(widgetId, currRecord)
        }
        break
      //展开当前节点
      case 'unFold':
        var tree = treeViewUtil.getTree(widgetId)
        var currRecord = tree.getCurrentRecord()
        if (currRecord) {
          var node = tree.getNodeById(currRecord.getSysId())
          expandNode(widgetId, node)
        }
        break
      //显示到第几层
      case 'specUnFold':
        var depth = inParamsObj['unFoldCount']
        if (typeof depth != 'number') {
          var context = new ExpressionContext()
          context.setRouteContext(ruleContext.getRouteContext())
          depth = formulaUtil.execute({
            expression: depth,
            context: context
          })
        }
        expandTree(widgetId, depth)
        break
      default:
        throw new Error('不存在[' + type + ']参数类型，请检查！')
        break
    }
    //TODO
    ruleContext.setRuleStatus(true)
    ruleContext.fireRuleCallback()
    ruleContext.fireRouteCallback()
    scopeManager.closeScope()
  }
}

let main = function (ruleContext) {
  let cb = callback(ruleContext)
  //TODO
  setTimeout(cb, 20)
  //终止规则链执行
  ruleContext.markRouteExecuteUnAuto()
}

/**
 * 折叠当前记录
 * @param {Object} widgetId 控件ID
 * @param {Object} currRecord 折叠的记录行
 */
let collapseNode = function (widgetId, currRecord) {
  if (currRecord) {
    widgetAction.executeWidgetAction(
      widgetId,
      'collapseNode',
      currRecord.getSysId()
    )
  }
}

/**
 * 展开当前记录
 * @param {Object} currRecord 展开的记录行
 */
let expandNode = function (widgetId, node) {
  let unloadNodes = _get_UnLoadSubTreeNodes_In_Node(widgetId, node)
  if (unloadNodes && unloadNodes.length > 0) {
    _get_subTreeNodes_FromDB(widgetId, unloadNodes, true, false)
  }
  widgetAction.executeWidgetAction(widgetId, 'expandNode', node.getSysId())
}

/**
 * 展开树的层级
 */
let expandTree = function (widgetId, depth) {
  let loadDepth = 0
  let tree = treeViewUtil.getTree(widgetId)
  let accessor = tree.getDataAccessor()
  if (accessor) {
    loadDepth = accessor.command.config.depth
  }
  if (!loadDepth) {
    //如果上一次加载为全部加载，则直接嗲用UI的全部展开接口
    if (depth == 0) {
      widgetAction.executeWidgetAction(widgetId, 'expandAll')
    } else {
      widgetAction.executeWidgetAction(widgetId, 'expandTreeByDepth', depth)
    }
  } else {
    if (loadDepth >= depth) {
      widgetAction.executeWidgetAction(widgetId, 'expandTreeByDepth', depth)
    } else {
      let unLoadRecordsMap = getUnLoadNodesMap(widgetId, depth)
      if (unLoadRecordsMap) {
        let unLoadRecords = []
        for (let key in unLoadRecordsMap) {
          let srcRecords = unLoadRecordsMap[key]
          if (srcRecords) {
            unLoadRecords = unLoadRecords.concat(srcRecords)
          }
        }
        // 获取数据， 但不通知UI更新（不会出现根节点）, 主要是UIhandler不知道要显示的层级， 这里又不想把加载出来的数据再清空
        let datas = _get_subTreeNodes_FromDB(
          widgetId,
          unLoadRecords,
          true,
          true
        )
      }
      widgetAction.executeWidgetAction(widgetId, 'expandTreeByDepth', depth)
    }
  }
}

/**
 * 从数据库中加载参数节点中的所有子树节点
 * @param {Object} widgetId
 * @param {Object} nodes 需要加载的节点集合
 * @param {Object} isCallObserver 是否需要通知handler更新UI
 * @param {Object} isRefleshConditon 是否更新加载的条件
 */
let _get_subTreeNodes_FromDB = function (
  widgetId,
  nodes,
  isCallObserver,
  isRefleshConditon
) {
  let tree = treeViewUtil.getTree(widgetId)
  let accessor = tree.getDataAccessor()
  if (!accessor) return
  accessor = treeViewUtil.genLoadSubTreeAccerror({
    tree: tree,
    nodes: nodes
  })
  let queryParam = {
    dataAccessObjects: [accessor],
    isAsync: false
  }
  dataAdapter.queryData({
    config: queryParam,
    isAppend: true,
    refreshCondition: false
  })
}

/**
 * 获取某个节点的子树中， 没有加载过的节点
 */
let _get_UnLoadSubTreeNodes_In_Node = function (widgetId, node) {
  if (!node) return
  let unLoadNodes = []
  //var treeViewModel = treeViewUIHelp.getTreeViewModel(widgetId);
  _getUnLoadNodes(node)
  return unLoadNodes
  /**
   * 递归获取某个节点的子树中， 没有加载过的节点
   */
  function _getUnLoadNodes(node) {
    if (node.isLeaf()) {
      return
    } else {
      let children = node.getChildren()
      if (children.isEmpty()) {
        unLoadNodes.push(node)
      } else {
        children.iterate(function (child, i) {
          _getUnLoadNodes(child)
        })
      }
    }
  }
}

/**
 * 获取需要加载节点的节点Map， 格式[{“需要加载的层级”:[加载的记录数]}]
 * @param {Object} widgetId
 * @param {Object} depth 加载的层级
 * @return unLoadRecordsMap 数据格式：[{需要加载的层级数：[records]}]
 */
let getUnLoadNodesMap = function (widgetId, depth) {
  let unLoadRecordsMap = null
  //遍历树形
  let tree = treeViewUtil.getTree(widgetId)
  let roots = tree.getRoots()
  let defDepth = 1
  roots.iterate(function (node, i) {
    _get_UnLoadNode_needLoad_depth(node, defDepth)
  })
  return unLoadRecordsMap

  /**
   * 获取前端没有加载的节点， 需要从数据库中加载多少级孩子的节点集合
   * @param {Object} node
   */
  function _get_UnLoadNode_needLoad_depth(node, currDepth) {
    if (node.isLeaf()) {
      return
    } else {
      if (currDepth == depth) {
        return
      }
      let children = node.getChildren()
      if (children.isEmpty()) {
        if (!unLoadRecordsMap) {
          unLoadRecordsMap = {}
        }
        let tierRecordMap = unLoadRecordsMap[depth - currDepth]
        if (tierRecordMap) {
          tierRecordMap.push(node)
        } else {
          unLoadRecordsMap[depth - currDepth] = [node]
        }
      } else {
        children.iterate(function (child, i) {
          _get_UnLoadNode_needLoad_depth(child, currDepth + 1)
        })
      }
    }
  }
}

export { main }
