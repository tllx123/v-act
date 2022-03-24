/**
 *	@namespace Criteria
 *  @class Criteria
 *  @catalog 前端实体/普通实体/查询条件
 *  @desc 查询数据标准<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.datasource<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.datasource.Criteria<br/>
 *  @author xiedh
 */
let Criteria: any = function () {
  // @ts-ignore
  this.conditions = []
}

Criteria.operators = {
  Eq: 'Eq',
  Sw: 'Sw'
}

Criteria.prototype = {
  /**
   *  添加等于条件
   * @param {String} fieldCode 字段编号
   * @param {Object} val 值
   * @return {@link Criteria}
   */
  eq: function (fieldCode: string, val: any) {
    // @ts-ignore
    let operator = new Operator(fieldCode, Criteria.operators.Eq, val)
    this.conditions.push(operator)
    return this
  },
  /**
   *  添加startWith条件
   * @param {String} fieldCode 字段编号
   * @param {Object} val 值
   * @return {@link Criteria}
   */
  sw: function (fieldCode: string, val: any) {
    // @ts-ignore
    let operator = new Operator(fieldCode, Criteria.operators.Sw, val)
    this.conditions.push(operator)
    return this
  },
  /**
   *  获取设置的查询条件
   * @return Array
   */
  getConditions: function () {
    return this.conditions
  }
}

let Operator = function (fieldCode: string, operator: any, val: any) {
  // @ts-ignore
  this.fieldCode = fieldCode
  // @ts-ignore
  this.operator = operator
  // @ts-ignore
  this.value = val
}

Operator.prototype = {
  getFieldCode: function () {
    return this.fieldCode
  },

  getOperator: function () {
    return this.operator
  },

  getValue: function () {
    return this.value
  }
}

export default Criteria
