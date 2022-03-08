/**
 * @namespace Field
 * @class Field
 * @desc 字段定义 <br/>
 * 字段实例不能直接通过该定义类创建,请使用{FieldFactory}服务创建<br/>
 * vjs名称：vjs.framework.extension.platform.interface.model.metadata<br/>
 * vjs服务名称：vjs.framework.extension.platform.interface.model.metadata.Field<br/>
 * @author xiedh
 */
let Field = function (
  code,
  name,
  type,
  length,
  defaultValue,
  precision,
  expression,
  remark
) {
  this.code = code
  this.name = name
  this.type = type
  this.length = typeof length == 'undefine' ? 255 : length
  this.precision = typeof precision == 'undefine' ? 0 : precision
  this.defaultValue = defaultValue
  this.expression = expression
  this.remark = remark ? JSON.parse(remark) : null
  this.dataAdaptor = null
}
/**
 * 字段克隆
 * @return {@link Field}
 */
Field.prototype.clone = function () {
  let c = new Field()
  c.code = this.code
  c.name = this.name
  c.length = this.length
  c.type = this.type
  c.precision = this.precision
  c.defaultValue = this.defaultValue
  c.expression = this.expression
  c.defaultValueGenerator = this.defaultValueGenerator
  c.dataAdaptor = this.dataAdaptor
  return c
}

/**
 * 获取字段编码
 *
 * @return String
 */
Field.prototype.getCode = function () {
  return this.code
}

/**
 * 获取字段名称
 *
 * @return String
 */
Field.prototype.getName = function () {
  return this.name
}

/**
 * 获取字段长度
 *
 * @return Number
 */
Field.prototype.getLength = function () {
  return this.length
}

/**
 * 获取字段精度
 *
 * @return Number
 */
Field.prototype.getPrecision = function () {
  return this.precision
}

/**
 * 获取字段类型
 * @return String
 */
Field.prototype.getType = function () {
  return this.type
}

/**
 * 获取字段表达式
 * @return String
 */
Field.prototype.getExpression = function () {
  return this.expression
}

/**
 * 设置字段表达式
 * @param {String} expression 字段表达式
 */
Field.prototype.setExpression = function (expression) {
  this.expression = expression
}

/**
 * 获取字段默认值
 *
 * @return any
 */
Field.prototype.getDefaultValue = function () {
  if (
    undefined == this.defaultValueGenerator ||
    null == this.defaultValueGenerator
  ) {
    return this.defaultValue
  } else {
    return this.defaultValueGenerator.generate()
  }
}

/**
 * 设置默认值生成器
 *
 * @param {Object}  defaultValueGenerator  默认值生成器
 */
Field.prototype.setDefaultValueGenerator = function (defaultValueGenerator) {
  this.defaultValueGenerator = defaultValueGenerator
}

/**
 * 设置字段数据适配器
 * @param Object  dataAdaptor 数据适配器
 */
Field.prototype.setDataAdaptor = function (dataAdaptor) {
  this.dataAdaptor = dataAdaptor
}

/**
 *获取字段数据适配器
 * @return DataAdaptor
 */
Field.prototype.getDataAdaptor = function () {
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
Field.prototype.serialize = function () {
  return {
    code: this.code,
    name: this.name,
    length: this.length,
    type: this.type,
    precision: this.precision,
    defaultValue: this.defaultValue,
    expression: this.expression
  }
}

export { adapt, getDataValidator }
