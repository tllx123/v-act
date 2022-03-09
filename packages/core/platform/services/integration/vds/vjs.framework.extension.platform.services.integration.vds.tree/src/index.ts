/**
 * 树相关的工具方法
 * @desc 提供与树相关的一系列接口，使用前请先import：vds.import("vds.tree.*")
 * @namespace vds/tree
 * @module tree
 * @catalog 工具方法/树
 * @example
 * vds.import("vds.tree.*");
 * vds.tree.lookup("treeCode1",vds.tree.createTreeStruct("treeCode1","PID","OrderNo","InnerCode","IsLeafCode"));
 */
var vds = window.vds
if (!vds) {
  vds = {}
  window.vds = vds
}
var tree = vds.tree
if (!tree) {
  tree = {}
  vds.tree = tree
}
exports = tree

var sandbox, treeManager, Tree, TreeStruct

export function initModule(sBox) {
  sandbox = sBox
  treeManager = sBox.getService(
    'vjs.framework.extension.platform.services.model.manager.tree.TreeManager'
  )
  Tree = require('vjs/framework/extension/platform/services/integration/vds/tree/Tree')
  TreeStruct = require('vjs/framework/extension/platform/services/integration/vds/tree/TreeStruct')
}
/**
 * 二开规范的树型结构适配成控件所需的结构
 * @ignore
 * */
export function _toTreeStruct(treeCode, treeStruct) {
  if (treeStruct instanceof TreeStruct) {
    //新规范
    return treeStruct['treeStruct']
  }
  var newTreeStruct = {
    //兼容开源的TreeNodeMoveUpDownEditor
    type: '1',
    tableName: treeCode,
    pidField: treeStruct.pId || treeStruct.pidField,
    orderField: treeStruct.orderNo || treeStruct.orderField,
    isLeafField: treeStruct.isLeaf || treeStruct.isLeafField,
    treeCodeField: treeStruct.innerCode || treeStruct.treeCodeField
  }
  return newTreeStruct
}
//	/**
//	 * 获取树数据源实例
//	 * @param {String} treeCode 实体编码
//	 * @param {Object} treeStruct 树结构
//	 * {
//	 *   "pId" : {String} 父级节点字段编码
//	 *   "isLeaf": {String}叶子节点字段编码
//	 *   "innerCode" : {String} 层级码字段编码
//	 *   "orderNo":{String} 排序号字段编码
//	 *   "filterCode":{String} 过滤字段编码
//	 * },
//	 * @returns {Tree} 树数据源实例
//	 * */
/**
 * 获取树数据源实例
 * @param {String} treeCode 实体编码
 * @param {TreeStruct} treeStruct 树结构对象
 * @returns {Tree} 树数据源实例
 * */
export function lookup(treeCode, treeStruct) {
  if (!treeCode || !treeStruct) {
    return null
  }
  treeStruct = exports._toTreeStruct(treeCode, treeStruct)
  var tree = treeManager.lookup({
    datasourceName: treeCode,
    treeStruct: treeStruct
  })
  if (!tree) {
    return null
  }
  return new Tree(tree, treeStruct)
}
/**
 * 创建树结构对象
 * @param {String} treeCode 树编码
 * @param {String} pId 父节点编码
 * @param {String} orderNo 排序号编码
 * @param {String} innerCode 层级码编码
 * @param {String} isLeafCode 叶子节点编码
 * @param {String} filterCode 过滤字段编码(可选)
 * */
export function createTreeStruct(
  treeCode,
  pId,
  orderNo,
  innerCode,
  isLeafCode,
  filterCode
) {
  if (!treeCode || !pId || !orderNo || !innerCode || !isLeafCode) {
    throw vds.exception.newSystemException(
      '树结构信息不全，无法创建树结构，请检查！'
    )
  }
  return new TreeStruct(
    treeCode,
    pId,
    orderNo,
    innerCode,
    isLeafCode,
    filterCode
  )
}
/**
 * 根据编码获取关联的树数据源对象
 * @param {String} treeCode 树数据源编码，不传时获取所有的树实例
 * @returns {Array<Tree>}
 * @example
 * var trees = vds.tree.getAll("treeCode1");
 * console.log(trees.length);
 * */
export function getAll(treeCode) {
  var trees = treeCode
    ? treeManager.lookupByName({
        datasourceName: treeCode
      })
    : treeManager.getAll()
  if (trees) {
    for (var i = 0, len = trees.length; i < len; i++) {
      var tree = trees[i]
      var treeStruct = tree.getTreeStruct()
      trees[i] = new Tree(
        tree,
        exports._toTreeStruct(tree._getDatasourceName(), treeStruct)
      )
    }
    return trees
  } else {
    return []
  }
}
module.exports = exports
