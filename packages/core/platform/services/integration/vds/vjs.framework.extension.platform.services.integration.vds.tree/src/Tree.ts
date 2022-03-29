import { DataAccessObject } from '@v-act/vjs.framework.extension.platform.services.repository.access'
import { DataAdapter as dataAdapter } from '@v-act/vjs.framework.extension.platform.services.viewmodel.dataadapter'
import * as ds from '@v-act/vjs.framework.extension.platform.services.integration.vds.ds'
import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

import Node from './Node'
import NodeSet from './NodeSet'
import TreeStruct from './TreeStruct'

const vds = { ds, object }
/**
 * 数据源定义
 * @constructor
 * @alias tree
 * @catalog 数据源/树数据源定义
 */
class Tree {
  tree: any
  treeStruct: any

  constructor(tree: any, treeStruct: Record<string, any> | null) {
    this.tree = tree
    this.treeStruct = treeStruct
  }
  /**
   * 获取平台内部数据源实例
   * */
  _get() {
    return this.tree
  }
  //		/**
  //		 * 判断是否存在根节点
  //		 * */
  //		_hasRoot(){
  //			var tree = this._get();
  //			var root = tree.getRoots();
  //			if(root.isEmpty()){
  //				return false;
  //			}
  //			return true;
  //		}
  //		/**
  //		 * 记录位置枚举
  //		 * @enum {String}
  //		 * @example
  //		 * var tree = vds.tree.lookup("tree1");
  //		 * tree.insertNode([tree.createNode()],tree.Position.After);
  //		 */
  //		Position : {
  //			/**当前记录前*/
  //			"Before":"Before",
  //			/**当前记录后*/
  //			"After":"After"
  //		}
  //		/**
  //		 * 插入根节点
  //		 * @param {Array<Node>} nodes 添加的节点列表
  //		 * */
  //		_insertRoot(nodes){
  //			var params = {
  //		        "nodes": nodes
  //		    };
  //		    this.tree.insertRoots(params);
  //		}
  /**
   * 创建树节点
   * @returns {@link Node} 空节点对象
   * */
  createNode() {
    var node = this.tree.createNode()
    return new Node(node)
  }
  /**
   * 获取当前节点
   * @return {@link Node} 当前节点
   * var currentNode = vds.tree.lookup("tree1", treeStruct).getCurrentNode();
   * */
  getCurrentNode() {
    var record = this.tree.getCurrentRecord()
    if (null == record) {
      return null
    }
    var primaryVal = record.getSysId()
    var node = this.tree.getNodeById(primaryVal)
    return new Node(node)
  }
  /**
   * 获取根节点
   * @return {@link NodeSet} 节点集
   * @example
   * vds.tree.lookup("tree1", treeStruct).getRoots();
   * */
  getRoots() {
    var nodeset = this._get().getRoots()
    return new NodeSet(nodeset)
  }
  /**
   * 获取选中记录
   * @returns {@link ResultSet} 节点集
   * @example
   * var nodeset = vds.tree.lookup("tree1", treeStruct).getSelectedRecords();
   * */
  getSelectedRecords() {
    var resultset = this._get().getSelectedRecords()
    return vds.ds._genResultSet(resultset)
  }
  /**
   * 添加根节点
   * @param {Array<Node>} nodes 添加的节点列表
   * @param {Boolean=} [resetCurrent=true] 是否重置当前行
   * */
  addRootNodes(nodes: any[], resetCurrent: any) {
    if (!vds.object.isArray(nodes) || nodes.length < 1) {
      return
    }
    var newNodes = []
    for (var i = 0, len = nodes.length; i < len; i++) {
      newNodes.push(nodes[i]._get())
    }
    var datas: any[] = this.tree.insertRoots({
      nodes: newNodes,
      resetCurrent: resetCurrent
    })
    if (datas) {
      for (var i = 0, len = datas.length; i < len; i++) {
        datas[i] = new Node(datas[i])
      }
    }
    return datas
  }
  /**
   * 判断是否多选树
   * @returns {Boolean}
   * */
  isMultipleSelect() {
    return this._get().isMultipleSelect()
  }
  /**
   * 获取当前记录
   * @returns {@link Record} 当前记录
   * */
  getCurrentRecord() {
    return this._get().getCurrentRecord()
  }
  /**
   * 根据id删除节点
   * @param {Array<String>} removeIds 需要删除的节点id列表
   * */
  removeNodeByIds(removeIds: any[]) {
    if (!vds.object.isArray(removeIds) || removeIds.length < 1) {
      return
    }
    this._get().removeNodeByIds({
      ids: removeIds
    })
  }
  /**
   * 根据记录id获取节点对象
   * @param {String} id 记录id
   * @return {@link Node}
   * @example
   * var node = vds.tree.lookup("tree1", treeStruct).getNodeById("id1");
   * */
  getNodeById(id: string) {
    var node = this.tree.getNodeById(id)
    if (node) {
      return new Node(node)
    }
    return null
  }

  /**
   * 获取所有记录
   * @returns {@link ResultSet}
   */
  getAllRecords() {
    var resultSet = this.tree.getAllRecords()
    return vds.ds._genResultSet(resultSet)
  }
  /**
   * 获取树结构
   * @returns {@link TreeStruct}
   */
  getTreeStruct() {
    var treeStruct = this.tree.getTreeStruct()
    return new TreeStruct(
      treeStruct.tableName,
      treeStruct.pidField,
      treeStruct.orderField,
      treeStruct.treeCodeField,
      treeStruct.isLeafField,
      treeStruct.busiFilterField
    )
  }
  /**
   * 获取树的加载深度
   * @returns {Integer} 0表示全部加载
   * */
  getLoadedDepth() {
    var depth = 0
    var dataAccessObject = this.tree.getDataAccessor()
    if (dataAccessObject) {
      var tempDepth = dataAccessObject.command.config.depth
      if (null != tempDepth) {
        try {
          tempDepth = Number(tempDepth)
          if (typeof tempDepth == 'number' && !isNaN(tempDepth)) {
            depth = tempDepth
          }
        } catch (e) {}
      }
    }
    return depth
  }
  /**
   * 根据记录id获取记录下标
   * @param {String} recordId 记录id
   * @returns {Integer} 记录下标
   * @example
   * var tree1 = vds.tree.getAll("tree1")[0];
   * var index = tree1.getIndexById("1")
   * */
  getIndexById(recordId: any) {
    return this._get().getIndexById(recordId)
  }
  /**
   * 重新加载树数据(仅支持使用加载规则加载过数据源)
   * @param {String} condition 查询条件
   * @param {Object} params 修改的查询参数
   * {
   *  "isAsync" : {Boolean} 是否异步，默认false（可选）
   *  "isAppend":{Boolean} 是否以添加方式加载数据， 默认true（可选）
   *  "isRefreshCondition" : {Boolean} 是否更新加载的条件，查询对象为查询时有效，默认true（可选）
   * }
   * */
  queryData(
    condition: string,
    params: { isAsync: boolean; isAppend: boolean; isRefreshCondition: boolean }
  ) {
    var dataAccessObject = this.tree.getDataAccessor()
    if (!dataAccessObject || !condition) return
    var isAsync = false
    var isAppend = true
    var isRefreshCondition = true
    if (params) {
      if (params.isAsync === true) {
        isAsync = true
      }
      if (params.isAppend === false) {
        isAppend = false
      }
      if (params.isRefreshCondition === false) {
        isRefreshCondition = false
      }
    }
    var oriConditionsToWhere = dataAccessObject.getCommand().config.whereToWhere
    var newWhereRestrict =
      dataAccessObject.getCommand().config.whereRestrictNoDepthFilter
    var callbackNewWhereRestrict = newWhereRestrict.clone()
    callbackNewWhereRestrict.andConditionString('(' + condition + ')')
    var cd = dataAccessObject.getCommand()
    var command: any = {
      config: {
        where: newWhereRestrict,
        pageSize: -1,
        recordStart: -1,
        filterFields: null
      },
      type: cd.type
    }
    var accessObj = new DataAccessObject(
      dataAccessObject.getDataProvider(),
      dataAccessObject.getModelSchema(),
      command
    )
    var queryParam = {
      dataAccessObjects: [accessObj],
      isAsync: isAsync
    }
    dataAdapter.queryData({
      config: queryParam,
      isAppend: isAppend,
      refreshCondition: isRefreshCondition
    })
  }
  /**
   * 获取元数据
   * @returns {@link Metadata}
   * @example
   * var tree = vds.tree.lookup("tree1", treeStruct)
   * var metadata = tree.getMetadata();
   */
  getMetadata() {
    var matadata = this.tree.getMetadata()
    return vds.ds._genMetadata(matadata)
  }
}
export default Tree
