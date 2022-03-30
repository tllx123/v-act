/**
 *	@namespace Criteria
 *  @class Criteria
 *  @catalog 前端实体/普通实体/查询条件
 *  @desc 查询数据标准<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.datasource<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.datasource.Criteria<br/>
 *  @author xiedh
 */
class Criteria {
  static operators = {
    Eq: 'Eq',
    Sw: 'Sw'
  }
  conditions: Operator[] = []

  /**
   *  添加等于条件
   * @param {String} fieldCode 字段编号
   * @param {Object} val 值
   * @return {@link Criteria}
   */
  eq(fieldCode: string, val: any) {
    // @ts-ignore
    let operator = new Operator(fieldCode, Criteria.operators.Eq, val)
    this.conditions.push(operator)
    return this
  }
  /**
   *  添加startWith条件
   * @param {String} fieldCode 字段编号
   * @param {Object} val 值
   * @return {@link Criteria}
   */
  sw(fieldCode: string, val: any) {
    // @ts-ignore
    let operator = new Operator(fieldCode, Criteria.operators.Sw, val)
    this.conditions.push(operator)
    return this
  }
  /**
   *  获取设置的查询条件
   * @return Array
   */
  getConditions() {
    return this.conditions
  }
}

class Operator {
  fieldCode: string
  operator: string
  value: string
  constructor(fieldCode: string, operator: string, val: any) {
    this.fieldCode = fieldCode
    this.operator = operator
    this.value = val
  }
  getFieldCode() {
    return this.fieldCode
  }

  getOperator() {
    return this.operator
  }

  getValue() {
    return this.value
  }
}

export default Criteria
