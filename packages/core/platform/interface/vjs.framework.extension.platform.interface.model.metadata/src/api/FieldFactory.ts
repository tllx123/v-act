import * as dataAdaptorFactory from '../adapter/DataAdaptorFactory'
import * as Field from '../api/Field'

/**
 *检查参数
 * @param {Object} params 参数
 */
let _checkArguments = function (params) {
  if (!params.hasOwnProperty('code')) {
    throw Error('[Field._checkArguments]字段初始化失败，必须设置字段编码！')
  }
}
/**
 *填充参数并返回实例
 * @param params 参数
 */
let _fillParamAndReturn = function (params) {
  return new Field(
    params.code,
    params.name,
    params.type,
    params.length,
    params.defaultValue,
    params.precision,
    params.expression,
    params.remark
  )
}

/**
 *设置字段类型
 */
let _fillFieldType = function (field, type) {
  field.type = type
  field.setDataAdaptor(dataAdaptorFactory.getDataValidator(type))
}

/**
 *填充参数信息
 * @param {Object} params 参数信息
 * @param {String} proName 属性名称
 * @param {any} val 属性值
 */
let _fillParam = function (params, proName, val) {
  if (!params.hasOwnProperty(proName)) {
    params[proName] = val
  }
}

let __return = function (field) {
  if (this.__recurCreate) {
    this.__temp.push(field)
    return this
  } else {
    return field
  }
}

let _generate = function (params, defaultVal, type) {
  _checkArguments(params)
  _fillParam(params, 'defaultValue', defaultVal)
  let field = _fillParamAndReturn(params)
  _fillFieldType(field, type)
  return __return.call(this, field)
}

export function initModule() {}

const Char = function (params) {
  return _generate.call(this, params, null, 'char')
}

const Text = function (params) {
  return _generate.call(this, params, null, 'text')
}

const Number = function (params) {
  return _generate.call(this, params, null, 'number')
}

const Boolean = function (params) {
  params.length = 1
  return _generate.call(this, params, false, 'boolean')
}

const Date = function (params) {
  return _generate.call(this, params, null, 'date')
}

const LongDate = function (params) {
  return _generate.call(this, params, null, 'longDate')
}

const File = function (params) {
  return _generate.call(this, params, null, 'file')
}

const Object = function (params) {
  return _generate.call(this, params, null, 'object')
}

const Integer = function (params) {
  params.precision = 0
  return _generate.call(this, params, null, 'integer')
}

const begin = function () {
  this.__recurCreate = true
  this.__temp = []
  return this
}

const collect = function () {
  this.__recurCreate = false
  let result = this.__temp
  delete this.__temp
  return result
}

const unSerialize = function (params) {
  let type = params.type
  let methodName = type.substring(0, 1).toUpperCase() + type.substring(1)
  let constructor = exports[methodName]
  if (constructor) {
    return constructor.call(this, params)
  } else {
    throw Error('[FieldFactory.unSerialize]不支持[' + type + ']字段类型！')
  }
}

export {
  adapt,
  begin,
  Boolean,
  Char,
  collect,
  Date,
  File,
  getDataValidator,
  Integer,
  LongDate,
  Number,
  Object,
  Text,
  unSerialize
}
