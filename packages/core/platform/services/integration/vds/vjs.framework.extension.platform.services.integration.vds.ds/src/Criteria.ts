/**
 * 数据源记录条件定义（适用于前台数据查询）
 * @constructor
 * @alias Criteria
 * @catalog 数据源/条件定义
 */
class Criteria {
  criteria: any

  constructor(criteria: any) {
    this.criteria = criteria
  }

  /**
   *  添加等于条件
   * @param {String} fieldCode 字段编号
   * @param {Object} val 值
   * @return {@link Criteria}
   */
  eq(fieldCode: any, val: any) {
    this.criteria.eq(fieldCode, val)
    return this
  }
  /**
   *  添加startWith条件
   * @param {String} fieldCode 字段编号
   * @param {Object} val 值
   * @return {@link Criteria}
   */
  sw(fieldCode: any, val: any) {
    this.criteria.sw(fieldCode, val)
    return this
  }
}

export default Criteria
