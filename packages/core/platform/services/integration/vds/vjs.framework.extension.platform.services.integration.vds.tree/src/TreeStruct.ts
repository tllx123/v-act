/**
 * 树结构定义
 * @constructor
 * @alias TreeStruct
 * @catalog 数据源/树数据源定义
 */
var TreeStruct = function (
  treeCode,
  pId,
  orderNo,
  innerCode,
  isLeafCode,
  filterCode
) {
  this.treeStruct = {
    type: '1',
    tableName: treeCode,
    pidField: pId,
    orderField: orderNo,
    treeCodeField: innerCode,
    isLeafField: isLeafCode,
    busiFilterField: filterCode
  }
}
TreeStruct.prototype = {
  //    	/**
  //    	 * 转成原生Map对象
  //    	 * */
  //    	toMap:function(){
  //    		return {
  //    			"type":"1",
  //    			"tableName":this.treeCode,
  //    			"pidField": this.pId,
  //    			"orderField": this.orderNo,
  //    			"treeCodeField": this.innerCode,
  //    			"isLeafField": this.isLeaf,
  //    			"busiFilterField":this.filterCode
  //    		}
  //    	},
  _get: function () {
    return this.treeStruct
  },
  /**
   * 获取父节点字段编码
   * @returns {String}
   * */
  getPId: function () {
    return this.treeStruct.pidField
  },
  /**
   * 获取排序号字段编码
   * @returns {String}
   * */
  getOrderNo: function () {
    return this.treeStruct.orderField
  },
  /**
   * 获取层级码字段编码
   * @returns {String}
   * */
  getInnerCode: function () {
    return this.treeStruct.treeCodeField
  },
  /**
   * 获取是否叶子节点字段编码
   * @returns {String}
   * */
  getIsLeafCode: function () {
    return this.treeStruct.isLeafField
  },
  /**
   * 获取过滤字段编码
   * @returns {String}
   * */
  getFilterCode: function () {
    return this.treeStruct.busiFilterField
  }
}

module.exports = TreeStruct
