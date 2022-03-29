/**
 * 树结构定义
 * @constructor
 * @alias TreeStruct
 * @catalog 数据源/树数据源定义
 */
class TreeStruct {
  treeStruct: any

  constructor(
    treeCode: any,
    pId: any,
    orderNo: any,
    innerCode: any,
    isLeafCode: any,
    filterCode: any
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
  //    	/**
  //    	 * 转成原生Map对象
  //    	 * */
  //    	toMap(){
  //    		return {
  //    			"type":"1",
  //    			"tableName":this.treeCode,
  //    			"pidField": this.pId,
  //    			"orderField": this.orderNo,
  //    			"treeCodeField": this.innerCode,
  //    			"isLeafField": this.isLeaf,
  //    			"busiFilterField":this.filterCode
  //    		}
  //    	}
  _get() {
    return this.treeStruct
  }
  /**
   * 获取父节点字段编码
   * @returns {String}
   * */
  getPId() {
    return this.treeStruct.pidField
  }
  /**
   * 获取排序号字段编码
   * @returns {String}
   * */
  getOrderNo() {
    return this.treeStruct.orderField
  }
  /**
   * 获取层级码字段编码
   * @returns {String}
   * */
  getInnerCode() {
    return this.treeStruct.treeCodeField
  }
  /**
   * 获取是否叶子节点字段编码
   * @returns {String}
   * */
  getIsLeafCode() {
    return this.treeStruct.isLeafField
  }
  /**
   * 获取过滤字段编码
   * @returns {String}
   * */
  getFilterCode() {
    return this.treeStruct.busiFilterField
  }
}

export default TreeStruct
