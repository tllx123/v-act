import {
  Datasource,
  Criteria,
  Record
} from '@v-act/vjs.framework.extension.platform.interface.model.datasource'
import { Metadata } from '@v-act/vjs.framework.extension.platform.interface.model.metadata'
import { CollectionUtil as collectionUtil } from '@v-act/vjs.framework.extension.util.collection'
import { ObjectUtil as objectUtil } from '@v-act/vjs.framework.extension.util.object'
import { ArrayUtil as arrayUtil } from '@v-act/vjs.framework.extension.util.array'
import Node from './Node'
import NodeSet from './NodeSet'

/**
 * @namespace Tree
 * @class Tree
 * @desc 树形实体定义<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.tree<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.tree.Tree<br/>
 * @extends Datasource
 * @author xiedh
 * @example
 * 该模块暂时不能直接创建，使用前添加vjs.framework.extension.platform.services.model.manager.tree vjs模块依赖
 * var treeManager = sandbox.getService("vjs.framework.extension.platform.services.model.manager.tree.TreeManager");
 * var tree = treeManager.lookup({"datasourceName":"tree1","treeStruct":treeStruct});
 * var node = tree.createNode();
 * var treeStruct = tree.getTreeStruct();
 * ...
 */

type TreeStructType = {
  refWidgetId: string
  orderField: string
  pidField: string
  isLeafField: string
  treeCodeField: string
}

class Tree extends Datasource {
  /**
   *  根据数据源实例创建树实例
   * @param {Object} params 参数信息
   * {
   * 		"datasource":{@link Datasource} 数据源实例
   * 		"treeStruct": Object 树形结构
   * }
   * @return {@link Tree}
   */
  static createFromDatasource = function (params: {
    treeStruct: TreeStructType
    datasource: Datasource
  }) {
    const { treeStruct, datasource } = params
    let tree = new Tree(datasource.getMetadata(), datasource, treeStruct)
    return tree
  }
  treeStruct: TreeStructType
  datasource: Datasource
  actionHandler: any
  dataAdapter: any
  constructor(metadata: Metadata, db: Datasource, treeStruct: TreeStructType) {
    super(metadata, db.db)
    this.treeStruct = treeStruct
    this.datasource = db
    for (const key in db) {
      const element = db[key]
      if (typeof element == 'function') {
        this[key] = (...args: any[]) => {
          const ds = this._getDatasource()
          return ds[key].apply(ds, args)
        }
      }
    }
  }

  _getDatasource() {
    return this.datasource
  }
  //通过id获取行号
  getIndexById(id: string) {
    return this.actionHandler.executeWidgetAction(
      this.treeStruct.refWidgetId,
      'getIndexById',
      id
    )
  }
  /**
   * 获取树形结构
   * @return Object
   */
  getTreeStruct() {
    return this.treeStruct
  }

  _getOrderField() {
    return this.treeStruct['orderField']
  }

  _getParentField() {
    return this.treeStruct['pidField']
  }

  _getIsLeafField() {
    return this.treeStruct['isLeafField']
  }

  _getInnerCodeField() {
    return this.treeStruct['treeCodeField']
  }

  _getDataById(id: string) {
    let record = this.datasource.getRecordById(id)
    return record ? record.getOriginalData() : null
  }

  _putWidgetAction(widgetAction: any) {
    this.actionHandler = widgetAction
  }

  _putDataAdapter(da: any) {
    this.dataAdapter = da
  }

  /**
   * 根据id获取树节点
   * @return {@link Node}
   */
  getNodeById(id: string) {
    let data = this._getDataById(id)
    if (data) {
      return new Node(this.getMetadata(), data, this)
    }
    return null
  }

  _getDatasourceName() {
    let metadata = this.getMetadata()
    return metadata.getDatasourceName()
  }

  _loadChildren(parentId: string | null) {
    /*var metadModule = viewModel.getMetaModule();
      var datasourceName = this._getDatasourceName();
      var isDataSet = metadModule.isDataSetSqlDataSource(datasourceName);
      if (isDataSet) {//现在前端实体都是dataSet
          return;
      }
     if(dataAdapter){
         var dataAccessor = this.getDataAccessor();
         var command = dataAccessor.getCommand();
         var config = command.config;
         var wr = config.where;
          var condition = metadModule.getDataSourceLoadConditionWR(datasourceName);
          var parentField = this._getParentField();
          wr.andEq(parentField, parentId);
          config.pageSize = -1;
          config.recordStart = -1;
         dataAdapter.queryData({
              "config":{
                  "dataAccessObjects": [dataAccessor],
                  "isAsync": false
              },
              "isAppend" : true
         });
     }*/
    /* var dataModule = viewModel.getDataModule();
      var datas = dataModule.findByDS(datasourceName, condition, -1, -1, false, false);
      if (parentId == null) {
          dataModule.loadDataRecords(datasourceName, datas, false, true, true, false);
      } else {
          //解决树表新增下级不能加载的问题
          dataModule.loadDataRecords(datasourceName, datas, false, true, true, false);
      }*/
  }

  _getChildrenFromDatasource(parentId?: string | null) {
    parentId = parentId == null ? undefined : parentId
    /*var refWidgetId = this.treeStruct.refWidgetId;
      if(refWidgetId&&actionHandler){
           var children = [];
           var childrenIds = actionHandler.executeWidgetAction(refWidgetId, "getChildrenIds", parentId);
           if(childrenIds&&childrenIds.length>0){
              for(var i=0,l=childrenIds.length;i<l;i++){
                  var data = this._getDataById(childrenIds[i]);
                  children.push(data);
              }
           }
           return new NodeSet(this.getMetadata(),children,this);
      }else{*/
    let critera = new Criteria()
    let parentField = this._getParentField()
    critera.eq(parentField, parentId)
    return this.queryRecord({ criteria: critera })
    //}
  }

  _getRootsInRecords(records: Node[]) {
    let roots = []
    let idMap = {}
    for (let i = 0; i < records.length; i++) {
      let record = records[i]
      idMap[record.getSysId()] = record
    }
    let parentField = this._getParentField()
    for (let id in idMap) {
      let record = idMap[id]
      let parentId = record.get(parentField)
      if (!idMap[parentId]) {
        //没有找到父节点
        roots.push(record)
      }
    }
    let orderField = this._getOrderField()
    if (orderField) {
      roots.sort(function compare(a, b) {
        return a.get(orderField) - b.get(orderField)
      })
    }
    return roots
  }

  /**
   * 获取所有根节点
   * @return {@link NodeSet}
   */
  getRoots() {
    let resultSet = this.getAllRecords()
    let roots
    if (resultSet.isEmpty()) {
      //记录为空，去后台加载数据
      this._loadChildren(null)
      let rs = this._getChildrenFromDatasource(null)
      roots = rs.toArray()
      let orderField = this._getOrderField()
      if (orderField) {
        roots.sort(function compare(a: Node, b: Node) {
          return a.get(orderField) - b.get(orderField)
        })
      }
    } else {
      let records = resultSet.toArray()
      roots = this._getRootsInRecords(records)
    }
    let datas: Array<{ [fieldCode: string]: any }> = []
    collectionUtil.each(roots, function (record) {
      datas.push(record.__recordData__)
    })
    return new NodeSet(this.getMetadata(), datas, this)
  }

  /**
   * 创建树节点
   * @return {@link Node}
   */
  createNode() {
    let record = this.createRecord()
    record.set(this._getIsLeafField(), 1)
    return this.createNodeFromRecord(record)
  }

  /**
   * 根据Record记录创建树节点
   * @return {@link Node}
   */
  createNodeFromRecord(record: Record) {
    let node = new Node(this.getMetadata(), record.__recordData__, this)
    node.changedData = record.changedData
    return node
  }

  /**
   * 新增跟节点
   * @param {Object} params 参数信息
   * {
   * 		"nodes" : Array<{@link Node}> 树节点信息
   * 		"resetCurrent" : Boolean 是否重置当前行
   * }
   */
  insertRoots(params: { nodes: Node[]; resetCurrent: boolean }) {
    let nodes = params.nodes
    let roots = this.getRoots()
    let parentId = '',
      orderIndex = 0,
      parentField = this._getParentField(),
      orderField = this._getOrderField()
    if (roots.isEmpty()) {
      parentId = ''
      orderIndex = 1
    } else {
      let last = roots.last()
      parentId = last ? last.get(parentField) : null
      orderIndex = last ? last.get(orderField) + 1 : 0
    }
    collectionUtil.each(nodes, function (node) {
      node.set(parentField, parentId)
      node.set(orderField, orderIndex)
    })
    this.insertRecords({ records: nodes, resetCurrent: params.resetCurrent })
    return nodes
  }

  _getDescendantIds(id: string) {
    let parentMap = {},
      ids: string[] = []
    let datas = this.datasource.getAllRecords().getOriginalDatas()
    let parentField = this._getParentField()
    for (let i = 0, l = datas.length; i < l; i++) {
      let data = datas[i]
      let pId = data[parentField]
      let children: Array<{ [fieldCode: string]: any }>
      if (!parentMap[pId]) {
        children = []
        parentMap[pId] = children
      } else {
        children = parentMap[pId]
      }
      children.push(data)
    }
    let iterate = function (parentId: string) {
      let cd = parentMap[parentId]
      if (cd) {
        for (let i = 0, l = cd.length; i < l; i++) {
          let nodeId = cd[i].id
          ids.push(nodeId)
          iterate(nodeId)
        }
      }
    }
    iterate(id)
    return ids
  }

  /**
   * 根据主键值删除树节点(子节点同步删除)
   * @param {Object} params
   * {
   * 		"ids" : Array 主键值集合
   * }
   * @return {@link NodeSet}
   */
  removeNodeByIds(params: { ids: string[] }) {
    let ids = params.ids
    if (ids && ids.length > 0) {
      let treeStruct = this.getTreeStruct()
      let toRemoveIds: string[] = []
      let parentIds: string[] = []
      let tree = this
      collectionUtil.each(ids, function (id) {
        /*if (refWidgetId,actionHandler) {
                  var exist = actionHandler.executeWidgetAction(refWidgetId, "nodeExist", id);
                  if(exist){
                      var parentId = actionHandler.executeWidgetAction(refWidgetId, "getParentId", id);
                      var descendantIds = actionHandler.executeWidgetAction(refWidgetId, "getDescendantIds", id);
                      descendantIds.push(id);
                      toRemoveIds = toRemoveIds.concat(descendantIds);
                      parentIds.push(parentId);
                  }
              }else{/如果没有关联到树控件*/
        let node = tree.getNodeById(id)
        if (node) {
          /*var criteria = new Criteria();
                      var innerCode = tree._getInnerCodeField();
                      criteria.sw(innerCode,node.get(innerCode));
                      var descendants = tree.queryRecord({"criteria":criteria});
                      if(!descendants.isEmpty()){
                          descendants.iterate(function(record,i){
                              toRemoveIds.push(record.getSysId());
                          });
                      }*/

          let descendantIds = tree._getDescendantIds(id)
          descendantIds.push(id)
          toRemoveIds = toRemoveIds.concat(descendantIds)
          let parentId = node.get(tree._getParentField())
          parentIds.push(parentId)
        }
        //}
      })
      collectionUtil.each(toRemoveIds, function (id) {
        arrayUtil.remove(parentIds, id)
      })

      this.removeRecordByIds({ ids: toRemoveIds })
      let parentNodes: Node[] = []
      collectionUtil.each(parentIds, function (id) {
        let node = tree.getNodeById(id)
        if (node) {
          let children = node.getChildren()
          if (children.isEmpty()) {
            node.set(tree._getIsLeafField(), 1)
            parentNodes.push(node)
          }
        }
      })

      if (parentNodes && parentNodes.length > 0) {
        this.updateRecords({ records: parentNodes })
      }
    }
  }

  _iterator(parent: Node, contianer: Array<{ [fieldCode: string]: any }>) {
    let children = parent.getChildren()
    children.iterate((node: Node, i: number) => {
      contianer.push(node.getOriginalData())
      this._iterator(node, contianer)
    })
  }

  /**
   * 获取所有树节点
   * @param {Object} params
   * {
   * 		"sorted" : Boolean 是否排序
   * }
   */
  getAllNodes(params?: { sorted: boolean }) {
    let sorted = params ? !!params.sorted : false
    if (sorted) {
      let datas: Array<{ [fieldCode: string]: any }> = []
      let roots = this.getRoots()
      roots.iterate((node: Node, i: number) => {
        datas.push(node.getOriginalData())
        this._iterator(node, datas)
      })
      return new NodeSet(this.getMetadata(), datas, this)
    } else {
      let rs = this.getAllRecords()
      return new NodeSet(this.getMetadata(), rs.getOriginalDatas(), this)
    }
  }
}

export default Tree
