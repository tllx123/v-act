import { DefaultValueGenerator } from '@v-act/vjs.framework.extension.platform.services.view.logic.defaultvalue'

export default class Field {
  constructor(
    public code: string,
    public name: string,
    public type: string,
    public length?: number,
    public defaultValue?: string,
    public precision: number = 0,
    public expression?: string,
    public remark?: string,
    public defaultValueGenerator?: DefaultValueGenerator,
    public dataAdaptor?: any
  ) {
    return this
  }
  /**
   * 字段克隆
   * @return {@link Field}
   */
  clone() {
    let c = new Field(
      this.code,
      this.name,
      this.type,
      this.length,
      this.defaultValue,
      this.precision,
      this.expression,
      this.remark
    )
    return c
  }
  /**
   * 获取字段编码
   *
   * @return String
   */
  getCode() {
    return this.code
  }
  /**
   * 获取字段名称
   *
   * @return String
   */
  getName() {
    return this.name
  }

  /**
   * 获取字段长度
   *
   * @return Number
   */
  getLength() {
    return this.length
  }
  /**
   * 获取字段精度
   *
   * @return Number
   */
  getPrecision() {
    return this.precision
  }
  /**
   * 获取字段类型
   * @return String
   */
  getType() {
    return this.type
  }
  /**
   * 获取字段表达式
   * @return String
   */
  getExpression() {
    return this.expression
  }
  /**
   * 设置字段表达式
   * @param {String} expression 字段表达式
   */
  setExpression(expression: string) {
    this.expression = expression
  }

  /**
   * 获取字段默认值
   *
   * @return any
   */
  getDefaultValue() {
    if (null == this.defaultValueGenerator) {
      return this.defaultValue
    } else {
      return this.defaultValueGenerator.generate()
    }
  }

  /**
   * 设置默认值生成器
   * @param {Object}  defaultValueGenerator  默认值生成器
   */
  setDefaultValueGenerator(defaultValueGenerator: DefaultValueGenerator) {
    this.defaultValueGenerator = defaultValueGenerator
  }

  /**
   * 设置字段数据适配器
   * @param Object  dataAdaptor 数据适配器
   */
  setDataAdaptor(dataAdaptor: any) {
    this.dataAdaptor = dataAdaptor
  }

  /**
   *获取字段数据适配器
   * @return DataAdaptor
   */
  getDataAdaptor() {
    return this.dataAdaptor
  }

  /**
   * 序列化
   * @return Object
   * @example
   * 返回格式
   * {
   * 		"code":编码,
   * 		"name":名称,
   * 		"length":长度,
   * 		"type":类型,
   * 		"defaultValue":默认值,
   * 		"precision":精度,
   * 		"expression":字段表达式
   * }
   */

  serialize() {
    return this
  }
}
