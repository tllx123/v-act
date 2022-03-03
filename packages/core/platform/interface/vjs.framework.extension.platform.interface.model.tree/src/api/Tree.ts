import * as Node from './api/Node'
import * as NodeSet from './api/NodeSet'

let Datasource,
  Criteria,
  viewModel,
  dbManager,
  actionHandler,
  dataAdapter,
  collectionUtil,
  arrayUtil,
  objectUtil,
  primaryKey = 'id',
  uuid

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
let Tree = function (metadata, db, treeStruct) {
  this.treeStruct = treeStruct
  this.datasource = new Datasource(metadata, db)
  //Datasource.call(this,metadata,db);
}

/**
 *  根据数据源实例创建树实例
 * @param {Object} params 参数信息
 * {
 * 		"datasource":{@link Datasource} 数据源实例
 * 		"treeStruct": Object 树形结构
 * }
 * @return {@link Tree}
 */
Tree.createFromDatasource = function (params) {
  let tree = new Tree()
  tree.treeStruct = params.treeStruct
  tree.datasource = params.datasource
  return tree
}

let _dispatcher = function (funcName) {
  return function () {
    let ds = this._getDatasource()
    return ds[funcName].apply(ds, arguments)
  }
}

Tree.prototype.initModule = function (sb) {
  if (sb) {
    Datasource = sb.getService(
      'vjs.framework.extension.platform.interface.model.datasource.Datasource'
    )
    Criteria = sb.getService(
      'vjs.framework.extension.platform.interface.model.datasource.Criteria'
    )
    uuid = sb.getService('vjs.framework.extension.util.UUID')
    collectionUtil = sb.util.collections //sb.getService("vjs.framework.extension.util.collectionUtil");
    arrayUtil = sb.getService('vjs.framework.extension.util.ArrayUtil')
    objectUtil = sb.util.object //sb.getService("vjs.framework.extension.util.ObjectUtil");
    let initFunc = Datasource.prototype.initModule
    if (initFunc) {
      initFunc.call(this, sb)
    }
    let proto = Datasource.prototype
    let treeProto = Tree.prototype
    for (let attr in proto) {
      let val = proto[attr]
      if (!treeProto.hasOwnProperty(attr)) {
        if (typeof val == 'function') {
          val = _dispatcher(attr)
        }
        treeProto[attr] = val
      }
    }
  }
}

Tree.prototype._getDatasource = function () {
  return this.datasource
}
//通过id获取行号
Tree.prototype.getIndexById = function (id) {
  return actionHandler.executeWidgetAction(
    this.treeStruct.refWidgetId,
    'getIndexById',
    id
  )
}
/**
 * 获取树形结构
 * @return Object
 */
Tree.prototype.getTreeStruct = function () {
  return this.treeStruct
}

Tree.prototype._getOrderField = function () {
  return this.treeStruct['orderField']
}

Tree.prototype._getParentField = function () {
  return this.treeStruct['pidField']
}

Tree.prototype._getIsLeafField = function () {
  return this.treeStruct['isLeafField']
}

Tree.prototype._getInnerCodeField = function () {
  return this.treeStruct['treeCodeField']
}

Tree.prototype._getDataById = function (id) {
  let record = this.datasource.getRecordById(id)
  return record ? record.getOriginalData() : null
}

Tree.prototype._putWidgetAction = function (widgetAction) {
  actionHandler = widgetAction
  Node._putWidgetAction(widgetAction)
}

Tree.prototype._putDataAdapter = function (da) {
  dataAdapter = da
}

/**
 * 根据id获取树节点
 * @return {@link Node}
 */
Tree.prototype.getNodeById = function (id) {
  let data = this._getDataById(id)
  if (data) {
    return new Node(this.getMetadata(), data, this)
  }
  return null
}

Tree.prototype._getDatasourceName = function () {
  let metadata = this.getMetadata()
  return metadata.getDatasourceName()
}

Tree.prototype._loadChildren = function (parentId) {
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

Tree.prototype._getChildrenFromDatasource = function (parentId) {
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

Tree.prototype._getRootsInRecords = function (records) {
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
Tree.prototype.getRoots = function () {
  let resultSet = this.getAllRecords()
  let roots
  if (resultSet.isEmpty()) {
    //记录为空，去后台加载数据
    this._loadChildren(null)
    let rs = this._getChildrenFromDatasource(null)
    roots = rs.toArray()
    let orderField = this._getOrderField()
    if (orderField) {
      roots.sort(function compare(a, b) {
        return a.get(orderField) - b.get(orderField)
      })
    }
  } else {
    let records = resultSet.toArray()
    roots = this._getRootsInRecords(records)
  }
  let datas = []
  collectionUtil.each(roots, function (record) {
    datas.push(record.__recordData__)
  })
  return new NodeSet(this.getMetadata(), datas, this)
}

/**
 * 创建树节点
 * @return {@link Node}
 */
Tree.prototype.createNode = function () {
  let record = this.createRecord()
  record.set(this._getIsLeafField(), 1)
  return this.createNodeFromRecord(record)
}

/**
 * 根据Record记录创建树节点
 * @return {@link Node}
 */
Tree.prototype.createNodeFromRecord = function (record) {
  let node = new Node(this.getMetadata(), record.__recordData__, this)
  node.changedData = record.changedData
  return node
}

/**
 * 新增跟节点
 * @param {Object} params 参数信息
 * {
 * 		"nodes" : Array<{@link Node}> 树节点信息
 * }
 */
Tree.prototype.insertRoots = function (params) {
  let nodes = params.nodes
  let roots = this.getRoots()
  let parentId,
    orderIndex,
    parentField = this._getParentField(),
    orderField = this._getOrderField()
  if (roots.isEmpty()) {
    parentId = ''
    orderIndex = 1
  } else {
    let last = roots.last()
    parentId = last.get(parentField)
    orderIndex = last.get(orderField) + 1
  }
  collectionUtil.each(nodes, function (node) {
    node.set(parentField, parentId).set(orderField, orderIndex)
  })
  this.insertRecords({ records: nodes })
  return nodes
}

Tree.prototype._getDescendantIds = function (id) {
  let parentMap = {},
    ids = []
  let datas = this.datasource.getAllRecords().getOriginalDatas()
  let parentField = this._getParentField()
  for (let i = 0, l = datas.length; i < l; i++) {
    let data = datas[i]
    let pId = data[parentField]
    let children
    if (!parentMap[pId]) {
      children = []
      parentMap[pId] = children
    } else {
      children = parentMap[pId]
    }
    children.push(data)
  }
  let iterate = function (parentId) {
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
Tree.prototype.removeNodeByIds = function (params) {
  let ids = params.ids
  if (ids && ids.length > 0) {
    let treeStruct = this.getTreeStruct()
    let refWidgetId = treeStruct.refWidgetId
    let parentToLeaf = false
    let toRemoveIds = []
    let parentIds = []
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
    let parentNodes = [],
      tree = this
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

let _iterator = function (parent, contianer) {
  let children = parent.getChildren()
  children.iterate(function (node, i) {
    contianer.push(node.getOriginalData())
    _iterator(node, contianer)
  })
}

/**
 * 获取所有树节点
 * @param {Object} params
 * {
 * 		"sorted" : Boolean 是否排序
 * }
 */
Tree.prototype.getAllNodes = function (params) {
  let sorted = params ? !!params.sorted : false
  if (sorted) {
    let datas = []
    let roots = this.getRoots()
    roots.iterate(function (node, i) {
      datas.push(node.getOriginalData())
      _iterator(node, datas)
    })
    return new NodeSet(this.getMetadata(), datas, this)
  } else {
    let rs = this.getAllRecords()
    return new NodeSet(this.getMetadata(), rs.getOriginalDatas(), this)
  }
}

//	Tree.prototype.load = function(params){
//		var ds = this._getDatasource();
//		params.defaultSel = false;
//		ds.load(params);
//		this._defaultSelectFirstRecord();
//	}
//
//	Tree.prototype._defaultSelectFirstRecord = function() {
//        // 如果DB没有标识为不默认选中记录，则不执行
//        var currentRecord = this.getCurrentRecord();
//        if(currentRecord){
//        	return;
//        }
//        //获取所有根绝点
//        var allRoots = this.getRoots();
//       	var firstRecord = allRoots.index(0);
//       	if(firstRecord) {
//       		var isMult = this.isMultipleSelect();
//       		var isDefaultSel = this.isDefaultSelect();
//       		if(isMult&&isDefaultSel){//多选情况下
//       			this.selectRecords({"records":[firstRecord],"isSelect":true});
//       		}
//       		this.setCurrentRecord({"record":firstRecord});
//       	}
//    }

return Tree
