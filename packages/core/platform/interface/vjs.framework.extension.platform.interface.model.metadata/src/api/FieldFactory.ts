import * as dataAdaptorFactory from '../adapter/DataAdaptorFactory'
import Field from '../api/Field'

interface params extends Field {
  [key: string]: any
}

/**
 *检查参数
 * @param {Object} params 参数
 */
let _checkArguments = function (params: params) {
  if (!params.hasOwnProperty('code')) {
    throw Error('[Field._checkArguments]字段初始化失败，必须设置字段编码！')
  }
}

/**
 *填充参数并返回实例
 * @param params 参数
 */
let _fillParamAndReturn = function (params: params) {
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
let _fillFieldType = function (field: Field, type: string) {
  field.type = type
  field.setDataAdaptor(dataAdaptorFactory.getDataValidator(type))
}

/**
 *填充参数信息
 * @param {Object} params 参数信息
 * @param {String} proName 属性名称
 * @param {any} val 属性值
 */
let _fillParam = function (params: params, proName: string, val: any) {
  if (!params.hasOwnProperty(proName)) {
    params[proName] = val
  }
}

let _generate = function (params: params, defaultVal: any, type: string) {
  _checkArguments(params)
  _fillParam(params, 'defaultValue', defaultVal)
  let field = _fillParamAndReturn(params)
  _fillFieldType(field, type)
  return field
}

const Char = function (params: params) {
  return _generate(params, null, 'char')
}

const Text = function (params: params) {
  return _generate(params, null, 'text')
}

const Number = function (params: params) {
  return _generate(params, null, 'number')
}

const Boolean = function (params: params) {
  params.length = 1
  return _generate(params, false, 'boolean')
}

const Date = function (params: params) {
  return _generate(params, null, 'date')
}

const LongDate = function (params: params) {
  return _generate(params, null, 'longDate')
}

const File = function (params: params) {
  return _generate(params, null, 'file')
}

const Object = function (params: params) {
  return _generate(params, null, 'object')
}

const Integer = function (params: params) {
  params.precision = 0
  return _generate(params, null, 'integer')
}

const Constructors = {
  Char,
  Text,
  Number,
  Boolean,
  Date,
  LongDate,
  File,
  Object,
  Integer
}

const unSerialize = function (params: params) {
  let type = params.type
  let methodName = type.substring(0, 1).toUpperCase() + type.substring(1)
  let constructor = Constructors[methodName]
  if (constructor) {
    return constructor(params)
  } else {
    throw Error('[FieldFactory.unSerialize]不支持[' + type + ']字段类型！')
  }
}

export {
  Char,
  Text,
  Number,
  Boolean,
  Date,
  LongDate,
  File,
  Object,
  Integer,
  unSerialize
}
