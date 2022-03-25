import * as object from '@v-act/vjs.framework.extension.platform.services.integration.vds.object'

const vds = { object }
/**
 * 数据源记录条件定义
 * @constructor
 * @alias Where
 * @catalog 数据源/条件定义
 */

class Where {
  static id: string
  where: any
  nullFilterWhere: any
  /**
   * 排序类型
   * @enum
   * */
  OrderType: {
    /**
     * 升序
     * */
    ASC: 'Asc'
    /**
     * 降序
     * */
    DESC: 'Desc'
  }

  /**
   * 条件节点类型
   * @enum
   * */
  NodeType: {
    /**
     * 相等条件
     * */
    EQ: 'Eq'
  }

  constructor(where: any) {
    this.where = where
    this.nullFilterWhere = where.clone()
    this.OrderType = {
      ASC: 'Asc',
      DESC: 'Desc'
    }
    this.NodeType = {
      EQ: 'Eq'
    }
  }

  _get() {
    return this.where
  }
  _getNullFilterWhere() {
    return this.nullFilterWhere
  }

  toParameters() {
    return this.where.toParameters()
  }
  toWhere() {
    return this.where.toWhere()
  }
  toOrderBy() {
    return this.where.toOrderBy()
  }
  /**
   * 添加and条件
   * @param {Object} condition 过滤条件
   * */
  addCondition(condition: any) {
    //对接原来的andExtraCondition
    var mode = this.where.fetchMode === 'custom' ? 'custom' : 'table'
    var res = this.where.andExtraCondition(condition, mode)
    this.nullFilterWhere.andExtraCondition(condition, mode)
    return res
  }

  /**
   * 追加字符串条件
   * @param {String} condition 字符串条件
   * */
  andConditionString(condition: any) {
    this.where.andConditionString(condition)
  }
  /**
   * 添加参数
   * @param {Object} params 参数
   * */
  addParameters(params: any) {
    if (params) {
      this.where.addExtraParameters(params)
      this.nullFilterWhere.addExtraParameters(params)
    }
  }
  addExtraParameters(params: any) {
    this.addParameters(params)
  }
  /**
   * 添加排序字段
   * @param {String} orderCode 排序字段编码
   * @param {OrderType} type 排序类型：OrderType.DESC(降序)，OrderType.ASC(升序，默认)（可选）
   * */
  addOrderBy(orderCode: any, type: string) {
    if (this.OrderType.DESC === type) {
      this.where.addOrderByDesc(orderCode)
      this.nullFilterWhere.addOrderByDesc(orderCode)
    } else {
      this.where.addOrderBy(orderCode)
      this.nullFilterWhere.addOrderBy(orderCode)
    }
  }
  /**
   * 添加或条件
   * @param {Array<String>} conditions 条件信息
   * {
   *  "code" : {String} 编码
   *  "value" : {String} 值
   * }
   * @param {@link Where.NodeType} 条件节点类型
   * */
  addOrConditions(conditions: string | any[], nodetype: any) {
    if (!vds.object.isArray(conditions) || !nodetype) {
      return
    }
    var eqnodes = []
    for (var i = 0, len = conditions.length; i < len; i++) {
      var condition = conditions[i]
      var code = condition.code
      var value = condition.value
      if (!code || value === null || value === undefined) {
        continue
      }
      eqnodes.push(this.where.eq(code, value))
    }
    this.where.or(eqnodes)
  }
}

export default Where
